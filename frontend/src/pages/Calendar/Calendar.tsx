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
import eventsWeekRepository from "@repositories/api/events/week/:week/handlers";
import userRepository from "@repositories/api/users/:id/handlers";
import meInfosRepository from "@repositories/graph/me/handlers";
import { useToast } from "@contexts/ToastContext";
import { useNavigate } from "react-router-dom";

const locales = { fr };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const getWeekNumber = (date: Date): number => {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return weekNo;
};

const EventsCalendar: React.FC = () => {
    const [events, setEvents] = useState<EventValueObject[]>([]);
    const [loadedWeeks, setLoadedWeeks] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();
    const navigation = useNavigate();

    const loadEventsWeek = async (date: Date) => {
        const currentWeek = getWeekNumber(date);

        if (loadedWeeks.includes(currentWeek)) return [];

        const eventsWeekRepo = new eventsWeekRepository(currentWeek);

        setLoadedWeeks((prev) => [...prev, currentWeek]);

        const events = await eventsWeekRepo.list();

        if (events.isFailure) {
            toast(events.getError(), "error");
            return [];
        }

        return events.getValue();
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);

            let tmpEvents: EventValueObject[] = [];

            const meInfosRepo = new meInfosRepository();
            const meInfos = await meInfosRepo.get();

            if (meInfos.isFailure) {
                toast(meInfos.getError(), "error");
                setLoading(false);
                return;
            }

            const userRepo = new userRepository(meInfos.getValue().getId());
            const user = await userRepo.get();

            if (user.isFailure) {
                toast(user.getError(), "error");
                setLoading(false);
                return;
            }

            tmpEvents = [...tmpEvents, ...(await loadEventsWeek(new Date()))];

            for (const clubId of user.getValue().getJoinedClubs()) {
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

            setLoading(false);
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
            <div className="p-4 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                        <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}

                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    defaultView={Views.WEEK}
                    views={["week"]}
                    style={{ height: 800 }}
                    min={new Date(new Date().setHours(8, 0, 0, 0))}
                    onNavigate={async (date) => {
                        const toLoad = getWeekNumber(date);

                        if (loadedWeeks.includes(toLoad)) return;

                        setLoading(true);

                        const newEvents = await loadEventsWeek(date);

                        setEvents((prev) => [...prev, ...newEvents]);

                        setLoading(false);
                    }}
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
                        navigation(
                            `/club/${event.resource.clubId}/event/${event.resource.id}`,
                        );
                    }}
                />
            </div>
        </Layout>
    );
};

export default EventsCalendar;
