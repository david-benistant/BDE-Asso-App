import React from "react";
import profileCDN from "@repositories/cdn/profile.cdn";
import Modal from "@components/Modal/Modal";
import type { clubValueObjectProps } from "@valueObjects/clubs/club.valueObject";

type EventModalProps = {
    setIsOpen: (value: boolean) => void;
    members: clubValueObjectProps["members"];
    buttonText?: string;
    buttonAction?: (member: clubValueObjectProps["members"][0]) => void;
};

const MembersModal: React.FC<EventModalProps> = ({
    setIsOpen,
    members,
    buttonText,
    buttonAction,
}) => {

    const onClick = (member: clubValueObjectProps["members"][0]) => {
        if (!buttonAction) return
        buttonAction(member)
        setIsOpen(false)
    }

    return (
        <Modal setIsOpen={setIsOpen} title={"Membres"}>
            {members &&
                members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3 min-w-0 ">
                            <img
                                src={profileCDN.get(member.id)}
                                alt={member.displayName}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <span className="font-medium text-gray-900 truncate max-w-xs pr-2">
                                {member.displayName}
                            </span>
                        </div>

                        { (buttonText && buttonAction) && 
                        <button
                            onClick={() => onClick(member)}
                            className="cursor-pointer px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-600 transition flex-shrink-0"
                        >
                            {buttonText}
                        </button>
                         }
                    </div>
                ))}
        </Modal>
    );
};

export default MembersModal;
