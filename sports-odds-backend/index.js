require('dotenv/config');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const logger = require('./logger');
const crypto = require('crypto');


const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

const oddsCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sports_odds',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        logger.error('Error connecting to database:', err.stack);
        process.exit(1);
    }
    logger.info('Connected to PostgreSQL database');
    release();
});

async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                sport VARCHAR(100),
                league VARCHAR(100),
                team_a VARCHAR(100) NOT NULL,
                team_b VARCHAR(100) NOT NULL,
                team_a_rating FLOAT DEFAULT 75,
                team_b_rating FLOAT DEFAULT 68,
                team_a_form INTEGER DEFAULT 3,
                team_b_form INTEGER DEFAULT 3,
                team_a_goals FLOAT DEFAULT 1.5,
                team_b_goals FLOAT DEFAULT 1.5,
                team_a_defense FLOAT DEFAULT 1.0,
                team_b_defense FLOAT DEFAULT 1.0,
                head_to_head_a INTEGER DEFAULT 0,
                head_to_head_b INTEGER DEFAULT 0,
                head_to_head_draw INTEGER DEFAULT 0,
                match_type VARCHAR(20),
                pitch_type VARCHAR(20),
                team_a_batting_avg FLOAT,
                team_b_batting_avg FLOAT,
                team_a_bowling_avg FLOAT,
                team_b_bowling_avg FLOAT,
                team_a_avg_points FLOAT,
                team_b_avg_points FLOAT,
                team_a_win_streak INTEGER DEFAULT 0,
                team_b_win_streak INTEGER DEFAULT 0,
                start_time TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, match_id)
            )
        `);

        await pool.query(`CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches(sport)`);

        const matchCount = await pool.query('SELECT COUNT(*) FROM matches');
        if (parseInt(matchCount.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO matches (sport, league, team_a, team_b, team_a_rating, team_b_rating, team_a_form, team_b_form, team_a_goals, team_b_goals, team_a_defense, team_b_defense, head_to_head_a, head_to_head_b, head_to_head_draw, match_type, pitch_type, team_a_batting_avg, team_b_batting_avg, team_a_bowling_avg, team_b_bowling_avg, team_a_avg_points, team_b_avg_points, team_a_win_streak, team_b_win_streak, start_time)
                VALUES 
                ('Football', 'Premier League', 'Manchester United', 'Liverpool', 82, 79, 4, 3, 2.1, 1.8, 1.1, 1.3, 3, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NOW() + INTERVAL '2 days'),
                ('Football', 'La Liga', 'Real Madrid', 'Barcelona', 88, 85, 5, 4, 2.5, 2.0, 0.9, 1.1, 4, 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NOW() + INTERVAL '3 days'),
                ('Cricket', 'IPL', 'Mumbai Indians', 'Chennai Super Kings', 78, 76, 3, 4, 1.9, 2.2, 1.3, 1.0, 2, 3, 2, 'T20', 'flat', 185, 178, 7.2, 7.8, NULL, NULL, 0, 0, NOW() + INTERVAL '1 day'),
                ('Football', 'Serie A', 'Juventus', 'AC Milan', 75, 72, 3, 3, 1.7, 1.6, 1.2, 1.2, 2, 2, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NOW() + INTERVAL '4 days'),
                ('Basketball', 'NBA', 'LA Lakers', 'Golden State Warriors', 85, 83, 4, 4, 112, 110, 105, 107, 3, 2, 0, NULL, NULL, NULL, NULL, NULL, NULL, 112, 110, 3, 2, NOW() + INTERVAL '2 days')
            `);
            logger.info('Sample matches inserted');
        }

        logger.info('✅ Database initialized');
    } catch (error) {
        logger.error('Database initialization error:', error);
        process.exit(1);
    }
}

initDatabase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password && password.length >= 6;

const fetchWithRetry = async (url, data, retries = 2) => {
    try {
        return await axios.post(url, data, { timeout: 5000 });
    } catch (err) {
        if (retries > 0) {
            await new Promise(res => setTimeout(res, 300));
            return fetchWithRetry(url, data, retries - 1);
        }
        throw err;
    }
};

const generateCacheKey = (match) => {
    const relevantData = {
        team_a: match.team_a,
        team_b: match.team_b,
        sport: match.sport,
        ratingA: match.team_a_rating,
        ratingB: match.team_b_rating,
        formA: match.team_a_form,
        formB: match.team_b_form,
    };
    return 'odds_' + crypto.createHash('md5').update(JSON.stringify(relevantData)).digest('hex');
};

