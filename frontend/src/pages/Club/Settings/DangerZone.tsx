import Layout from "@components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import ClubValueObject, {
    type clubValueObjectProps,
} from "@valueObjects/clubs/club.valueObject";
import clubRepository from "@repositories/api/clubs/:id/handlers";
import { Spinner } from "@components/Spinner/Spinner";
import SettingsLayout from "./Layout";
import MembersModal from "./MembersModal";
import profileCdn from "@repositories/cdn/profile.cdn";
import ClubPresidentRepository from "@repositories/api/clubs/:id/president/:memberId/handlers"

const ClubSettings: React.FC = () => {
    const [club, setClub] = useState<ClubValueObject | undefined>();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
    const [newPresident, setNewPresident] = useState<
        clubValueObjectProps["members"][0] | undefined
    >();
    const navigate = useNavigate()

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
        };
        getUser();
    }, [id, toast]);

    if (!club) {
        return (
            <Layout>
                <div className="md:w-full w-screen pt-50">
                    <Spinner />
                </div>
            </Layout>
        );
    }

    const save =  async () => {
        if (!newPresident) return
        setSaving(true)
        const clubPresidentRepo = new ClubPresidentRepository(club.getId(), newPresident?.id)
        const response = await clubPresidentRepo.put()
        if (response.isFailure) {
            toast(response.getError())
            setSaving(false)
        } else {
            navigate(`/club/${club.getId()}`)
        }
    }

    return (
        <>
            {saving && (
                <div className="fixed inset-0 z-50 bg-black/70">
                    <Spinner />
                </div>
            )}

            {showMemberModal && (
                <MembersModal
                    setIsOpen={setShowMemberModal}
                    members={club.getMembers()}
                    buttonText={"Choisir"}
                    buttonAction={setNewPresident}
                />
            )}
            <Layout>
                <SettingsLayout>
                    <div className="p-6 md:w-full w-screen space-y-6">
                        <div className="space-y-1">
                            <div className="mb-2 font-bold text-lg">
                                Transferer la présidence
                            </div>
                            <button
                                onClick={() => setShowMemberModal(true)}
                                className="cursor-pointer w-full sm:w-auto px-4 h-10 bg-red-600 text-white rounded"
                            >
                                Choisir un nouveau président
                            </button>
                        </div>
                        {newPresident && (
                            <>
                                Nouveau président:
                                <div className="flex items-center mt-2 gap-3 px-2 py-2 rounded md:w-200 bg-gray-200 transition">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
                                            <img
                                                src={profileCdn.get(
                                                    newPresident.id,
                                                )}
                                            />
                                        </div>

                                        <span className="text-gray-800 text-sm truncate roud">
                                            {newPresident.displayName}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-6">
                            <button
                                onClick={() => setNewPresident(undefined)}
                                className="cursor-pointer w-full sm:w-auto px-4 h-10 bg-white text-gray-800 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition"
                            >
                                Réinitialiser
                            </button>

                            <button
                                onClick={save}
                                className="cursor-pointer w-full sm:w-auto px-4 h-10 bg-gray-800 text-white rounded"
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </SettingsLayout>
            </Layout>
        </>
    );
};

export default ClubSettings;
