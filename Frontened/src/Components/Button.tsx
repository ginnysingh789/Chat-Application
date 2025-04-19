interface ButtonProp{
  label:string
  onClick?:()=>void
}
export const Button = ( props:ButtonProp) => {
   
    return (
      <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300 cursor-pointer " onClick={props.onClick} >
        {props.label}
      </button>
    );
  
  };
  
 
  