async function getOddsForMatches(matches) {
    const cachedResults = {};
    const matchesToFetch = [];

    matches.forEach((match) => {
        const cacheKey = generateCacheKey(match);
        const cached = oddsCache.get(cacheKey);
        if (cached) {
            cachedResults[match.id] = cached;
        } else {
            matchesToFetch.push(match);
        }
    });

    if (matchesToFetch.length > 0) {
        try {
            const response = await fetchWithRetry(
                `${process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'}/generate-odds-batch`,
                matchesToFetch.map(match => ({
                    teamA: match.team_a,
                    teamB: match.team_b,
                    sport: match.sport || 'Football',
                    teamA_rating: match.team_a_rating,
                    teamB_rating: match.team_b_rating,
                    teamA_form: match.team_a_form || 3,
                    teamB_form: match.team_b_form || 3,
                }))
            );

            response.data.forEach((data, idx) => {
                const match = matchesToFetch[idx];
                const cacheKey = generateCacheKey(match);
                oddsCache.set(cacheKey, data);
                cachedResults[match.id] = data;
            });

            logger.info(`Fetched odds for ${matchesToFetch.length} matches`);
        } catch (error) {
            logger.error('Batch fetch error:', error.message);
            matchesToFetch.forEach(match => {
                cachedResults[match.id] = {
                    teamA_win_prob: 0.33,
                    teamB_win_prob: 0.33,
                    draw_prob: 0.34,
                    odds: { teamA: 3.00, teamB: 3.00, draw: 3.00 },
                };
            });
        }
    }

    return cachedResults;
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

// ==================== AI TOOLS ====================
const aiTools = {
    getAllMatches: async () => {
        const result = await pool.query('SELECT * FROM matches ORDER BY start_time ASC');
        const matches = result.rows;
        const oddsMap = await getOddsForMatches(matches);
        return matches.map(match => ({
            id: match.id,
            sport: match.sport,
            league: match.league,
            teamA: match.team_a,
            teamB: match.team_b,
            teamA_rating: match.team_a_rating,
            teamB_rating: match.team_b_rating,
            teamA_form: match.team_a_form,
            teamB_form: match.team_b_form,
            teamA_prob: oddsMap[match.id]?.teamA_win_prob || 0,
            teamB_prob: oddsMap[match.id]?.teamB_win_prob || 0,
            draw_prob: oddsMap[match.id]?.draw_prob || 0,
            odds: oddsMap[match.id]?.odds || null,
            start_time: match.start_time
        }));
    }
};

// ==================== AUTH ENDPOINTS ====================
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });
        if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email format" });
        if (!isValidPassword(password)) return res.status(400).json({ error: "Password must be at least 6 characters" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        logger.info(`User registered: ${email}`);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === '23505') res.status(400).json({ error: "Email already exists" });
        else {
            logger.error('Registration error:', error);
            res.status(500).json({ error: "Registration failed" });
        }
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });
        
        const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '24h' });
        logger.info(`User logged in: ${email}`);
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: "Login failed" });
    }
});

// ==================== MATCHES ENDPOINTS ====================
app.get('/matches', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM matches ORDER BY start_time ASC');
        const matches = result.rows;
        const oddsMap = await getOddsForMatches(matches);
        const finalData = matches.map(match => ({
            match_id: match.id,
            sport: match.sport,
            league: match.league,
            teams: `${match.team_a} vs ${match.team_b}`,
            team_a: match.team_a,
            team_b: match.team_b,
            start_time: match.start_time,
            odds: oddsMap[match.id]?.odds || null,
            probabilities: oddsMap[match.id] ? {
                teamA: oddsMap[match.id].teamA_win_prob,
                teamB: oddsMap[match.id].teamB_win_prob,
                draw: oddsMap[match.id].draw_prob
            } : null,
        }));
        res.json(finalData);
    } catch (error) {
        logger.error('Error fetching matches:', error);
        res.status(500).json({ error: "Error fetching matches" });
    }
});

// ==================== FAVORITES ENDPOINTS ====================
app.post('/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { match_id } = req.body;
        await pool.query('INSERT INTO favorites (user_id, match_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, match_id]);
        res.json({ message: "Added to favorites" });
    } catch (error) {
        logger.error('Error adding favorite:', error);
        res.status(500).json({ error: "Failed to add favorite" });
    }
});

