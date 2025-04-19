import {  useNavigate } from "react-router-dom"
import { Button } from "./Button"
import { Card } from "./Card"

export const JoinRoom=()=>{
    const navigate=useNavigate();
    const joiningRoom=()=>{
        console.log("Joining Room is called")
        navigate("/Create")

    }
    return(
        <div>
            <Card>
                <span>Enter the room code </span>
                <span><input type="text" maxLength={6} placeholder="Code" /></span>
                <Button label="Join"  onClick={joiningRoom}></Button>

            </Card>
        </div>
    )
}