"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Sparkles } from "lucide-react"
import type { User } from "@supabase/supabase-js"

type Message = {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  message: string
  created_at: string
}

export function WitchChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadMessages()
      
      // Suscribirse a nuevos mensajes en tiempo real
      const channel = supabase
        .channel("chat_messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages" },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function loadMessages() {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)

    if (data) setMessages(data)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setLoading(true)
    const userName = user.user_metadata?.nombre || user.email?.split("@")[0] || "Bruja Anonima"

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      user_name: userName,
      message: newMessage.trim(),
    })

    setNewMessage("")
    setLoading(false)
  }

  return (
    <>
      {/* Boton flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Modal del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-primary/30 bg-background shadow-2xl shadow-primary/20 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-serif font-semibold">Chat de Brujas</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-primary/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4">
            {!user ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MessageCircle className="mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Debes iniciar sesion para unirte al chat
                </p>
                <Button
                  className="mt-3"
                  onClick={() => (window.location.href = "/auth/login")}
                >
                  Iniciar Sesion
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Sparkles className="mb-2 h-12 w-12 text-primary/50" />
                <p className="text-sm text-muted-foreground">
                  Se la primera en escribir en el aquelarre
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${msg.user_id === user?.id ? "text-right" : ""}`}
                  >
                    <div
                      className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.user_id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {msg.user_id !== user?.id && (
                        <p className="mb-1 text-xs font-semibold text-primary">
                          {msg.user_name}
                        </p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString("es", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {user && (
            <form onSubmit={sendMessage} className="border-t border-border p-3">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-full"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full"
                  disabled={loading || !newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  )
}
