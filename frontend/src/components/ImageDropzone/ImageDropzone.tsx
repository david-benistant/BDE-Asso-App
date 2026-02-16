import { useRef, useState } from "react";
import MD5 from "crypto-js/md5";
import WordArray from "crypto-js/lib-typedarrays";

export type ImageItem = {
    id: string;
    buffer: ArrayBuffer;
    hash: string;
    preview: string;
};

type Props = {
    onValidate?: (images: ImageItem[]) => void;
    setImages?: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    maxImages?: number;
};

export default function ImageDropzone({
    onValidate,
    maxImages,
    setImages,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImagesItem] = useState<ImageItem[]>([]);

    const limit = maxImages ?? Infinity;

    const validate = async () => {
        if (!onValidate) return;
        onValidate(images);
    };

    const onFilesSelected = async (files: FileList | null) => {
        if (!files) return;

        const remaining = limit - images.length;
        if (remaining <= 0) return;

        const newImages = await Promise.all(
            Array.from(files)
                .slice(0, remaining)
                .map(async (file) => ({
                    id: crypto.randomUUID(),
                    buffer: await file.arrayBuffer(),
                    hash: MD5(
                        WordArray.create(await file.arrayBuffer()),
                    ).toString(),
                    preview: URL.createObjectURL(file),
                })),
        );

        setImagesItem((prev) => [...prev, ...newImages]);

        if (setImages) {
            setImages((prev) => {
                return [...prev, ...newImages];
            });
        }
    };

    const removeImage = (id: string) => {
        setImagesItem((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((i) => i.id !== id);
        });
        if (setImages) {
            setImages((prev) => {
                const img = prev.find((i) => i.id === id);
                if (img) URL.revokeObjectURL(img.preview);
                return prev.filter((i) => i.id !== id);
            });
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => {
                    if (images.length < limit) inputRef.current?.click();
                }}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center
          ${
              images.length >= limit
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-gray-800 text-black hover:bg-gray-800/5"
          }`}
            >
                <p className="font-medium">Clique pour ajouter des images</p>
                {Number.isFinite(limit) && (
                    <p className="text-sm mt-1">
                        {images.length} / {limit} images
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
            />

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative group">
                            <img
                                src={img.preview}
                                className="w-full h-24 object-cover rounded-md border border-gray-800"
                            />
                            <button
                                onClick={() => removeImage(img.id)}
                                className="cursor-pointer absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {onValidate && (
                <div className="w-full flex justify-end">
                    <button
                        onClick={validate}
                        disabled={images.length === 0}
                        className="cursor-pointer mt-6 px-6 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                    >
                        Valider
                    </button>
                </div>
            )}
        </div>
    );
}
