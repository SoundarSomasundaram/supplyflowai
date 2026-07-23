from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import get_internal_inventory, search_external_conditions, scrape_url
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM
llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0
)

# 1. Search Agent
def build_search_agent():
    system_prompt = (
        "You are an Inventory Search Agent. Your goal is to gather all relevant raw internal and "
        "external information needed to make an inventory decision. You have tools to get internal "
        "inventory reports and search external conditions (weather, events, logistics, holidays). "
        "Do not analyze, summarize, or draw conclusions. Just collect and return all raw data."
    )
    return create_agent(
        model=llm,
        tools=[get_internal_inventory, search_external_conditions],
        system_prompt=system_prompt
    )

# 2. Reader Agent
def build_reader_agent():
    system_prompt = (
        "You are an Inventory Reader Agent. Your job is to convert messy unstructured external search results "
        "and raw internal inventory metrics into a clean, structured business context.\n\n"
        "You must structure your response EXACTLY as follows (do not add any other text):\n"
        "Key Metrics: [Single concise sentence comparing current stock to safety stock buffer]\n"
        "Climatic Insight: [Single concise sentence describing weather anomalies (rain, storms, heat) in the region]\n"
        "Logistics State: [Single concise sentence describing logistics delays or transit bottlenecks, or 'None']"
    )
    return create_agent(
        model=llm,
        tools=[scrape_url],
        system_prompt=system_prompt
    )

# 3. Writer Chain (Decision Engine)
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert Warehouse and Inventory Operations Manager.
Your job is to generate a precise operational recommendation based on the structured context provided.

Provide your recommendation in one of these actions:
- Transfer inventory (if nearby warehouses have surplus stock)
- Warehouse replenishment (order more stock from supplier)
- Wait (do nothing, monitor closely)
- Raise alert (warn about severe logistics or stockouts)
- No action

You must write extremely short, single-sentence suggestions. Structure your response exactly as follows:
## Proposed Action
[Transfer inventory / Warehouse replenishment / Wait / Raise alert / No action]

## Action Details
- Product: [Name]
- Target Warehouse: [Name]
- Quantity: [Amount, or None]
- Source: [Warehouse, Supplier, or None]

## Top 3 Operations Considerations
1. [First crisp consideration - max 1 line]
2. [Second crisp consideration - max 1 line]
3. [Third crisp consideration - max 1 line]

If you are revising based on feedback from the Critic, address the concerns directly in your top considerations."""),
    ("human", """Product: {product}
Warehouse: {warehouse}

Structured Context:
{context}

{feedback_section}

Please write your recommendation:"""),
])

writer_chain = writer_prompt | llm | StrOutputParser()

# 4. Critic Chain (Quality Validator)
critic_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a Senior Inventory Operations Critic. Your job is to strictly evaluate the proposed operational recommendation against the structured context.

Evaluate the logic, nearby warehouse stock levels, capacities, and weather/logistics factors.
You must respond in this exact format (do not add any other text):

Score: X/100
Approved: [Yes/No]
Audit Result: [Single concise sentence detailing the main strength or validity of the action]
Improvement Warning: [Single concise sentence describing the correction required if rejected, or 'None' if approved]"""),
    ("human", """Structured Context:
{context}

Proposed Recommendation:
{recommendation}

Please evaluate this recommendation:"""),
])

critic_chain = critic_prompt | llm | StrOutputParser()
