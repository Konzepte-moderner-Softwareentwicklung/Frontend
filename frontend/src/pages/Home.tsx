import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 via-gray-50 to-white py-12">
      <div className="container mx-auto text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 leading-tight mb-6 animate-fade-in">
          Deine Fracht, Unsere Fahrt.
        </h1>
        <p className="text-xl text-green-700 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-delay-1">
          Finde schnell und einfach Transportangebote, die zu deinen Bedürfnissen passen, 
          oder biete selbst Fahrten an, um ungenutzten Platz zu füllen.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
          <Link to="/offers">
            <Button className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors text-lg font-semibold shadow-lg">
              Angebote finden
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="outline"
              className="bg-white text-green-700 border-2 border-green-300 px-8 py-3 rounded-lg hover:bg-green-50 hover:border-green-600 transition-colors text-lg font-semibold shadow-md"
            >
              Jetzt registrieren
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 