import { useRef, useState } from "react";
import MD5 from "crypto-js/md5";
import WordArray from "crypto-js/lib-typedarrays";
import FileIcon from "@assets/FileIcon.png"

export type FileItem = {
    id: string;
    buffer: ArrayBuffer;
    hash: string;
    name: string;
};

type Props = {
    onValidate?: (files: FileItem[]) => void;
    setFiles?: React.Dispatch<React.SetStateAction<FileItem[]>>;
    maxFiles?: number;
};

export default function FileDropzone({
    onValidate,
    maxFiles,
    setFiles,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFilesItem] = useState<FileItem[]>([]);

    const limit = maxFiles ?? Infinity;

    const validate = async () => {
        if (!onValidate) return;
        onValidate(files);
    };

    const onFilesSelected = async (files: FileList | null) => {
        if (!files) return;

        const remaining = limit - files.length;
        if (remaining <= 0) return;

        const newFiles = await Promise.all(
            Array.from(files)
                .slice(0, remaining)
                .map(async (file) => ({
                    id: crypto.randomUUID(),
                    buffer: await file.arrayBuffer(),
                    hash: MD5(
                        WordArray.create(await file.arrayBuffer()),
                    ).toString(),
                    name: file.name,
                })),
        );

        setFilesItem((prev) => [...prev, ...newFiles]);

        if (setFiles) {
            setFiles((prev) => {
                return [...prev, ...newFiles];
            });
        }
    };

    const removeFile = (id: string) => {
        setFilesItem((prev) => {
            return prev.filter((i) => i.id !== id);
        });
        if (setFiles) {
            setFiles((prev) => {
                return prev.filter((i) => i.id !== id);
            });
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => {
                    if (files.length < limit) inputRef.current?.click();
                }}
                className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center
          ${
              files.length >= limit
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-gray-800 text-black hover:bg-gray-800/5"
          }`}
            >
                <p className="font-medium">Clique pour ajouter des fichiers</p>
                {Number.isFinite(limit) && (
                    <p className="text-sm mt-1">
                        {files.length} / {limit} files
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
            />

            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {files.map((img) => (
                        <div key={img.id} className="relative group w-40">
                            <div
                                className="w-full h-24 rounded-md border border-gray-800 flex items-center justify-center px-2 bg-contain bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${FileIcon})` }}
                            >
                                <span className="block w-full truncate text-center bg-black/40 text-white rounded px-1">
                                    {img.name}
                                </span>
                            </div>

                            <button
                                onClick={() => removeFile(img.id)}
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
                        disabled={files.length === 0}
                        className="cursor-pointer mt-6 px-6 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                    >
                        Valider
                    </button>
                </div>
            )}
        </div>
    );
}
