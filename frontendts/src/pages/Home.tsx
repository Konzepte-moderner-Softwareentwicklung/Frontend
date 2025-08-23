import Hero from "../components/Hero.js";
import { useState, useEffect } from "react";
import { searchOffersByFilter } from "@/api/offers_api.tsx";
import OfferWrapper from "@/components/OfferWrapper.tsx";

function Home() {
    const [loading, setLoading] = useState(true);
    const [rides, setRides] = useState([]);

    useEffect(() => {
        async function fetchRides() {
            try {
                const res = await searchOffersByFilter({});
                setRides(res);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }
        fetchRides();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-cyan-100">
                <Hero />

                {loading && <p className="text-center mt-10">Lade Fahrten...</p>}

                {!loading && rides.length === 0  && (
                    <p className="text-center mt-10 text-gray-600">
                        Aktuell gibt es keine Fahrten.
                    </p>
                )}
                {!loading &&rides.length > 0&& (
                <p className="text-center mt-10 text-gray-600">
                    Aktuelle Fahrten:
                </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-35 py-10 max-w-screen-2xl mx-auto">
                    {rides.slice(0,5).map((ride, i) => (
                        <OfferWrapper key={i} {...ride} />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Home;
