import Layout from "@components/Layout/Layout";
import { useNavigate } from "react-router-dom";

type Association = {
    id: number;
    name: string;
    image: string;
    members: number;
    followers: number;
};

const associations: Association[] = [
    {
        id: 1,
        name: "BDE Campus",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        members: 42,
        followers: 320,
    },
    {
        id: 2,
        name: "Club Robotique",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32    ",
        members: 18,
        followers: 210,
    },
    {
        id: 3,
        name: "Association Sportive",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
        members: 65,
        followers: 540,
    },
    {
        id: 4,
        name: "Club Photo",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        members: 23,
        followers: 180,
    },
    {
        id: 5,
        name: "Club Photo",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        members: 23,
        followers: 180,
    },
    {
        id: 6,
        name: "Club Photo",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        members: 23,
        followers: 180,
    },
];

const Home = () => {
    const navigate = useNavigate()

    return (
        <Layout>
            <div className="p-6 w-full mx-auto">
                <h1 className="text-4xl font-bold mb-10">
                    Associations du campus
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {associations.map((association) => (
                        <div
                            key={association.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden w-full h-full cursor-pointer"
                            onClick={() => navigate(`club/${association.id}`)}
                        >
                            <img
                                src={association.image}
                                alt={association.name}
                                className="h-56 w-full object-cover"
                            />

                            <div className="p-6 flex flex-col gap-4 w-full">
                                <h2 className="text-2xl font-semibold">
                                    {association.name}
                                </h2>

                                <div className="text-base text-gray-600 flex justify-between">
                                    <span>
                                        👥 {association.members} membres
                                    </span>
                                    <span>
                                        ⭐ {association.followers} abonnés
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
