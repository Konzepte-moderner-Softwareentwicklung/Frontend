import {
    createOffer,
    getOfferDetails,
    occupyOffer,
    payOffer,
    postRating,
    searchOffersByFilter
} from "@/api/offers_api.tsx";
import toast from "react-hot-toast";
import {uploadPictureForCompound} from "@/api/media_api.tsx";
import {getUserByID} from "@/api/user_api.tsx";

export interface Coordinates {
    longitude: number;
    latitude: number;
}

export interface userFeedback {

    answers: [content: string, value: number];
    comment: string;
    targetId: string;
    userId: string | null

}

export const DEFAULT_OFFER: Offer = {
    id: '',
    title: '',
    description: '',
    price: 0,
    locationFrom: {latitude: 0, longitude: 0},
    locationTo: {latitude: 0, longitude: 0},
    driver: '',
    createdAt: new Date().toISOString(),
    isChat: false,
    chatId: '',
    isPhone: false,
    isEmail: false,
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    canTransport: {
        items: [], seats: 0,
        occupiedBy: ""
    },
    occupiedSpace: [],
    restrictions: [],
    info: [],
    infoCar: [],
    imageURL: '',
    isGesuch: false,
    ended: false,
    creator: ""
};


interface LocationCache {
    city: string;
    coordinates: Coordinates;
}

export interface Offer {
    id?: string;
    title: string;
    description: string;
    price: number;
    locationFrom: Coordinates;
    locationTo: Coordinates;
    creator: string;
    driver: string;
    createdAt: string; // ISO-String!
    isChat: boolean;
    chatId?: string;
    isPhone: boolean;
    isEmail: boolean;
    startDateTime: string; // ISO-String!
    endDateTime: string;   // ISO-String!
    canTransport: Space;
    paidSpaces?: Space[];
    occupiedSpace: Space[],
    restrictions?: string[] | null;
    info?: string[] | null;
    infoCar?: string[] | null;
    imageURL: string;
    isGesuch?: boolean;
    ended?: boolean;
}

export interface SearchDialogFields {
    title: string;
    description: string;
    creatorId: string;
    locationFrom: string;
    locationTo: string;
    passengers: number;
    price: number;
    package: Item;
    info: string[];
    restrictions: string[];
}


export interface serverFilter {
    maxPrice?: number;
    includePassed?: boolean;
    dateTime?: string;
    nameStartsWith?: string;
    freeSpace?: number;
    locationFrom?: Coordinates | string | number;
    locationTo?: Coordinates | string | number;
    locationFromDiff?: number;
    locationToDiff?: number;
    user?: string;
    creator?: string;
    currentTime?: string;
    id?: string;
}


export interface clientFilter {
    type?: "angebote" | "gesuche" | "beides";
    maxWeight?: number;
}

export type filterMessage = serverFilter & clientFilter;

export interface Space {
    occupiedBy: string,
    items: Item[];
    seats: number;
}

export interface Item {
    size: Size;
    weight: number;
}

export interface Size {
    width: number;
    height: number;
    depth: number;
}


export let offers: Offer[] = [];
export const archivedOffers: Offer[] = [];


const unifiedLocationCache: LocationCache[] = [];


let isRateLimited = false;


export async function getOffer(id: string | undefined): Promise<Offer | undefined> {
    let foundOffer;

    if (foundOffer == undefined) {
        await getOfferDetails(id || "").then(offer => foundOffer = offer);
    }
    return foundOffer;

}

export function getMaxPrice(): number {
    let price = 0;
    offers?.forEach((offer: Offer) => {
        if (offer.price > price) {
            price = offer.price;
        }
    })
    return price;
}

export async function fetchOffersWithFilter(filterMessage: serverFilter): Promise<Offer[]> {

    offers = await searchOffersByFilter(filterMessage);

    return getActiveOffers();
}

export async function createNewOffer(offer: Offer) {
    try {
        return await createOffer(offer)
    } catch (error: any) {
        if (error.response?.status === 500) {
            toast("Server interner Fehler");
        } else {
            toast.error('Fahrt erstellen fehlgeschlagen');
        }
    }
}

export function isSpaceAvailable(can: Space, occupied: Space[], newItem: Item): boolean {
    let totalWeight = 0, totalVolume = 0;
    const maxItem = can.items[0];
    const maxVolume = maxItem.size.width * maxItem.size.height * maxItem.size.depth;
    occupied.forEach((space) => {
        if(space == null) return;
        totalWeight += space?.items?.reduce((sum, i) => sum + i.weight, 0) + newItem.weight;
        totalVolume += space?.items?.reduce((sum, i) => sum + i.size.width * i.size.height * i.size.depth, 0) +
            newItem.size.width * newItem.size.height * newItem.size.depth;
    })

    return (
        totalWeight <= maxItem.weight &&
        totalVolume <= maxVolume
    );
}

// Globale Variable für Rate-Limit-Steuerung
let lastNominatimRequestTime = 0;

