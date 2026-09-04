# NEXUS AI — Autonomous Multi-Agent Reasoning System

A self-orchestrating AI system where four specialized agents collaborate to answer any question — planning, researching, reasoning, and self-critiquing before delivering a final answer.

Built solo by Akarshit Sharma.

---

## How It Works

User asks a question → 4 agents activate in sequence:

- 🧠 **Planner** — breaks the question into focused sub-questions
- 🔍 **Researcher** — searches the live web for current information
- ⚡ **Reasoner** — synthesizes findings into a structured answer
- 🎯 **Critic** — identifies weaknesses and produces an improved final answer

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Brain | Anthropic Claude API |
| Memory | ChromaDB (persistent vector memory) |
| Web Search | Tavily Search API |
| Backend | FastAPI + Python |
| Frontend | React |

---

## Run Locally

Backend:
cd backend && source venv/bin/activate && uvicorn main:app --reload

Frontend:
cd frontend && npm install && npm start

Create backend/.env with:
ANTHROPIC_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here

---

## Built By

Akarshit Sharma — Solo developer, BBA student at MIET Jammu.
GitHub: sharmaakarshit60-maker
