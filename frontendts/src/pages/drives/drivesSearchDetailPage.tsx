import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {DialogDescription} from "@radix-ui/react-dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    createOffer,
    createSearch,
    getOffer,
    type Offer,
    type SearchDialogFields,
} from "@/pages/drives/drivesService.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

function DrivesSearchDetailPage() {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDriverDialog, setShowDriverDialog] = useState(false);
    const [description, setDescription] = useState("");
    const [car, setCar] = useState("");
    const [info, setInfo] = useState("");
    const [infoCar, setInfoCar] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [storageHeight, setStorageHeight] = useState<number | null>(null);
    const [seats, setSeats] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [restrictions, setRestrictions] = useState("");
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [isChat, setIsChat] = useState(false);
    const [isPhone, setIsPhone] = useState<boolean>(false);


    const [storageDepth, setStorageDepth] = useState<number | null>(null);
    const [storageWeight, setStorageWeight] = useState<number | null>(null);

    const [offer, setOffer] = useState<Offer | undefined>(undefined);
    const {id} = useParams();
    const [storageWidth, setStorageWidth] = useState<number | null>(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId")||sessionStorage.getItem("userId")||"";
    const handleBack = () => {
        navigate("/drives");
    };
    const [fields, setFields] = useState<SearchDialogFields>({
        title: "",
        creatorId:"",
        description: "",
        locationFrom: "",
        locationTo: "",
        passengers: 0,
        price: 0,
        package: {
            weight: 0,
            size: {
                width: 0,
                height: 0,
                depth: 0,
            },
        },
        info: [],
        restrictions: [],
    });


    useEffect(() => {
        if (id) {
            getOffer(id).then((fetchedOffer) => {
                if (!fetchedOffer) {
                    createSearch(fields).then(setOffer);
                } else {
                    setOffer(fetchedOffer);
                }
            });
        }
    }, [fields, id]); 



    const handleFieldChange = (field: keyof SearchDialogFields, value: any) => {
        setFields((prev) => ({...prev, [field]: value}));
    };


    const handleDriverSubmit = () => {
        const newOffer: Offer = {
            id: "",
            title: fields.title,
            description: description,
            price: fields.price,
            locationFrom: fields.locationFrom,
            locationTo: fields.locationTo,
            driver: userId,
            createdAt: new Date(),
            isChat: isChat,
            chatId: "",
            isPhone: isPhone,
            isEmail: isEmail,
            startDateTime: startDate,
            endDateTime: endDate,
            canTransport: {
                seats: parseInt(seats),
                items: [{
                    size: {
                        width: storageWidth || 0,
                        height: storageHeight || 0,
                        depth: storageDepth || 0
                    },
                    weight: storageWeight || 0
                }]
            },
            occupiedSpace: {
                seats: 1, items: [fields.package]
            },
            passenger: offer?.passenger||[fields.creatorId],
            restrictions: fields.restrictions||restrictions||[],
            info: fields.info||info||[],
            infoCar: infoCar.split(";")||[],
            car: car,
            imageURL: ""
        };
        setShowDriverDialog(false);

        createOffer(newOffer).then(function (addedOffer) {
            if (offer) {
                offer.ended = true;
            }
            navigate(`/drives/${addedOffer.id}`);
        });
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
                <button
                    onClick={handleBack}
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
                    {fields.title || "Titel (noch leer)"}
                </h1>
                <p className="text-gray-600 mb-4">
                    {fields.description || "Keine Beschreibung"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p>
                            <strong>Von:</strong> {fields.locationFrom || "-"}
                        </p>
                        <p>
                            <strong>Nach:</strong> {fields.locationTo || "-"}
                        </p>
                        <p>
                            <strong>Preis:</strong> {fields.price} €
                        </p>
                        <p>
                            <strong>Sitze:</strong> {fields.passengers}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Infos:</strong> {fields.info || "-"}
                        </p>
                        <p>
                            <strong>Einschränkungen:</strong>{" "}
                            {fields.restrictions.join(", ") || "-"}
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold">Paketinformationen</h2>
                    <ul className="list-disc ml-5">
                        <li>
                            Größe: {fields.package.size.width}×{fields.package.size.height}×
                            {fields.package.size.depth} cm
                        </li>
                        <li>Gewicht: {fields.package.weight} kg</li>
                    </ul>
                </div>

                <div className="flex gap-4">

                    {offer && offer.passenger[0] === userId && (
                        <Button onClick={() => setShowEditDialog(true)}>Bearbeiten</Button>
                    )}


                    {offer && offer.passenger[0] !== userId && (
                        <Button onClick={() => setShowDriverDialog(true)}>
                            Als Fahrer melden
                        </Button>
                    )}
                </div>


            </div>


            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Felder bearbeiten</DialogTitle>
                        <DialogDescription>
                            Bearbeite die Informationen für dein Angebot.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Titel"
                            value={fields.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                        />
                        <Input
                            placeholder="Beschreibung"
                            value={fields.description}
                            onChange={(e) =>
                                handleFieldChange("description", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Startort"
                            value={fields.locationFrom}
                            onChange={(e) =>
                                handleFieldChange("locationFrom", e.target.value)
                            }
                        />
                        <Input
                            placeholder="Zielort"
                            value={fields.locationTo}
                            onChange={(e) => handleFieldChange("locationTo", e.target.value)}
                        />
                        <Input
                            placeholder="Anzahl Passagiere"
                            type="number"
                            value={fields.passengers}
                            onChange={(e) =>
                                handleFieldChange("passengers", Number(e.target.value))
                            }
                        />
                        <Input
                            placeholder="Preis (€)"
                            type="number"
                            value={fields.price}
                            onChange={(e) =>
                                handleFieldChange("price", Number(e.target.value))
                            }
                        />

                        <div className="font-semibold mt-2">Paketgröße & Gewicht</div>
                        <Input
                            placeholder="Breite (cm)"
                            type="number"
                            value={fields.package.size.width}
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    package: {
                                        ...prev.package,
                                        size: {
                                            ...prev.package.size,
                                            width: parseFloat(e.target.value),
                                        },
                                    },
                                }))
                            }
                        />
                        <Input
                            placeholder="Höhe (cm)"
                            type="number"
                            value={fields.package.size.height}
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    package: {
                                        ...prev.package,
                                        size: {
                                            ...prev.package.size,
                                            height: parseFloat(e.target.value),
                                        },
                                    },
                                }))
                            }
                        />
                        <Input
                            placeholder="Tiefe (cm)"
                            type="number"
                            value={fields.package.size.depth}
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    package: {
                                        ...prev.package,
                                        size: {
                                            ...prev.package.size,
                                            depth: parseFloat(e.target.value),
                                        },
                                    },
                                }))
                            }
                        />
                        <Input
                            placeholder="Gewicht (kg)"
                            type="number"
                            value={fields.package.weight}
                            onChange={(e) =>
                                setFields((prev) => ({
                                    ...prev,
                                    package: {
                                        ...prev.package,
                                        weight: parseFloat(e.target.value),
                                    },
                                }))
                            }
                        />
                        <Input
                            placeholder="Weitere Infos"
                            value={fields.info}
                            onChange={(e) => handleFieldChange("info", e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowEditDialog(false)}>Fertig</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Als Fahrer melden</DialogTitle>
                        <DialogDescription>
                            Bitte ergänze die fehlenden Angaben.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Allgemein</label>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="StartDatum"
                                    type="date"
                                    value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                    onChange={(e) => setStartDate(new Date(e.target.value))}
                                />
                                <Input
                                    placeholder="EndDatum"
                                    type="date"
                                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                                    onChange={(e) => setEndDate(new Date(e.target.value))}
                                />
                            </div>
                            <Input
                                placeholder="Sitzplätze"
                                type="number"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lagerraum von Fahrzeug (in
                                Meter)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Input
                                    placeholder="Breite"
                                    type="number"
                                    value={storageWidth ?? ""}
                                    onChange={(e) => setStorageWidth(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                                <Input
                                    placeholder="Höhe"
                                    type="number"
                                    value={storageHeight ?? ""}
                                    onChange={(e) => setStorageHeight(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                                <Input
                                    placeholder="Tiefe"
                                    type="number"
                                    value={storageDepth ?? ""}
                                    onChange={(e) => setStorageDepth(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                                <Input
                                    placeholder="Gewicht in kg"
                                    type="number"
                                    value={storageWeight ?? ""}
                                    onChange={(e) => setStorageWeight(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                            </div>
                        </div>


                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={isPhone}
                                       onChange={(e) => setIsPhone(e.target.checked)}/>
                                Handy
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={isEmail}
                                       onChange={(e) => setIsEmail(e.target.checked)}/>
                                E-Mail
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={isChat} onChange={(e) => setIsChat(e.target.checked)}/>
                                Chat
                            </label>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Textarea
                                placeholder="Beschreibung"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Textarea
                                placeholder="Infos/Hinweise (Einzelne Hinweise mit ; trennen)"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                            />
                            <Textarea
                                placeholder="Einschränkungen (Einzelne Einschränkungen mit ; trennen)"
                                value={restrictions}
                                onChange={(e) => setRestrictions(e.target.value)}
                            />
                            <Textarea
                                placeholder="Infos über Fahrzeug/Anhänger (Einzelne Infos mit ; trennen)"
                                value={infoCar}
                                onChange={(e) => setInfoCar(e.target.value)}
                            />
                        </div>

                        <Select onValueChange={(value) => setCar(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Fahrzeug auswählen"/>
                            </SelectTrigger>
                            <SelectContent>
                                {["Audi", "Mazda", "Mercedes Benz"].map((count) => (
                                    <SelectItem key={count} value={count}>
                                        {count}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleDriverSubmit}>Speichern</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DrivesSearchDetailPage;
