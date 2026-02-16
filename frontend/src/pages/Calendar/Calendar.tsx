import React, { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    type Event as RBCEvent,
    Views,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventValueObject from "@valueObjects/events/event.valueObject";
import { fr } from "date-fns/locale";
import Layout from "@components/Layout/Layout";
import eventsRepository from "@repositories/api/events/club/:clubId/:visibility/handlers";
import userRepository from "@repositories/api/users/:id/handlers";
import meInfosRepository from "@repositories/graph/me/handlers";
import { useToast } from "@contexts/ToastContext";
import { useNavigate } from "react-router-dom";

const locales = { fr };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // lundi
    getDay,
    locales,
});

const EventsCalendar: React.FC = () => {
    const [events, setEvents] = useState<EventValueObject[]>([]);
    const { toast } = useToast();
    const navigation = useNavigate()

    useEffect(() => {
        const fetchEvents = async () => {
            let tmpEvents: EventValueObject[] = [];
            const meInfosRepo = new meInfosRepository();
            const meInfos = await meInfosRepo.get();
            if (meInfos.isFailure) {
                toast(meInfos.getError(), "error");
                return;
            }
            const userRepo = new userRepository(meInfos.getValue().getId());

            const user = await userRepo.get();
            if (user.isFailure) {
                toast(meInfos.getError(), "error");
                return;
            }

            for (const clubId of user.getValue().getFollowedClubs()) {
                const eventsRepo = new eventsRepository(clubId, "public");
                const events = await eventsRepo.list();
                if (events.isFailure) {
                    toast(events.getError(), "error");
                } else {
                    tmpEvents = [...tmpEvents, ...events.getValue()];
                }
            }
            for (const clubId of user.getValue().getJoinedClubs()) {
                const publicEventsRepo = new eventsRepository(clubId, "public");
                const publicEvents = await publicEventsRepo.list();
                if (publicEvents.isFailure) {
                    toast(publicEvents.getError(), "error");
                } else {
                    tmpEvents = [...tmpEvents, ...publicEvents.getValue()];
                }

                const privateEventsRepo = new eventsRepository(
                    clubId,
                    "private",
                );
                const privateEvents = await privateEventsRepo.list();
                if (privateEvents.isFailure) {
                    toast(privateEvents.getError(), "error");
                } else {
                    tmpEvents = [...tmpEvents, ...privateEvents.getValue()];
                }
            }

            setEvents(
                Array.from(
                    new Map(tmpEvents.map((e) => [e.getId(), e])).values(),
                ),
            );
        };
        fetchEvents();
    }, []);

    const calendarEvents: RBCEvent[] = useMemo(
        () =>
            events.map((evt) => ({
                id: evt.getId(),
                title: evt.getTitle(),
                start: evt.getDate(),
                end: new Date(
                    evt.getDate().getTime() + evt.getDuration() * 1000,
                ),
                allDay: false,
                resource: evt,
            })),
        [events],
    );

    return (
        <Layout>
            <div className="p-4">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    defaultView={Views.WEEK}
                    views={["week", "day", "agenda"]}
                    style={{ height: 800 }}
                    min={new Date(new Date().setHours(8, 0, 0, 0))}
                    messages={{
                        next: "Suivant",
                        previous: "Précédent",
                        today: "Aujourd'hui",
                        month: "Mois",
                        week: "Semaine",
                        day: "Jour",
                        agenda: "Agenda",
                        date: "Date",
                        time: "Heure",
                        event: "Événement",
                        allDay: "Toute la journée",
                        noEventsInRange: "Aucun événement sur cette période",
                        showMore: (total) => `+${total} en plus`,
                    }}
                    formats={{
                        weekdayFormat: (date) =>
                            format(date, "EEEE", { locale: fr }),
                        dayFormat: (date) =>
                            format(date, "dd/MM", { locale: fr }),
                        dayHeaderFormat: (date) =>
                            format(date, "EEEE dd/MM/yyyy", { locale: fr }),
                        monthHeaderFormat: (date) =>
                            format(date, "MMMM yyyy", { locale: fr }),
                        dayRangeHeaderFormat: ({ start, end }) =>
                            `${format(start, "dd/MM/yyyy", { locale: fr })} – ${format(end, "dd/MM/yyyy", { locale: fr })}`,
                        timeGutterFormat: "HH:mm",
                    }}
                    onSelectEvent={(event: RBCEvent) => {
                        navigation(`/club/${event.resource.clubId}/event/${event.resource.id}`)
                    }}
                />
            </div>
        </Layout>
    );
};

export default EventsCalendar;
