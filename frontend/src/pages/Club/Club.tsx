import Layout from "@components/Layout/Layout";
import CarouselImages from "@components/Carousel/Carousel";
import ReactMarkdown from "react-markdown";
import EventModal from "./EventModal";
import { useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import AuthProvider from "@repositories/AuthProvider";
import { useNavigate } from "react-router-dom";
import type ClubValueObject from "@valueObjects/clubs/club.valueObject";
import clubRepository from "@repositories/api/clubs/:id/handlers";
import { useParams } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import type UserValueObject from "@valueObjects/users/user.valueObject";
import userRepository from "@repositories/api/users/:id/handlers";
import profileCDN from "@repositories/cdn/profile.cdn";
import { Spinner } from "@components/Spinner/Spinner";
import picturesCdn from "@repositories/cdn/pictures.cdn";

const PresidentAndNumbers = ({ club }: { club: ClubValueObject }) => {
    const [president, setPresident] = useState<UserValueObject | undefined>();
    const { toast } = useToast();

    useEffect(() => {
        const fetchDatas = async () => {
            if (!club) return;

            const userRepo = new userRepository(club.getPresidentId());

            const response = await userRepo.get();

            if (response.isFailure) {
                toast("Failed to fetch president informations", "error");
            }

            setPresident(response.getValue());
        };

        if (club) {
            fetchDatas();
        }
    }, [club]);

    if (!president) {
        return <></>;
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
                    <div className="text-sm text-gray-500">Membres</div>
                </div>
                <div>
                    <div className="text-xl font-bold">
                        {club.getNbFollowers()}
                    </div>
                    <div className="text-sm text-gray-500">Abonnés</div>
                </div>
            </div>
        </>
    );
};

const Club = () => {
    const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
    const [isPresident, setIsPresident] = useState<boolean>(false);

    const [club, setClub] = useState<ClubValueObject | undefined>();

    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            if (!id) return;
            const clubRepo = new clubRepository(id);

            const response = await clubRepo.get();

            if (response.isFailure) {
                return toast("Failed to get club", "error");
            }
            const clubValue = response.getValue();
            setClub(clubValue);

            const infos = await AuthProvider.getAccountInfos();
            if (!infos) return;
            setIsPresident(infos.oid === clubValue.getPresidentId());
        };
        getUser();
    }, [id]);

    if (!club) {
        return (
            <Layout>
                <div className="md:w-full w-screen">
                    <Spinner />
                </div>
            </Layout>
        );
    }
    return (
        <>
            {eventModalOpen && <EventModal setIsOpen={setEventModalOpen} />}
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
                                <PresidentAndNumbers club={club} />
                            </div>

                            <div className="prose max-w-full sm:prose">
                                <ReactMarkdown>
                                    {club.getDescription()}
                                </ReactMarkdown>
                            </div>
                            <div className="flex flex-col gap-4">
                                {/* {club.events.map((event) => (
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
                                ))} */}
                            </div>
                        </div>

                        <div className="hidden lg:flex w-full lg:w-80  p-6 flex-col gap-6 order-1 lg:order-2">
                            <PresidentAndNumbers club={club} />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Club;
