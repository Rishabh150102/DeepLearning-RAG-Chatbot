"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Plus,
  Menu,
  X,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from "lucide-react"

interface Conversation {
  id: string
  title: string
  timestamp: Date
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out md:relative",
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isOpen ? "justify-between" : "justify-center"
        )}>
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent glow-accent-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">DeepLearning RAG</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="shrink-0 hover:bg-sidebar-accent transition-colors"
          >
            {isOpen ? (
              <>
                <X className="h-5 w-5 md:hidden" />
                <PanelLeftClose className="hidden h-5 w-5 md:block" />
              </>
            ) : (
              <PanelLeft className="hidden h-5 w-5 md:block" />
            )}
          </Button>
        </div>

        {/* New Chat Button */}
        <div className={cn("p-3", !isOpen && "hidden md:block md:px-2")}>
          <button
            onClick={onNewConversation}
            className={cn(
              "inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all duration-200",
              "bg-gradient-to-r from-[oklch(0.55_0.22_280)] to-[oklch(0.50_0.18_250)]",
              "hover:from-[oklch(0.60_0.24_280)] hover:to-[oklch(0.55_0.20_250)]",
              "shadow-[0_0_20px_-5px_oklch(0.55_0.20_280_/_0.4)]",
              "hover:shadow-[0_0_25px_-3px_oklch(0.60_0.22_280_/_0.5)]",
              isOpen ? "w-full justify-start gap-2" : "w-full justify-center"
            )}
            title="New Chat"
          >
            <Plus className="h-4 w-4 shrink-0" />
            {isOpen && <span>New Chat</span>}
          </button>
        </div>

        {/* Conversations List */}
        <ScrollArea className={cn("flex-1", isOpen ? "px-3" : "hidden md:block md:px-2")}>
          <div className="space-y-1 pb-4">
            {conversations.length === 0 ? (
              isOpen && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No conversations yet
                </p>
              )
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-3 rounded-xl text-sm transition-all duration-200",
                    isOpen ? "px-3 py-2.5" : "justify-center p-2",
                    activeConversationId === conversation.id
                      ? "glass-subtle text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                  onMouseEnter={() => setHoveredId(conversation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  title={!isOpen ? conversation.title : undefined}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {isOpen && (
                    <>
                      <span className="flex-1 truncate">{conversation.title}</span>
                      {hoveredId === conversation.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteConversation(conversation.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className={cn(
          "border-t border-sidebar-border p-4",
          !isOpen && "hidden md:block md:p-2"
        )}>
          {isOpen ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Powered by AI</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" title="Powered by AI" />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "fixed left-4 top-4 z-30 glass md:hidden",
          isOpen && "hidden"
        )}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}
