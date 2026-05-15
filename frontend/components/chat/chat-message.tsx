"use client"

import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { User, Bot, FileText } from "lucide-react"

interface Source {
  title: string
  page: number
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  sources?: Source[]
  isLoading?: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
      <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
      <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
    </div>
  )
}

function SourceCard({ source }: { source: Source }) {
  return (
    <div className="glass flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:glow-accent-sm cursor-pointer group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-accent-subtle">
        <FileText className="h-4 w-4 text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">
          {source.title}
        </p>
        <p className="text-xs text-muted-foreground">Page {source.page}</p>
      </div>
    </div>
  )
}

export function ChatMessage({
  role,
  content,
  sources,
  isLoading,
}: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex w-full gap-4 px-4 py-6 md:px-8 animate-fade-in-up",
        isUser ? "bg-transparent" : "glass-subtle"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
          isUser
            ? "gradient-accent glow-accent-sm"
            : "glass"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-accent" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-3">
        <div className="text-sm font-medium text-muted-foreground">
          {isUser ? "You" : "Assistant"}
        </div>

        {isLoading ? (
          <TypingIndicator />
        ) : (
          <>
            <div className="markdown-content prose prose-invert max-w-none text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>

            {/* Sources */}
            {sources && sources.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sources
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {sources.map((source, index) => (
                    <SourceCard key={index} source={source} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
