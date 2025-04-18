 export const Button = ({ label = "Click Me",onClick }) => {
   
    return (
      <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300 cursor-pointer " onClick={onClick} >
      
        {label}
      </button>
    );
  
  };
  
 
  