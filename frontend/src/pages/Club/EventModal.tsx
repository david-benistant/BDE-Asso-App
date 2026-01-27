import React from "react";
import ReactMarkdown from "react-markdown";
import {
    CalendarIcon,
    MapPinIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import Modal from "@components/Modal/Modal";

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
        <Modal setIsOpen={setIsOpen} title={event.title}>
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
        </Modal>
    );
};

export default EventModal;
