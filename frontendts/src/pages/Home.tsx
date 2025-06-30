import Hero from "../components/Hero.js";

function Home() {


    return (
        <div className="flex flex-col min-h-screen">

            <main className="flex-grow bg-cyan-100">
                <Hero />
            </main>

        </div>
    );
}

export default Home;
