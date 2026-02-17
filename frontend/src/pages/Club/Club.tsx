import Layout from "@components/Layout/Layout";
import CarouselImages from "@components/Carousel/Carousel";
import ReactMarkdown from "react-markdown";
import EventModal from "./EventModal";
import { useEffect, useState } from "react";
import { Cog6ToothIcon, PencilIcon } from "@heroicons/react/24/outline";
import AuthProvider, { type GraphToken } from "@repositories/AuthProvider";
import { useNavigate } from "react-router-dom";
import ClubValueObject, { Roles } from "@valueObjects/clubs/club.valueObject";
import clubRepository from "@repositories/api/clubs/:id/handlers";
import { useParams } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import type UserValueObject from "@valueObjects/users/user.valueObject";
import userRepository from "@repositories/api/users/:id/handlers";
import profileCDN from "@repositories/cdn/profile.cdn";
import { Spinner } from "@components/Spinner/Spinner";
import picturesCdn from "@repositories/cdn/pictures.cdn";
import clubFollowRepository from "@repositories/api/clubs/:id/follow/handlers";
import clubUnFollowRepository from "@repositories/api/clubs/:id/unfollow/handlers";
import clubJoinRepository from "@repositories/api/clubs/:id/join/handlers";
import clubJoinPendingRepository from "@repositories/api/clubs/:id/join/pending/handlers";
import clubLeaveRepository from "@repositories/api/clubs/:id/leave/handlers";
import CreateEventModal from "./CreateEventModal";
import EventValueObject from "@valueObjects/events/event.valueObject";
import eventsRepository from "@repositories/api/events/club/:clubId/:visibility/handlers";
import eventSubscribeRepository from "@repositories/api/events/club/:clubId/subscribe/:id/handlers";
import eventUnsubscribeRepository from "@repositories/api/events/club/:clubId/unsubscribe/:id/handlers";
import UpdateEventModal from "./UpdateEventModal";

