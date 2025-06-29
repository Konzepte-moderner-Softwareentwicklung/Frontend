import {Card, CardContent} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import {getLocationByCoordinates, type Offer} from "@/pages/drives/drivesService.tsx";
import {useNavigate} from "react-router-dom";
import {getCompoundImageLink} from "@/api/media_api";

export function DriveDetailCard({ offer }: { offer: Offer }) {
    const navigate = useNavigate();
    const [fromLocation, setFromLocation] = useState<string | null>(null);
    const [toLocation, setToLocation] = useState<string | null>(null);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchLocations() {
            if (!offer?.locationFrom || !offer?.locationTo) {
                setIsLoadingLocations(false);
                return;
            }

            try {
                setIsLoadingLocations(true);
                
                // Versuche beide Locations parallel zu laden
                const [fromResult, toResult] = await Promise.allSettled([
                    getLocationByCoordinates(offer.locationFrom.latitude, offer.locationFrom.longitude),
                    getLocationByCoordinates(offer.locationTo.latitude, offer.locationTo.longitude)
                ]);
                
                if (isMounted) {
                    // Verwende Stadtnamen oder Koordinaten als Fallback
                    const fromDisplay = fromResult.status === 'fulfilled' && fromResult.value 
                        ? fromResult.value 
                        : `Koordinaten: ${offer.locationFrom.latitude.toFixed(4)}, ${offer.locationFrom.longitude.toFixed(4)}`;
                    
                    const toDisplay = toResult.status === 'fulfilled' && toResult.value 
                        ? toResult.value 
                        : `Koordinaten: ${offer.locationTo.latitude.toFixed(4)}, ${offer.locationTo.longitude.toFixed(4)}`;
                    
                    setFromLocation(fromDisplay);
                    setToLocation(toDisplay);
                }
            } catch (error) {
                console.error("Fehler beim Laden der Locations:", error);
                if (isMounted) {
                    // Fallback zu Koordinaten bei Fehlern
                    setFromLocation(`Koordinaten: ${offer.locationFrom.latitude.toFixed(4)}, ${offer.locationFrom.longitude.toFixed(4)}`);
                    setToLocation(`Koordinaten: ${offer.locationTo.latitude.toFixed(4)}, ${offer.locationTo.longitude.toFixed(4)}`);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingLocations(false);
                }
            }
        }

        async function fetchImage() {
            if (offer?.imageURL) {
                try {
                    const imageArray = await getCompoundImageLink(offer.imageURL);
                    if (imageArray && imageArray.length > 0 && isMounted) {
                        setImageUrl(imageArray[0]);
                    }  else if (imageArray && imageArray.length == 0 || !imageArray) {
                        // image does not exist on server so that the server returns a default image
                        setImageUrl('/media/image/d6968fa0-7670-4fb1-a580-add195d92271')
                    }
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
        }

        fetchLocations();
        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [offer?.locationFrom, offer?.locationTo, offer?.imageURL]);

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
                    {imageUrl && (
                        <img
                            src={"/api" + imageUrl}
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