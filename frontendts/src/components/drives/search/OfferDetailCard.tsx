import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { type Offer, type SearchDialogFields } from "@/pages/drives/drivesService.tsx";
import { PackageInfoSection } from "./PackageInfoSection";

interface OfferDetailCardProps {
    offer: Offer;
    fields: SearchDialogFields;
    userId: string;
    onEditClick: () => void;
    onDriverApplicationClick: () => void;
    onBackClick: () => void;
}

export function OfferDetailCard({
    offer,
    fields,
    userId,
    onEditClick,
    onDriverApplicationClick,
    onBackClick,
}: OfferDetailCardProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-cyan-100 p-8">
            <button
                onClick={onBackClick}
                className="mb-6 px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50 transition"
            >
                ← Zurück
            </button>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow relative">
                {offer?.isChat && offer.chatId && (
                    <Button
                        className="absolute top-4 right-4"
                        onClick={() => navigate(`/chat/${offer.chatId}`)}
                    >
                        Chat öffnen
                    </Button>
                )}

                <h1 className="text-2xl font-bold mb-4">
                    {offer.title || "Titel (noch leer)"}
                </h1>
                <p className="text-gray-600 mb-4">
                    {offer.description || "Keine Beschreibung"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p>
                            <strong>Von:</strong>{" "}
                            {fields.locationFrom || "-"}
                        </p>
                        <p>
                            <strong>Nach:</strong>{" "}
                            {fields.locationTo || "-"}
                        </p>
                        <p>
                            <strong>Preis:</strong> {offer?.price} €
                        </p>
                        <p>
                            <strong>Sitze:</strong> {offer?.occupiedSpace[0]?.seats}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Infos:</strong> {fields.info.join(", ") || "-"}
                        </p>
                        <p>
                            <strong>Einschränkungen:</strong>{" "}
                            {fields.restrictions.join(", ") || "-"}
                        </p>
                    </div>
                </div>

                <PackageInfoSection package={fields.package} />

                <div className="flex gap-4">
                    {/*{offer?.creator === userId && (*/}
                    {/*    <Button onClick={onEditClick}>Bearbeiten</Button>*/}
                    {/*)}*/}

                    {offer?.creator !== userId && (
                        <Button onClick={onDriverApplicationClick}>
                            Als Fahrer melden
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
} 