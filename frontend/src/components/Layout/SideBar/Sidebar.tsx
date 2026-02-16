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
            className={`fixed left-0 z-40 w-40 h-[calc(100vh-var(--spacing)*14)] md:bg-white bg-gray-800 md:text-black text-white transform transition-transform duration-300 md:translate-x-0 md:border-r ${
                open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <nav className="flex flex-col gap-2 p-4">
                <Link
                    to="/"
                    onClick={onClose}
                    className="p-2 rounded md:hover:bg-gray-200"
                >
                    Accueil
                </Link>
                <Link
                    to="/calendar"
                    onClick={onClose}
                    className="p-2 rounded md:hover:bg-gray-200 md:block hidden"
                >
                    Calendrier
                </Link>
            </nav>
        </div>
    );
}
