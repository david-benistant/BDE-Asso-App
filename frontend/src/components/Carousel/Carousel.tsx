import { useState } from "react";
import LogoEpitech from "@assets/LogoEpitech.png"

interface CarouselProps {
    images: string[];
}

export default function CarouselImages({ images }: CarouselProps) {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((index - 1 + images.length) % images.length);
    const next = () => setIndex((index + 1) % images.length);

    return (
        <div className="relative w-full h-full mx-auto overflow-hidden shadow-lg">
            <div className="overflow-hidden w-full h-full">
                <div
                    className="flex transition-transform duration-500 h-full"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {images.length > 0 &&
                        images.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                className="w-full h-full flex-shrink-0 object-cover object-center"
                            />
                        ))}

                    {images.length === 0 && (
                        <img
                            key={0}
                            src={LogoEpitech}
                            className="w-full h-full flex-shrink-0 object-cover object-center"
                        />
                    )}
                </div>
            </div>

            <button
                onClick={prev}
                className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
                ‹
            </button>
            <button
                onClick={next}
                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
                ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}
