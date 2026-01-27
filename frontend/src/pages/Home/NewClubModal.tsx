import Modal from "@components/Modal/Modal";
import { useState } from "react";
import clubsRepository from '@repositories/api/clubs/handlers'
import { useToast } from "@contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@components/Spinner/Spinner";

const NewClubModal = ({
    setIsOpen,
}: {
    setIsOpen: (value: boolean) => void;
}) => {
    const [clubName, setClubName] = useState("");
    const { toast } = useToast()
    const navigate = useNavigate()
    const [subminting, setSubmiting] = useState<boolean>(false)

    const submit = async () => {
        setSubmiting(true)
        const clubRepo = new clubsRepository();
        const response = await clubRepo.post(clubName);
        if (response.isFailure) {
            setSubmiting(false)
            return toast("Failed to create club", "error")
        }

        const club = response.getValue()
        navigate(`club/${club.getId()}/settings`)
    }

    return (
        <Modal setIsOpen={setIsOpen} title={"Nouveau club"}>
            {subminting && 
                <div className="fixed inset-0 z-50 bg-black/70">
                    <Spinner />
                </div>
            }
            <div>
                <label className="block font-semibold">Nom du club</label>
                <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                />
            </div>
            <div className="flex w-full justify-end">
                <button disabled={subminting} onClick={submit} className="cursor-pointer mt-10 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700">
                    Créer mon club !
                </button>
            </div>

        </Modal>
    );
};

export default NewClubModal;
