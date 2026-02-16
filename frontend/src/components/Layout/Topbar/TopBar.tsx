import { useEffect, useRef, useState } from "react";
import NotificationPopover from "./Notifications";
import { useToast } from "@contexts/ToastContext";
import type MeInfosValueObject from "@valueObjects/me/infos/meInfos.valueObject";
// import mePhoto from "@repositories/graph/me/photo/mePhoto";
// import type mePhotoValueObject from "@valueObjects/me/photo/mePhoto.valueObject";
import meRepository from "@repositories/graph/me/handlers"
import profileCdn from "@repositories/cdn/profile.cdn";

type TopBarProps = {
    onSearch?: (value: string) => void;
    setSideBarOpen: (value: boolean) => void
    customButton?: { text: string, icon: React.ReactNode, onClick: () => void }
};

export default function TopBar({ onSearch, setSideBarOpen, customButton }: TopBarProps) {
    const [search, setSearch] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [me, setMe] =
        useState<MeInfosValueObject | null>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            const meRepo = new meRepository();

            const object = await meRepo.get();

            if (object.isFailure) {
                toast(object.getError(), "error")
            } else {
                setMe(object.getValue())
            }
        };

        fetchPhoto()
    }, []);

    return (
        <>
            <div
                className="fixed w-full h-14 bg-gray-800 flex items-center px-4 md:px-6 shadow-md"
                ref={buttonRef}
            >
                <div className="flex-1" >
                    <div className="md:hidden flex items-center p-4 ">

                    <button
                            onClick={() => setSideBarOpen(true)}
                            className="text-2xl text-white"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {onSearch && (
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            onSearch(e.target.value);
                        }}
                        placeholder="Search..."
                        className="hidden md:block h-9 w-64 px-4 rounded-md bg-white/15 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                )}

                {onSearch && (
                    <button
                        onClick={() => setMobileSearchOpen(true)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21 21l-4.3-4.3m1.3-5.7a7 7 0 1 1-14 0a7 7 0 0 1 14 0" />
                        </svg>
                    </button>
                )}

                {customButton && (
                    <button
                        onClick={customButton.onClick}
                        className="cursor-pointer hidden md:flex h-9 ml-4 p-4 items-center rounded-md justify-center bg-white/15 hover:bg-white/25 text-white"
                    >
                        {customButton.text}
                    </button>
                )}

                {customButton && (
                    <button
                        onClick={customButton.onClick}
                        className="cursor-pointer md:hidden w-9 h-9 ml-4 flex items-center rounded-full justify-center bg-white/15 hover:bg-white/25 text-white"
                    >
                        {customButton.icon}
                    </button>
                )}

                <NotificationPopover />

                <div className="ml-3 w-9 h-9 rounded-full bg-white/20 overflow-hidden">
                    { me && 
                    
                    <img src={profileCdn.get(me.getId())} className="w-full h-full object-cover" />
                    }
                </div>
            </div>

            {mobileSearchOpen && (
                <div className="fixed inset-0 bg-gray-800 z-50 flex items-center px-4">
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            onSearch?.(e.target.value);
                        }}
                        placeholder="Search..."
                        className="w-full h-12 px-4 rounded-md bg-white/15 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                        onClick={() => setMobileSearchOpen(false)}
                        className="ml-3 text-white text-xl"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
