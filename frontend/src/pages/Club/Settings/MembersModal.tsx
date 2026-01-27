import userValueObject from "@valueObjects/users/user.valueObject";
import React, { useEffect, useState } from "react";
import usersRepository from "@repositories/api/users/:id/handlers";
import profileCDN from "@repositories/cdn/profile.cdn";
import Modal from "@components/Modal/Modal";
import type { clubValueObjectProps } from "@valueObjects/clubs/club.valueObject";

type EventModalProps = {
    setIsOpen: (value: boolean) => void;
    members: clubValueObjectProps['members'];
};

const MembersModal: React.FC<EventModalProps> = ({ setIsOpen, members }) => {
    const [membersDatas, setMembersDatas] = useState<
        userValueObject[] | undefined
    >();

    useEffect(() => {
        const fetchDatas = async () => {
            const data = await Promise.all(
                members.map(async (member) => {
                    const users = new usersRepository(member.id);
                    const memberData = await users.get();

                    if (!memberData.isFailure) {
                        return memberData.getValue();
                    } else {
                        return new userValueObject({
                            id: member.id,
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
        <Modal setIsOpen={setIsOpen} title={"Membres"}>
            {membersDatas &&
                membersDatas.map((member) => (
                    <div
                        key={member.getId()}
                        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3 min-w-0 ">
                            <img
                                src={profileCDN.get(member.getId())}
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
        </Modal>
    );
};

export default MembersModal;
