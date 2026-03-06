import Layout from "@components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import ClubValueObject, { Roles } from "@valueObjects/clubs/club.valueObject";
import clubRepository from "@repositories/api/clubs/:id/handlers";
import { Spinner } from "@components/Spinner/Spinner";
import SettingsLayout from "./Layout";
import profileCdn from "@repositories/cdn/profile.cdn";
import clubMembersRepository from "@repositories/api/clubs/:id/members/handlers";
import clubMemberRepository from "@repositories/api/clubs/:id/members/:userId/handlers";
import clubPendingsRepository from "@repositories/api/clubs/:id/join/pendings/handlers";
import JoinRequestValueObject from "@valueObjects/clubs/pendings/join-request.valueObject";
import clubPendingAcceptRepository from "@repositories/api/clubs/:id/join/accept/handlers";
import clubPendingRefuseRepository from "@repositories/api/clubs/:id/join/refuse/handlers";

const ClubMembers: React.FC = () => {
    const [clubBase, setClubBase] = useState<ClubValueObject | undefined>();
    const [club, setClub] = useState<ClubValueObject | undefined>();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [saving, setSaving] = useState<boolean>(false);
    const [kicked, setKicked] = useState<string[]>([]);
    const [pendings, setPendings] = useState<
        JoinRequestValueObject[] | undefined
    >();

    useEffect(() => {
        const fetchDatas = async () => {
            if (!id) return;
            const clubRepo = new clubRepository(id);

            const responseClub = await clubRepo.get();

            if (responseClub.isFailure) {
                return toast(responseClub.getError(), "error");
            }

            const clubValue = responseClub.getValue();
            setClub(clubValue);
            setClubBase(clubValue);

            const pendingRepo = new clubPendingsRepository(id);

            const responsePending = await pendingRepo.get();

            if (responsePending.isFailure) {
                return toast(responsePending.getError(), "error");
            }

            setPendings(responsePending.getValue());
        };

        fetchDatas();
    }, [id]);

    if (!club || !pendings || !id) {
        return (
            <Layout>
                <div className="md:w-full w-screen pt-50 flex justify-center">
                    <Spinner />
                </div>
            </Layout>
        );
    }

    const updateMemberRole = (memberId: string, role: string) => {
        const updatedMembers = club
            .getMembers()
            .map((member) =>
                member.id === memberId ? { ...member, role } : member,
            );

        setClub(
            new ClubValueObject({
                ...club.getObject(),
                members: updatedMembers,
            }),
        );
    };

    const kickMember = (userId: string) => {
        setKicked([...kicked, userId]);
        setClub(
            new ClubValueObject({
                ...club.getObject(),
                members: club
                    .getMembers()
                    .filter((member) => member.id !== userId),
            }),
        );
    };

    const save = async () => {
        setSaving(true);
        const clubMembersRepo = new clubMembersRepository(id);
        const response = await clubMembersRepo.put(club.getMembers());
        if (response.isFailure) {
            toast(response.getError(), "error");
        }

        await Promise.all(
            kicked.map(async (userId) => {
                const clubMemberRepo = new clubMemberRepository(id, userId);
                await clubMemberRepo.delete();
            }),
        );
        setSaving(false);
    };

    const acceptJoin = async (userId: string) => {
        const clubPendingAcceptRepo = new clubPendingAcceptRepository(id);

        const joinRequest = pendings.find(
            (item) => item.getUserId() === userId,
        );
        const tmpPendings = pendings.filter(
            (item) => item.getUserId() !== userId,
        );

        const members = club.getMembers();

        if (!joinRequest) {
            return toast("Error while accepting member", "error");
        }

        setPendings(tmpPendings);
        setClub(
            new ClubValueObject({
                ...club.getObject(),
                members: [
                    ...members,
                    {
                        role: "m",
                        id: joinRequest.getUserId(),
                        displayName: joinRequest.getDisplayName(),
                    },
                ],
            }),
        );

        const response = await clubPendingAcceptRepo.put(userId);

        if (response.isFailure) {
            toast(response.getError(), "error");
            setPendings([...tmpPendings, joinRequest]);
            setClub(
                new ClubValueObject({
                    ...club.getObject(),
                    members,
                }),
            );
        }
    };

    const refuseJoin = async (userId: string) => {
        const clubPendingRefuseRepo = new clubPendingRefuseRepository(id);

        const joinRequest = pendings.find(
            (item) => item.getUserId() === userId,
        );
        const tmpPendings = pendings.filter(
            (item) => item.getUserId() !== userId,
        );

        if (!joinRequest) {
            return toast("Error while accepting member", "error");
        }

        setPendings(tmpPendings);

        const response = await clubPendingRefuseRepo.put(userId);

        if (response.isFailure) {
            toast(response.getError(), "error");
            setPendings([...tmpPendings, joinRequest]);
        }
    };

    return (
        <>
            {saving && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                    <Spinner />
                </div>
            )}

            <Layout>
                <SettingsLayout>
                    <div className="p-4 sm:p-6 md:w-full w-screen space-y-6">
                        <div className="space-y-1">
                            {pendings.length > 0 && (
                                <>
                                    <div className="mb-2 font-bold text-lg">
                                        En attente
                                    </div>
                                    {pendings.map((pending) => (
                                        <div
                                            key={pending.getUserId()}
                                            className="flex items-center gap-3 px-2 py-2 rounded md:w-200 bg-gray-200 transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
                                                    <img
                                                        src={profileCdn.get(
                                                            pending.getUserId(),
                                                        )}
                                                    />
                                                </div>

                                                <span className="text-gray-800 text-sm truncate roud">
                                                    {pending.getDisplayName()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    acceptJoin(
                                                        pending.getUserId(),
                                                    )
                                                }
                                                className="cursor-pointer px-4 h-8 bg-green-600 text-white rounded"
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() =>
                                                    refuseJoin(
                                                        pending.getUserId(),
                                                    )
                                                }
                                                className="cursor-pointer px-4 h-8 bg-red-600 text-white rounded"
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="mb-2 font-bold text-lg">
                                Membres
                            </div>
                            {club.getMembers().map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 px-2 py-2 rounded md:w-200 bg-gray-200 transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
                                            <img
                                                src={profileCdn.get(member.id)}
                                            />
                                        </div>

                                        <span className="text-gray-800 text-sm truncate roud">
                                            {member.displayName}
                                        </span>
                                    </div>

                                    {member.role !== Roles.PRESIDENT && (
                                        <>
                                            <select
                                                value={member.role}
                                                onChange={(e) =>
                                                    updateMemberRole(
                                                        member.id,
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 shrink-0"
                                            >
                                                <option value="m">
                                                    Membre
                                                </option>
                                                <option value="o">
                                                    Organisateur
                                                </option>
                                            </select>

                                            <button
                                                onClick={() =>
                                                    kickMember(member.id)
                                                }
                                                className="cursor-pointer px-4 h-8 bg-red-600 text-white rounded"
                                            >
                                                Virer
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-6">
                            <button
                                onClick={() => setClub(clubBase)}
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

export default ClubMembers;
