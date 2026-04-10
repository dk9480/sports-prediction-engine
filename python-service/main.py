from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import math
import logging
from typing import Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model with sport and advanced stats
class MatchInput(BaseModel):
    teamA: str
    teamB: str
    teamA_rating: float
    teamB_rating: float
    sport: Optional[str] = "Football"
    match_type: Optional[str] = None
    teamA_form: Optional[float] = 3.0
    teamB_form: Optional[float] = 3.0
    teamA_goals: Optional[float] = 1.5
    teamB_goals: Optional[float] = 1.5
    teamA_defense: Optional[float] = 1.0
    teamB_defense: Optional[float] = 1.0
    head_to_head_a: Optional[int] = 0
    head_to_head_b: Optional[int] = 0
    head_to_head_draw: Optional[int] = 0
    teamA_batting_avg: Optional[float] = None
    teamB_batting_avg: Optional[float] = None
    teamA_bowling_avg: Optional[float] = None
    teamB_bowling_avg: Optional[float] = None
    pitch_type: Optional[str] = "balanced"
    teamA_avg_points: Optional[float] = None
    teamB_avg_points: Optional[float] = None
    teamA_win_streak: Optional[int] = 0
    teamB_win_streak: Optional[int] = 0

# ================= FOOTBALL MODEL (NO RANDOMNESS) =================
def calculate_football_odds(data):
    try:
        expected_score_A = 1 / (1 + math.pow(10, (data.teamB_rating - data.teamA_rating) / 400))
        expected_score_B = 1 / (1 + math.pow(10, (data.teamA_rating - data.teamB_rating) / 400))
        home_advantage = 1.05
        form_factor_A = 1 + ((data.teamA_form - 3) * 0.05)
        form_factor_B = 1 + ((data.teamB_form - 3) * 0.05)
        goals_factor_A = data.teamA_goals / max(data.teamB_goals, 0.5)
        goals_factor_B = data.teamB_goals / max(data.teamA_goals, 0.5)
        defense_factor_A = data.teamB_defense / max(data.teamA_defense, 0.5)
        defense_factor_B = data.teamA_defense / max(data.teamB_defense, 0.5)
        
        total_h2h = data.head_to_head_a + data.head_to_head_b + data.head_to_head_draw
        if total_h2h > 0:
            h2h_factor_A = 1 + ((data.head_to_head_a - data.head_to_head_b) / max(total_h2h, 1) * 0.1)
            h2h_factor_B = 1 + ((data.head_to_head_b - data.head_to_head_a) / max(total_h2h, 1) * 0.1)
        else:
            h2h_factor_A = 1
            h2h_factor_B = 1
        
        base_probA = expected_score_A * home_advantage * form_factor_A * goals_factor_A * defense_factor_A * h2h_factor_A
        base_probB = expected_score_B * form_factor_B * goals_factor_B * defense_factor_B * h2h_factor_B
        rating_diff = abs(data.teamA_rating - data.teamB_rating)
        draw_prob = 0.15 + (0.1 * (1 - min(1, rating_diff / 50)))
        
        total = base_probA + base_probB + draw_prob
        probA = base_probA / total
        probB = base_probB / total
        draw_prob = draw_prob / total
        
        probA = round(probA, 3)
        probB = round(probB, 3)
        draw_prob = round(draw_prob, 3)
        
        margin = 1.05
        oddsA = round(margin / probA, 2)
        oddsB = round(margin / probB, 2)
        oddsDraw = round(margin / draw_prob, 2)
        
        return {
            "teamA_win_prob": probA,
            "teamB_win_prob": probB,
            "draw_prob": draw_prob,
            "odds": {"teamA": oddsA, "teamB": oddsB, "draw": oddsDraw},
            "analysis": {
                "sport": "Football",
                "favorite": data.teamA if probA > probB else data.teamB,
                "confidence": round(abs(probA - probB) * 100, 1),
                "is_close_match": abs(probA - probB) < 0.12
            }
        }
    except Exception as e:
        logger.error(f"Error in football model: {e}")
        raise

