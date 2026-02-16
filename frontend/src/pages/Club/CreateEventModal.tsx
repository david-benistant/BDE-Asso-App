import React, { useRef, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Modal from "@components/Modal/Modal";
import FileDropzone, {
    type FileItem,
} from "@components/FileDropzone/FileDropzone";
import EventClubRepository from "@repositories/api/events/club/:clubId/handlers";
import { useToast } from "@contexts/ToastContext";
import { Spinner } from "@components/Spinner/Spinner";
import EventValueObject, { type Tvisibility } from "@valueObjects/events/event.valueObject";

type EventForm = {
    title: string;
    dateTime: string;
    description: string;
    visibility: string;
    durationHours: string;
    durationMinutes: string;
};

type CreateEventModalProps = {
    setIsOpen: (value: boolean) => void;
    clubId: string;
    setEvents: React.Dispatch<React.SetStateAction<EventValueObject[]>>;
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({
    setIsOpen,
    clubId,
    setEvents
}) => {
    const titleInput = useRef<HTMLInputElement>(null);
    const dateTimeInput = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<FileItem[]>([]);

    const [event, setEvent] = useState<EventForm>({
        title: "",
        dateTime: "",
        description: "",
        visibility: "public",
        durationHours: "",
        durationMinutes: "",
    });

    const handleSubmit = async () => {
        if (!event.dateTime) {
            toast("Veuillez sélectionner une date et une heure", "error");
            return;
        }

        setLoading(true);
        const EventClubRepo = new EventClubRepository(clubId);
        const durationSeconds =
            Number(event.durationHours || 0) * 3600 +
            Number(event.durationMinutes || 0) * 60;

        const result = await EventClubRepo.post({
            title: event.title,
            description: event.description,
            attachedFiles: files.map((file) => ({
                name: file.name,
                buf: file.buffer,
            })),
            date: new Date(event.dateTime),
            visibility: event.visibility,
            duration: durationSeconds,
        });

        setLoading(false);
        if (result.isFailure) {
            toast(result.getError(), "error");
        } else {
            const eventId = result.getValue()
            setEvents((events) => {
                return [ ...events, new EventValueObject({
                    title: event.title,
                    description: event.description,
                    id: eventId,
                    attachedObjects: files.map((file) => `${eventId}/${file.name}`),
                    visibility: event.visibility as Tvisibility,
                    date: new Date(event.dateTime).getTime() / 1000,
                    attendee: [],
                    clubId: clubId,
                    duration: durationSeconds
                })]
            })
            setIsOpen(false);
        }
    };

    return (
        <Modal setIsOpen={setIsOpen} title="Créer un événement">
            {loading && (
                <div className="fixed inset-0 z-50 bg-black/70">
                    <Spinner />
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label className="block font-semibold">Titre</label>
                    <div className="flex w-full">
                        <input
                            ref={titleInput}
                            type="text"
                            value={event.title}
                            onChange={(e) =>
                                setEvent({ ...event, title: e.target.value })
                            }
                            className="flex-grow border rounded-lg p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold">Date & heure</label>
                    <div className="flex w-full items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        <input
                            ref={dateTimeInput}
                            type="datetime-local"
                            value={event.dateTime}
                            onChange={(e) =>
                                setEvent({ ...event, dateTime: e.target.value })
                            }
                            className="flex-grow border rounded-lg p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold">Durée</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="0"
                            placeholder="Heures"
                            value={event.durationHours}
                            onChange={(e) =>
                                setEvent({
                                    ...event,
                                    durationHours: e.target.value,
                                })
                            }
                            className="w-1/2 border rounded-lg p-2"
                        />
                        <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="Minutes"
                            value={event.durationMinutes}
                            onChange={(e) =>
                                setEvent({
                                    ...event,
                                    durationMinutes: e.target.value,
                                })
                            }
                            className="w-1/2 border rounded-lg p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold">
                        Description (Markdown)
                    </label>
                    <textarea
                        value={event.description}
                        onChange={(e) =>
                            setEvent({
                                ...event,
                                description: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2 min-h-[120px]"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Ressources</label>
                    <FileDropzone setFiles={setFiles} />
                </div>

                <div>
                    <label className="block font-semibold flex items-center gap-1">
                        Visibilité
                        <span className="ml-5 relative">
                            <span className="cursor-pointer text-xs text-gray-400">
                                Détermine qui peut voir l'événement : public =
                                tout le monde, privé = seulement les
                                membres.
                            </span>
                        </span>
                    </label>
                    <select
                        value={event.visibility}
                        onChange={(e) =>
                            setEvent({
                                ...event,
                                visibility: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="public">Public</option>
                        <option value="private">Privé</option>
                    </select>
                </div>

                <div className="w-full flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="cursor-pointer mt-6 px-6 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                    >
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateEventModal;
