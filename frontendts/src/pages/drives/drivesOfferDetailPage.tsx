import {useNavigate, useParams} from "react-router-dom";
import {
    DEFAULT_OFFER,
    getOffer,
    isSpaceAvailable,
    type Item,
    type Offer,
    setLocationName, type Space, uploadImage
} from "@/pages/drives/drivesService.tsx";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button";
import {DialogDescription} from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import {FeedbackDialog} from "@/pages/drives/FeedbackDialog";

function DrivesOfferDetailPage() {
    const ws = useRef<WebSocket | null>(null);
    const intervalRef = useRef<number | null>(null);
    const userId = localStorage.getItem("UserID")||sessionStorage.getItem("UserID")||"";
    const[isSelfChat, setIsSelfChat] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editedOffer, setEditedOffer] = useState<Offer>(DEFAULT_OFFER);
    const [FromLocationGeoName, setFromLocationGeoName] = useState('');
    const [ToLocationGeoName, setToLocationGeoName] = useState('');
    const [showRatingDialog,setShowRaginDialog] = useState(false);

    const [isDriver, setIsDriver] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [joinsWithPassenger, setJoinsWithPassenger] = useState(false);
    const [itemWidth, setItemWidth] = useState("");
    const [itemHeight, setItemHeight] = useState("");
    const [itemDepth, setItemDepth] = useState("");
    const [itemWeight, setItemWeight] = useState("");

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
        // change if the token is not saved in the localStorage
        // ws.current = new WebSocket(
        //     `/api/tracking?token=${sessionStorage.getItem("token")}`,
        // );
        //
        // ws.current.onopen = () => {
        //     intervalRef.current = window.setInterval(() => {
        //         if (navigator.geolocation && isTracking) {
        //             navigator.geolocation.getCurrentPosition(
        //                 (position: GeolocationPosition) => {
        //                     const location = {
        //                         latitude: position.coords.latitude,
        //                         longitude: position.coords.longitude,
        //                     };
        //                     ws.current?.send(JSON.stringify(location));
        //                 },
        //                 (error: GeolocationPositionError) => {
        //                     console.error("Geolocation error:", error.message);
        //                 },
        //             );
        //         }
        //     }, 5000);
        // };
        //
        // ws.current.onmessage = (event: MessageEvent) => {
        //     console.log("Message from server:", event.data);
        // };
        //
        // ws.current.onerror = (error: Event) => {
        //     console.error("WebSocket error:", error);
        // };
        //
        // ws.current.onclose = () => {
        //     console.log("WebSocket connection closed");
        // };
        //
        // // Cleanup
        // return () => {
        //     if (ws.current?.readyState === WebSocket.OPEN) {
        //         ws.current.close();
        //     }
        // };
    });

    const toggleTracking = () => {
        console.log("toggleTracking called");
        setIsTracking(!isTracking);
    };

    const navigate = useNavigate();
    const {id} = useParams();
    const [offer, setOffer] = useState<Offer | undefined>(undefined);
    const handleBack = () => {
        navigate("/drives");
    };
    useEffect(() => { //TODO: Wenn Auf Teilnehem gedrückt, muss Mitfahrer bezahlen
        if (id) {
            getOffer(id).then(setOffer);

            if (offer?.creator == userId) {
                setIsDriver(true);
                setIsSelfChat(true);
            }
        if(new Date(offer?.endDateTime||"").getTime() >= new Date().getTime()){//Fahrt zuende
            setShowRaginDialog(true);
        }
        }
    }, [id, offer?.creator, isDriver, userId, offer?.endDateTime]);
    const joinOffer = () => {
        if (!offer ||  offer.occupiedSpace?.some(space => space.Occupier === userId)) return;

        if (joinsWithPassenger && offer.canTransport.seats > 0) {
            offer.canTransport.seats -= 1;
        }

        // Füge Item hinzu
        const newItem: Item = {
            weight: parseFloat(itemWeight),
            size: {
                width: parseFloat(itemWidth),
                height: parseFloat(itemHeight),
                depth: parseFloat(itemDepth),
            },
        };
        const newSpace: Space = {Occupier:sessionStorage.getItem("UserID")||"",items:[newItem], seats:1}

        if (isSpaceAvailable(offer.canTransport, offer.occupiedSpace, newItem))
            offer.occupiedSpace.push(newSpace);



        // Force re-render
        setOffer({...offer});
    };


    const isLoggedIn = sessionStorage.getItem("token") != null;
    const hasJoined = offer?.occupiedSpace?.some(space => space.Occupier === userId);
    const noSeatsLeft = offer ? offer?.canTransport?.seats <= 0 : undefined;


    const goToChat = () => {

        // navigate(`/chat/${offer.chatId}`);
        if(isLoggedIn && !isDriver)
            navigate(`/chat`);
    };

    if (!offer) {
        return (
            <div className="min-h-screen bg-cyan-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleBack}
                        className="mb-6 px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50 transition"
                    >
                        ← Zurück
                    </button>

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

    // @ts-ignore
    return (
        <div className="min-h-screen bg-cyan-100 p-8">
            <div className="max-w-4xl mx-auto relative">
                <button
                    onClick={handleBack}
                    className="mb-6 px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50 transition"
                >
                    ← Zurück
                </button>

                <div className="absolute top-0 right-0 mt-2 mr-2 flex gap-2">
                    {isDriver && (
                        <button
                            onClick={() => {
                                setEditedOffer({...offer});
                                setShowEditDialog(true);
                            }}
                            className="px-4 py-2 rounded shadow bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                            Bearbeiten
                        </button>
                    )}

                    {isDriver && (
                        <button
                            onClick={() => toggleTracking()}
                            className={`px-4 py-2 rounded shadow transition ${
                                isTracking
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                        >
                            {isTracking ? "Stop Tracking" : "Start Tracking"}
                        </button>
                    )}
                    <button
                        onClick={() => setShowJoinDialog(true)}
                        disabled={!isLoggedIn || hasJoined || noSeatsLeft||isDriver}
                        className={`px-4 py-2 rounded shadow transition ${
                            !isLoggedIn || hasJoined || noSeatsLeft||isDriver
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                        {hasJoined|| isDriver ? "Bereits teilgenommen" : "Teilnehmen"}
                    </button>
                    {showEditDialog && editedOffer && (
                        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Angebot bearbeiten</DialogTitle>
                                    <DialogDescription>Ändere die Daten des Angebots.</DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <Input
                                        placeholder="Titel"
                                        value={editedOffer.title}
                                        onChange={(e) =>
                                            setEditedOffer({ ...editedOffer, title: e.target.value })
                                        }
                                    />
                                    <Input
                                        placeholder="Beschreibung"
                                        value={editedOffer.description}
                                        onChange={(e) =>
                                            setEditedOffer({ ...editedOffer, description: e.target.value })
                                        }
                                    />
                                    <Input
                                        placeholder="Von"
                                        value={FromLocationGeoName}
                                        onChange={(e) =>setFromLocationGeoName(e.target.value)}
                                        onBlur={async () => {
                                            try {
                                                const coords = await setLocationName(FromLocationGeoName);
                                                setEditedOffer((prev) => ({
                                                    ...prev,
                                                    locationFrom: coords||{latitude:0,longitude:0},
                                                }));
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            } catch (err) {
                                                toast.error("Von Location konnte nicht gesetzt werden. Bitte geben sie einen gültigen Wert ein");
                                            }
                                        }}
                                    />

                                    <Input
                                        placeholder="Nach"
                                        value={ToLocationGeoName}
                                        onChange={(e) =>setToLocationGeoName(e.target.value)}
                                        onBlur={async () => {
                                            try {
                                                const coords = await setLocationName(ToLocationGeoName);
                                                setEditedOffer((prev) => ({
                                                    ...prev,
                                                    locationFrom: coords||{latitude:0,longitude:0},
                                                }));
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            } catch (err) {
                                                toast.error("Von Location konnte nicht gesetzt werden. Bitte geben sie einen gültigen Wert ein");
                                            }
                                        }}
                                    />
                                    <Input
                                        placeholder="Preis in €"
                                        type="number"
                                        value={editedOffer.price}
                                        onChange={(e) =>
                                            setEditedOffer({
                                                ...editedOffer,
                                                price: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        onClick={() => {
                                            setOffer(editedOffer); // übernimmt die Änderungen ins Hauptobjekt
                                            setShowEditDialog(false);
                                        }}
                                    >
                                        Speichern
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {showJoinDialog && (
                        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Teilnahme bestätigen</DialogTitle>
                                    <DialogDescription>
                                        Gib bitte an, ob du selbst mitfährst und ob du Gepäck mitnimmst.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={joinsWithPassenger}
                                            onChange={(e) => setJoinsWithPassenger(e.target.checked)}
                                        />
                                        Ich fahre selbst mit
                                    </label>

                                    <Input
                                        placeholder="Breite in m"
                                        type="number"
                                        value={itemWidth}
                                        onChange={(e) => setItemWidth(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Höhe in m"
                                        type="number"
                                        value={itemHeight}
                                        onChange={(e) => setItemHeight(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Tiefe in m"
                                        type="number"
                                        value={itemDepth}
                                        onChange={(e) => setItemDepth(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Gewicht in kg"
                                        type="number"
                                        value={itemWeight}
                                        onChange={(e) => setItemWeight(e.target.value)}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        onClick={() => {
                                            joinOffer();
                                            setShowJoinDialog(false);
                                        }}
                                    >
                                        Teilnehmen
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    <FeedbackDialog
                        isDriver={isDriver} targetId={isDriver?offer?.occupiedSpace?.[0].Occupier ?? "":offer?.creator}
                    />

                    <button
                        onClick={goToChat}
                        disabled={!offer?.chatId|| isSelfChat}
                        className={`px-4 py-2 rounded shadow transition ${
                            isLoggedIn && offer?.chatId && !isSelfChat
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Zum Chat
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 mt-2">
                    {offer?.imageURL && offer.imageURL !== "" && (
                        <img
                            src={offer.imageURL}
                            alt="Angebot"
                            className="w-full h-64 object-cover rounded mb-4"
                        />
                    )}

                    <button
                        onClick={() => document.getElementById('imageUploadInput')?.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Bild hochladen
                    </button>

                    <input
                        type="file"
                        id="imageUploadInput"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                  await uploadImage(file);
                            }
                        }}
                    />

                    <h1 className="text-2xl font-bold mb-2">{offer?.title}</h1>
                    <p className="text-gray-600 mb-4">{offer?.description}</p>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            {/*TODO:Fix*/}
                            {/*<p>*/}
                            {/*    <strong>Von:</strong> {getLocationName(offer?.locationFrom?.latitude,offer?.locationFrom?.longitude)}*/}
                            {/*</p>*/}
                            {/*<p>*/}
                            {/*    <strong>Nach:</strong> {getLocationName(offer?.locationTo?.latitude,offer?.locationTo?.longitude)}*/}
                            {/*</p>*/}
                            <p>
                                <strong>Preis:</strong> {offer?.price} €
                            </p>
                            <p>
                                <strong>Start:</strong> {offer?.startDateTime ? new Date(offer.startDateTime).toLocaleString() : '–'}
                            </p>
                            <p>
                                <strong>Ende:</strong> {offer?.endDateTime ? new Date(offer.endDateTime).toLocaleString() : '–'}
                            </p>

                        </div>
                        <div>
                            <p>
                                <strong>Sitze frei:</strong> {offer?.canTransport?.seats}
                            </p>
                            <p>
                                <strong>Kommunikation:</strong>{" "}
                                {[
                                    offer?.isChat && "Chat",
                                    offer?.isPhone && "Telefon",
                                    offer?.isEmail && "E-Mail",
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                            <p>
                                <strong>Ersteller:</strong> {offer?.creator}
                            </p>
                        </div>
                    </div>


                    <div className="mb-4">
                        <h2 className="font-semibold">Ladefläche des Fahrzeugs</h2>
                        <ul className="list-disc ml-5">
                            {offer?.canTransport?.items?.map((item, i) => (
                                <li key={i}>
                                    Größe: {item.size.width}×{item.size.height}×{item.size.depth}
                                    cm, Maximalgewicht: {item.weight}kg
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="mb-4">
                        <h2 className="font-semibold">Einschränkungen</h2>
                        <ul className="list-disc ml-5">
                            {offer?.restrictions?.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>


                    <div className="mb-4">
                        <h2 className="font-semibold">Weitere Infos</h2>
                        <ul className="list-disc ml-5">
                            {offer?.info?.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>


                    <div>
                        <h2 className="font-semibold">Fahrzeug</h2>
                        <ul className="list-disc ml-5">
                            {offer?.infoCar?.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DrivesOfferDetailPage;