const PresidentAndNumbers = ({
    club,
    setClub,
    setCreateEventModalOpen,
}: {
    club: ClubValueObject;
    setClub: (value: ClubValueObject) => void;
    setCreateEventModalOpen: (value: boolean) => void;
}) => {
    const [president, setPresident] = useState<UserValueObject | undefined>();
    const { toast } = useToast();
    const [userInfos, setUserInfos] = useState<GraphToken>();

    const isFollowed = club.getfollowers().find((id) => id === userInfos?.oid)
        ? true
        : false;

    const isMember = club
        .getMembers()
        .find((member) => member.id === userInfos?.oid)
        ? true
        : false;

    const isPresident = club.getPresidentId() === userInfos?.oid;
    const isOrganisator =
        club.getMembers().find((member) => member.id === userInfos?.oid)
            ?.role === Roles.ORGANISATOR;

    const { id } = useParams<{ id: string }>();
    const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
    const [loadingJoin, setLoadingJoin] = useState<boolean>(false);

    const [pending, setPending] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const fetchDatas = async () => {
            if (!club) return;

            const userRepo = new userRepository(club.getPresidentId());

            const response = await userRepo.get();

            if (response.isFailure) {
                toast("Failed to fetch president informations", "error");
            }

            setPresident(response.getValue());
            const infos = await AuthProvider.getAccountInfos();
            if (!infos) return;
            setUserInfos(infos);

            const joinPendingRepo = new clubJoinPendingRepository(club.getId());

            const PendingResponse = await joinPendingRepo.get();

            if (PendingResponse.isFailure) {
                console.log("lalalaalal", PendingResponse.getError());
                toast(PendingResponse.getError(), "error");
            } else {
                setPending(PendingResponse.getValue());
            }
        };

        if (club) {
            fetchDatas();
        }
    }, [club.getPresidentId(), club.getId()]);

    const followClub = async () => {
        if (!id) return;
        setLoadingFollow(true);
        const repo = new clubFollowRepository(id);

        if (userInfos) {
            setClub(
                new ClubValueObject({
                    ...club.getObject(),
                    followers: [...club.getfollowers(), userInfos.oid],
                }),
            );
        }

        const response = await repo.put();

        if (response.isFailure) {
            if (userInfos) {
                setClub(
                    new ClubValueObject({
                        ...club.getObject(),
                        followers: club
                            .getfollowers()
                            .filter((clubId) => clubId !== userInfos.oid),
                    }),
                );
            }

            toast(response.getError(), "error");
        }
        setLoadingFollow(false);
    };

    const unfollowClub = async () => {
        if (!id) return;
        setLoadingFollow(true);
        const repo = new clubUnFollowRepository(id);

        if (userInfos) {
            setClub(
                new ClubValueObject({
                    ...club.getObject(),
                    followers: club
                        .getfollowers()
                        .filter((clubId) => clubId !== userInfos.oid),
                }),
            );
        }
        const response = await repo.put();

        if (response.isFailure) {
            if (userInfos) {
                setClub(
                    new ClubValueObject({
                        ...club.getObject(),
                        followers: [...club.getfollowers(), userInfos.oid],
                    }),
                );
            }
            toast(response.getError(), "error");
        }
        setLoadingFollow(false);
    };

    const joinClub = async () => {
        if (!id) return;
        setLoadingJoin(true);
        setPending(true);
        const repo = new clubJoinRepository(id);
        const response = await repo.put();

        if (response.isFailure) {
            setPending(false);
            toast(response.getError(), "error");
        }
        setLoadingJoin(false);
    };

    const leaveClub = async () => {
        if (!id) return;
        setLoadingJoin(true);

        const leftMember = club
            .getMembers()
            .find((item) => item.id === userInfos?.oid);
        const members = club
            .getMembers()
            .filter((item) => item.id !== userInfos?.oid);

        if (leftMember) {
            setClub(new ClubValueObject({ ...club.getObject(), members }));
        }

        const clubLeaveRepo = new clubLeaveRepository(id);

        const response = await clubLeaveRepo.put();

        if (response.isFailure) {
            if (leftMember) {
                setClub(
                    new ClubValueObject({
                        ...club.getObject(),
                        members: [...members, leftMember],
                    }),
                );
            }
            toast(response.getError(), "error");
        }
        setLoadingJoin(false);
    };

    if (!president) {
        return <Spinner />;
    }
    return (
        <>
            <div className="flex items-center gap-4">
                <img
                    src={profileCDN.get(president.getId())}
                    alt={president.getDisplayName()}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <div className="text-sm text-gray-500">Président</div>
                    <div className="font-semibold">
                        {president.getDisplayName()}
                    </div>
                </div>
            </div>

            <div className="flex justify-between text-center">
                <div>
                    <div className="text-xl font-bold">
                        {club.getMembers().length}
                    </div>
                    <div className="text-sm text-gray-500">
                        Membre{club.getMembers().length > 1 ? "s" : ""}
                    </div>
                    {!isPresident && pending !== undefined && (
                        <button
                            onClick={isMember ? leaveClub : joinClub}
                            disabled={loadingJoin || pending}
                            className={
                                "mt-4 px-4 h-10 py-1 text-white rounded cursor-pointer bg-green-600"
                            }
                        >
                            {pending && <>En attente</>}
                            {!pending && (
                                <>{isMember ? "Quitter" : "Rejoindre"}</>
                            )}
                        </button>
                    )}
                </div>
                <div>
                    <div className="text-xl font-bold">
                        {club.getfollowers().length}
                    </div>
                    <div className="text-sm text-gray-500">
                        Abonné{club.getfollowers().length > 1 ? "s" : ""}
                    </div>
                    <button
                        onClick={isFollowed ? unfollowClub : followClub}
                        disabled={loadingFollow}
                        className="mt-4 px-4 h-10 py-1 bg-gray-800 text-white rounded cursor-pointer"
                    >
                        <>{isFollowed ? "Ne plus suivre" : "Suivre"}</>
                    </button>
                </div>
            </div>
            {(isOrganisator || isPresident) && (
                <div className="flex items-center mt-10 gap-4">
                    <button
                        onClick={() => setCreateEventModalOpen(true)}
                        className="w-full h-10 bg-gray-800 text-white rounded cursor-pointer"
                    >
                        Créer un évènement
                    </button>
                </div>
            )}
        </>
    );
};

