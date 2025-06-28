import {createOffer, getOfferDetails, searchOffersByFilter} from "@/api/offers_api.tsx";
import toast from "react-hot-toast";
import {downloadPicture, uploadPicture} from "@/api/media_api.tsx";

export interface Coordinates {
    longitude: number;
    latitude: number;
}

export const DEFAULT_OFFER: Offer = {
    id: '',
    title: '',
    description: '',
    price: 0,
    locationFrom: {latitude: 0, longitude: 0},
    locationTo: {latitude: 0, longitude: 0},
    creator: '',
    createdAt: new Date().toISOString(),
    isChat: false,
    chatId: '',
    isPhone: false,
    isEmail: false,
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    canTransport: {items: [], seats: 0},
    occupiedSpace: {items: [], seats: 0},
    occupiedBy: [],
    restrictions: [],
    info: [],
    infoCar: [],
    imageURL: '',
    isGesuch: false,
    ended: false,
};

export interface Offer {
    id: string;
    title: string;
    description: string;
    price: number;
    locationFrom: Coordinates;
    locationTo: Coordinates;
    creator: string;
    createdAt: string; // ISO-String!
    isChat: boolean;
    chatId?: string;
    isPhone: boolean;
    isEmail: boolean;
    startDateTime: string; // ISO-String!
    endDateTime: string;   // ISO-String!
    canTransport: Space;
    occupiedSpace: Space;
    occupiedBy?: string[] | null;
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


export interface Filter {
    freeSpace?: number;
    locationFrom?: string;
    locationTo?: string;
    locationFromDiff?: number;
    date?: string;
    user?: string;
    creator?: string;
    maxPrice?: number;
    type?: 'angebote' | 'gesuche' | 'beides';
    onlyOwn?: boolean;
}

export interface Space {
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

let idCount = 11;

export async function getAllOffers(): Promise<Offer[]> {
    offers = await searchOffersByFilter({});
    return offers;
}


export async function getOffer(id: string | undefined): Promise<Offer | undefined> {
    // In bereits vorhandenen offers suchen ansonsten Servercall
    let foundOffer;
    // = offers.find(offer => offer.id === id);
    if (foundOffer == undefined) {
        await getOfferDetails(id || "").then(offer => foundOffer = offer);
    }
    return foundOffer;

}

export function getMaxPrice(): number {
    let price = 0;
    offers.forEach((offer: Offer) => {
        if (offer.price > price) {
            price = offer.price;
        }
    })
    return price;
}

export async function fetchOffersWithFilter(filter: Filter, userId: string): Promise<Offer[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredOffers = offers.filter((offer) => {
                const isOwn = userId === offer.creator;
                if (filter.onlyOwn && !isOwn || offer.ended) return false;

                const matchesLocationFrom =
                    filter.locationFrom !== undefined &&
                    filter.locationFrom !== ""
                //offer.locationFrom.includes(filter.locationFrom);

                const matchesLocationTo =
                    filter.locationTo !== undefined &&
                    filter.locationTo !== ""
                //offer.locationTo.includes(filter.locationTo);

                const matchesDate =
                    filter.date !== undefined &&
                    filter.date !== "" &&
                    new Date(offer.endDateTime).toDateString() === new Date(filter.date).toDateString();

                const matchesFreeSpace =
                    filter.freeSpace !== undefined &&
                    offer.canTransport.seats === filter.freeSpace;

                const matchesMaxPrice =
                    filter.maxPrice !== undefined &&
                    offer.price <= filter.maxPrice;


                return (
                    (!filter.locationFrom || matchesLocationFrom) &&
                    (!filter.locationTo || matchesLocationTo) &&
                    (!filter.date || matchesDate) &&
                    (filter.freeSpace === undefined || matchesFreeSpace) &&
                    (filter.maxPrice === undefined || matchesMaxPrice)
                );
            });

            resolve(filteredOffers);
        }, 500);
    });
}

export async function createNewOffer(offer: Offer) {
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         const newOffer = offer;
    //         newOffer.driver =localStorage.getItem("userId")||sessionStorage.getItem("userId")||"";//TODO: user mit eingeloggten Benutzer ersetzen
    //         newOffer.isGesuch = false;
    //         newOffer.id = "offer-0"+idCount++;
    //
    //         mockOffers.push(newOffer);
    //         resolve(newOffer);
    //     }, 500);
    // });} catch (error: any) {

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


export async function createSearch(fields: SearchDialogFields) {
    try {
        const newOffer = await convertSearchFieldsToOffer(fields);
        newOffer?.occupiedBy?.push(localStorage.getItem("userId") || sessionStorage.getItem("userId") || "");//TODO: user mit eingeloggten Benutzer ersetzen
        newOffer.id = "search-0" + idCount++;//remove wenn Servercall
        newOffer.isGesuch = true;
        return await createOffer(newOffer).then(offer => {
            offers.push(newOffer);
            return offer;
        })
    } catch (error: any) {
        if (error.response?.status === 500) {
            toast("Server interner Fehler");
        } else {
            toast.error('Gesuch erstellen fehlgeschlagen');
        }
    }
}

async function convertSearchFieldsToOffer(fields: SearchDialogFields): Promise<Offer> {
    const locationFrom = await setLocationName(fields.locationFrom);
    const locationTo = await setLocationName(fields.locationTo);
    return {
        canTransport: {
            items: [],
            seats: 0
        },
        chatId: "",
        createdAt: "",
        description: fields.description,
        creator: "",
        startDateTime: "",
        endDateTime: "",
        id: "",
        imageURL: "",
        info: fields.info,
        infoCar: [],
        isChat: false,
        isEmail: false,
        isGesuch: true,
        isPhone: false,
        locationFrom: locationFrom,
        locationTo: locationTo,
        occupiedBy: [],
        occupiedSpace: {
            items: [fields.package],
            seats: fields.passengers
        },
        price: 0,
        restrictions: [],
        title: fields.title
    }
}

export function isSpaceAvailable(can: Space, occupied: Space, newItem: Item): boolean {
    const totalWeight = occupied.items.reduce((sum, i) => sum + i.weight, 0) + newItem.weight;
    const totalVolume = occupied.items.reduce((sum, i) => sum + i.size.width * i.size.height * i.size.depth, 0) +
        newItem.size.width * newItem.size.height * newItem.size.depth;

    const maxItem = can.items[0];
    const maxVolume = maxItem.size.width * maxItem.size.height * maxItem.size.depth;

    return (
        totalWeight <= maxItem.weight &&
        totalVolume <= maxVolume
    );
}

export async function getLocationName(latitude: number, longitude: number) {
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

export async function loadAllImages(id: string) {
}

export async function uploadImage(file: File) {
    try {
        await uploadPicture(file)
    } catch (error) {
        toast.error('Bild konnte nicht hochgeladen werden'); //TODO:Bilder hochladen
    }
}

export async function setLocationName(city: string) {
    if (city == null || city == "") {
        return null;
    }
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&city=${city}`
    );
    const data = await response.json();
    if (data.length === 0) throw new Error('Ort nicht gefunden');
    const coordinate: Coordinates = {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
    }
    return coordinate; // z.B. {latitude:"52.5108850",longitude:13.3989367}
}

