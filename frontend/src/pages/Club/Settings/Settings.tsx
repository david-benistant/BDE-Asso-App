import Layout from "@components/Layout/Layout";
import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
import ClubValueObject from "@valueObjects/clubs/club.valueObject";
import clubRepository from "@repositories/api/clubs/:id/handlers";
import clubThumbnailRepository from "@repositories/api/clubs/:id/thumbnail/handlers";
import clubPicturesDeleteRepository from "@repositories/api/clubs/:id/pictures/delete/handlers";
import clubPicturesRepository from "@repositories/api/clubs/:id/pictures/handlers";
import { Spinner } from "@components/Spinner/Spinner";
import UploadPictureModal from "./UploadPictureModal";
import picturesCdn from "@repositories/cdn/pictures.cdn";
import SettingsLayout from "./Layout";
import type { ImageItem } from "@components/ImageDropzone/ImageDropzone";

const ClubSettings: React.FC = () => {
    // const [showMembersModal, setShowMembersModal] = useState(false);
    const nameInput = useRef<HTMLInputElement | null>(null);
    const descripitonInput = useRef<HTMLTextAreaElement | null>(null);
    const [clubBase, setClubBase] = useState<ClubValueObject | undefined>();
    const [club, setClub] = useState<ClubValueObject | undefined>();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [uploadThumbnailModal, setUploadThumbnailModal] =
        useState<boolean>(false);
    const [uploadPicturesModal, setUploadPicturesModal] =
        useState<boolean>(false);

    const [newThumbnail, setNewThumbnail] = useState<ArrayBuffer | undefined>();

    const [newPictures, setNewPictures] = useState<ArrayBuffer[]>([]);
    const [deletedPictures, setDeletedPicture] = useState<string[]>([]);
    const [saving, setSaving] = useState<boolean>(false);
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
            setClubBase(clubValue);
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

    const isThumbnail = () => {
        if (newThumbnail || club.getThumbnail().length > 0) return true;
        return false;
    };
    const getThumbnail = () => {
        if (newThumbnail) {
            const blob = new Blob([newThumbnail], { type: "image/png" });
            return URL.createObjectURL(blob);
        }
        if (club.getThumbnail().length > 0) {
            return picturesCdn.get(club.getThumbnail());
        }
    };

    const onValidateThumbnailModal = (images: ImageItem[]) => {
        setNewThumbnail(images[0].buffer);
        setUploadThumbnailModal(false);
    };

    const onValidatePicturesModal = (images: ImageItem[]) => {
        setNewPictures([...newPictures, ...images.map((img) => img.buffer)]);
        setUploadPicturesModal(false);
    };

    const getNewPicturesUrls = () => {
        return newPictures.map((picture) => {
            const blob = new Blob([picture], { type: "image/png" });
            return URL.createObjectURL(blob);
        });
    };

    const save = async () => {
        if (!id) return;
        setSaving(true);
        const clubRepo = new clubRepository(id);

        const updateResponse = await clubRepo.put({
            displayName: club.getDisplayName(),
            description: club.getDescription(),
        });

        if (updateResponse.isFailure) {
            setSaving(false);
            return toast(updateResponse.getError(), "error");
        }

        if (newThumbnail) {
            const clubThumbnailRepo = new clubThumbnailRepository(id);
            const updateThumbnailResponse =
                await clubThumbnailRepo.put(newThumbnail);

            if (updateThumbnailResponse.isFailure) {
                setSaving(false);
                return toast(updateThumbnailResponse.getError(), "error");
            }
        }

        if (deletedPictures.length > 0) {
            const clubPicturesDeleteRepo = new clubPicturesDeleteRepository(id);
            const deletedPicturesResponse =
                await clubPicturesDeleteRepo.put(deletedPictures);
            if (deletedPicturesResponse.isFailure) {
                setSaving(false);
                return toast(deletedPicturesResponse.getError(), "error");
            }
        }

        if (newPictures.length > 0) {
            const clubPicturesReposito = new clubPicturesRepository(id);
            const addedPicturesResponse =
                await clubPicturesReposito.put(newPictures);
            if (addedPicturesResponse.isFailure) {
                setSaving(false);
                return toast(addedPicturesResponse.getError(), "error");
            }
        }

        setSaving(false);
        toast("Club settings updated");
        navigate(`/club/${id}`);
    };

    return (
        <>
            {saving && (
                <div className="fixed inset-0 z-50 bg-black/70">
                    <Spinner />
                </div>
            )}

            {uploadThumbnailModal && (
                <UploadPictureModal
                    setIsOpen={setUploadThumbnailModal}
                    title={"Miniature du club"}
                    max={1}
                    onValidate={onValidateThumbnailModal}
                />
            )}

            {uploadPicturesModal && (
                <UploadPictureModal
                    setIsOpen={setUploadPicturesModal}
                    title={"Photos du club"}
                    onValidate={onValidatePicturesModal}
                />
            )}
            <Layout>
                <SettingsLayout>
                    <div className="p-6 md:w-full w-screen space-y-6">
                        <div className="md:w-100 ">
                            <label className="block font-semibold">
                                Nom du club
                            </label>
                            <div className="flex w-full">
                                <input
                                    ref={nameInput}
                                    type="text"
                                    value={club.getDisplayName()}
                                    onChange={(e) => {
                                        const newClub = new ClubValueObject({
                                            ...club.getObject(),
                                            displayName: e.target.value,
                                        });
                                        setClub(newClub);
                                    }}
                                    className="flex-grow border rounded-lg p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold">
                                Description (Markdown)
                            </label>
                            <div className="flex h-80 md:w-200 mt-1">
                                <textarea
                                    ref={descripitonInput}
                                    value={club.getDescription()}
                                    onChange={(e) => {
                                        const newClub = new ClubValueObject({
                                            ...club.getObject(),
                                            description: e.target.value,
                                        });
                                        setClub(newClub);
                                    }}
                                    rows={10}
                                    className="flex-grow border rounded-lg p-2 font-mono resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold mb-3">
                                Miniature du club
                            </label>

                            {!isThumbnail() && (
                                <div className="w-32 h-32 flex justify-center items-center">
                                    <div
                                        onClick={() =>
                                            setUploadThumbnailModal(true)
                                        }
                                        className="cursor-pointer w-17 h-17  bg-gray-200 rounded-full flex justify-center items-center"
                                    >
                                        <PlusIcon className="h-13 text-white" />
                                    </div>
                                </div>
                            )}
                            {isThumbnail() && (
                                <div
                                    className="relative w-32 h-32 rounded bg-cover bg-center bg-no-repeat rounded group cursor-pointer"
                                    style={{
                                        backgroundImage: `url(${getThumbnail()})`,
                                    }}
                                    onClick={() =>
                                        setUploadThumbnailModal(true)
                                    }
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-medium">
                                            Changer
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold mb-3">
                                Photos du club
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {club
                                    .getPictures()
                                    .filter(
                                        (picture) =>
                                            !deletedPictures.includes(picture),
                                    )
                                    .map((pic, index) => (
                                        <div
                                            key={`${pic}-${index}`}
                                            style={{
                                                backgroundImage: `url(${picturesCdn.get(pic)})`,
                                            }}
                                            className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded flex"
                                        >
                                            <div
                                                onClick={() =>
                                                    setDeletedPicture([
                                                        ...deletedPictures,
                                                        pic,
                                                    ])
                                                }
                                            >
                                                <XMarkIcon className="h-7 text-white cursor-pointer" />
                                            </div>
                                        </div>
                                    ))}

                                {getNewPicturesUrls().map((pic, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundImage: `url(${pic})`,
                                        }}
                                        className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded flex"
                                    >
                                        <div
                                            onClick={() =>
                                                setNewPictures(
                                                    newPictures.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <XMarkIcon className="h-7 text-white cursor-pointer" />
                                        </div>
                                    </div>
                                ))}
                                <div className="w-32 h-32 flex justify-center items-center">
                                    <div
                                        onClick={() =>
                                            setUploadPicturesModal(true)
                                        }
                                        className="cursor-pointer w-17 h-17  bg-gray-200 rounded-full flex justify-center items-center"
                                    >
                                        <PlusIcon className="h-13 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex mt-10 gap-5">
                            <button
                                onClick={() => {
                                    setClub(clubBase);
                                    setNewPictures([]);
                                    setDeletedPicture([]);
                                    setNewThumbnail(undefined);
                                }}
                                className="px-3 h-10 w-30 py-1 bg-white text-gray-800 border-2 border-gray-800 rounded cursor-pointer hover:bg-gray-800 hover:text-white transition-all"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={save}
                                className="px-3 h-10 w-30 py-1 bg-gray-800 text-white rounded cursor-pointer"
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
