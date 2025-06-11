import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Offer {
  id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
  bookedBy?: string;
}

export default function Chats() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // Mock user
  const userId = "me";
  // Mock offers (drives)
  const offers: Offer[] = [
    {
      id: "1",
      title: "Express Delivery",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60",
      createdBy: "me",
      bookedBy: "user2",
    },
    {
      id: "2",
      title: "Standard Transport",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
      createdBy: "user2",
      bookedBy: "me",
    },
    {
      id: "3",
      title: "Heavy Cargo Transport",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60",
      createdBy: "me",
      bookedBy: "user3",
    },
    {
      id: "4",
      title: "Overnight Parcel",
      imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&auto=format&fit=crop&q=60",
      createdBy: "user4",
      bookedBy: "me",
    },
    {
      id: "5",
      title: "Furniture Move",
      imageUrl: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?w=800&auto=format&fit=crop&q=60",
      createdBy: "me",
      bookedBy: "user5",
    },
    {
      id: "6",
      title: "Bike Courier",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60",
      createdBy: "user6",
      bookedBy: "me",
    },
    {
      id: "7",
      title: "International Freight",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
      createdBy: "me",
      bookedBy: "user7",
    },
    {
      id: "8",
      title: "City-to-City Ride",
      imageUrl: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&auto=format&fit=crop&q=60",
      createdBy: "user8",
      bookedBy: "me",
    },
  ];
  // Filter drives where user is creator or participant
  const relevantDrives = offers.filter(
    (offer) => offer.createdBy === userId || offer.bookedBy === userId
  );
  const filteredDrives = relevantDrives.filter((drive) =>
    drive.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-green-800">Meine Fahrten</h1>
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Fahrt suchen..."
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all bg-white"
          />
        </div>
        {filteredDrives.length === 0 ? (
          <div className="text-center text-green-700">Keine Fahrten gefunden.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDrives.map((drive) => (
              <Card key={drive.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white border border-green-200">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-2xl font-semibold text-green-900">
                    {drive.title}
                  </CardTitle>
                </CardHeader>
                <div className="px-6">
                  <img
                    src={drive.imageUrl}
                    alt={drive.title}
                    className="w-full h-52 object-cover rounded-xl shadow-sm border border-green-100"
                  />
                </div>
                <CardContent className="flex-1 p-6 pt-4">
                  {/* Optionally add more drive details here */}
                </CardContent>
                <CardFooter className="p-6 border-t bg-green-50">
                  <Button
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-medium border border-green-700"
                    onClick={() => navigate(`/chat/${drive.id}`)}
                  >
                    Chat anzeigen
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 