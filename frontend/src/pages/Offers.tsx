import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  locationFrom: string;
  locationTo: string;
  distance: number;
  itemType: string;
  weight: number;
  availableDate: string;
  fromDeviation: number;  // Distance in km from the exact location
  toDeviation: number;    // Distance in km from the exact location
}

export default function Offers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [fromDeviation, setFromDeviation] = useState("");
  const [toDeviation, setToDeviation] = useState("");
  const [distanceFrom, setDistanceFrom] = useState("");
  const [distanceTo, setDistanceTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "distance-asc" | "distance-desc">("price-asc");

  // Mock data for demonstration
  const offers: Offer[] = [
    {
      id: "1",
      title: "Express Delivery",
      price: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60",
      description: "Fast and reliable delivery service",
      locationFrom: "New York",
      locationTo: "Boston",
      distance: 350,
      itemType: "Electronics",
      weight: 5,
      availableDate: "2024-03-20",
      fromDeviation: 10,
      toDeviation: 15,
    },
    {
      id: "2",
      title: "Standard Transport",
      price: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
      description: "Regular delivery service for your items",
      locationFrom: "Los Angeles",
      locationTo: "San Francisco",
      distance: 560,
      itemType: "Furniture",
      weight: 25,
      availableDate: "2024-03-22",
      fromDeviation: 20,
      toDeviation: 25,
    },
    {
      id: "3",
      title: "Heavy Cargo Transport",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60",
      description: "Specialized transport for heavy items",
      locationFrom: "Chicago",
      locationTo: "Detroit",
      distance: 450,
      itemType: "Industrial Equipment",
      weight: 100,
      availableDate: "2024-03-25",
      fromDeviation: 15,
      toDeviation: 20,
    },
    {
      id: "4",
      title: "Small Package Delivery",
      price: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
      description: "Perfect for small packages and documents",
      locationFrom: "Miami",
      locationTo: "Orlando",
      distance: 280,
      itemType: "Documents",
      weight: 1,
      availableDate: "2024-03-21",
      fromDeviation: 5,
      toDeviation: 10,
    },
  ];

  const handleSelectOffer = (offerId: string) => {
    navigate(`/offers/${offerId}`);
  };

  const filteredOffers = offers
    .filter((offer) => {
      const matchesSearch = 
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.itemType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocationFrom = !locationFrom || 
        offer.locationFrom.toLowerCase().includes(locationFrom.toLowerCase());
      
      const matchesLocationTo = !locationTo || 
        offer.locationTo.toLowerCase().includes(locationTo.toLowerCase());
      
      const matchesFromDeviation = !fromDeviation || 
        offer.fromDeviation <= Number(fromDeviation);
      
      const matchesToDeviation = !toDeviation || 
        offer.toDeviation <= Number(toDeviation);
      
      const matchesDistance = 
        (!distanceFrom || offer.distance >= Number(distanceFrom)) &&
        (!distanceTo || offer.distance <= Number(distanceTo));
      
      const matchesPrice = 
        (!priceFrom || offer.price >= Number(priceFrom)) &&
        (!priceTo || offer.price <= Number(priceTo));

      return matchesSearch && matchesLocationFrom && matchesLocationTo && 
             matchesFromDeviation && matchesToDeviation && matchesDistance && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "distance-asc":
          return a.distance - b.distance;
        case "distance-desc":
          return b.distance - a.distance;
        default:
          return 0;
      }
    });

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocationFrom("");
    setLocationTo("");
    setFromDeviation("");
    setToDeviation("");
    setDistanceFrom("");
    setDistanceTo("");
    setPriceFrom("");
    setPriceTo("");
    setSortBy("price-asc");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12 text-center text-green-800">Transportation Offers</h1>
        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {/* Main Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, description, or item type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all bg-white"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location From */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-700">
                From Location
              </label>
              <input
                type="text"
                placeholder="Enter starting location..."
                value={locationFrom}
                onChange={(e) => setLocationFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Max deviation (km)"
                  value={fromDeviation}
                  onChange={(e) => setFromDeviation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-green-500">Maximum distance from pickup location</p>
            </div>

            {/* Location To */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-700">
                To Location
              </label>
              <input
                type="text"
                placeholder="Enter destination..."
                value={locationTo}
                onChange={(e) => setLocationTo(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Max deviation (km)"
                  value={toDeviation}
                  onChange={(e) => setToDeviation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-green-500">Maximum distance from delivery location</p>
            </div>

            {/* Distance Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-700">
                Route Distance (km)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min distance"
                  value={distanceFrom}
                  onChange={(e) => setDistanceFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max distance"
                  value={distanceTo}
                  onChange={(e) => setDistanceTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-green-500">Distance between pickup and delivery locations</p>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-700">
                Price Range ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="distance-asc">Distance: Near to Far</option>
                <option value="distance-desc">Distance: Far to Near</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                onClick={handleClearFilters}
                className="w-full bg-green-100 text-green-700 hover:bg-green-200"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-green-700 text-center mb-8">
          {filteredOffers.length} {filteredOffers.length === 1 ? 'transport offer' : 'transport offers'} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white border border-green-200">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-2xl font-semibold text-green-900">
                  {offer.title}
                </CardTitle>
              </CardHeader>
              <div className="px-6">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-52 object-cover rounded-xl shadow-sm border border-green-100"
                />
              </div>
              <CardContent className="flex-1 p-6 pt-4">
                <p className="text-green-800 text-lg leading-relaxed">
                  {offer.description}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-green-900">
                    <span className="font-medium">From:</span> {offer.locationFrom}
                    <span className="text-sm text-green-600 ml-1">(±{offer.fromDeviation} km)</span>
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">To:</span> {offer.locationTo}
                    <span className="text-sm text-green-600 ml-1">(±{offer.toDeviation} km)</span>
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">Route Distance:</span> {offer.distance} km
                    <span className="text-sm text-green-600 ml-1">(from {offer.locationFrom} to {offer.locationTo})</span>
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">Item Type:</span> {offer.itemType}
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">Weight:</span> {offer.weight} kg
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">Available:</span> {new Date(offer.availableDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-6 border-t bg-green-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 w-full">
                  <div>
                    <span className="text-3xl font-bold text-green-700">
                      ${offer.price}
                    </span>
                    <span className="text-green-500 text-sm ml-1">/delivery</span>
                  </div>
                  <Button
                    onClick={() => handleSelectOffer(offer.id)}
                    className="bg-green-700 text-white px-6 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-base font-medium border border-green-700 w-full md:w-auto"
                  >
                    Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-green-700 text-lg">No transport offers found matching your criteria.</p>
            <Button
              onClick={handleClearFilters}
              className="mt-4 bg-green-700 text-white px-6 py-2.5 rounded-lg hover:bg-green-800 transition-colors"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 