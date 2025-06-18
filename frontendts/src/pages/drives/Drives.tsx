import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
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

import { Input } from "../../components/ui/input.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { fetchOffers, type Offer } from "@/pages/drives/drivesService.tsx";

function Drives() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(offers.length / entriesPerPage);


    const paginatedOffers = offers.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    useEffect(() => {
        async function loadOffers() {
            try {
                const data = await fetchOffers();
                setOffers(data);
            } catch (error) {
                console.error("Fehler beim Laden der Angebote:", error);
            }
        }

        loadOffers();
    }, []);

    return (
        <div className="bg-cyan-100 min-h-screen p-6">
            <section className="bg-white p-6 rounded-2xl shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input placeholder="von: Ort" />
                    <Input placeholder="bis: Ort" />
                    <Input placeholder="Datum" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input placeholder="freie Plätze" />
                    <Input placeholder="Bewertungen" />
                    <Input placeholder="Gewicht" />
                    <div>
                        <label className="block text-sm mb-1">Preis</label>
                        <Slider defaultValue={[100]} max={100} step={1} />
                    </div>
                </div>
            </section>


            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {offers.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">Keine Angebote gefunden.</p>
                ) : (
                    paginatedOffers.map((offer) => (
                        <Card key={offer.id} className="rounded-2xl shadow">
                            <CardContent className="p-4">
                                <div className="bg-gray-200 h-32 rounded mb-4">
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
                <Pagination className="list-none">
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

                <Button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white">
                    Fahrt erstellen
                </Button>
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
