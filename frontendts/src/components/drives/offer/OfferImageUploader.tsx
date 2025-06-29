// components/OfferImageUploader.tsx
import { uploadImage } from "@/pages/drives/drivesService";

export function OfferImageUploader({ offer }: { offer: any }) {
    const currentUserId = sessionStorage.getItem("UserID");
    const isCreator = currentUserId == offer?.creator;
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadImage(offer?.imageURL || "", file);
        }
    };

    return (
        <div className="mb-4">
            {offer?.imageURL && (
                <img
                    src={offer.imageURL}
                    alt="Angebot"
                    className="w-full h-64 object-cover rounded mb-4"
                />
            )}

            {isCreator && (
                <button
                    onClick={() => document.getElementById("imageUploadInput")?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
