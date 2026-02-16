import React from "react";
import Modal from "@components/Modal/Modal";
import ImageDropzone, {
    type ImageItem,
} from "@components/ImageDropzone/ImageDropzone";

type UploadPicturesModalProps = {
    setIsOpen: (value: boolean) => void;
    max?: number;
    title: string;
    onValidate: (images: ImageItem[]) => void;
};

const UploadPictureModal: React.FC<UploadPicturesModalProps> = ({
    setIsOpen,
    max,
    title,
    onValidate,
}) => {
    return (
        <Modal setIsOpen={setIsOpen} title={title}>
            <ImageDropzone onValidate={onValidate} maxImages={max} />
        </Modal>
    );
};

export default UploadPictureModal;
