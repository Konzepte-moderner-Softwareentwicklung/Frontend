import {useNavigate, useParams} from "react-router-dom";
import {
    DEFAULT_OFFER, getLocationByCoordinates,
    getOffer, getUserNameFromUserId,
    isSpaceAvailable,
    type Item, occupyOfferById,
    type Offer,
    type Space,
} from "@/pages/drives/drivesService.tsx";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {FeedbackDialog} from "@/components/drives/FeedbackDialog.tsx";
import {OfferEditDialog} from "@/components/drives/offer/OfferEditDialog";
import {OfferJoinDialog} from "@/components/drives/offer/OfferJoinDialog";
import {OfferImageUploader} from "@/components/drives/offer/OfferImageUploader.tsx";
import {createIfNotExistChat} from "@/pages/chat/chatService.tsx";

function DrivesOfferDetailPage() {
    const ws = useRef<WebSocket | null>(null);
    const intervalRef = useRef<number | null>(null);
    const userId = localStorage.getItem("UserID") || sessionStorage.getItem("UserID") || "";
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editedOffer, setEditedOffer] = useState<Offer>(DEFAULT_OFFER);
    const [FromLocationGeoName, setFromLocationGeoName] = useState('');
    const [ToLocationGeoName, setToLocationGeoName] = useState('');
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [hasGivenFeedback, setHasGivenFeedback] = useState(false);

    const [creatorName, setCreatorName] = useState("");
    const [isDriver, setIsDriver] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [joinsWithPassenger, setJoinsWithPassenger] = useState(false);
    const [itemWidth, setItemWidth] = useState("");
    const [itemHeight, setItemHeight] = useState("");
    const [itemDepth, setItemDepth] = useState("");
    const [itemWeight, setItemWeight] = useState("");


    const navigate = useNavigate();
    const {id} = useParams();
    const [offer, setOffer] = useState<Offer | undefined>(undefined);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});

        ws.current = new WebSocket(
            `/api/tracking?token=${sessionStorage.getItem("token")}`,
        );

        ws.current.onopen = () => {
            intervalRef.current = window.setInterval(() => {
                if (navigator.geolocation && isTracking) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            ws.current?.send(JSON.stringify(location));
                        },
                        (error) => {
                            console.error("Geolocation error:", error.message);
                        },
                    );
                }
            }, 5000);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, [isTracking]);
    useEffect(() => {
        const fetchCreatorName = async () => {
            if (offer?.creator) {
                const result = await getUserNameFromUserId(offer.creator);
                if (result) {
                    setCreatorName(`${result.firstName} ${result.lastName}`);
                }
            }
        };

        fetchCreatorName().then();
    }, [offer?.creator]);

    useEffect(() => {
        if (id) {
            getOffer(id).then(setOffer);
        }
    }, [id]);
    useEffect(() => {
        const fetchLocations = async () => {
            if (offer?.locationFrom?.latitude && offer?.locationFrom?.longitude) {
                try {
                    const from = await getLocationByCoordinates(
                        offer.locationFrom.latitude,
                        offer.locationFrom.longitude
                    );
                    setFromLocationGeoName(from || `${offer.locationFrom.latitude}, ${offer.locationFrom.longitude}`);
                } catch {
                    setFromLocationGeoName(`${offer.locationFrom.latitude}, ${offer.locationFrom.longitude}`);
                }
            }

            if (offer?.locationTo?.latitude && offer?.locationTo?.longitude) {
                try {
                    const to = await getLocationByCoordinates(
                        offer.locationTo.latitude,
                        offer.locationTo.longitude
                    );
                    setToLocationGeoName(to || `${offer.locationTo.latitude}, ${offer.locationTo.longitude}`);
                } catch {
                    setToLocationGeoName(`${offer.locationTo.latitude}, ${offer.locationTo.longitude}`);
                }
            }
        };

        fetchLocations().then();
    }, [offer]);


    const isLoggedIn = sessionStorage.getItem("token") != null && sessionStorage.getItem("token") !== "";

    useEffect(() => {
        if (offer?.driver === userId) {
            setIsDriver(true);
        }

          if (new Date(offer?.endDateTime || "").getTime() <= new Date().getTime()) {
        setShowRatingDialog(true);
           }
    }, [offer, userId]);

    const toggleTracking = () => {
        setIsTracking(!isTracking);
    };

    const handleBack = () => {
        navigate("/drives");
    };

    const joinOffer = async () => {
        if (!offer || offer.occupiedSpace?.some(space => space.occupiedBy === userId)) return;

        if (joinsWithPassenger && offer.canTransport.seats > 0) {
            offer.canTransport.seats -= 1;
        }

        const newItem: Item = {
            weight: parseFloat(itemWeight),
            size: {
                width: parseFloat(itemWidth),
                height: parseFloat(itemHeight),
                depth: parseFloat(itemDepth),
            },
        };

        const newSpace: Space = {
            occupiedBy: userId,
            items: [newItem],
            seats: 1,
        };

        if (isSpaceAvailable(offer.canTransport, offer.occupiedSpace, newItem)) {
            offer.occupiedSpace.push(newSpace);
        }

        await occupyOfferById(offer?.id || "", newSpace);
        setOffer({...offer});
    };


    const goToChat = () => {
        if (isLoggedIn && !isDriver && offer?.isChat) {
            createIfNotExistChat(offer?.chatId || "").then();
            navigate(`/chat`);
        }
    };


    const isOccupiedSpaceUser = offer?.occupiedSpace?.some(space => space.occupiedBy === userId) || false;
    const canGiveFeedback = isDriver || isOccupiedSpaceUser;


    if (!offer) {
        return (
            <div className="min-h-screen bg-cyan-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <Button onClick={handleBack} className="mb-6">
                        ← Zurück
                    </Button>
                    <div className="bg-white p-6 rounded-2xl shadow text-center">
                        <h1 className="text-xl font-bold text-red-600 mb-4">
                            Die Fahrt konnte nicht geladen werden.
                        </h1>
                        <p className="text-gray-600">
                            Bitte überprüfe den Link oder versuche es später erneut.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyan-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow space-y-6">
                <div className="flex justify-between items-center">
                    <Button onClick={handleBack}>← Zurück</Button>

                    <div className="flex gap-4">
                        {isDriver && (
                            <Button
                                variant="outline"
                                onClick={toggleTracking}
                                className={
                                    isTracking
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                }
                            >
                                {isTracking ? "Stop Tracking" : "Start Tracking"}
                            </Button>
                        )}

                        {!isDriver && !isOccupiedSpaceUser && isLoggedIn && (
                            <Button
                                variant="outline"
                                onClick={() => setShowJoinDialog(true)}
                            >
                                An Fahrt teilnehmen
                            </Button>
                        )}

                        <Button
                            onClick={goToChat}
                            disabled={isDriver || offer?.isChat}
                            className={
                                isLoggedIn && offer?.isChat && isDriver
                                    ? ""
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                        >
                            Zum Chat
                        </Button>

                        {/*<Button variant="outline" onClick={() => setShowEditDialog(true)}>*/}
                        {/*    Bearbeiten*/}
                        {/*</Button>*/}
                    </div>
                </div>

                <OfferEditDialog
                    open={showEditDialog}
                    onClose={setShowEditDialog}
                    editedOffer={editedOffer}
                    setEditedOffer={setEditedOffer}
                    setOffer={setOffer}
                    FromLocationGeoName={FromLocationGeoName}
                    setFromLocationGeoName={setFromLocationGeoName}
                    ToLocationGeoName={ToLocationGeoName}
                    setToLocationGeoName={setToLocationGeoName}
                />


                <OfferJoinDialog
                    open={showJoinDialog}
                    onClose={setShowJoinDialog}
                    joinsWithPassenger={joinsWithPassenger}
                    setJoinsWithPassenger={setJoinsWithPassenger}
                    itemWidth={itemWidth}
                    setItemWidth={setItemWidth}
                    itemHeight={itemHeight}
                    setItemHeight={setItemHeight}
                    itemDepth={itemDepth}
                    setItemDepth={setItemDepth}
                    itemWeight={itemWeight}
                    setItemWeight={setItemWeight}
                    onJoin={joinOffer}
                />

                {canGiveFeedback && showRatingDialog && !hasGivenFeedback && (
                    <FeedbackDialog
                        offerId={offer?.id || ""}
                        isDriver={isDriver}
                        targetId={isDriver ? offer?.occupiedSpace?.[0]?.occupiedBy ?? "" : offer?.driver}
                        onFeedbackGiven={() => setHasGivenFeedback(true)}
                        hasGivenFeedback={hasGivenFeedback}

                    />
                )}


                <OfferImageUploader offer={offer}/>

                <h1 className="text-3xl font-bold">{offer?.title}</h1>
                <p className="text-gray-700">{offer?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p><strong>Preis:</strong> {offer?.price} €</p>
                        <p>
                            <strong>Start:</strong> {offer?.startDateTime ? new Date(offer.startDateTime).toLocaleString() : '–'}
                        </p>
                        <p>
                            <strong>Ende:</strong> {offer?.endDateTime ? new Date(offer.endDateTime).toLocaleString() : '–'}
                        </p>
                        <p><strong>Startort:</strong> {FromLocationGeoName || "–"}</p>
                        <p><strong>Zielort:</strong> {ToLocationGeoName || "–"}</p>

                    </div>
                    <div className="space-y-2">
                        <p><strong>Sitze frei:</strong> {offer?.canTransport?.seats}</p>
                        <p>
                            <strong>Kommunikation:</strong> {[offer?.isChat && "Chat", offer?.isPhone && "Telefon", offer?.isEmail && "E-Mail"].filter(Boolean).join(", ")}
                        </p>
                        <p><strong>Ersteller:</strong>{creatorName || "–"}</p>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Ladefläche des Fahrzeugs</h2>
                    <ul className="list-disc ml-5">
                        {offer?.canTransport?.items?.map((item, i) => (
                            <li key={i}>
                                Größe: {item.size.width}×{item.size.height}×{item.size.depth} cm,
                                Maximalgewicht: {item.weight}kg
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Einschränkungen</h2>
                    <ul className="list-disc ml-5">
                        {offer?.restrictions?.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Weitere Infos</h2>
                    <ul className="list-disc ml-5">
                        {offer?.info?.map((info, i) => (
                            <li key={i}>{info}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Fahrzeug</h2>
                    <ul className="list-disc ml-5">
                        {offer?.infoCar?.map((info, i) => (
                            <li key={i}>{info}</li>
                        ))}
                    </ul>
                </div>


            </div>
        </div>
    );
}

export default DrivesOfferDetailPage;
