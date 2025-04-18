
import { Button } from "./Button";

 export const Card = ({children}:any) => {
    return (
      <div className="w-80 bg-white rounded-xl shadow-md p-4">
        {/* Header */}
        {children}

      </div>
    );
  };
  
  
  