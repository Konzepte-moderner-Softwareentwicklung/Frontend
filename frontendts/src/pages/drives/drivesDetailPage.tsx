import {useNavigate, useParams} from 'react-router-dom';
import {getOffer, type Offer} from "@/pages/drives/drivesService.tsx";
import WebSocketComponent from "@/components/drivesWebSocket.tsx";
import {useEffect, useState} from "react";
function DrivesDetailPage() {
    const navigate = useNavigate();
   
    const { id } = useParams();

    const [offer, setOffer] = useState<Offer | undefined>(undefined);
    const handleBack = () => {
        navigate("/drives");
    };
    useEffect(() => {
        if (id) {
            getOffer(id).then(setOffer);
        }
    }, [id]);
    const joinOffer = () => {
        if(offer != undefined){
            if(!offer.occupiedBy.includes("user789")){ //TODO: Später mit User id ersetzen
                offer.canTransport.seats =offer.canTransport.seats -1;
                offer.occupiedBy.push("user789");
            }
        }
    };
    const isLoggedIn = true;


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

                    <button
                        onClick={joinOffer}
                        disabled={!isLoggedIn && offer.canTransport.seats <=0}
                        className={`px-4 py-2 rounded shadow transition ${
                            (isLoggedIn && offer.canTransport.seats >0)
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Teilnehmen
                    </button>


                    <button
                        onClick={goToChat}
                      //  disabled={!offer.chatId}
                        className={`px-4 py-2 rounded shadow transition ${
                            isLoggedIn
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
                            <p><strong>Von:</strong> {offer.locationFrom}</p>
                            <p><strong>Nach:</strong> {offer.locationTo}</p>
                            <p><strong>Preis:</strong> {offer.price} €</p>
                            <p><strong>Start:</strong> {offer.startDateTime.toLocaleString()}</p>
                            <p><strong>Ende:</strong> {offer.endDateTime.toLocaleString()}</p>
                        </div>
                        <div>
                            <p><strong>Sitze frei:</strong> {offer.canTransport.seats}</p>
                            <p>
                                <strong>Kommunikation:</strong>{" "}
                                {[
                                    offer.isChat && "Chat",
                                    offer.isPhone && "Telefon",
                                    offer.isEmail && "E-Mail",
                                ].filter(Boolean).join(", ")}
                            </p>
                            <p><strong>Ersteller:</strong> {offer.creator}</p>
                            <p><strong>Erstellt am:</strong> {offer.createdAt.toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Transportierte Objekte */}
                    <div className="mb-4">
                        <h2 className="font-semibold">Transportierte Gegenstände</h2>
                        <ul className="list-disc ml-5">
                            {offer.canTransport.items.map((item, i) => (
                                <li key={i}>
                                    Größe: {item.size.width}×{item.size.height}×{item.size.depth}cm, Gewicht: {item.weight}kg
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Einschränkungen */}
                    <div className="mb-4">
                        <h2 className="font-semibold">Einschränkungen</h2>
                        <ul className="list-disc ml-5">
                            {offer.restrictions.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Infos */}
                    <div className="mb-4">
                        <h2 className="font-semibold">Weitere Infos</h2>
                        <ul className="list-disc ml-5">
                            {offer.info.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Fahrzeug */}
                    <div>
                        <h2 className="font-semibold">Fahrzeug</h2>
                        <ul className="list-disc ml-5">
                            {offer.infoCar.map((info, i) => (
                                <li key={i}>{info}</li>
                            ))}
                        </ul>
                    </div>
                    <WebSocketComponent />
                </div>
            </div>
        </div>
    );
}




export default DrivesDetailPage;