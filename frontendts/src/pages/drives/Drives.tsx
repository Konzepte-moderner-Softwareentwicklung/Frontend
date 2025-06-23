import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { useNavigate } from 'react-router-dom';
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

import { Input } from "../../components/ui/input.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
    createOffer,
    fetchOffers,
    fetchOffersWithFilter,
    type Filter,
    getMaxPrice,
    type Offer, type OfferMessage, type Space
} from "@/pages/drives/drivesService.tsx";

function Drives() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filter, setFilter] = useState<Filter | undefined>(undefined);
    const maxOfferPrice = getMaxPrice();
    const [maxPrice, setMaxPrice] = useState([100]);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [canTransport, setCanTransport] = useState( "");
    const [endDate, setEndDate] = useState(new Date());
    const [toLocation, setToLocation] = useState("");
    const [price, setPrice] = useState("");

    const numericPrice = parseFloat(price);
    const seats = {seats:parseInt(canTransport),items:[]} as Space ;
    const createNewOffer = () => {
        const offerData: OfferMessage = {
            title: title,
            description: description,
            price: numericPrice,
            locationFrom: fromLocation,
            locationTo: toLocation,
            creator: "user",
            startDateTime: startDate,
            endDateTime: endDate,
            canTransport: seats,
            occupied: false,
            occupiedBy: [],
            restrictions: [],
            info: [],
            infoCar: []
        };

        createOffer(offerData).then();
    };



    const totalPages = Math.ceil(offers.length / entriesPerPage);
    const navigate = useNavigate();

    const paginatedOffers = offers.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    useEffect(() => {
        async function loadOffers() {
            try {
                const data = filter
                    ? await fetchOffersWithFilter(filter)
                    : await fetchOffers();
                setOffers(data);

                setCurrentPage(1);
            } catch (error) {
                console.error("Fehler beim Laden der Angebote:", error);
            }
        }

        loadOffers();
    }, [filter]);

    return (
        <div className="bg-cyan-100 min-h-screen p-6">

            <section className="bg-white p-6 rounded-2xl shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-1">Von</label>
                        <Input
                            placeholder="Ort"
                            onChange={(e) => setFilter((prev) => ({ ...prev, locationFrom: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Bis</label>
                        <Input
                            placeholder="Ort"
                            onChange={(e) => setFilter((prev) => ({ ...prev, locationTo: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Datum</label>
                        <Input
                            type="date"
                            onChange={(e) => setFilter((prev) => ({ ...prev, date: e.target.value }))}
                        />
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
                            onValueChange={(value) =>{
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
                {offers.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">Keine Angebote gefunden.</p>
                ) : (
                    paginatedOffers.map((offer) => (
                        <Card key={offer.id} className="rounded-2xl shadow"  onClick={()=>navigate(`/drives/${offer.id}`)}>
                            <CardContent className="p-4">
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
                                    {offer.locationFrom} → {offer.locationTo}
                                </p>

                                <p className="font-bold">{offer.price} Euro</p>

                            </CardContent>
                        </Card>

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
                        <Button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white">
                            Fahrt erstellen
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Neue Fahrt erstellen</DialogTitle>
                            <DialogDescription>
                                Fülle die Informationen aus, um eine neue Fahrt anzulegen.
                            </DialogDescription>
                        </DialogHeader>


                        <div className="grid gap-4 py-4">
                            <Input
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
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
                            <Input
                                placeholder="StartDatum"
                                type="date"
                                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                            <Input
                                placeholder="EndDatum"
                                type="date"
                                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                            <Input
                                placeholder="Anzahl Passagiere"
                                type="number"
                                value={description}
                                onChange={(e) => setCanTransport(e.target.value)}
                            />
                            <Input
                                placeholder="Preis in €"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <Input
                                placeholder="Beschreibung"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                        </div>


                        <DialogFooter>
                            <Button  onClick={createNewOffer} className="cursor-pointer" type="submit">Erstellen</Button>
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
                            <SelectValue placeholder="Einträge wählen" />
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
