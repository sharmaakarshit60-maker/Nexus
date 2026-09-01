from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "NEXUS is alive"}
from agents import planner_agent, researcher_agent, reasoner_agent, critic_agent
from pydantic import BaseModel

class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask_nexus(query: Query):
    question = query.question
    
    plan = planner_agent(question)
    research = researcher_agent(plan)
    answer = reasoner_agent(question, research)
    final = critic_agent(question, answer)
    
    return {
        "question": question,
        "plan": plan,
        "research": research,
        "answer": answer,
        "final": final
    }
