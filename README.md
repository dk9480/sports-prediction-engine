# 🏆 Sports Odds Intelligence Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-cyan)
![Python](https://img.shields.io/badge/Python-3.10-yellow)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)

**An intelligent sports odds platform that generates dynamic odds using AI/ML models for Football, Cricket, and Basketball.**

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [AI Agent Examples](#ai-agent-examples)
- [Project Structure](#project-structure)

---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure login/register system |
| 🏏 **Multi-Sport Support** | Football, Cricket, Basketball |
| 🤖 **AI Agent** | Natural language queries about matches |
| ⭐ **Favorites** | Save and track favorite matches |
| 📊 **Probability Bars** | Visual win probability indicators |
| ⏰ **Countdown Timer** | Live match countdowns |
| 🌙 **Dark Mode** | Toggle between light/dark themes |
| 📥 **CSV Export** | Export match data to CSV |

### Bonus Features
- 🚀 **Batch API Calls** - Efficient Python service integration
- 💾 **Smart Caching** - MD5-based odds caching
- 🎯 **Sport-Specific Models** - Custom algorithms per sport
- 📱 **Responsive Design** - Works on all devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Axios |
| Backend | Node.js, Express.js, PostgreSQL, JWT |
| ML Service | Python, FastAPI |
| Caching | NodeCache |
| Logging | Winston |

---

## 📸 Screenshots

### Login Page
![Login](./screenshots/login.png)

### Matches Dashboard
![Matches](./screenshots/matches.png)

### AI Agent
![AI Agent](./screenshots/ai-agent.png)

### Favorites
![Favorites](./screenshots/favorites.png)

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+

### Installation

#### 1. Python Service (Port 8000)
```bash
cd python-service
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
