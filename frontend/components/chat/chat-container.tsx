"use client"

import { useState, useRef, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { FileText, Sparkles, Upload, MessageCircle } from "lucide-react"

interface Source {
  title: string
  page: number
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
}

interface Conversation {
  id: string
  title: string
  timestamp: Date
  messages: Message[]
}

async function sendMessage(
  message: string
): Promise<{ answer: string; sources: Source[] }> {

  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: message,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch response")
  }

  const data = await response.json()

  return data
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      {/* Hero icon with glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-2xl gradient-accent opacity-30 rounded-full scale-150" />
        <div className="relative glass flex h-24 w-24 items-center justify-center rounded-3xl animate-pulse-glow">
          <FileText className="h-12 w-12 text-accent" />
        </div>
      </div>
      
      <h2 className="mb-3 text-3xl font-bold text-foreground text-center text-balance">
        Welcome to DeepLearning RAG Chatbot
      </h2>
      <p className="mb-10 max-w-lg text-center text-muted-foreground text-balance">
        Upload a PDF document and start asking questions. Our AI will analyze the
        content and provide answers with source citations.
      </p>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3 max-w-2xl w-full">
        <div className="glass rounded-2xl p-5 transition-all duration-200 hover:glow-accent-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-accent-subtle">
            <Upload className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Upload PDF</h3>
          <p className="text-sm text-muted-foreground">Drag and drop or click to upload your document</p>
        </div>
        
        <div className="glass rounded-2xl p-5 transition-all duration-200 hover:glow-accent-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-accent-subtle">
            <MessageCircle className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Ask Questions</h3>
          <p className="text-sm text-muted-foreground">Chat naturally about your document content</p>
        </div>
        
        <div className="glass rounded-2xl p-5 transition-all duration-200 hover:glow-accent-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-accent-subtle">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Get Answers</h3>
          <p className="text-sm text-muted-foreground">Receive AI-powered responses with citations</p>
        </div>
      </div>
    </div>
  )
}

export function ChatContainer() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages, isLoading])

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    setSidebarOpen(false)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setSidebarOpen(false)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      // Create new conversation if none exists
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        timestamp: new Date(),
        messages: [],
      }
      setConversations((prev) => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === (activeConversationId || prev[0]?.id)) {
          return {
            ...c,
            title: c.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : c.title,
            messages: [...c.messages, userMessage],
          }
        }
        return c
      })
    )

    setIsLoading(true)

    try {
      const response = await sendMessage(content)

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        sources: response.sources,
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === (activeConversationId || prev[0]?.id)) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
            }
          }
          return c
        })
      )
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadPDF = (file: File) => {
    setUploadedFile(file)
    // In a real app, you would upload the file to your backend here
    console.log("PDF uploaded:", file.name)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main chat area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mx-auto max-w-4xl pb-4">
              {activeConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                />
              ))}
              {isLoading && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadPDF={handleUploadPDF}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