# ================= CRICKET MODEL (NO RANDOMNESS) =================
def calculate_cricket_odds(data):
    try:
        draw_prob = 0.02
        batting_first_advantage = 1.10
        
        if data.teamA_batting_avg and data.teamB_batting_avg:
            batting_strength = data.teamA_batting_avg / max(data.teamB_batting_avg, 1)
            bowling_strength = data.teamB_bowling_avg / max(data.teamA_bowling_avg, 1)
        else:
            batting_strength = data.teamA_rating / max(data.teamB_rating, 1)
            bowling_strength = data.teamB_rating / max(data.teamA_rating, 1)
        
        form_factor_A = 1 + ((data.teamA_form - 3) * 0.05)
        form_factor_B = 1 + ((data.teamB_form - 3) * 0.05)
        
        pitch_factors = {"flat": 1.20, "spinning": 0.85, "seaming": 0.80, "balanced": 1.00}
        pitch_factor = pitch_factors.get(data.pitch_type, 1.00)
        
        if data.match_type == "T20":
            match_factor = 1.0
        elif data.match_type == "ODI":
            match_factor = 1.05
        else:
            match_factor = 1.10
        
        base_probA = (batting_strength * 0.35 + bowling_strength * 0.35 + 
                      form_factor_A * 0.15 + batting_first_advantage * 0.10 + 
                      pitch_factor * 0.05) * match_factor
        
        base_probB = (1 / batting_strength * 0.35 + 1 / bowling_strength * 0.35 + 
                      form_factor_B * 0.15 + pitch_factor * 0.05) * match_factor
        
        total = base_probA + base_probB + draw_prob
        probA = base_probA / total
        probB = base_probB / total
        
        probA = round(probA, 3)
        probB = round(probB, 3)
        final_draw = round(draw_prob, 3)
        
        margin = 1.05
        oddsA = round(margin / probA, 2)
        oddsB = round(margin / probB, 2)
        oddsDraw = round(margin / final_draw, 2) if final_draw > 0 else 100.00
        
        return {
            "teamA_win_prob": probA,
            "teamB_win_prob": probB,
            "draw_prob": final_draw,
            "odds": {"teamA": oddsA, "teamB": oddsB, "draw": oddsDraw},
            "analysis": {
                "sport": "Cricket",
                "match_type": data.match_type or "T20",
                "pitch_type": data.pitch_type,
                "favorite": data.teamA if probA > probB else data.teamB,
                "confidence": round(abs(probA - probB) * 100, 1),
                "is_close_match": abs(probA - probB) < 0.12
            }
        }
    except Exception as e:
        logger.error(f"Error in cricket model: {e}")
        raise

# ================= BASKETBALL MODEL (NO RANDOMNESS) =================
def calculate_basketball_odds(data):
    try:
        draw_prob = 0.00
        home_advantage = 1.12
        
        if data.teamA_avg_points and data.teamB_avg_points:
            point_diff = data.teamA_avg_points - data.teamB_avg_points
            base_prob = 0.5 + (point_diff / 20)
        else:
            base_prob = 1 / (1 + math.pow(10, (data.teamB_rating - data.teamA_rating) / 400))
        
        streak_factor_A = 1 + (data.teamA_win_streak * 0.02)
        streak_factor_B = 1 + (data.teamB_win_streak * 0.02)
        form_factor_A = 1 + ((data.teamA_form - 3) * 0.05)
        form_factor_B = 1 + ((data.teamB_form - 3) * 0.05)
        
        probA = base_prob * home_advantage * streak_factor_A * form_factor_A
        probB = (1 - base_prob) * streak_factor_B * form_factor_B
        
        total = probA + probB
        probA = probA / total
        probB = probB / total
        
        probA = round(probA, 3)
        probB = round(probB, 3)
        
        margin = 1.05
        oddsA = round(margin / probA, 2)
        oddsB = round(margin / probB, 2)
        
        return {
            "teamA_win_prob": probA,
            "teamB_win_prob": probB,
            "draw_prob": 0.00,
            "odds": {"teamA": oddsA, "teamB": oddsB, "draw": None},
            "analysis": {
                "sport": "Basketball",
                "favorite": data.teamA if probA > probB else data.teamB,
                "confidence": round(abs(probA - probB) * 100, 1),
                "is_close_match": abs(probA - probB) < 0.12
            }
        }
    except Exception as e:
        logger.error(f"Error in basketball model: {e}")
        raise

# ================= MAIN ENDPOINTS =================
@app.post("/generate-odds")
async def generate_odds(data: MatchInput):
    try:
        logger.info(f"Generating odds for {data.teamA} vs {data.teamB} ({data.sport})")
        sport = data.sport or "Football"
        
        if sport == "Cricket":
            result = calculate_cricket_odds(data)
        elif sport == "Basketball":
            result = calculate_basketball_odds(data)
        else:
            result = calculate_football_odds(data)
        
        result["teamA"] = data.teamA
        result["teamB"] = data.teamB
        result["sport"] = sport
        result["timestamp"] = datetime.now().isoformat()
        
        return result
    except Exception as e:
        logger.error(f"Error generating odds: {e}")
        return {
            "teamA_win_prob": 0.33,
            "teamB_win_prob": 0.33,
            "draw_prob": 0.34,
            "odds": {"teamA": 3.00, "teamB": 3.00, "draw": 3.00},
            "analysis": {
                "sport": data.sport or "Football",
                "error": str(e),
                "favorite": "Unknown",
                "confidence": 0
            },
            "teamA": data.teamA,
            "teamB": data.teamB,
            "timestamp": datetime.now().isoformat()
        }

@app.post("/generate-odds-batch")
async def generate_odds_batch(matches: list[MatchInput]):
    results = []
    for data in matches:
        try:
            if data.sport == "Cricket":
                result = calculate_cricket_odds(data)
            elif data.sport == "Basketball":
                result = calculate_basketball_odds(data)
            else:
                result = calculate_football_odds(data)
            results.append(result)
        except:
            results.append({
                "teamA_win_prob": 0.33,
                "teamB_win_prob": 0.33,
                "draw_prob": 0.34,
                "odds": {"teamA": 3.0, "teamB": 3.0, "draw": 3.0}
            })
    return results

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_version": "3.0",
        "sports_supported": ["Football", "Cricket", "Basketball"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    return {
        "message": "Sports Odds AI Service",
        "version": "3.0",
        "endpoints": ["/generate-odds", "/health"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
