import anthropic
import os
import chromadb
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
chroma_client = chromadb.Client()
memory_collection = chroma_client.create_collection(name="nexus_memory")

def save_memory(question: str, answer: str):
    memory_collection.add(
        documents=[f"Q: {question} A: {answer}"],
        ids=[datetime.now().isoformat()]
    )

def get_memory(question: str) -> str:
    results = memory_collection.query(
        query_texts=[question],
        n_results=2
    )
    if results["documents"][0]:
        return "\n".join(results["documents"][0])
    return ""

def planner_agent(question: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""You are the Planner agent of NEXUS AI.
Your job is to break down this question into 3 clear sub-questions that will help answer it fully.

Question: {question}

Return exactly 3 sub-questions, numbered 1, 2, 3.
Be specific and focused."""
            }
        ]
    )
    return response.content[0].text
from tavily import TavilyClient

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def researcher_agent(sub_questions: str) -> str:
    try:
        search_results = tavily.search(
            query=sub_questions,
            max_results=3
        )
        results_text = ""
        for result in search_results["results"]:
            results_text += f"Source: {result['url']}\n"
            results_text += f"Content: {result['content']}\n\n"
    except Exception:
        results_text = "Web search unavailable. Using Claude's knowledge directly."

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""You are the Researcher agent of NEXUS AI.
Analyze these search results and extract the most important findings.

Search Results:
{results_text}

Provide a clear, structured summary of the key findings."""
            }
        ]
    )
    return response.content[0].text
def reasoner_agent(question: str, research: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""You are the Reasoner agent of NEXUS AI.
Your job is to synthesize the research findings into a clear, confident answer.

Original Question: {question}

Research Findings:
{research}

Provide a well-structured, insightful answer with a confidence score (0-100%) at the end.
Format: Answer first, then 'Confidence: X%' on the last line."""
            }
        ]
    )
    return response.content[0].text
def critic_agent(question: str, answer: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""You are the Critic agent of NEXUS AI.
Your job is to challenge and improve the answer given by the Reasoner.

Original Question: {question}

Reasoner's Answer:
{answer}

Do the following:
1. Identify 2 weaknesses or gaps in this answer
2. Provide an improved final answer that addresses these gaps
3. End with a final confidence score (0-100%)

Format:
Weaknesses: ...
Improved Answer: ...
Final Confidence: X%"""
            }
        ]
    )
    return response.content[0].text