app.delete('/favorites/:match_id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { match_id } = req.params;
        await pool.query('DELETE FROM favorites WHERE user_id = $1 AND match_id = $2', [userId, match_id]);
        res.json({ message: "Removed from favorites" });
    } catch (error) {
        logger.error('Error removing favorite:', error);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
});

app.get('/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const result = await pool.query(`SELECT m.* FROM matches m JOIN favorites f ON m.id = f.match_id WHERE f.user_id = $1 ORDER BY m.start_time ASC`, [userId]);
        const matches = result.rows;
        const oddsMap = await getOddsForMatches(matches);
        const finalData = matches.map(match => ({
            match_id: match.id,
            sport: match.sport,
            league: match.league,
            teams: `${match.team_a} vs ${match.team_b}`,
            team_a: match.team_a,
            team_b: match.team_b,
            start_time: match.start_time,
            odds: oddsMap[match.id]?.odds || null,
            probabilities: oddsMap[match.id] ? {
                teamA: oddsMap[match.id].teamA_win_prob,
                teamB: oddsMap[match.id].teamB_win_prob,
                draw: oddsMap[match.id].draw_prob
            } : null,
        }));
        res.json(finalData);
    } catch (error) {
        logger.error('Error fetching favorites:', error);
        res.status(500).json({ error: "Error fetching favorites" });
    }
});

