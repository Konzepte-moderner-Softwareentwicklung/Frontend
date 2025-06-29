// components/OfferImageUploader.tsx
import { getCompoundImageLink } from "@/api/media_api";
import { uploadImage } from "@/pages/drives/drivesService";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function OfferImageUploader({ offer }: { offer: any }) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentUserId = sessionStorage.getItem("UserID");
    const isCreator = currentUserId == offer?.creator;

    useEffect(() => {
        const fetchImages = async () => {
            if (offer?.imageURL) {
                try {
                    const imageArray = await getCompoundImageLink(offer.imageURL);
                    if (imageArray && imageArray.length > 0) {
                        setImageUrls(imageArray);
                        setCurrentIndex(0);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            }
        };

        fetchImages();
    }, [offer?.imageURL]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadImage(offer?.imageURL || "", file);
            // Refresh the images after upload
            if (offer?.imageURL) {
                try {
                    const imageArray = await getCompoundImageLink(offer.imageURL);
                    if (imageArray && imageArray.length > 0) {
                        setImageUrls(imageArray);
                        setCurrentIndex(0);
                    }
                } catch (error) {
                    console.error('Error fetching images after upload:', error);
                }
            }
        }
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="mb-4">
            {imageUrls.length > 0 && (
                <div className="relative">
                    {/* Main Image */}
                    <div className="relative w-full h-64 overflow-hidden rounded">
                        <img
                            src={"/api" + imageUrls[currentIndex]}
                            alt={`Angebot ${currentIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Navigation Buttons */}
                        {imageUrls.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Image Indicators */}
                    {imageUrls.length > 1 && (
                        <div className="flex justify-center mt-2 space-x-2">
                            {imageUrls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToImage(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentIndex 
                                            ? 'bg-blue-500' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image Counter */}
                    {imageUrls.length > 1 && (
                        <div className="text-center text-sm text-gray-600 mt-1">
                            {currentIndex + 1} / {imageUrls.length}
                        </div>
                    )}
                </div>
            )}

            {isCreator && (
                <button
                    onClick={() => document.getElementById("imageUploadInput")?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                >
                    Bild hochladen
                </button>
            )}

            <input
                type="file"
                id="imageUploadInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
        </div>
    );
}
