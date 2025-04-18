export const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  
 
  