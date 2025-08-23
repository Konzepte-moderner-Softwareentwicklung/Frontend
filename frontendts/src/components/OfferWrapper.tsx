// components/OfferWrapper.tsx
import { useState, useEffect } from "react";
import {getLocationByCoordinates, type Offer} from "@/pages/drives/drivesService.tsx";
import RideCard from "@/components/RideCard.tsx";

export default function OfferWrapper(offer:Offer) {
    const [locations, setLocations] = useState<{ from: string; to: string } | null>(null);

    function fetchLocationsForOffer(offer2: Offer) {
        const { locationFrom, locationTo } = offer2;
        const fromPromise = getLocationByCoordinates(locationFrom.latitude, locationFrom.longitude);
        const toPromise = getLocationByCoordinates(locationTo.latitude, locationTo.longitude);
        return Promise.all([fromPromise, toPromise]);
    }

    useEffect(() => {
        fetchLocationsForOffer(offer).then(([from, to]) => {
            setLocations({ from, to });
        });
    }, [offer]);

    if (!locations) {
        return <div>Loading...</div>;
    }

    return (
        <RideCard
            locationFrom={offer.locationFrom}
            locationTo={offer.locationTo}
            from={locations.from}
            to={locations.to}
            price={offer.price}
            startDateTime={offer.startDateTime}
            endDateTime={offer.endDateTime}
        />
    );
}