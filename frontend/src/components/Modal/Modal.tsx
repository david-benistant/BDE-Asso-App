import type React from "react";

const Modal = ({
    setIsOpen,
    title,
    children,
}: {
    setIsOpen: (value: boolean) => void;
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-11/12 md:w-1/2 p-6 relative overflow-y-auto max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold mb-4">{title}</h2>

                {children}
            </div>
        </div>
    );
};

export default Modal;
