export default function RideCard({ from, to, price, rating, reviews }) {
  return (
      <div className="bg-white p-4 rounded shadow w-60 h-80 transition-transform duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="h-32 bg-gray-100 rounded mb-2" />
          <p className="text-sm font-medium">{from} → {to}</p>
          <p className="font-bold">{price} Euro</p>
          <p className="text-xs text-gray-500">{rating} Sterne ({reviews} Bewertungen)</p>
      </div>
  );
}
