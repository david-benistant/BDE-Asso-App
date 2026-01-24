// import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <div
            className={`fixed left-0 z-40 w-40 h-[calc(100vh-var(--spacing)*14)] transform transition-transform duration-300 md:translate-x-0 md:border-r ${
                open
                    ? "translate-x-0 bg-gray-800 text-white"
                    : "-translate-x-full md:text-black text-transparent"
            }`}
        >
            <nav className="flex flex-col gap-2 p-4">
                <Link
                    to="/"
                    onClick={onClose}
                    className="hover:bg-gray-200 p-2 rounded"
                >
                    Accueil
                </Link>

                
               
            </nav>
        </div>
    );
}
