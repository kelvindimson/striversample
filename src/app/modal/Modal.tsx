import { title } from "process";
import { useState } from "react";

interface ModalProps {
    id?: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    isClicked: (
    event: 
    | React.MouseEvent 
    | React.KeyboardEvent<HTMLDivElement>
    | React.MouseEvent<HTMLButtonElement>
    | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, isClicked, children }) => {

    const [modalState, setModalState] = useState(false);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setModalState(false);
      onClose();
    }
  };

  const handleEscapeKey: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Escape") {
      setModalState(false);
      onClose();
    }
  };

  return (
    <>
        <div 
        className={`duration-500 ease-in-out; ${isOpen ? "fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 visible transform" : " invisible " }`}
           >

        <div className={`transition duration-150 ease-in-out ${isOpen ? "w-4/5 bg-white rounded-lg z-50 overflow-hidden scale-100 p-2 lg:p-6 md:p-4 sm:p-2 lg:w-[600px] md:w-3/4 sm:w-4/5" : "scale-0" }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onKeyDown={handleEscapeKey} >
                <div className="p-4">
                    <h2 id="modal-title" className="text-xl font-bold mb-4"> {title} </h2>
                {children}
                </div>
        </div>

        <div className={`transition duration-150 ease-in-out ${isOpen ? "absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50 visible" : " invisible opacity-0"}`} 
        onClick={handleOverlayClick}
        >


        </div>
          

        </div>

    </>
  );
}

export default Modal