#load pdf
#split into chunks
#embed the chunks
#store into chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

## Data is loaded in the object.
data = PyPDFLoader("deeplearning.pdf")
docs = data.load()


# We are splitting the data into chunks.
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

chunks = splitter.split_documents(docs)


# We are embedding the chunks.
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

# We are storing the chunks in chroma vectorstore.
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory="chroma_db"
)