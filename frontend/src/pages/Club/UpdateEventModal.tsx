import React, { useRef, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Modal from "@components/Modal/Modal";
import { useToast } from "@contexts/ToastContext";
import { Spinner } from "@components/Spinner/Spinner";
import EventValueObject from "@valueObjects/events/event.valueObject";
import EventsClubEventRepository from "@repositories/api/events/club/:clubId/:eventId/handlers";

type EventForm = {
    title: string;
    dateTime: string;
    description: string;
    durationHours: string;
    durationMinutes: string;
};

type CreateEventModalProps = {
    setIsOpen: (value: boolean) => void;
    eventSource: EventValueObject;
    setEvents: React.Dispatch<React.SetStateAction<EventValueObject[]>>;
};

const UpdateEventModal: React.FC<CreateEventModalProps> = ({
    setIsOpen,
    eventSource,
    setEvents,
}) => {
    const titleInput = useRef<HTMLInputElement>(null);
    const dateTimeInput = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [event, setEvent] = useState<EventForm>({
        title: eventSource.getTitle(),
        dateTime: formatDate(eventSource.getDate()),
        description: eventSource.getDescription(),
        durationHours: Math.floor(eventSource.getDuration() / 3600).toString(),
        durationMinutes: Math.floor(
            (eventSource.getDuration() % 3600) / 60,
        ).toString(),
    });

    const handleSubmit = async () => {
        if (!event.dateTime || !event.title) {
            toast("Veuillez sélectionner une date et une heure", "error");
            return;
        }

        setLoading(true);

        const EventsClubEventRepo = new EventsClubEventRepository(
            eventSource.getClubId(),
            eventSource.getId(),
        );

        const durationSeconds =
            Number(event.durationHours || 0) * 3600 +
            Number(event.durationMinutes || 0) * 60;

        const result = await EventsClubEventRepo.put({
            title: event.title,
            duration: durationSeconds,
            date: new Date(event.dateTime),
            description: event.description,
        });

        setLoading(false);
        if (result.isFailure) {
            toast(result.getError(), "error");
        } else {
            setEvents((events) => {
                const toChange = events.findIndex(
                    (event) => event.getId() === eventSource.getId(),
                );
                if (toChange === -1) return events;
                const newEvents = [...events];
                newEvents[toChange] = new EventValueObject({
                    ...newEvents[toChange].getObject(),
                    title: event.title,
                    duration: durationSeconds,
                    date: new Date(event.dateTime).getTime() / 1000,
                    description: event.description,
                });

                return newEvents
            });
            setIsOpen(false);
        }
    };

    return (
        <Modal setIsOpen={setIsOpen} title="Mettre à jour un événement">
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

export default UpdateEventModal;
