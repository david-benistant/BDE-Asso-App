import React from "react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
    CalendarIcon,
    UsersIcon,
    ClockIcon,
    ShareIcon,
    DocumentDuplicateIcon,
    QrCodeIcon,
} from "@heroicons/react/24/outline";
import Modal from "@components/Modal/Modal";
import type EventValueObject from "@valueObjects/events/event.valueObject";
import profileCdn from "@repositories/cdn/profile.cdn";
import FileIcon from "@assets/FileIcon.png";
import documentsCdn from "@repositories/cdn/documents.cdn";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

type EventModalProps = {
    setIsOpen: (value: boolean) => void;
    event: EventValueObject;
    toggleSubscribe: (event: EventValueObject) => void;
    userId: string;
};
const ShareButton = ({ event }: { event: EventValueObject }) => {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `https://club.bde-valgrind.fr/club/${event.getClubId()}/event/${event.getId()}`,
            );
        } catch (err) {
            console.error("Erreur lors de la copie :", err);
        }
    };

    const handleDownloadQrCode = async () => {
        try {
            const dataUrl = await QRCode.toDataURL(
                `https://club.bde-valgrind.fr/club/${event.getClubId()}/event/${event.getId()}`,
                {
                    width: 256,
                    margin: 2,
                },
            );

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "qrcode.png";
            link.click();
        } catch (err) {
            console.error("Erreur lors de la génération du QR code:", err);
        }
    };


    return (
        <div className="relative inline-block" ref={popoverRef}>
            <button
                onClick={() => setOpen(!open)}
                className="cursor-pointer px-6 py-2 rounded-md border hover:bg-gray-100"
            >
                <ShareIcon className="w-5 h-5" />
            </button>

            {open && (
                <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 bg-white border rounded-md shadow-lg p-2 z-50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                handleCopy();
                                setOpen(false);
                            }}
                            className="cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => {
                                handleDownloadQrCode();
                                setOpen(false);
                            }}
                            className="cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                            <QrCodeIcon className="w-5 h-5" />
                        </button>
                        {/* <button
                            onClick={() => {
                                shareOnTeams()
                                setOpen(false);
                            }}
                            className="cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                            <img src={TeamsIcon} className="w-5 h-5" />
                        </button> */}
                    </div>
                </div>
            )}
        </div>
    );
};

const EventModal: React.FC<EventModalProps> = ({
    setIsOpen,
    event,
    toggleSubscribe,
    userId,
}) => {
    const navigate = useNavigate();
    const formatDuration = (duration: number): string => {
        if (duration < 3600) {
            return `${Math.floor(duration / 60)}min`;
        } else {
            return `${Math.floor(duration / 3600)}h${Math.floor((duration % 3600) / 60)}`;
        }
    };

    const toggleOpen = (value: boolean) => {
        if (!value) {
            navigate(`/club/${event.getClubId()}`);
        }
        setIsOpen(value);
    };
    return (
        <Modal setIsOpen={toggleOpen} title={event.getTitle()}>
            <div className="flex items-center gap-4 mb-2 text-gray-600">
                <CalendarIcon className="w-5 h-5" />
                <span>
                    {new Intl.DateTimeFormat("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(event.getDate())}
                </span>
            </div>

            <div className="flex items-center gap-4 mb-2 text-gray-600">
                <ClockIcon className="w-5 h-5" />
                <span>{formatDuration(event.getDuration())}</span>
            </div>
            <div className="flex items-center gap-4 mb-2 text-gray-600">
                <UsersIcon className="w-5 h-5" />
                <span>{event.getAttendee().length}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
                {event.getAttendee().map((attendee) => (
                    <div
                        key={attendee.id}
                        className="flex gap-2 justify-center items-center rounded-full border-solid border-1 pl-2"
                    >
                        <div>{attendee.displayName}</div>
                        <img
                            className="outline-1 w-8 h-8 rounded-full"
                            src={profileCdn.get(attendee.id)}
                        />
                    </div>
                ))}
            </div>
            <div className="pt-4 pb-5 prose mb-2">
                <ReactMarkdown>{event.getDescription()}</ReactMarkdown>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                {event.getAttachedObject().map((file) => (
                    <a
                        key={file}
                        className="cursor-pointer relative group w-40"
                        href={documentsCdn.get(file)}
                        download={true}
                    >
                        <div
                            className="w-full h-24 rounded-md border border-gray-800 flex items-center justify-center px-2 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${FileIcon})` }}
                        >
                            <span className="block w-full truncate text-center bg-black/40 text-white rounded px-1">
                                {file.split("/")[1]}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
            <div className="w-full flex mt-6 justify-end gap-2">
                <ShareButton event={event} />
                <button
                    onClick={() => toggleSubscribe(event)}
                    className="cursor-pointer px-6 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                >
                    {event
                        .getAttendee()
                        .find((attendee) => attendee.id === userId)
                        ? "Se désinscrire"
                        : "S’inscrire"}
                </button>
            </div>
        </Modal>
    );
};

export default EventModal;
