import {Button} from "@/components/ui/button.tsx";
import { Card, CardContent } from "../ui/card";
import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "../ui/pagination";
import { Input } from "../ui/input";
import {Slider} from "@/components/ui/slider.tsx";

function Drives(){
//TODO:Input Felder Logik implementieren
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
                {[...Array(5)].map((_, i) => ( //TODO: LImit auf 10-20 Begrenzen
                    <Card key={i} className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <div className="bg-gray-200 h-32 rounded mb-4" />
                            <p className="font-medium">Köln → Rotterdam</p>
                            <p className="font-bold">15 Euro</p>
                            <p className="text-sm text-gray-600">4.7 Sterne (12 Bewertungen)</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className="flex justify-between items-center">
                <Pagination className="list-none">
                    <PaginationPrevious>Previous</PaginationPrevious>
                    <PaginationItem key={1}>
                        <PaginationLink>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem key={2}>
                        <PaginationLink>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem key={3}>
                        <PaginationLink>3</PaginationLink>
                    </PaginationItem>
                    <PaginationEllipsis />
                    <PaginationItem key={10}>
                        <PaginationLink>10</PaginationLink>
                    </PaginationItem>
                    <PaginationNext>Next</PaginationNext>
                </Pagination>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Fahrt erstellen</Button>
            </div>
        </div>
    )
} //TODO: API einbinden und Seite zum erstellen neuer Drives machen
export default Drives;