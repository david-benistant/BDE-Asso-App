import React from "react";
import ReactMarkdown from "react-markdown";
import {
    CalendarIcon,
    UsersIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import Modal from "@components/Modal/Modal";
import type EventValueObject from "@valueObjects/events/event.valueObject";
import profileCdn from "@repositories/cdn/profile.cdn";
import FileIcon from "@assets/FileIcon.png";
import documentsCdn from "@repositories/cdn/documents.cdn";
import { useNavigate } from "react-router-dom";

type EventModalProps = {
    setIsOpen: (value: boolean) => void;
    event: EventValueObject;
    toggleSubscribe: (event: EventValueObject) => void;
    userId: string;
};

const EventModal: React.FC<EventModalProps> = ({
    setIsOpen,
    event,
    toggleSubscribe,
    userId,
}) => {
    const navigate = useNavigate()
    const formatDuration = (duration: number): string => {
        if (duration < 3600) {
            return `${Math.floor(duration / 60)}min`;
        } else {
            return `${Math.floor(duration / 3600)}h${Math.floor((duration % 3600) / 60)}`;
        }
    };

    const toggleOpen = (value: boolean) => {
        if (!value) {
            navigate(`/club/${event.getClubId()}`)
        }
        setIsOpen(value)
    }
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
                    <a key={file} className="cursor-pointer relative group w-40" href={documentsCdn.get(file)} download={true} >
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
            <div className="w-full flex justify-end">
                <button
                    onClick={() => toggleSubscribe(event)}
                    className="cursor-pointer mt-6 px-6 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
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
