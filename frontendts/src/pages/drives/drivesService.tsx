import {createOffer, getOfferDetails, searchOffersByFilter} from "@/api/offers_api.tsx";
import toast from "react-hot-toast";
import {downloadPicture, uploadPicture, uploadPictureForCompound} from "@/api/media_api.tsx";
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
};

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


export interface Filter {
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

let idCount = 11;


export async function getOffer(id: string | undefined): Promise<Offer | undefined> {
    let foundOffer;

    // if(offers){
    //     foundOffer = offers.find(offer => offer.id === id);
    // }

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

export async function fetchOffersWithFilter(filter: Filter): Promise<Offer[]> {
    offers = await searchOffersByFilter(filter);
    return offers;
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


export async function createSearch(fields: SearchDialogFields) {
    try {
        const newOffer = await convertSearchFieldsToOffer(fields);
        return await createOffer(newOffer);
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
        creator: fields.creatorId,
        canTransport: {
            occupiedBy: fields.creatorId,
            items: [],
            seats: 10,
        },
        chatId: fields.creatorId,
        createdAt: new Date().toISOString(),
        description: fields.description,
        paidSpaces: [],
        driver: fields.creatorId,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        id: fields.creatorId,
        imageURL: fields.creatorId,
        info: fields.info,
        infoCar: [],
        isChat: false,
        isEmail: false,
        isGesuch: true,
        isPhone: false,
        locationFrom: locationFrom || { latitude: 0, longitude: 0 },
        locationTo: locationTo || { latitude: 0, longitude: 0 },
        occupiedSpace: [
            {
                occupiedBy: sessionStorage.getItem("UserID") || "",
                items: [fields.package],
                seats: fields.passengers,
            },
        ],
        price: fields.price,
        restrictions: ["", ""],
        title: fields.title,
    };

}

export function isSpaceAvailable(can: Space, occupied: Space[], newItem: Item): boolean {//TODO:Fix
    // const totalWeight = occupied.items.reduce((sum, i) => sum + i.weight, 0) + newItem.weight;
    // const totalVolume = occupied.items.reduce((sum, i) => sum + i.size.width * i.size.height * i.size.depth, 0) +
    //     newItem.size.width * newItem.size.height * newItem.size.depth;
    //
    // const maxItem = can.items[0];
    // const maxVolume = maxItem.size.width * maxItem.size.height * maxItem.size.depth;
    //
    // return (
    //     totalWeight <= maxItem.weight &&
    //     totalVolume <= maxVolume
    // );
    return true
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

}

export async function getUserNameFromUserId(userId: string):Promise<{firstName:string,lastName:string}> {
    return await getUserByID(userId).then((user) => {
        console.log(user.firstName, user.lastName);
        return {firstName: user.firstName, lastName: user.lastName};
    });


}