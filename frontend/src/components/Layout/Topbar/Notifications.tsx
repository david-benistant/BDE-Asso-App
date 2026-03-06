import { useState, useRef, useEffect } from "react";
import notificationsRepository from "@repositories/api/notifications/handlers";
import { useToast } from "@contexts/ToastContext";
import NotificationValueObject from "@valueObjects/notifications/notifications.valueObject";
import { useNavigate } from "react-router-dom";

export default function NotificationPopover() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const [hasNotification, setHasNotification] = useState(false);
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<
        NotificationValueObject[]
    >([]);
    const [nbNew, setNbNew] = useState<number>(0);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            const notifcationsRepo = new notificationsRepository();

            const result = await notifcationsRepo.list();

            if (result.isFailure) {
                toast(result.getError(), "error");
            }

            const sorted = result.getValue().sort((a, b) => {
                return b.getCreatedAt() - a.getCreatedAt();
            });

            const latestViewed = localStorage.getItem(
                "latest-viewed-notification",
            );

            let tmpNewNb = 0;
            if (latestViewed) {
                const latest = sorted.findIndex(
                    (notif) =>
                        notif.getCreatedAt() === Number.parseInt(latestViewed),
                );
                if (latest !== undefined) {
                    tmpNewNb = sorted.length - (sorted.length - latest);
                }
            } else {
                if (sorted.length > 0) {
                    localStorage.setItem(
                        "latest-viewed-notification",
                        sorted[0].getCreatedAt().toString(),
                    );
                }
            }
            if (tmpNewNb > 0) {
                setHasNotification(true);
                setNbNew(tmpNewNb);
            }

            setNotifications(sorted);
        };
        fetchNotifications();
    }, []);

    const handleClick = (notification: NotificationValueObject) => {
        navigate(`/club/${notification.getResourceId()}`);
    };

    const openNotifications = () => {
        setOpen((v) => !v);
        setHasNotification(false);
        console.log();
        localStorage.setItem(
            "latest-viewed-notification",
            notifications[0].getCreatedAt().toString(),
        );
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={openNotifications}
                className="cursor-pointer relative w-9 h-9 ml-3 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white"
            >
                {hasNotification && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
                </svg>
            </button>

            {open && (
                <div
                    ref={popoverRef}
                    className="
                      fixed inset-x-4 top-16
                      sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3
                      w-[calc(100vw-2rem)] sm:w-80
                      max-h-96      
                      bg-white rounded-xl shadow-xl border border-gray-100 z-100
                      overflow-hidden 
                    "
                >
                    <div className="px-4 py-3 border-b font-semibold text-sm sticky top-0 bg-white">
                        Notifications
                    </div>

                    <div className="overflow-y-auto max-h-80">
                        {" "}
                        {/* conteneur scrollable */}
                        {notifications.map((n, i) => (
                            <div
                                onClick={() => handleClick(n)}
                                key={n.getId()}
                                className="px-4 py-4 relative hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            >
                                {i < nbNew && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                                )}

                                <div className="flex justify-between gap-2">
                                    <p className="font-medium text-sm">
                                        {n.getTitle()}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {n.getMessage()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