// ==================== HEALTH CHECK ====================
app.get('/health', async (req, res) => {
    let pythonStatus = "UNKNOWN";
    try {
        await axios.get(`${process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'}/health`, { timeout: 1000 });
        pythonStatus = "UP";
    } catch {
        pythonStatus = "DOWN";
    }
    res.json({
        status: 'healthy',
        python_service: pythonStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ==================== AI AGENT - ANSWERS ANY QUESTION ====================
app.post('/agent/query', authenticateToken, async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ error: "Question required" });

        const matches = await aiTools.getAllMatches();

        if (matches.length === 0) {
            return res.json({
                answer: "No matches available right now.",
                reasoning: "Database contains no matches"
            });
        }

        let answer = "";
        let reasoning = "";
        const lowerQuestion = question.toLowerCase();

        // ========== HANDLE ALL TYPES OF QUESTIONS ==========

        // 1. Greetings
        if (lowerQuestion.match(/^(hi|hello|hey|greetings|good morning|good evening)/)) {
            answer = "👋 Hello! I'm your AI Sports Analyst. Ask me about matches, odds, predictions, or favorites! How can I help you today?";
            reasoning = "User greeted the assistant";
        }
        
        // 2. What can you do? / Help
        else if (lowerQuestion.includes("what can you do") || lowerQuestion.includes("help") || lowerQuestion.includes("capabilities") || lowerQuestion.includes("how to use")) {
            answer = "🤖 I'm your AI Sports Analyst! I can help you with:\n\n📋 'Show me all matches' - List all matches\n🏆 'Will Real Madrid win?' - Match predictions\n⭐ 'Who is the favorite?' - Find strongest favorite\n🎯 'Show me close matches' - Competitive games\n📊 'Most predictable match' - Safest bet\n💰 'Show me value bets' - Best underdog odds\n📈 'Platform statistics' - Overall overview\n\nWhat would you like to know?";
            reasoning = "User asked about assistant capabilities";
        }
        
        // 3. Show all matches
        else if (lowerQuestion.includes("all matches") || lowerQuestion.includes("list matches") || lowerQuestion.includes("show me matches") || lowerQuestion.includes("what matches")) {
            const matchList = matches.map((m, i) => `${i+1}. ${m.teamA} vs ${m.teamB} (${m.sport}) - ${(Math.max(m.teamA_prob, m.teamB_prob) * 100).toFixed(0)}% ${m.teamA_prob > m.teamB_prob ? m.teamA : m.teamB} favored`).join("\n");
            answer = `📋 Here are ${matches.length} matches:\n\n${matchList}\n\n⭐ Click on any match to see detailed odds and probabilities!`;
            reasoning = `Listed all ${matches.length} matches from database`;
        }
        
        // 4. Specific team question
        else {
            let foundMatch = null;
            
            // Search for team in question
            for (const match of matches) {
                if (lowerQuestion.includes(match.teamA.toLowerCase()) || 
                    lowerQuestion.includes(match.teamB.toLowerCase())) {
                    foundMatch = match;
                    break;
                }
            }
            
            // Partial matching
            if (!foundMatch) {
                for (const match of matches) {
                    const teamAParts = match.teamA.toLowerCase().split(' ');
                    const teamBParts = match.teamB.toLowerCase().split(' ');
                    for (const part of teamAParts) {
                        if (part.length > 3 && lowerQuestion.includes(part)) {
                            foundMatch = match;
                            break;
                        }
                    }
                    if (foundMatch) break;
                    for (const part of teamBParts) {
                        if (part.length > 3 && lowerQuestion.includes(part)) {
                            foundMatch = match;
                            break;
                        }
                    }
                    if (foundMatch) break;
                }
            }
            
            if (foundMatch) {
                const teamAProb = foundMatch.teamA_prob * 100;
                const teamBProb = foundMatch.teamB_prob * 100;
                const drawProb = foundMatch.draw_prob * 100;
                const winner = teamAProb > teamBProb ? foundMatch.teamA : foundMatch.teamB;
                const loser = winner === foundMatch.teamA ? foundMatch.teamB : foundMatch.teamA;
                const winnerProb = Math.max(teamAProb, teamBProb);
                
                let confidence = "";
                if (winnerProb > 70) confidence = "🔥 Strong favorite";
                else if (winnerProb > 60) confidence = "📈 Moderate favorite";
                else if (winnerProb > 55) confidence = "🤏 Slight favorite";
                else confidence = "⚖️ Very close match";
                
                answer = `🏆 ${winner} has ${winnerProb.toFixed(1)}% chance to win against ${loser}!\n\n${confidence}\n\n📊 Probabilities:\n• ${foundMatch.teamA}: ${teamAProb.toFixed(1)}%\n• Draw: ${drawProb.toFixed(1)}%\n• ${foundMatch.teamB}: ${teamBProb.toFixed(1)}%`;
                
                if (foundMatch.odds) {
                    answer += `\n\n💰 Odds:\n• ${foundMatch.teamA}: ${foundMatch.odds.teamA}\n• Draw: ${foundMatch.odds.draw}\n• ${foundMatch.odds.teamB}: ${foundMatch.odds.teamB}`;
                }
                
                reasoning = `Analysis based on ratings (${foundMatch.teamA}:${foundMatch.teamA_rating} vs ${foundMatch.teamB}:${foundMatch.teamB_rating}) and form (${foundMatch.teamA_form}/5 vs ${foundMatch.teamB_form}/5)`;
            }
            
            // 5. Who is favorite?
            else if (lowerQuestion.includes("favorite") || lowerQuestion.includes("likely to win") || lowerQuestion.includes("best team") || (lowerQuestion.includes("who will win") && !lowerQuestion.includes("vs"))) {
                let highestProb = 0;
                let favoriteMatch = null;
                for (const match of matches) {
                    const maxProb = Math.max(match.teamA_prob, match.teamB_prob);
                    if (maxProb > highestProb) {
                        highestProb = maxProb;
                        favoriteMatch = match;
                    }
                }
                if (favoriteMatch) {
                    const winner = favoriteMatch.teamA_prob > favoriteMatch.teamB_prob ? favoriteMatch.teamA : favoriteMatch.teamB;
                    answer = `🏆 The strongest favorite is ${winner} in ${favoriteMatch.teamA} vs ${favoriteMatch.teamB} with ${(highestProb * 100).toFixed(1)}% win probability!`;
                    reasoning = "Based on highest win probability across all matches";
                } else {
                    answer = "No clear favorite found in current matches.";
                    reasoning = "All matches have competitive probabilities";
                }
            }
            
            // 6. Close matches
            else if (lowerQuestion.includes("close") || lowerQuestion.includes("competitive") || lowerQuestion.includes("tight")) {
                const closeMatches = matches.filter(m => Math.abs(m.teamA_prob - m.teamB_prob) < 0.12);
                if (closeMatches.length > 0) {
                    answer = `🎯 Found ${closeMatches.length} close ${closeMatches.length === 1 ? 'match' : 'matches'}:\n\n${closeMatches.map(m => `• ${m.teamA} vs ${m.teamB}\n  ${m.teamA}: ${(m.teamA_prob * 100).toFixed(1)}% | ${m.teamB}: ${(m.teamB_prob * 100).toFixed(1)}%`).join("\n\n")}`;
                    reasoning = "Matches where win probability difference is less than 12%";
                } else {
                    answer = "No extremely close matches at the moment. All matches have a clear favorite.";
                    reasoning = "All matches have win probability difference > 12%";
                }
            }
            
            // 7. Most predictable
            else if (lowerQuestion.includes("predictable") || lowerQuestion.includes("safe bet") || lowerQuestion.includes("sure win")) {
                let highestDiff = 0;
                let predictableMatch = null;
                for (const match of matches) {
                    const diff = Math.abs(match.teamA_prob - match.teamB_prob);
                    if (diff > highestDiff) {
                        highestDiff = diff;
                        predictableMatch = match;
                    }
                }
                if (predictableMatch) {
                    const winner = predictableMatch.teamA_prob > predictableMatch.teamB_prob ? predictableMatch.teamA : predictableMatch.teamB;
                    answer = `📊 Most predictable match: ${predictableMatch.teamA} vs ${predictableMatch.teamB}\n\n${winner} has ${(highestDiff * 100).toFixed(1)}% higher chance to win than their opponent!`;
                    reasoning = `Highest probability difference of ${(highestDiff * 100).toFixed(1)}%`;
                } else {
                    answer = "No highly predictable matches found.";
                    reasoning = "All matches have close probabilities";
                }
            }
            
            // 8. Value bets
            else if (lowerQuestion.includes("value") || lowerQuestion.includes("underdog") || lowerQuestion.includes("best odds")) {
                const valueBets = matches.filter(m => {
                    const underdogProb = Math.min(m.teamA_prob, m.teamB_prob);
                    const underdogOdds = m.teamA_prob < m.teamB_prob ? m.odds?.teamA : m.odds?.teamB;
                    return underdogProb > 0.3 && underdogOdds && underdogOdds > 3.0;
                });
                if (valueBets.length > 0) {
                    answer = `💰 Value bets found:\n\n${valueBets.map(m => {
                        const underdog = m.teamA_prob < m.teamB_prob ? m.teamA : m.teamB;
                        const prob = Math.min(m.teamA_prob, m.teamB_prob) * 100;
                        const odds = m.teamA_prob < m.teamB_prob ? m.odds?.teamA : m.odds?.teamB;
                        return `• ${m.teamA} vs ${m.teamB}\n  ${underdog} has ${prob.toFixed(1)}% chance at ${odds} odds`;
                    }).join("\n\n")}`;
                    reasoning = "Underdogs with >30% win probability and >3.0 odds offer good value";
                } else {
                    answer = "No value bets found at the moment.";
                    reasoning = "No underdogs meet the criteria (>30% chance, >3.0 odds)";
                }
            }
            
            // 9. Statistics
            else if (lowerQuestion.includes("statistic") || lowerQuestion.includes("overview") || lowerQuestion.includes("summary") || lowerQuestion.includes("platform info")) {
                const avgRating = matches.reduce((sum, m) => sum + m.teamA_rating + m.teamB_rating, 0) / (matches.length * 2);
                const avgDrawProb = matches.reduce((sum, m) => sum + m.draw_prob, 0) / matches.length;
                const sports = [...new Set(matches.map(m => m.sport))];
                answer = `📈 Platform Overview:\n\n• Total Matches: ${matches.length}\n• Average Team Rating: ${avgRating.toFixed(1)}\n• Average Draw Probability: ${(avgDrawProb * 100).toFixed(1)}%\n• Sports: ${sports.join(", ")}\n• Leagues: Premier League, La Liga, IPL, Serie A, NBA`;
                reasoning = "Statistics calculated from all matches in database";
            }
            
            // 10. Default - Show help
            else {
                answer = "🤖 I'm your AI Sports Analyst! I can help you with:\n\n• 🏆 Match predictions: 'Will Real Madrid win?'\n• 📋 All matches: 'Show me all matches'\n• ⭐ Favorites: 'Who is the favorite?'\n• 🎯 Close matches: 'Show me close matches'\n• 📊 Predictable: 'Most predictable match'\n• 💰 Value bets: 'Show me value bets'\n• 📈 Statistics: 'Platform overview'\n\nWhat would you like to know about today's matches?";
                reasoning = "User asked something not recognized, showing help menu";
            }
        }

        logger.info(`AI Query: ${question} - Answered successfully`);
        res.json({
            answer,
            reasoning,
            data: matches,
            timestamp: new Date().toISOString(),
            matches_analyzed: matches.length
        });

    } catch (error) {
        logger.error('Agent error:', error);
        res.status(500).json({ error: "Service temporarily unavailable. Please try again." });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: "Server is running!" });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server...');
    pool.end(() => {
        logger.info('Database pool closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`🤖 AI Agent Ready - Ask ANY question about sports!`);
});
