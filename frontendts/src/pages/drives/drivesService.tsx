import {createOffer, getOfferDetails, searchOffersByFilter} from "@/api/offers_api.tsx";
import toast from "react-hot-toast";
import {downloadPicture, uploadPictureForCompound} from "@/api/media_api.tsx";
import {getUserByID} from "@/api/user_api.tsx";

export interface Coordinates {
    longitude: number;
    latitude: number;
}

export interface feedBackData {
    answers: Record<string, number>;
    comment: string,
    targetName: string,

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

interface placeList{
    id: string,
    coordinatesFrom: string,
    coordinatesTo: string
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


export interface clientFilter {
    freeSpace?: number;
    locationFrom?: string;
    locationTo?: string;
    locationFromDiff?: number;
    dateTime?: string;
    showPassed?:boolean;
    user?: string;
    creator?: string;
    maxPrice?: number;
    onlyOwn?: boolean;
    // Zusätzliche Felder für erweiterte Filterung
    type?: "angebote" | "gesuche" | "beides";
    rating?: number;
    maxWeight?: number;
}

export interface ServerFilter {
    price: number;
    includePassed: boolean;
    dateTime: string; // ISO-String (z. B. new Date().toISOString())
    nameStartsWith: string;
    spaceNeeded: Space;
    locationFrom: Coordinates;
    locationTo: Coordinates;
    locationFromDiff: number;
    locationToDiff: number;
    user: string;
    creator: string;
    currentTime: string; // ISO-String
    id: string;
}

export interface Space {
    occupiedBy:string,
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
const locationCache:placeList[] = [];


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

export async function fetchOffersWithFilter(serverFilter:ServerFilter): Promise<Offer[]> {
    offers = await searchOffersByFilter(serverFilter);

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
    let totalWeight = 0,totalVolume = 0;
    const maxItem = can.items[0];
    const maxVolume = maxItem.size.width * maxItem.size.height * maxItem.size.depth;
    occupied.forEach((space) => {
         totalWeight += space.items.reduce((sum, i) => sum + i.weight, 0) + newItem.weight;
         totalVolume += space.items.reduce((sum, i) => sum + i.size.width * i.size.height * i.size.depth, 0) +
            newItem.size.width * newItem.size.height * newItem.size.depth;
    })

    return (
        totalWeight <= maxItem.weight &&
        totalVolume <= maxVolume
    );
}

export async function getLocationName(latitude: number, longitude: number):Promise<string> {
    if (latitude == 0 || longitude == 0) {
        return "";
    }
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return data?.city; // z.B. "Berlin"
}


export async function loadImage(id: string) {
    return await downloadPicture(id);
}


export async function uploadImage(imgId:string,file: File) {
console.log(imgId);
    try {
        if(imgId == null || imgId == ""){
            throw "";
        }
        await uploadPictureForCompound(imgId,file)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        toast.error('Bild konnte nicht hochgeladen werden'); //TODO:Bilder hochladen
    }
}

export async function setLocationName(city: string) {
    if (city == null || city == "") {
        return null;
    }
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
    }
    return coordinate; // z.B. {latitude:"52.5108850",longitude:13.3989367}
}


export async function sendFeedback(feedBack: {
    answers: Record<string, number>;
    comment: string;
    targetId: string;
    userId: string | null
}) {
return null;
}

export async function getUserNameFromUserId(userId: string):Promise<{firstName:string,lastName:string}> {
    return await getUserByID(userId).then((user) => {
        console.log(user.firstName, user.lastName);
        return {firstName: user.firstName, lastName: user.lastName};
    });

}

export async function getLocationFromList(
    id: string,
    locationFrom: Coordinates,
    locationTo: Coordinates
): Promise<{ coordinatesFrom: string; coordinatesTo: string }> {
    const cached = locationCache.find((entry) => entry.id === id);

    if (cached) {
        return { coordinatesFrom: cached.coordinatesFrom, coordinatesTo: cached.coordinatesTo };
    } else {

        const fromLocation = await getLocationName( locationFrom.latitude,locationFrom.longitude);
        const toLocation = await getLocationName(locationTo.latitude,locationTo.longitude);
        locationCache.push({
            id,
            coordinatesFrom: fromLocation,
            coordinatesTo: toLocation,
        });

        return {coordinatesFrom: fromLocation, coordinatesTo: toLocation};
    }
}

// Neue Funktion zum Erstellen eines bearbeiteten Offers
export async function createEditedOffer(originalOffer: Offer, editedFields: SearchDialogFields): Promise<Offer | undefined> {
    try {
        // Das ursprüngliche Offer als "ended" markieren und ins Archiv verschieben
        originalOffer.ended = true;
        archivedOffers.push(originalOffer);
        
        // Neues Offer mit den bearbeiteten Feldern erstellen
        const locationFrom = await setLocationName(editedFields.locationFrom);
        const locationTo = await setLocationName(editedFields.locationTo);
        
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
        
        // Das neue Offer zur aktiven Liste hinzufügen
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

// Funktion zum Abrufen nur aktiver Offers (nicht archivierte)
export function getActiveOffers(): Offer[] {
    return offers.filter(offer => !offer.ended);
}

// Funktion zum Abrufen archivierter Offers
export function getArchivedOffers(): Offer[] {
    return archivedOffers;
}

// Funktion zum Abrufen aller Offers (aktive + archivierte)
export function getAllOffers(): Offer[] {
    return [...offers, ...archivedOffers];
}