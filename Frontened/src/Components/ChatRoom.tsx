"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Send, Mic, CheckCheck, Users, Wifi, WifiOff, ArrowLeft, Copy } from "lucide-react"

interface Message {
  text: string
  isSent: boolean
  timestamp: Date
}

export const ChatRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const socketRef = useRef<WebSocket | null>(null)

  const [totalUserCount, setTotalUserCount] = useState<number>(1)
  const [code, setCode] = useState<string>("")
  const [text, setText] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)

    // Simulate typing indicator for demo purposes
    if (e.target.value && !isTyping) {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 3000)
    }
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
    let currentRoomId = roomId

    // If no roomId in URL, generate one and redirect
    if (!currentRoomId) {
      currentRoomId = Math.random().toString(36).substring(2, 7)
      navigate(`/room/${currentRoomId}`)
      return
    }

    setCode(currentRoomId)
    setIsLoading(true)

    // Simulate connection delay for demo purposes
    setTimeout(() => {
      const socket = new WebSocket("ws://localhost:5000")
      socketRef.current = socket
      console.log("Connecting to socket...")

      socket.onopen = () => {
        setIsConnected(true)
        setIsLoading(false)
        const joinMessage = { type: "join", payload: { roomId: currentRoomId } }
        socket.send(JSON.stringify(joinMessage))
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === "user-count") {
            setTotalUserCount(message.payload.count)
          }
        } catch (e) {
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
        console.log("WebSocket connection closed")
      }
    }, 1500)

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [roomId, navigate])

  const sendMessageToServer = () => {
    if (socketRef.current && text.trim()) {
      const sendMessage = { type: "chat", payload: { message: text } }
      socketRef.current.send(JSON.stringify(sendMessage))

      setMessages((prev) => [...prev, { text, isSent: true, timestamp: new Date() }])

      setText("")
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageToServer()
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ""

    messages.forEach((message) => {
      const messageDate = message.timestamp.toLocaleDateString()
      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ date: messageDate, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const messageGroups = groupMessagesByDate()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gradient-to-br from-sky-100 to-blue-200">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Chat</h2>
          <p className="text-gray-500 text-center">Establishing secure connection to room {code || "..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center h-screen w-full fixed inset-0 bg-gradient-to-br from-sky-100 to-blue-200">
      <div className="w-full h-full flex flex-col overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <button
              className="h-8 w-8 flex items-center justify-center text-white hover:bg-blue-600 rounded-full transition-colors"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="font-semibold">Chat Room</h1>
              <div className="flex items-center text-xs text-blue-100">
                {isConnected ? (
                  <>
                    <Wifi size={12} className="mr-1" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} className="mr-1" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-full">
              <Users size={14} />
              <span className="text-sm">{totalUserCount}</span>
            </div>

            <div
              className="bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer transition-all px-2 py-1 rounded-full text-white text-sm flex items-center gap-1"
              onClick={copyRoomCode}
            >
              {code}
              {isCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="bg-amber-500 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
            <WifiOff size={16} />
            <span>Connection lost. Attempting to reconnect...</span>
          </div>
        )}

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto"
          style={{
            backgroundImage: "url('/placeholder.svg?height=500&width=500')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 bg-opacity-60 text-white text-xs px-3 py-1 rounded-full">
                  {new Date(group.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {group.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-3 ${msg.isSent ? "justify-end" : "justify-start"}`}
                  style={{
                    animation: "fadeIn 0.3s ease-in-out, slideUp 0.3s ease-in-out",
                  }}
                >
                  {!msg.isSent && (
                    <div className="h-8 w-8 mr-2 mt-1 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                      {totalUserCount > 1 ? "U" : "B"}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      msg.isSent ? "bg-blue-500 text-white rounded-tr-none" : "bg-white rounded-tl-none"
                    }`}
                  >
                    <p className={msg.isSent ? "text-white" : "text-gray-800"}>{msg.text}</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <p className={`text-xs ${msg.isSent ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                      {msg.isSent && <CheckCheck className="h-3 w-3 text-blue-100" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {isTyping && messages.length > 0 && (
            <div
              className="flex justify-start mb-4"
              style={{
                animation: "fadeIn 0.3s ease-in-out, slideUp 0.3s ease-in-out",
              }}
            >
              <div className="h-8 w-8 mr-2 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                {totalUserCount > 1 ? "U" : "B"}
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white">
              <div className="bg-white bg-opacity-20 p-6 rounded-full mb-6 backdrop-blur-sm">
                <Send size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">No messages yet</h3>
              <p className="text-center text-white text-opacity-80 max-w-xs">
                Send a message to start chatting. Invite others by sharing your room code.
              </p>
              <button
                className="mt-6 bg-white bg-opacity-20 text-white border-0 hover:bg-opacity-30 px-4 py-2 rounded-md flex items-center transition-colors"
                onClick={copyRoomCode}
              >
                {isCopied ? <CheckCheck size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                Copy Room Code
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 flex items-end gap-2 border-t border-gray-200">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message and press Enter to send"
              className="w-full p-3 pr-12 max-h-[100px] border border-gray-200 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ minHeight: "46px" }}
            />
          </div>

          <button
            onClick={sendMessageToServer}
            className={`rounded-full h-11 w-11 flex items-center justify-center transition-all duration-300 ${
              text.trim() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
            }`}
            disabled={!text.trim() && !isConnected}
          >
            {text.trim() ? <Send size={18} /> : <Mic size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}

// Add these CSS animations to your global styles or inline
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(0);
  }
}
`
