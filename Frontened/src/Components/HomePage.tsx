
import { Card } from "./Card";
import { Button } from "./Button";
import { useState } from "react";
export const HomePage = () => {
    const[createCode,setcreateCode]=useState<string|null>(null);
    const randomNum=()=>{
        const value:string=(Math.random().toString(36).substring(2,7));
        setcreateCode(value)
        
    }
    return (
        <div className="flex">
            <Card><div className="flex justify-center  text-2xl">Chat Application</div>
                <div className=" flex flex-col mt-8 items-center">
                    <div className="mt-1.5">
                    <Button label="Join a Room "></Button>
                    </div>
                    <div className="mt-1.5">
                    <Button label="Create a Room" onClick={randomNum} ></Button>
                    </div>
                </div>
                <div >{(createCode!=null)?"Random value"+createCode:null}</div>
            </Card>
           
            
        </div>


    );
};