const Club = () => {
    const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
    const [eventModalContent, setEventModalContent] =
        useState<EventValueObject | null>(null);
    const [accountInfos, setAccountInfos] = useState<GraphToken | undefined>();

    const [club, setClub] = useState<ClubValueObject | undefined>();
    const isPresident = accountInfos?.oid === club?.getPresidentId();

    const { id, eventId } = useParams<{ id: string; eventId: string }>();
    const { toast } = useToast();

    const navigate = useNavigate();
    const [createEventModalOpen, setCreateEventModalOpen] =
        useState<boolean>(false);
    const [updateEventModalOpen, setUpdateEventModalOpen] =
        useState<boolean>(false);
    const [updateEventModalObject, setUpdateEventModalObject] =
        useState<EventValueObject | null>(null);

    const [events, setEvents] = useState<EventValueObject[]>([]);

    useEffect(() => {
        const fetchDatas = async () => {
            if (!id) return;
            const clubRepo = new clubRepository(id);

            const response = await clubRepo.get();

            if (response.isFailure) {
                return toast("Failed to get club", "error");
            }
            const clubValue = response.getValue();
            setClub(clubValue);

            const infos = await AuthProvider.getAccountInfos();
            if (!infos) {
                return toast("Failed to get account informations", "error");
            }
            setAccountInfos(infos);

            const publicEventsRepo = new eventsRepository(id, "public");

            const publicEvents = await publicEventsRepo.list();

            if (publicEvents.isFailure) {
                toast(publicEvents.getError());
            }

            let mergedEvents = publicEvents.getValue();

            if (
                clubValue
                    .getMembers()
                    .find((member) => member.id === infos?.oid)
            ) {
                const privateEventsRepo = new eventsRepository(id, "private");

                const privateEvents = await privateEventsRepo.list();

                if (privateEvents.isFailure) {
                    toast(privateEvents.getError());
                }

                mergedEvents = [...mergedEvents, ...privateEvents.getValue()];
            }

            const now = new Date();

            mergedEvents = mergedEvents
                .filter((e) => e.getDate().getTime() >= now.getTime())
                .sort((a, b) => a.getDate().getTime() - b.getDate().getTime());

            setEvents(mergedEvents);

            if (eventId) {
                const toOpenEvent = mergedEvents.find(
                    (evnt) => evnt.getId() === eventId,
                );
                if (toOpenEvent) {
                    setEventModalOpen(true);
                    setEventModalContent(toOpenEvent);
                }
            }
        };

        fetchDatas();
    }, [id]);

    if (!club || !accountInfos || !id) {
        return (
            <Layout>
                <div className="md:w-full w-screen pt-50">
                    <Spinner />
                </div>
            </Layout>
        );
    }

    const toggleSubscribe = async (event: EventValueObject) => {
        if (
            event
                .getAttendee()
                .find((attendee) => attendee.id === accountInfos.oid)
        ) {
            let tmpEvents = [
                ...events.filter((evnt) => evnt.getId() !== event.getId()),
                new EventValueObject({
                    ...event.getObject(),
                    attendee: event
                        .getAttendee()
                        .filter((attendee) => attendee.id !== accountInfos.oid),
                }),
            ];
            setEvents(tmpEvents);
            setEventModalContent(
                tmpEvents.find((evnt) => evnt.getId() === event.getId()) ||
                    null,
            );
            const eventUnsubscribeRepo = new eventUnsubscribeRepository(
                id,
                event.getId(),
            );
            const reponse = await eventUnsubscribeRepo.put();
            if (reponse.isFailure) {
                toast(reponse.getError(), "error");
                tmpEvents = [
                    ...tmpEvents.filter(
                        (evnt) => evnt.getId() !== event.getId(),
                    ),
                    new EventValueObject({
                        ...event.getObject(),
                        attendee: [
                            ...event.getAttendee(),
                            {
                                id: accountInfos.oid,
                                displayName: accountInfos.name,
                            },
                        ],
                    }),
                ];
                setEvents(tmpEvents);
                setEventModalContent(
                    tmpEvents.find((evnt) => evnt.getId() === event.getId()) ||
                        null,
                );
            } else {
                toast(`You unsubscribed to ${event.getTitle()}`, "success");
            }
        } else {
            let tmpEvents = [
                ...events.filter((evnt) => evnt.getId() !== event.getId()),
                new EventValueObject({
                    ...event.getObject(),
                    attendee: [
                        ...event.getAttendee(),
                        {
                            id: accountInfos.oid,
                            displayName: accountInfos.name,
                        },
                    ],
                }),
            ];
            setEvents(tmpEvents);
            setEventModalContent(
                tmpEvents.find((evnt) => evnt.getId() === event.getId()) ||
                    null,
            );
            const eventSubscribeRepo = new eventSubscribeRepository(
                id,
                event.getId(),
            );
            const reponse = await eventSubscribeRepo.put();
            if (reponse.isFailure) {
                toast(reponse.getError(), "error");
                tmpEvents = [
                    ...tmpEvents.filter(
                        (evnt) => evnt.getId() !== event.getId(),
                    ),
                    new EventValueObject({
                        ...event.getObject(),
                        attendee: event
                            .getAttendee()
                            .filter(
                                (attendee) => attendee.id !== accountInfos.oid,
                            ),
                    }),
                ];
                setEvents(tmpEvents);
                setEventModalContent(
                    tmpEvents.find((evnt) => evnt.getId() === event.getId()) ||
                        null,
                );
            } else {
                toast(`You subscribed to ${event.getTitle()}`, "success");
            }
        }
    };

    return (
        <>
            {eventModalOpen && eventModalContent && (
                <EventModal
                    userId={accountInfos.oid}
                    toggleSubscribe={toggleSubscribe}
                    setIsOpen={setEventModalOpen}
                    event={eventModalContent}
                />
            )}
            {createEventModalOpen && (
                <CreateEventModal
                    setIsOpen={setCreateEventModalOpen}
                    clubId={id}
                    setEvents={setEvents}
                />
            )}
            {updateEventModalOpen && updateEventModalObject && (
                <UpdateEventModal
                    setIsOpen={setUpdateEventModalOpen}
                    eventSource={updateEventModalObject}
                    setEvents={setEvents}
                />
            )}
            <Layout>
                <div className="flex flex-col w-full">
                    <div className="w-full h-64 sm:h-96">
                        <CarouselImages
                            images={club
                                .getPictures()
                                .map((pic) => picturesCdn.get(pic))}
                        />
                    </div>
                    {isPresident && (
                        <div className="w-full flex justify-end items-center pr-5 pt-3 cursor-pointer">
                            <Cog6ToothIcon
                                className="h-10 w-10 text-gray-700 "
                                onClick={() => {
                                    navigate(`/club/${club.getId()}/settings`);
                                }}
                            />
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row w-full p-4 sm:p-6 gap-6 lg:gap-8">
                        <div className="flex flex-col flex-1 gap-6 order-2 lg:order-1">
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                {club.getDisplayName()}
                            </h1>

                            <div className="w-full lg:hidden p-6 flex flex-col gap-6 mb-4">
                                <PresidentAndNumbers
                                    club={club}
                                    setClub={setClub}
                                    setCreateEventModalOpen={
                                        setCreateEventModalOpen
                                    }
                                />
                            </div>

                            <div className="prose max-w-full sm:prose">
                                <ReactMarkdown>
                                    {club.getDescription()}
                                </ReactMarkdown>
                            </div>

                            <h2 className="mt-10 font-bold text-2xl">
                                Évènements à venir
                            </h2>
                            <div className="flex flex-col gap-4">
                                {events.map((event) => (
                                    <div
                                        key={event.getId()}
                                        className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-lg font-semibold">
                                                {event.getTitle()}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {new Intl.DateTimeFormat(
                                                    "fr-FR",
                                                    {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                ).format(event.getDate())}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    setEventModalOpen(true);
                                                    setEventModalContent(event);
                                                }}
                                                className="cursor-pointer px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
                                            >
                                                Détail
                                            </button>

                                            <button
                                                onClick={() =>
                                                    toggleSubscribe(event)
                                                }
                                                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700"
                                            >
                                                {event
                                                    .getAttendee()
                                                    .find(
                                                        (attendee) =>
                                                            attendee.id ===
                                                            accountInfos.oid,
                                                    )
                                                    ? "Se désinscrire"
                                                    : "S’inscrire"}
                                            </button>
                                            {isPresident && (
                                                <button
                                                    onClick={() => {
                                                        setUpdateEventModalObject(
                                                            event,
                                                        );
                                                        setUpdateEventModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="cursor-pointer px-2 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700"
                                                >
                                                    <PencilIcon className="h-6 text-white " />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:flex w-full lg:w-80  p-6 flex-col gap-6 order-1 lg:order-2">
                            <PresidentAndNumbers
                                club={club}
                                setClub={setClub}
                                setCreateEventModalOpen={
                                    setCreateEventModalOpen
                                }
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Club;
