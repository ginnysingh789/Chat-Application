import { WebSocketServer } from "ws";
let userCount=0;
let allSocket=[];
const wss=new WebSocketServer({port:8000});
wss.on("connection",(socket)=>{
    allSocket.push(socket);
    userCount=userCount+1;
    socket.onmessage=(e)=>{ 
       for(let s of allSocket)
       {
        if(s!==socket)
        {
            s.send(e.data.toString())
        }
       }
    }
})