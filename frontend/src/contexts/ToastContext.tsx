import { createContext, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error";

type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error("useToast doit être utilisé dans un ToastProvider");
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const toast = (message: string, type: ToastType = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-50">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-2 rounded shadow-lg text-white ${
                            t.type === "error" ? "bg-red-500" : "bg-green-500"
                        } animate-slide-in`}    //? annimation marche pas, ça me fait chier 
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
