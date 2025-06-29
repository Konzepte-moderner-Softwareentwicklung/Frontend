import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

import {useNavigate} from 'react-router-dom';
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "../../components/ui/pagination.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {Input} from "../../components/ui/input.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {
    createNewOffer, fetchOffersWithFilter,
    type clientFilter,
    getMaxPrice,
    type Offer, type Space, setLocationName, type ServerFilter, getLocationName
} from "@/pages/drives/drivesService.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {DriveDetailCard} from "@/components/drives/DriveDetailCard.tsx";


function getServerFilter() {
    const serverFilter: ServerFilter = {
        currentTime: "",
        dateTime: "",
        id: "",
        includePassed: false,
        locationFrom: undefined,
        locationFromDiff: 0,
        locationTo: undefined,
        locationToDiff: 0,
        nameStartsWith: "",
        price: 0,
        spaceNeeded: undefined,
        user: ""
    }
}

function getClientFilter() {

}

function Drives() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState<clientFilter | undefined>(undefined);
    const maxOfferPrice = getMaxPrice();
    const [maxPrice, setMaxPrice] = useState([100]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [info, setInfo] = useState("");
    const [infoCar, setInfoCar] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [canTransport, setCanTransport] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [toLocation, setToLocation] = useState("");
    const [price, setPrice] = useState("");
    const [restrictions, setRestrictions] = useState("");
    const [storageWidth, setStorageWidth] = useState<number | null>(null);
    const [isChat, setIsChat] = useState(false);
    const [isPhone, setIsPhone] = useState<boolean>(false);
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [storageDepth, setStorageDepth] = useState<number | null>(null);
    const [storageWeight, setStorageWeight] = useState<number | null>(null);
    const [storageHeight, setStorageHeight] = useState<number | null>(null);
    const numericPrice = parseFloat(price);

    const seats: Space = {
        occupiedBy: sessionStorage.getItem("UserID") || "",
        seats: parseInt(canTransport),
        items: [
            {
                weight: storageWeight ?? 0,
                size: {
                    width: storageWidth ?? 0,
                    height: storageHeight ?? 0,
                    depth: storageDepth ?? 0
                }
            }
        ]
    };

    async function createOffer() {
        const [locationFrom, locationTo] = await Promise.all([
            setLocationName(fromLocation),
            setLocationName(toLocation)
        ]);


        const offerData: Offer = {
            title: title,
            creator: sessionStorage.getItem("UserID") || "",
            paidSpaces: [],
            description: description,
            price: numericPrice,
            locationFrom: locationFrom || {latitude: 0, longitude: 0},
            locationTo: locationTo || {latitude: 0, longitude: 0},
            driver: sessionStorage.getItem("UserID") || "",
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
            canTransport: seats,
            occupiedSpace: [],
            isPhone: isPhone,
            isEmail: isEmail,
            isChat: isChat,
            isGesuch: false,
            restrictions: restrictions.split(";"),
            info: info.split(";"),
            infoCar: infoCar.split(";"),
            createdAt: new Date().toISOString(),
            imageURL: ""
        };


        createNewOffer(offerData).then(function (offer) {
            if (offer)
                navigate(`/drives/${offer.id}`);

        });
    }

    const createNewSearch = () => {
       // const userId = sessionStorage.getItem("UserID") || "";
        // const offerData: SearchDialogFields = {
        //     title: title,
        //     description: description,
        //     price: numericPrice,
        //     creatorId: userId,
        //     locationFrom: fromLocation,
        //     locationTo: toLocation,
        //     passengers: seats.seats,
        //     package: seats.items[0],
        //     restrictions: restrictions.split(";"),
        //     info: info.split(";"),
        // };


        const offerData: Offer = {
            title: title,
            creator: sessionStorage.getItem("UserID") || "",
            paidSpaces: [],
            description: description,
            price: numericPrice,
            locationFrom:  {latitude: 0, longitude: 0},
            locationTo:  {latitude: 0, longitude: 0},
            driver: sessionStorage.getItem("UserID") || "",
            startDateTime: new Date(new Date().setFullYear(new Date().getFullYear() + 50)).toISOString(),
            endDateTime: new Date(new Date().setFullYear(new Date().getFullYear() + 50)).toISOString(),
            canTransport: seats,
            occupiedSpace: [ seats],
            isPhone: isPhone,
            isEmail: isEmail,
            isChat: isChat,
            isGesuch: true,
            restrictions: restrictions.split(";"),
            info: info.split(";"),
            infoCar: infoCar.split(";"),
            createdAt: new Date().toISOString(),
            imageURL: ""
        };
        createNewOffer(offerData).then(function (offer) {
            if (offer)
                navigate(`/drives/${offer.id}/search`);
        });
    };


    const totalPages = Math.ceil((offers?.length || 1) / entriesPerPage);
    const navigate = useNavigate();

    const paginatedOffers = offers?.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    ) || [];

    useEffect(() => {
        async function loadOffers() {
            try {
                const serverFilter = getServerFilter();
                const clientFilter = getClientFilter();
                const data = await fetchOffersWithFilter(serverFilter,clientFilter);
                setOffers(data);

                setCurrentPage(1);
            } catch (error) {
                console.error("Fehler beim Laden der Angebote:", error);
            }
        }

        loadOffers().then();
    }, [filter]);

    const isLoggedIn = sessionStorage.getItem("token") != null;


    return (
        <div className="bg-cyan-100 min-h-screen p-6">

            <section className="bg-white p-6 rounded-2xl shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-1">Von</label>
                        <Input
                            placeholder="Ort"
                            onChange={(e) => setFilter((prev) => ({...prev, locationFrom: e.target.value}))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Bis</label>
                        <Input
                            placeholder="Ort"
                            onChange={(e) => setFilter((prev) => ({...prev, locationTo: e.target.value}))}
                        />
                    </div>
                    <div>
                        <label className="flex text-sm mb-1">Datum</label>
                        <Input
                            type="date"
                            onChange={(e) => setFilter((prev) => ({...prev, dateTime: e.target.value}))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Anzeigen</label>
                        <select
                            className="border rounded px-3 py-2 w-full"
                            value={"beides"}
                            onChange={(e) =>
                                setFilter((prev) => ({
                                    ...prev,
                                    type: e.target.value as "angebote" | "gesuche" | "beides",
                                }))
                            }
                        >
                            <option value="beides">Angebote und Gesuche</option>
                            <option value="angebote">Nur Angebote</option>
                            <option value="gesuche">Nur Gesuche</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 mt-6 md:mt-0">
                        <input
                            type="checkbox"
                            id="ownTrips"
                            className="w-4 h-4"
                            onChange={(e) =>
                                setFilter((prev) => ({
                                    ...prev,
                                    onlyOwn: e.target.checked,
                                }))
                            }
                        />
                        <label htmlFor="ownTrips" className="text-sm">
                            Eigene Fahrten anzeigen
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Freie Plätze</label>
                        <Input
                            placeholder="z.B. 3"
                            type="number"
                            onChange={(e) => setFilter((prev) => ({
                                ...prev,
                                freeSpace: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Bewertungen</label>
                        <Input
                            placeholder="z.B.  4.5"
                            type="number"
                            step="0.1"
                            onChange={(e) => setFilter((prev) => ({
                                ...prev,
                                rating: e.target.value ? parseFloat(e.target.value) : undefined
                            }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Max. Gewicht</label>
                        <Input
                            placeholder="in kg"
                            type="number"
                            onChange={(e) => setFilter((prev) => ({
                                ...prev,
                                maxWeight: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Preis :{maxPrice[0]}</label>
                        <Slider
                            defaultValue={[100]}
                            max={maxOfferPrice}
                            step={1}
                            onValueChange={(value) => {
                                setMaxPrice(value)
                                setFilter((prev) => ({
                                    ...prev,
                                    maxPrice: value[0]
                                }))
                            }
                            }
                        />
                    </div>
                </div>


            </section>


            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {offers?.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">
                        Keine Angebote und Gesuche vorhanden.
                    </p>
                ) : (
                    paginatedOffers.map((offer: Offer) => (
                        <DriveDetailCard key={offer.id} offer={offer} />
                    ))
                )}
            </section>



            <div className="flex justify-between items-center mt-6">
                <Pagination className="list-none cursor-pointer">
                    <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    >
                        Previous
                    </PaginationPrevious>

                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationNext
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    >
                        Next
                    </PaginationNext>
                </Pagination>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={!isLoggedIn}
                                className="bg-green-600 cursor-pointer hover:bg-green-700 text-white  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                            Fahrt erstellen
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[1000px]">
                        <DialogHeader>
                            <DialogTitle>Neue Fahrt erstellen</DialogTitle>
                            <DialogDescription>
                                Fülle die Informationen aus, um eine neue Fahrt anzulegen.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allgemein</label>
                                <Input
                                    placeholder="Titel"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Von Ort"
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Nach Ort"
                                        value={toLocation}
                                        onChange={(e) => setToLocation(e.target.value)}
                                    />
                                </div>
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
                                    value={canTransport}
                                    onChange={(e) => setCanTransport(e.target.value)}
                                />
                                <Input
                                    placeholder="Preis pro Person in €"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lagerraum von Fahrzeug
                                    (in Meter)</label>
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
                                    <input type="checkbox" checked={isChat}
                                           onChange={(e) => setIsChat(e.target.checked)}/>
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
                        </div>

                        <DialogFooter>
                            <Button onClick={createOffer} type="submit">
                                Erstellen
                            </Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>


                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            disabled={!isLoggedIn}
                            className="ml-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            Gesuch erstellen
                        </Button>
                    </DialogTrigger>


                    <DialogContent className="sm:max-w-[800px] sm:max-h-[1000px] scroll">
                        <DialogHeader>
                            <DialogTitle>Neues Gesuch erstellen</DialogTitle>
                            <DialogDescription>
                                Fülle die Informationen aus, um eine neue Suche anzulegen.
                            </DialogDescription>
                        </DialogHeader>


                        <div className="grid gap-4 py-4">
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allgemein</label>
                                <Input
                                    placeholder="Titel"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Von Ort"
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Nach Ort"
                                        value={toLocation}
                                        onChange={(e) => setToLocation(e.target.value)}
                                    />
                                </div>
                                <Input
                                    placeholder="Mitfahrer (mindestens 1)"
                                    type="number"
                                    value={canTransport}
                                    onChange={(e) => setCanTransport(e.target.value)}
                                />
                                <Input
                                    placeholder="Wunschpreis pro Person in €"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gepäck
                                    (in Meter)</label>
                                <div className="grid grid-cols-2 gap-4">

                                    <Input
                                        placeholder="Breite"
                                        type="number"
                                        value={storageWidth ?? ""}
                                        onChange={(e) => setStorageWidth(parseInt(e.target.value))}
                                    />
                                    <Input
                                        placeholder="Höhe"
                                        type="number"
                                        value={storageHeight ?? ""}
                                        onChange={(e) => setStorageHeight(parseInt(e.target.value))}
                                    />
                                    <Input
                                        placeholder="Gewicht in kg"
                                        type="number"
                                        value={storageWeight ?? ""}
                                        onChange={(e) => setStorageWeight(parseInt(e.target.value))}
                                    />
                                    <Input
                                        placeholder="Tiefe"
                                        type="number"
                                        value={storageDepth ?? ""}
                                        onChange={(e) => setStorageDepth(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <Textarea
                                placeholder="Beschreibung"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Textarea
                                placeholder="Infos/Hinweise(Einzelne Hinweise mit ; trennen)"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                            />
                            <Textarea
                                placeholder="Einschränkungen(Einzelne Einschränkungen mit ; trennen)"
                                value={restrictions}
                                onChange={(e) => setRestrictions(e.target.value)}
                            />


                        </div>


                        <DialogFooter>
                            <Button onClick={createNewSearch} className="cursor-pointer"
                                    type="submit">Erstellen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>

            <div className="flex justify-end mb-4">
                <div className="w-48">
                    <label className="block text-sm text-gray-600 mb-1">Anzahl pro Seite</label>
                    <Select
                        value={entriesPerPage.toString()}
                        onValueChange={(value) => setEntriesPerPage(Number(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Einträge wählen"/>
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 15, 20].map((count) => (
                                <SelectItem key={count} value={count.toString()}>
                                    {count} Einträge
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

    );
}


export default Drives;
