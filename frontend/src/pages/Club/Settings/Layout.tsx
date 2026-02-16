import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

type LayoutProps = {
    children: ReactNode;
};

export default function SettingsLayout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="h-14 bg-gray-900 text-white flex items-center px-6 gap-4 overflow-x-scroll whitespace-nowrap">
                <button
                    onClick={() => navigate(`/club/${id}/settings`)}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-gray-700 transition shrink-0"
                >
                    Paramètres
                </button>
                <button
                    onClick={() => navigate(`/club/${id}/members`)}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-gray-700 transition shrink-0"
                >
                    Membres
                </button>
                {/* <button
                    onClick={() => navigate(`/club/${id}/danger`)}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-gray-700 transition shrink-0"
                >
                    Zone de danger
                </button> */}
            </nav>

            <div className="flex-1 bg-gray-100">{children}</div>
        </div>
    );
}