export async function getLocationByCoordinates(latitude: number, longitude: number): Promise<string> {
    if (latitude === 0 || longitude === 0) {
        return "";
    }

    if (isRateLimited) {
        return `Koordinaten: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    // Prüfe Cache
    let cachedEntry = unifiedLocationCache.find(
        entry => entry.coordinates.latitude === latitude && entry.coordinates.longitude === longitude
    );
    if (cachedEntry) {
        return cachedEntry.city;
    }
    // 1 Sekunde warten, wenn die letzte Anfrage < 1 Sekunde her ist
    const now = Date.now();
    const timeSinceLastRequest = now - lastNominatimRequestTime;
    if (timeSinceLastRequest < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
    }

    lastNominatimRequestTime = Date.now();

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        if (response.status === 429) {
            isRateLimited = true;
            return `Koordinaten: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }

        const data = await response.json();
        const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.hamlet ||
            "";

        if (city) {
            cachedEntry = unifiedLocationCache.find(
                entry => entry.coordinates.latitude === latitude && entry.coordinates.longitude === longitude
            );

            if (!cachedEntry) {
                unifiedLocationCache.push({
                    city,
                    coordinates: {latitude, longitude},
                });
            }
        }

        return city || `Koordinaten: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        isRateLimited = true;
        return `Koordinaten: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
}


export async function uploadImage(imgId: string, file: File) {
    console.log(imgId);
    try {
        if (imgId == null || imgId == "") {
            throw "";
        }
        await uploadPictureForCompound(imgId, file)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        toast.error('Bild konnte nicht hochgeladen werden'); //TODO:Bilder hochladen
    }
}

export async function getLocationByCity(city: string) {
    if (city == null || city == "") {
        return null;
    }

    // Wenn bereits Rate Limited, direkt null zurückgeben


    // Suche im Cache (case-insensitive)
    const cachedEntry = unifiedLocationCache.find(
        entry => entry.city.toLowerCase() === city.toLowerCase()
    );
    if (isRateLimited) {
        return null;
    }
    if (cachedEntry) {
        return cachedEntry.coordinates;
    }

    // API-Call durchführen
    try {
        const fetchPromise = fetch(
            `https://nominatim.openstreetmap.org/search?format=json&city=${city}`
        ).then(res => res.json());

        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve([]), 10000) // nach 10 Sekunden leeres Array zurückgeben
        );

        const data = await Promise.race([fetchPromise, timeoutPromise]);

        if (data.length === 0) {
            toast.error('Ort nicht gefunden');
            throw new Error('Ort nicht gefunden');
        }

        const coordinate: Coordinates = {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };

        // In Cache speichern
        unifiedLocationCache.push({
            city: city.toLowerCase(), // Normalisierte Form speichern
            coordinates: coordinate
        });

        return coordinate; // z.B. {latitude:"52.5108850",longitude:13.3989367}

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // Bei Fehlern Rate Limiting annehmen
        isRateLimited = true;
        return null;
    }
}

export async function updateOffer(offer:Offer){
    return await updateOffer(offer);
}


export async function sendFeedback(offerId: string, feedBack: {
    answers: { content: string; value: number }[];
    comment: string;
    targetId: string;
    userId: string | null
}) {
    return await postRating(offerId, feedBack);
}

export async function getUserNameFromUserId(userId: string): Promise<{ firstName: string, lastName: string }> {
    return await getUserByID(userId);
}


export async function createEditedOffer(originalOffer: Offer, editedFields: SearchDialogFields): Promise<Offer | undefined> {
    try {

        originalOffer.ended = true;
        archivedOffers.push(originalOffer);


        const locationFrom = await getLocationByCity(editedFields.locationFrom);
        const locationTo = await getLocationByCity(editedFields.locationTo);

        const newOffer: Offer = {
            id: "0", // Wird vom Server generiert
            title: editedFields.title,
            creator: originalOffer.creator,
            paidSpaces: originalOffer.paidSpaces || [],
            description: editedFields.description,
            price: editedFields.price,
            locationFrom: locationFrom || {latitude: 0, longitude: 0},
            locationTo: locationTo || {latitude: 0, longitude: 0},
            driver: originalOffer.driver,
            startDateTime: originalOffer.startDateTime,
            endDateTime: originalOffer.endDateTime,
            canTransport: originalOffer.canTransport,
            occupiedSpace: [
                {
                    occupiedBy: editedFields.creatorId,
                    seats: editedFields.passengers,
                    items: [editedFields.package],
                },
            ],
            isPhone: originalOffer.isPhone,
            isEmail: originalOffer.isEmail,
            isChat: originalOffer.isChat,
            isGesuch: originalOffer.isGesuch || false,
            restrictions: editedFields.restrictions,
            info: editedFields.info,
            infoCar: originalOffer.infoCar || [],
            createdAt: new Date().toISOString(),
            imageURL: originalOffer.imageURL
        };

        const createdOffer = await createOffer(newOffer);


        offers.push(createdOffer);

        return createdOffer;
    } catch (error: any) {
        if (error.response?.status === 500) {
            toast("Server interner Fehler");
        } else {
            toast.error('Fahrt bearbeiten fehlgeschlagen');
        }
        return undefined;
    }
}


export function getActiveOffers(): Offer[] {
    if(offers) return offers.filter(offer => !offer.ended);
    else return [];
}


export async function occupyOfferById(offerId: string, space: Space): Promise<Offer> {
    return await occupyOffer(offerId, space);
}

export async function payOfferById(offerId: string ,userId:string): Promise<any> {
    return await payOffer(offerId,userId);
}