
import { Button } from "./Button";
import { Card } from "./Card";
import { useEffect, useState,useRef } from "react";
import { JoinRoom } from "./JoinRoom";
import { sortUserPlugins } from "vite";

export const CreateRoom = () => {
    const SocketRef=useRef<WebSocket|null>(null);
    const [createCode, setCreateCode] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const textareaRef = useRef(null);
    const handleChange = (e) => {
        setText(e.target.value);
      };
      useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = "auto"; // Reset height
          textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
        }
      }, [text]);
  
    useEffect(() => {
      const value: string = Math.random().toString(36).substring(2, 7);
      setCreateCode(value);
      const socket=new WebSocket("ws://localhost:5000")
      console.log("Connection establish to socket")
      SocketRef.current=socket;
      socket.onopen=()=>{
        const joinMessage={"type":"join","payload":{"roomId":value}}
        socket.send(JSON.stringify(joinMessage))
      }},
       []);
       //For Sending messages
       const sendMessageToServer=()=>{
        if(SocketRef.current&&text.trim())
        {
        const SendMessage={"type":"chat","payload":{"message":text}}
        SocketRef.current?.send(JSON.stringify(SendMessage))
        }
       }
     
        
  
    return (
      <div className="flex justify-center  h-screen w-full fixed  p-4 bg-slate-400">
        <Card>
          <div className="flex flex-col gap-4 p-8 w-screen ">
            <div className="flex justify-between text-lg font-medium">
              <div>User Count: 0</div>
              <div>
                Room Code: <span className="text-blue-600">{createCode}</span>
              </div>
            </div>
            <div className="h-72 bg-slate-400 rounded-xl shadow-inner border-orange-500" />
            <div className="flex justify-evenly bg-slate-500">
            <textarea
      ref={textareaRef}
      value={text}
      onChange={handleChange}
      rows={1}
      placeholder="Type something..."
      className="w-full p-2 border border-gray-300 rounded resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
           <Button label="Send"  onClick={sendMessageToServer}></Button>
           </div>
          </div>
        </Card>
      </div>
    );
  };
  
