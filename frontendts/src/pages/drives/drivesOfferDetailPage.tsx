import {useNavigate, useParams} from "react-router-dom";
import {getOffer, isSpaceAvailable, type Item, type Offer} from "@/pages/drives/drivesService.tsx";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button";
import {DialogDescription} from "@radix-ui/react-dialog";

function DrivesOfferDetailPage() {
    const ws = useRef<WebSocket | null>(null);
    const intervalRef = useRef<number | null>(null);
    const userId = "user789";
    const[isSelfChat, setIsSelfChat] = useState(false);

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
        ws.current = new WebSocket(
            `/api/tracking?token=${localStorage.getItem("token")}`,
        );

        ws.current.onopen = () => {
            intervalRef.current = window.setInterval(() => {
                if (navigator.geolocation && isTracking) {
                    navigator.geolocation.getCurrentPosition(
                        (position: GeolocationPosition) => {
                            const location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            ws.current?.send(JSON.stringify(location));
                        },
                        (error: GeolocationPositionError) => {
                            console.error("Geolocation error:", error.message);
                        },
                    );
                }
            }, 5000);
        };

        ws.current.onmessage = (event: MessageEvent) => {
            console.log("Message from server:", event.data);
        };

        ws.current.onerror = (error: Event) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        // Cleanup
        return () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
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
    useEffect(() => {
        if (id) {
            getOffer(id).then(setOffer);
            if (offer?.driver == userId) {
                setIsDriver(true);
                setIsSelfChat(true);
            }

        }
    }, [id, offer?.driver]);
    const joinOffer = () => {
        if (!offer || offer.occupiedBy.includes(userId)) return;


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

        if (isSpaceAvailable(offer.canTransport, offer.occupiedSpace, newItem))
            offer.occupiedSpace.items.push(newItem);

        offer.occupiedBy.push(userId);


        // Force re-render
        setOffer({...offer});
    };


    const isLoggedIn = true;
    const hasJoined = offer?.occupiedBy.includes(userId);
    const noSeatsLeft = offer ? offer?.canTransport.seats <= 0 : undefined;


    const goToChat = () => {
        // navigate(`/chat/${offer.chatId}`);
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
                        disabled={!isLoggedIn || hasJoined || noSeatsLeft}
                        className={`px-4 py-2 rounded shadow transition ${
                            !isLoggedIn || hasJoined || noSeatsLeft
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                        {hasJoined ? "Bereits teilgenommen" : "Teilnehmen"}
                    </button>
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


                    <button
                        onClick={goToChat}
                        disabled={!offer.chatId|| isSelfChat}
                        className={`px-4 py-2 rounded shadow transition ${
                            (isLoggedIn || !offer.chatId) && !isSelfChat
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Zum Chat
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 mt-2">
                    <img
                        src={offer.imageURL}
                        alt="Angebot"
                        className="w-full h-64 object-cover rounded mb-4"
                    />

                    <h1 className="text-2xl font-bold mb-2">{offer.title}</h1>
                    <p className="text-gray-600 mb-4">{offer.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>
                                <strong>Von:</strong> {offer.locationFrom}
                            </p>
                            <p>
                                <strong>Nach:</strong> {offer.locationTo}
                            </p>
                            <p>
                                <strong>Preis:</strong> {offer.price} €
                            </p>
                            <p>
                                <strong>Start:</strong> {offer.startDateTime.toLocaleString()}
                            </p>
                            <p>
                                <strong>Ende:</strong> {offer.endDateTime.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Sitze frei:</strong> {offer.canTransport.seats}
                            </p>
                            <p>
                                <strong>Kommunikation:</strong>{" "}
                                {[
                                    offer.isChat && "Chat",
                                    offer.isPhone && "Telefon",
                                    offer.isEmail && "E-Mail",
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                            <p>
                                <strong>Ersteller:</strong> {offer.driver}
                            </p>
                            <p>
                                <strong>Erstellt am:</strong>{" "}
                                {offer.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    </div>


                    <div className="mb-4">
                        <h2 className="font-semibold">Ladefläche des Fahrzeugs</h2>
                        <ul className="list-disc ml-5">
                            {offer.canTransport.items.map((item, i) => (
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
                            {offer.restrictions.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>


                    <div className="mb-4">
                        <h2 className="font-semibold">Weitere Infos</h2>
                        <ul className="list-disc ml-5">
                            {offer.info.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>


                    <div>
                        <h2 className="font-semibold">Fahrzeug</h2>
                        <ul className="list-disc ml-5">
                            {offer.infoCar.map((info, i) => (
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
