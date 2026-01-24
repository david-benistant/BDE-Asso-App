import userValueObject from "@valueObjects/users/user.valueObject";
import React, { useEffect, useState } from "react";
import usersRepository from "@repositories/api/users/:id/handlers";
import photoCdn from "@repositories/cdn/photo.cdn";

type EventModalProps = {
    setIsOpen: (value: boolean) => void;
    members: string[];
};

const MembersModal: React.FC<EventModalProps> = ({ setIsOpen, members }) => {
    const [membersDatas, setMembersDatas] = useState<
        userValueObject[] | undefined
    >();

    useEffect(() => {
        const fetchDatas = async () => {
            const data = await Promise.all(
                members.map(async (member) => {
                    const users = new usersRepository(member);
                    const memberData = await users.get();

                    if (!memberData.isFailure) {
                        return memberData.getValue();
                    } else {
                        return new userValueObject({
                            id: member,
                            email: "not found",
                            displayName: "not found",
                        });
                    }
                }),
            );
            setMembersDatas(data);
        };

        if (!membersDatas) {
            fetchDatas();
        }
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-1/2 p-6 relative overflow-y-auto max-h-[80vh]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✕
                </button>
                <h2 className="text-3xl font-bold mb-4">Membres</h2>

                {membersDatas &&
                    membersDatas.map((member) => (
                        <div
                            key={member.getId()}
                            className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-3 min-w-0 ">
                                <img
                                    src={photoCdn.get(member.getId())}
                                    alt={member.getDisplayName()}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <span className="font-medium text-gray-900 truncate max-w-xs pr-2">
                                    {member.getDisplayName()}
                                </span>
                            </div>

                            <button
                                // onClick={() => handleKick(member.getId())}
                                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition flex-shrink-0"
                            >
                                Virer
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MembersModal;
