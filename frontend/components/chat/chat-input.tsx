"use client"

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, FileUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onUploadPDF: (file: File) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  onUploadPDF,
  isLoading,
  disabled,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      onUploadPDF(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-4xl p-4">
        {/* Uploaded file indicator */}
        {uploadedFile && (
          <div className="mb-3 flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm animate-fade-in-up">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent-subtle">
              <FileUp className="h-4 w-4 text-accent" />
            </div>
            <span className="flex-1 truncate text-foreground font-medium">{uploadedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => setUploadedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Input area */}
        <div className="glass flex items-end gap-2 rounded-2xl p-2 transition-all duration-200 focus-within:glow-accent-sm">
          {/* PDF Upload button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUploadClick}
            disabled={disabled || isLoading}
            className="shrink-0 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors rounded-xl"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Upload PDF</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your PDF..."
            disabled={disabled || isLoading}
            className={cn(
              "max-h-[200px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            rows={1}
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            size="icon"
            className={cn(
              "shrink-0 rounded-xl transition-all duration-200",
              message.trim()
                ? "gradient-accent text-white glow-accent-sm hover:opacity-90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Upload a PDF and ask questions about its content
        </p>
      </div>
    </div>
  )
}
