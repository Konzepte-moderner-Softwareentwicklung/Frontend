import {Card, CardContent} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import {getLocationFromList, type Offer} from "@/pages/drives/drivesService.tsx";
import {useNavigate} from "react-router-dom";

export function DriveDetailCard({ offer }: { offer: Offer }) {
    const navigate = useNavigate();
    const [fromLocation, setFromLocation] = useState<string | null>(null);
    const [toLocation, setToLocation] = useState<string | null>(null);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchLocations() {
            if (!offer?.id) {
                setIsLoadingLocations(false);
                return;
            }

            try {
                setIsLoadingLocations(true);
                const { coordinatesFrom, coordinatesTo } = await getLocationFromList(
                    offer.id,
                    offer.locationFrom,
                    offer.locationTo
                );
                
                if (isMounted) {
                    setFromLocation(coordinatesFrom);
                    setToLocation(coordinatesTo);
                }
            } catch (error) {
                console.error("Fehler beim Laden der Locations:", error);
                if (isMounted) {
                    setFromLocation("Unbekannt");
                    setToLocation("Unbekannt");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingLocations(false);
                }
            }
        }

        fetchLocations();

        return () => {
            isMounted = false;
        };
    }, [offer?.id, offer?.locationFrom, offer?.locationTo]);

    const isGesuch = offer.isGesuch;

    const getLocationDisplay = () => {
        if (isLoadingLocations) {
            return "Lade...";
        }
        if (fromLocation && toLocation) {
            return `${fromLocation} → ${toLocation}`;
        }
        return "Standort unbekannt";
    };

    return (
        <Card
            key={offer.id}
            className={`rounded-2xl shadow cursor-pointer transition hover:shadow-lg
      ${isGesuch ? "bg-pink-100" : "border-2 border-green-400"}`}
            onClick={() => {
                if (!isGesuch) {
                    navigate(`/drives/${offer.id}`);
                } else {
                    navigate(`/drives/${offer.id}/search`);
                }
            }}
        >
            <CardContent className="p-4">
                {isGesuch && (
                    <h3 className="text-pink-700 font-semibold mb-2">Suche Fahrt:</h3>
                )}
                {!isGesuch && (
                    <h3 className="text-green-700 font-semibold mb-2">Biete an:</h3>
                )}
                <p>{offer.title}</p>
                <div className="bg-gray-200 h-32 rounded mb-4 overflow-hidden">
                    {offer.imageURL && (
                        <img
                            src={offer.imageURL}
                            alt="Angebot"
                            className="h-full w-full object-cover rounded"
                        />
                    )}
                </div>
                <p className="font-medium">
                    {getLocationDisplay()}
                </p>
                <p className="font-bold">{offer.price} Euro</p>
            </CardContent>
        </Card>
    );
}