import { ReactNode } from "react";
type cardProps={
  children:ReactNode
}
 export const Card = ({children}:cardProps) => {
    return (
      <div className=" bg-white rounded-xl shadow-md p-4">
        {/* Header */}
        {children}

      </div>
    );
  };
  
  
  