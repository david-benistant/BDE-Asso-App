import Layout from "@components/Layout/Layout";
import CarouselImages from "@components/Carousel/Carousel";
import ReactMarkdown from "react-markdown";
import EventModal from "./EventModal";
import { useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import AuthProvider, { type GraphToken } from "@repositories/AuthProvider";
import { useNavigate } from "react-router-dom";

const clubMock = {
    id: 6,
    name: "Club Photo",
    president: {
        name: "Alex Martin",
        id: "cba23394-e5db-48be-a1c6-0beaa6147b43",
        avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
    },
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    pictures: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    ],
    members: ["cba23394-e5db-48be-a1c6-0beaa6147b43"],
    nbFollowers: 45,
    description: `
## 📸 À propos du club

Le **Club Photo** est ouvert à tous les passionnés, débutants comme confirmés.

### Ce que nous faisons
- Sorties photo en extérieur
- Ateliers techniques
- Retouche photo
- Expositions

> Venez avec votre créativité, on s'occupe du reste.
`,
    events: [
        {
            id: 1,
            title: "Sortie photo urbaine",
            date: "2026-02-03",
            location: "Centre-ville",
            description: "hello",
            numberOfAttendees: 10,
            visibility: "public",
            resources: ["manual.pdf"],
        },
    ],
};

const PresidentAndNumbers = ({ club }: { club: any }) => {
    return (
        <>
            <div className="flex items-center gap-4">
                <img
                    src={club.president.avatar}
                    alt={club.president.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <div className="text-sm text-gray-500">Président</div>
                    <div className="font-semibold">{club.president.name}</div>
                </div>
            </div>

            <div className="flex justify-between text-center">
                <div>
                    <div className="text-xl font-bold">{club.members.length}</div>
                    <div className="text-sm text-gray-500">Membres</div>
                </div>
                <div>
                    <div className="text-xl font-bold">{club.nbFollowers}</div>
                    <div className="text-sm text-gray-500">Abonnés</div>
                </div>
            </div>
        </>
    );
};

const Club = () => {
    const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
    const [isPresident, setIsPresident] = useState<boolean>(false);
    const [user, setUser] = useState<GraphToken | null>(null);

    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            const infos = await AuthProvider.getAccountInfos();
            if (!infos) return;
            setUser(infos);
            setIsPresident(infos.oid === clubMock.president.id);
        };
        getUser();
    }, []);

    return (
        <>
            {eventModalOpen && <EventModal setIsOpen={setEventModalOpen} />}
            <Layout>
                <div className="flex flex-col w-full">
                    <div className="w-full h-64 sm:h-96">
                        <CarouselImages images={clubMock.pictures} />
                    </div>
                    {isPresident && (
                        <div className="w-full flex justify-end items-center pr-5 pt-3 cursor-pointer">
                            <Cog6ToothIcon className="h-10 w-10 text-gray-700 " onClick={() => {navigate(`/club/${clubMock.id}/settings`)}} />
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row w-full p-4 sm:p-6 gap-6 lg:gap-8">
                        <div className="flex flex-col flex-1 gap-6 order-2 lg:order-1">
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                {clubMock.name}
                            </h1>

                            <div className="w-full lg:hidden p-6 flex flex-col gap-6 mb-4">
                                <PresidentAndNumbers club={clubMock} />
                            </div>

                            <div className="prose max-w-full sm:prose">
                                <ReactMarkdown>
                                    {clubMock.description}
                                </ReactMarkdown>
                            </div>
                            <div className="flex flex-col gap-4">
                                {clubMock.events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-lg font-semibold">
                                                {event.title}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {event.date}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {event.location}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() =>
                                                    setEventModalOpen(true)
                                                }
                                                className="cursor-pointer px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
                                            >
                                                Détail
                                            </button>

                                            <button className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700">
                                                S’inscrire
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:flex w-full lg:w-80  p-6 flex-col gap-6 order-1 lg:order-2">
                            <PresidentAndNumbers club={clubMock} />
                        </div>
                    </div>

                    {/* <div className="flex flex-col lg:flex-row w-full p-4 sm:p-6 gap-6 lg:gap-8">
                        <div className="flex flex-col flex-1 gap-6">
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                {clubMock.name}
                            </h1>

                            <div className="prose max-w-full sm:prose">
                                <ReactMarkdown>
                                    {clubMock.description}
                                </ReactMarkdown>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">
                                    Événements à venir
                                </h2>

                                <div className="flex flex-col gap-4">
                                    {clubMock.events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-lg font-semibold">
                                                    {event.title}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {event.date}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {event.location}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    onClick={() =>
                                                        setEventModalOpen(true)
                                                    }
                                                    className="cursor-pointer px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
                                                >
                                                    Détail
                                                </button>

                                                <button className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700">
                                                    S’inscrire
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 border rounded-xl p-6 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={clubMock.president.avatar}
                                    alt={clubMock.president.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Président
                                    </div>
                                    <div className="font-semibold">
                                        {clubMock.president.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-center">
                                <div>
                                    <div className="text-xl font-bold">
                                        {clubMock.members}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Membres
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold">
                                        {clubMock.followers}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Abonnés
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </Layout>
        </>
    );
};

export default Club;
