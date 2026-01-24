import Layout from "@components/Layout/Layout";
import React, { useState } from "react";
import MembersModal from "./MembersModal";

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
};

export const ClubSettings: React.FC = () => {
    const [club, setClub] = useState(clubMock);
    const [showMembersModal, setShowMembersModal] = useState(false);

    const updateField = (field: keyof typeof club, value: any) => {
        setClub((prev) => ({ ...prev, [field]: value }));
    };

    const updatePicture = (index: number, value: string) => {
        const newPictures = [...club.pictures];
        newPictures[index] = value;
        updateField("pictures", newPictures);
    };

    const addPicture = () => updateField("pictures", [...club.pictures, ""]);

    const removePicture = (index: number) => {
        const newPictures = club.pictures.filter((_, i) => i !== index);
        updateField("pictures", newPictures);
    };


    return (
        <>
            {showMembersModal && (
                <MembersModal setIsOpen={setShowMembersModal} members={clubMock.members} />
            )}
            <Layout>
                <div className="max-w-3xl mx-auto p-6 space-y-6">
                    <div>
                        <label className="block font-semibold">
                            Nom du club
                        </label>
                        <input
                            type="text"
                            value={club.name}
                            onChange={(e) =>
                                updateField("name", e.target.value)
                            }
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">
                            Description (Markdown)
                        </label>
                        <textarea
                            value={club.description}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
                            rows={10}
                            className="mt-1 w-full border rounded p-2 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Thumbnail</label>
                        <input
                            type="text"
                            value={club.thumbnail}
                            onChange={(e) =>
                                updateField("thumbnail", e.target.value)
                            }
                            className="mt-1 block w-full border rounded p-2"
                        />
                        {club.thumbnail && (
                            <img
                                src={club.thumbnail}
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold">Pictures</label>
                        {club.pictures.map((pic, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 mt-2"
                            >
                                <input
                                    type="text"
                                    value={pic}
                                    onChange={(e) =>
                                        updatePicture(index, e.target.value)
                                    }
                                    className="flex-1 border rounded p-2"
                                />
                                <button
                                    onClick={() => removePicture(index)}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addPicture}
                            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                        >
                            Ajouter une picture
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowMembersModal(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            Voir les membres ({club.members.length})
                        </button>
                    </div>

                </div>
            </Layout>
        </>
    );
};
