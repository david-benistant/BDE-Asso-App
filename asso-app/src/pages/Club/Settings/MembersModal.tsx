import React from "react";


type EventModalProps = {
    setIsOpen: (value: boolean) => void;
};

const MembersModal: React.FC<EventModalProps> = ({ setIsOpen }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-1/2 p-6 relative overflow-y-auto max-h-[80vh]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✕
                </button>
                <h2 className="text-3xl font-bold mb-4">Membres</h2>
            </div>
        </div>
    );
};

export default MembersModal;
