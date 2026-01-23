import React from "react";
import ReactMarkdown from "react-markdown";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";


type EventModalProps = {
    setIsOpen: (value: boolean) => void;
};

const EventModal: React.FC<EventModalProps> = ({ setIsOpen }) => {
    const event = {
        id: 1,
        title: "Sortie photo urbaine",
        date: "2026-02-03",
        location: "Centre-ville",
        description: `
# Bienvenue à la sortie photo urbaine

Rejoignez-nous pour une **journée de photographie** dans le centre-ville.  

- Apportez votre appareil photo  
- Habillez-vous confortablement  
- Prévoyez de l'eau et un snack  

> Note : Cette sortie est ouverte à tous, débutants comme professionnels.
        `,
        numberOfAttendees: 10,
        visibility: "public",
        resources: ["manual.pdf"],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-1/2 p-6 relative overflow-y-auto max-h-[80vh]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✕
                </button>
                <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
                <div className="flex items-center gap-4 mb-2 text-gray-600">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-4 mb-2 text-gray-600">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-4 mb-2 text-gray-600">
                    <UsersIcon className="w-5 h-5" />
                    <span>{event.numberOfAttendees}</span>
                </div>
                <div className="pt-4 pb-5 prose mb-2">
                    <ReactMarkdown>{event.description}</ReactMarkdown>
                </div>
                
                <p className="text-gray-600 mb-1">
                    <strong>Ressources:</strong> {event.resources.join(", ")}
                </p>
            </div>
        </div>
    );
};

export default EventModal;
