"use client"

import type React from "react"
import { Card } from "./Card"
import { useEffect, useState, useRef } from "react"
import { Send, Mic, Paperclip, Smile } from "lucide-react"

interface Message {
  text: string
  isSent: boolean
  timestamp: Date
}

export const CreateRoom = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [totalUserCount, setTotalUserCount] = useState<number>(1)
  const [createCode, setCreateCode] = useState<string | null>(null)
  const [text, setText] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isConnected, setIsConnected] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
    }
  }, [text])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Initialize WebSocket connection
  useEffect(() => {
    const value: string = Math.random().toString(36).substring(2, 7)
    setCreateCode(value)
    const socket = new WebSocket("ws://localhost:5000")
    console.log("Connection established to socket")
    socketRef.current = socket

    socket.onopen = () => {
      setIsConnected(true)
      const joinMessage = { type: "join", payload: { roomId: value } }
      socket.send(JSON.stringify(joinMessage))
    }

    socket.onmessage = (event) => {
      try {
        // Try to parse as JSON first (for user-count messages)
        const message = JSON.parse(event.data)
        if (message.type === "user-count") {
          setTotalUserCount(message.payload.count)
        }
      } catch (e) {
        // If not JSON, it's a direct message from another user
        setMessages((prev) => [
          ...prev,
          {
            text: event.data,
            isSent: false,
            timestamp: new Date(),
          },
        ])
      }
    }

    socket.onclose = () => {
      setIsConnected(false)
      console.log("Connection closed")
    }

    return () => {
      socket.close()
    }
  }, [])

  // Send message function
  const sendMessageToServer = () => {
    if (socketRef.current && text.trim()) {
      const sendMessage = { type: "chat", payload: { message: text } }
      socketRef.current.send(JSON.stringify(sendMessage))

      // Add message to local state
      setMessages((prev) => [
        ...prev,
        {
          text: text,
          isSent: true,
          timestamp: new Date(),
        },
      ])

      // Clear input field
      setText("")
    }
  }

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageToServer()
    }
  }

  // Format time for message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ""

    messages.forEach((message) => {
      const messageDate = message.timestamp.toLocaleDateString()

      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({
          date: messageDate,
          messages: [message],
        })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  return (
    <div className="flex justify-center h-screen w-full fixed p-4 bg-gradient-to-br from-emerald-500 to-teal-700">
      <Card className="w-full max-w-md flex flex-col overflow-hidden shadow-2xl rounded-xl">
        {/* WhatsApp-style header */}
        <div className="bg-emerald-600 text-white p-3 flex justify-between items-center shadow-md">
          <div className="font-medium flex items-center">
            <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></div>
            <span>Active Users: {totalUserCount.toString()}</span>
          </div>
          <div>
            Room: <span className="font-bold bg-white bg-opacity-20 px-2 py-1 rounded-md">{createCode}</span>
          </div>
        </div>

        {/* Connection status */}
        {!isConnected && <div className="bg-yellow-500 text-white text-center text-sm py-1">Reconnecting...</div>}

        {/* Chat messages area with WhatsApp-style background */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-3 overflow-y-auto"
          style={{
            backgroundImage: "url('/placeholder.svg?height=500&width=500')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              <div className="flex justify-center mb-3">
                <div className="bg-gray-200 bg-opacity-70 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {new Date(group.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {group.messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isSent ? "justify-end" : "justify-start"} mb-2 animate-fadeIn`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                      msg.isSent ? "bg-emerald-100 rounded-tr-none" : "bg-white rounded-tl-none"
                    }`}
                  >
                    <p className="text-gray-800">{msg.text}</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <p className="text-xs text-gray-500">{formatTime(msg.timestamp)}</p>
                      {msg.isSent && (
                        <svg
                          className="h-3 w-3 text-emerald-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white text-opacity-70">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4">
                <Send size={24} className="text-white" />
              </div>
              <p className="text-center">No messages yet</p>
              <p className="text-center text-sm">Send a message to start chatting</p>
            </div>
          )}
        </div>

        {/* WhatsApp-style input area */}
        <div className="bg-gray-100 p-2 flex items-end gap-2 border-t border-gray-200">
          <button className="text-gray-500 hover:text-emerald-600 transition-colors">
            <Smile size={20} />
          </button>

          <button className="text-gray-500 hover:text-emerald-600 transition-colors">
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 p-2 max-h-[100px] border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style={{ minHeight: "40px" }}
          />

          <button
            onClick={sendMessageToServer}
            className={`${
              text.trim() ? "bg-emerald-600" : "bg-gray-400"
            } text-white p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors duration-200 hover:bg-emerald-700`}
            disabled={!text.trim()}
          >
            {text.trim() ? <Send size={18} /> : <Mic size={18} />}
          </button>
        </div>
      </Card>
    </div>
  )
}

// Add this to your globals.css or tailwind.config.js
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }
