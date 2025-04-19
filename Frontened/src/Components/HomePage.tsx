
import { Card } from "./Card";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
export const HomePage = () => {
    const navigate=useNavigate();
    const createRoom=()=>{
        navigate("/Create");
    }
        const joinRoom=()=>{
            console.log("Join Room Called")
            navigate("/Join")
        }
    return (
        <div className="flex">
            <Card><div className="flex justify-center  text-2xl">Chat Application</div>
                <div className=" flex flex-col mt-8 items-center">
                    <div className="mt-1.5">
                    <Button label="Join a Room " onClick={joinRoom}></Button>
                    </div>
                    <div className="mt-1.5">
                    <Button label="Create a Room" onClick={createRoom} ></Button>
                    </div>
                </div>
               
            </Card>
           
            
        </div>


    );
};


