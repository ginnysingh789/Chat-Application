
import { json } from "stream/consumers";
import { WebSocketServer,WebSocket } from "ws";
const wss = new WebSocketServer({ port: 5000 })
interface userScheme{
    socket:WebSocket,
    roomId:string
}
let totalUser=0;
let allConnectedUser:userScheme[]=[]

    wss.on("connection", function (socket) {    
       
        //First Join the room
        socket.on("message",(message)=>{
         
                const parsedObject=JSON.parse(message as unknown as string)//Web socket 
                // recieve only string
                
            if(parsedObject.type==="join")
            {
                allConnectedUser.push({socket:socket,roomId:parsedObject.payload.roomId})
                console.log("User Connected")
                totalUser=totalUser+1;
                console.log(totalUser)
                socket.send(JSON.stringify({type:"user-count",payload:{count:totalUser}}))

            }
            //After sending the room send the message
            if(parsedObject.type==="chat")
            {
                //first get the user which send the message
                let CurrentUserRoom=null
                for(let i =0;i<allConnectedUser.length;i++)//Check user exist or not
                {
                    if(allConnectedUser[i].socket===socket)
                    {
                        CurrentUserRoom=allConnectedUser[i].roomId;
                        console.log(CurrentUserRoom)
                    }
                }
                if(CurrentUserRoom!=null)
                {
                    for(let i =0;i<allConnectedUser.length;i++)
                    {
                        if(CurrentUserRoom==allConnectedUser[i].roomId&& allConnectedUser[i].socket!==socket){
                            allConnectedUser[i].socket.send(parsedObject.payload.message)
                        }
                    }
                }
                else
                {
                    console.log("Entry not found ");
                }
            }
        })
       socket.on("close",()=>{
        console.log("User Disconneted");
        allConnectedUser=allConnectedUser.filter(user=>user.socket!=socket)
        
       })
    })



