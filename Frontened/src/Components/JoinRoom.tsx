import { useNavigate } from "react-router-dom"
import { Button } from "./Button"
import { Card } from "./Card"
import { useState } from "react"

export const JoinRoom = () => {
    const [inputValue, setInputValue] = useState<string>("")
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const joiningRoom = () => {
        if (!inputValue.trim()) return

        const socket = new WebSocket("ws://localhost:5000")
        console.log("Connecting to WebSocket...")

        socket.onopen = () => {
            console.log("WebSocket connected")
            const joinMessage = { type: "join", payload: { roomId: inputValue.trim() } }
            socket.send(JSON.stringify(joinMessage))

            // ✅ Navigate to the room page after joining
            navigate(`/room/${inputValue.trim()}`)
        }

        socket.onerror = () => {
            console.error("WebSocket error while joining room")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="p-6 space-y-4 w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold">Enter Room Code</h2>
                <input
                    type="text"
                    maxLength={6}
                    placeholder="Code"
                    onChange={handleInputChange}
                    value={inputValue}
                    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button  variant="secondary" label="Join" onClick={joiningRoom} />
            </Card>
        </div>
    )
}
