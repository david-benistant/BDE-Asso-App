import Layout from "@components/Layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewClubModal from "./NewClubModal";
import type ClubValueObject from "@valueObjects/clubs/club.valueObject";
import clubsRepository from '@repositories/api/clubs/handlers'
import { useToast } from "@contexts/ToastContext";
import { Spinner } from "@components/Spinner/Spinner";
import LogoEpitech from "@assets/LogoEpitech.png"
import picturesCdn from "@repositories/cdn/pictures.cdn";

const Home = () => {
    const navigate = useNavigate();
    const [newClubModalIsOpen, setNewClubModalIsOpen] = useState(false);
    const [clubs, setClubs] = useState<ClubValueObject[] | undefined>()
    const { toast } = useToast()

    useEffect(() => {
            const getUser = async () => {
                const clubRepo = new clubsRepository();
    
                const response = await clubRepo.list();
    
                if (response.isFailure) {
                    return toast("Failed to list clubs", "error");
                }
                const clubValue = response.getValue();
                setClubs(clubValue);
            };
            getUser();
        }, []);

    return (
        <>
            {newClubModalIsOpen && (
                <NewClubModal setIsOpen={setNewClubModalIsOpen} />
            )}
            <Layout
                // onSearch={() => {}}
                customButton={{
                    text: "Nouveau club",
                    icon: "+",
                    onClick: () => setNewClubModalIsOpen(true),
                }}
            >
                <div className="p-6 w-full mx-auto">
                    <h1 className="text-4xl font-bold mb-10">
                        Associations du campus
                    </h1>

                    {!clubs && <Spinner />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {clubs && clubs.map((club) => (
                            <div
                                key={club.getId()}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden w-full h-full cursor-pointer"
                                onClick={() =>
                                    navigate(`club/${club.getId()}`)
                                }
                            >
                                <img
                                    src={club.getThumbnail().length > 0 ? picturesCdn.get(club.getThumbnail()) : LogoEpitech}
                                    alt={club.getDisplayName()}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-6 flex flex-col gap-4 w-full">
                                    <h2 className="text-2xl font-semibold">
                                        {club.getDisplayName()}
                                    </h2>

                                    <div className="text-base text-gray-600 flex justify-between">
                                        <span>
                                            👥 {club.getMembers().length} membre{club.getMembers().length > 1 ?  "s" : "" }
                                        </span>
                                        <span>
                                            ⭐ {club.getfollowers().length} abonné{club.getfollowers().length > 1 ?  "s" : "" }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Home;
