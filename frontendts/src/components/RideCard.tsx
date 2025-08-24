

interface RideCardProps {
    locationFrom: { latitude: number; longitude: number };
    locationTo: { latitude: number; longitude: number };
    from: string;
    to: string;
    price: number;
    startDateTime: string;
    endDateTime: string;
}

export default function RideCard({
                                     from,
                                     to,
                                     price,
                                     startDateTime,
                                     endDateTime,
                                 }: RideCardProps) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const startFormatted = start.toLocaleString("de-DE", options);
    const endFormatted = end.toLocaleString("de-DE", options);

    return (
        <div className="bg-white p-4 rounded shadow w-60 h-80 transition-transform duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
            <div className="h-32 bg-gray-100 rounded mb-2" />
            <p className="text-sm font-medium">{from} → {to}</p>
            <p className="font-bold">{price} Euro</p>
            <p className="font-bold">Start: {startFormatted}</p>
            <p className="font-bold">Ende: {endFormatted}</p>
        </div>
    );
}