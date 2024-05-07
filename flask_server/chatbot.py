from langchain_openai import OpenAI
from langchain.chains import LLMChain
from langchain.memory.buffer import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv


# import os
# from openai import AsyncOpenAI

# from fastapi.responses import JSONResponse

# from chainlit.auth import create_jwt
# from chainlit.server import app

# import chainlit as cl


# @app.get("/custom-auth")
# async def custom_auth():
#     # Verify the user's identity with custom logic.
#     token = create_jwt(cl.User(identifier="Test User"))
#     return JSONResponse({"token": token})

flood_assistant_template = """
 You are a flood assistant chatbot named "FloodHelper". Your expertise lies in providing information and guidance related to floods and flood management. You specialize in offering advice on what to do before, during, and after a flood, as well as providing information on flood preparedness, safety measures, evacuation procedures, and emergency contacts. You do not provide information outside of this scope. If a question is not related to floods, respond with, "I specialize only in flood-related queries."
 Chat History: {chat_history}
 Question: {question}
 Answer:"""

flood_assistant_prompt = PromptTemplate(
     input_variables=["chat_history", "question"],
     template=flood_assistant_template
 )


load_dotenv()





@cl.on_chat_start
def setup_multiple_chains():
    llm = OpenAI(model='gpt-3.5-turbo-instruct',
                 temperature=0)
    conversation_memory = ConversationBufferMemory(memory_key="chat_history",
                                                   max_len=200,
                                                   return_messages=True,
                                                   )
    llm_chain = LLMChain(llm=llm, prompt=flood_assistant_prompt, memory=conversation_memory)
    cl.user_session.set("llm_chain", llm_chain)


@cl.on_message
async def handle_message(message: cl.Message):
    user_message = message.content.lower()
    llm_chain = cl.user_session.get("llm_chain")
    # Default to llm_chain for handling general queries
    response = await llm_chain.acall(user_message,
                                         callbacks=[cl.AsyncLangchainCallbackHandler()])

    response_key = "output" if "output" in response else "text"             
    await cl.Message(response.get(response_key, "")).send()

