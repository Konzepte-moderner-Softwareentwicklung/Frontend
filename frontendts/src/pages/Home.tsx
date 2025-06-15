import Navbar from "../components/navbar.tsx";
import Hero from "../components/Hero.js";
import Footer from "../components/footer.tsx";
import RideCard from "../components/RideCard.tsx";

function Home() {
    const rides = [
        { from: "München", to: "Madrid", price: 40, rating: 4.7, reviews: 12 },
        { from: "Berlin", to: "Amsterdam", price: 12, rating: 4.6, reviews: 12 },
        { from: "Gießen", to: "Ingolstadt", price: 5, rating: 4.2, reviews: 12 },
        { from: "Köln", to: "Rotterdam", price: 15, rating: 4.7, reviews: 12 },
        { from: "Frankfurt", to: "Gießen", price: 2, rating: 4.1, reviews: 112 },

    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow bg-cyan-100">
                <Hero />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-35 py-10 max-w-screen-2xl mx-auto">
                    {rides.map((ride, i) => (
                        <RideCard key={i} {...ride} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
