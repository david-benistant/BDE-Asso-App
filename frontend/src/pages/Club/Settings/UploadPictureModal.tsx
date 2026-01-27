import React from "react";
import Modal from "@components/Modal/Modal";
import ImageDropzone from "@components/ImageDropzone/ImageDropzone";

type UploadPicturesModalProps = {
    setIsOpen: (value: boolean) => void;
    max?: number;
    title: string;
    onValidate: (images: ArrayBuffer[]) => void
};

const UploadPictureModal: React.FC<UploadPicturesModalProps> = ({
    setIsOpen,
    max,
    title,
    onValidate
}) => {
    return (
        <Modal setIsOpen={setIsOpen} title={title}>
            <ImageDropzone onValidate={onValidate} maxImages={max}  />
        </Modal>
    );
};

export default UploadPictureModal;
