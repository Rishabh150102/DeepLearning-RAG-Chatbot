from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_mistralai import ChatMistralAI   
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)

retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 5,
        "fetch_k": 10,
        "lambda_mult": 0.5
        }
)

llm = ChatMistralAI(model="mistral-small-2506")

# prompt template

prompt = ChatPromptTemplate.from_messages(
    [
        ("system",
         """ You are a helpful AI assistant. 

         Use only provided context to answer the question.

         If the answer is not contained within the context, say "I could not find an answer in the document.".
         """),

         ("human", 
          
          """
            Context: {context}

            Question: {question}
          """)
    ]
)

# from rich import print

def ask_question(query: str) -> str:

    docs = retriever.invoke(query)

    # print(docs)

    m_data = [(doc.metadata["page_label"],doc.metadata["source"]) for doc in docs]

    unique_sources = set([data for data in m_data])

    cleaned_sources = []

    for page, source in unique_sources:
        cleaned_sources.append({"page": page, "source": source})

    # print(unique_sources)

    context = "\n\n".join([doc.page_content for doc in docs])

    final_prompt = prompt.invoke({
        "context": context,
        "question": query
    })

    response = llm.invoke(final_prompt)

    return {"answer": response.content, "sources": cleaned_sources}
    # print(f"\n AI: {response.content}\n")

# ask_question("What is Neuron")