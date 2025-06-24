export interface Offer {
    id: string;
    title: string;
    description: string;
    price: number;
    locationFrom: string;
    locationTo: string;
    creator: string;
    createdAt: Date;
    isChat: boolean;
    chatId: string;
    isPhone: boolean;
    isEmail: boolean;
    startDateTime: Date;
    endDateTime: Date;
    canTransport: Space;
    occupiedSpace: Space; // ⬅️ aktualisiert
    occupiedBy: string[];
    restrictions: string[];
    info: string[];
    infoCar: string[];
    imageURL: string;
    isOffer?: boolean;
}

export interface OfferMessage {
    title: string;
    description: string;
    price: number;
    locationFrom: string;
    locationTo: string;
    creator: string;
    startDateTime: Date;
    endDateTime: Date;
    canTransport: Space;
    occupiedSpace: Space; // ⬅️ aktualisiert
    occupiedBy: string[];
    restrictions: string[];
    info: string[];
    infoCar: string[];
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

export const mockOffers: Offer[] = [
    {
        id: "offer-001",
        title: "Transport von Möbeln nach Berlin",
        description: "Ich biete eine Fahrt von München nach Berlin am Wochenende an.",
        price: 120,
        locationFrom: "München",
        locationTo: "Berlin",
        creator: "user123",
        createdAt: new Date("2025-06-10T10:00:00Z"),
        isChat: true,
        chatId: "chat-001",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-06-22T08:00:00Z"),
        endDateTime: new Date("2025-06-22T16:00:00Z"),
        canTransport: {
            seats: 2,
            items: [
                {
                    size: { width: 100, height: 120, depth: 80 },
                    weight: 100,
                },
            ],
        },
        occupiedSpace: {
            seats: 1,
            items: [
                {
                    size: { width: 50, height: 60, depth: 40 },
                    weight: 20,
                },
                {
                    size: { width: 40, height: 50, depth: 30 },
                    weight: 15,
                },
            ],
        },
        occupiedBy: ["user789"],
        restrictions: ["Haustiere", "Rauchen"],
        info: ["Fahrt findet bei jedem Wetter statt"],
        infoCar: ["Transporter mit Rampe"],
        imageURL: "https://example.com/images/offer1.jpg",
    },
    {
        id: "offer-002",
        title: "Mitfahrgelegenheit nach Hamburg",
        description: "Fahre mit einem SUV von Köln nach Hamburg. 3 Sitzplätze verfügbar.",
        price: 50,
        locationFrom: "Köln",
        locationTo: "Hamburg",
        creator: "user456",
        createdAt: new Date("2025-06-12T09:30:00Z"),
        isChat: false,
        chatId: "",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-18T07:00:00Z"),
        endDateTime: new Date("2025-06-18T13:00:00Z"),
        canTransport: {
            seats: 3,
            items: [
                {
                    size: { width: 100, height: 50, depth: 50 },
                    weight: 50,
                },
            ],
        },
        occupiedSpace: {
            seats: 1,
            items: [
                {
                    size: { width: 40, height: 40, depth: 30 },
                    weight: 20,
                },
            ],
        },
        occupiedBy: ["user789"],
        restrictions: [],
        info: ["Bitte pünktlich sein"],
        infoCar: ["SUV"],
        imageURL: "https://example.com/images/offer2.jpg",
    },
    {
        id: "offer-003",
        title: "Kleintransporte Stuttgart → Nürnberg",
        description: "Perfekt für kleine Möbel oder 1-2 Kartons.",
        price: 70,
        locationFrom: "Stuttgart",
        locationTo: "Nürnberg",
        creator: "user238",
        createdAt: new Date("2025-06-14T12:00:00Z"),
        isChat: true,
        chatId: "chat-238",
        isPhone: true,
        isEmail: true,
        startDateTime: new Date("2025-06-21T09:00:00Z"),
        endDateTime: new Date("2025-06-21T12:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {
                    size: { width: 80, height: 60, depth: 50 },
                    weight: 40,
                },
            ],
        },
        occupiedSpace: {
            seats: 0,
            items: [
                {
                    size: { width: 60, height: 40, depth: 40 },
                    weight: 15,
                },
            ],
        },
        occupiedBy: [],
        restrictions: [],
        info: ["Transportversicherung inklusive"],
        infoCar: ["Kleiner Van"],
        imageURL: "https://example.com/images/offer3.jpg",
    },
    {
        id: "offer-004",
        title: "Umzugshilfe von Leipzig nach Dresden",
        description: "Habe einen großen Sprinter, kann Möbel transportieren.",
        price: 90,
        locationFrom: "Leipzig",
        locationTo: "Dresden",
        creator: "user315",
        createdAt: new Date("2025-06-13T15:20:00Z"),
        isChat: true,
        chatId: "chat-315",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-24T08:00:00Z"),
        endDateTime: new Date("2025-06-24T10:00:00Z"),
        canTransport: {
            seats: 2,
            items: [
                {
                    size: { width: 150, height: 120, depth: 100 },
                    weight: 200,
                },
            ],
        },
        occupiedSpace: {
            seats: 1,
            items: [
                {
                    size: { width: 80, height: 70, depth: 60 },
                    weight: 60,
                },
                {
                    size: { width: 60, height: 50, depth: 40 },
                    weight: 35,
                },
            ],
        },
        occupiedBy: ["user002"],
        restrictions: ["Keine Tiere"],
        info: ["Tragehilfe vorhanden"],
        infoCar: ["Großer Sprinter"],
        imageURL: "https://example.com/images/offer4.jpg",
    },
    {
        id: "offer-005",
        title: "Nachts nach Frankfurt",
        description: "Fahre nachts mit leerem Kofferraum nach Frankfurt.",
        price: 40,
        locationFrom: "Nürnberg",
        locationTo: "Frankfurt",
        creator: "user998",
        createdAt: new Date("2025-06-11T20:00:00Z"),
        isChat: false,
        chatId: "",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-06-25T22:00:00Z"),
        endDateTime: new Date("2025-06-26T01:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {
                    size: { width: 70, height: 50, depth: 60 },
                    weight: 40,
                },
            ],
        },
        occupiedSpace: {
            seats: 0,
            items: [],
        },
        occupiedBy: [],
        restrictions: [],
        info: ["Nachtruhe erwünscht"],
        infoCar: ["Limousine"],
        imageURL: "https://example.com/images/offer5.jpg",
    },
    {
        id: "offer-006",
        title: "Pick-up Service Berlin – Rostock",
        description: "Fahre regelmäßig und kann kleine Pakete mitnehmen.",
        price: 30,
        locationFrom: "Berlin",
        locationTo: "Rostock",
        creator: "user744",
        createdAt: new Date("2025-06-15T08:30:00Z"),
        isChat: true,
        chatId: "chat-744",
        isPhone: true,
        isEmail: true,
        startDateTime: new Date("2025-06-27T09:00:00Z"),
        endDateTime: new Date("2025-06-27T12:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {
                    size: { width: 100, height: 60, depth: 60 },
                    weight: 50,
                },
            ],
        },
        occupiedSpace: {
            seats: 0,
            items: [
                {
                    size: { width: 40, height: 30, depth: 30 },
                    weight: 10,
                },
                {
                    size: { width: 30, height: 30, depth: 20 },
                    weight: 5,
                },
            ],
        },
        occupiedBy: [],
        restrictions: ["Kein Alkohol"],
        info: ["Sicher und pünktlich"],
        infoCar: ["Kombi"],
        imageURL: "https://example.com/images/offer6.jpg",
    },
    {
        id: "offer-007",
        title: "Transporter mit Ladefläche",
        description: "Platz für sperrige Gegenstände, z. B. Fahrräder oder Kühlschränke.",
        price: 100,
        locationFrom: "Bremen",
        locationTo: "Hannover",
        creator: "user111",
        createdAt: new Date("2025-06-17T14:10:00Z"),
        isChat: true,
        chatId: "chat-111",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-06-28T10:00:00Z"),
        endDateTime: new Date("2025-06-28T12:30:00Z"),
        canTransport: {
            seats: 2,
            items: [
                {
                    size: { width: 160, height: 130, depth: 100 },
                    weight: 300,
                },
            ],
        },
        occupiedSpace: {
            seats: 1,
            items: [
                {
                    size: { width: 100, height: 100, depth: 80 },
                    weight: 120,
                },
            ],
        },
        occupiedBy: ["user332"],
        restrictions: [],
        info: ["Laderampe vorhanden"],
        infoCar: ["Offener Transporter"],
        imageURL: "https://example.com/images/offer7.jpg",
    },
    {
        id: "offer-008",
        title: "Fahrt zum Flughafen Stuttgart",
        description: "Reise früh morgens, Gepäck kann mitgenommen werden.",
        price: 25,
        locationFrom: "Ulm",
        locationTo: "Stuttgart",
        creator: "user007",
        createdAt: new Date("2025-06-16T06:15:00Z"),
        isChat: false,
        chatId: "",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-29T04:30:00Z"),
        endDateTime: new Date("2025-06-29T06:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {
                    size: { width: 80, height: 40, depth: 50 },
                    weight: 25,
                },
            ],
        },
        occupiedSpace: {
            seats: 0,
            items: [
                {
                    size: { width: 40, height: 30, depth: 30 },
                    weight: 8,
                },
            ],
        },
        occupiedBy: [],
        restrictions: ["Keine großen Hunde"],
        info: ["Kofferraum frei"],
        infoCar: ["Kompaktwagen"],
        imageURL: "https://example.com/images/offer8.jpg",
    },
    {
        id: "offer-009",
        title: "Wochenendfahrt München → Salzburg",
        description: "Gemütliche Fahrt mit VW Bus, viel Platz.",
        price: 60,
        locationFrom: "München",
        locationTo: "Salzburg",
        creator: "user303",
        createdAt: new Date("2025-06-19T17:45:00Z"),
        isChat: true,
        chatId: "chat-303",
        isPhone: true,
        isEmail: true,
        startDateTime: new Date("2025-07-01T10:00:00Z"),
        endDateTime: new Date("2025-07-01T13:00:00Z"),
        canTransport: {
            seats: 4,
            items: [
                {
                    size: { width: 150, height: 110, depth: 90 },
                    weight: 250,
                },
            ],
        },
        occupiedSpace: {
            seats: 2,
            items: [
                {
                    size: { width: 70, height: 60, depth: 50 },
                    weight: 40,
                },
            ],
        },
        occupiedBy: ["user789", "user999"],
        restrictions: [],
        info: ["Gemütliche Fahrt mit Musik"],
        infoCar: ["VW Bus"],
        imageURL: "https://example.com/images/offer9.jpg",
    },
    {
        id: "offer-010",
        title: "Täglicher Pendelservice Bonn ↔ Köln",
        description: "Fahre täglich und kann kleine Pakete mitnehmen.",
        price: 15,
        locationFrom: "Bonn",
        locationTo: "Köln",
        creator: "user002",
        createdAt: new Date("2025-06-20T09:00:00Z"),
        isChat: true,
        chatId: "chat-002",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-07-02T07:00:00Z"),
        endDateTime: new Date("2025-07-02T08:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {
                    size: { width: 60, height: 50, depth: 50 },
                    weight: 30,
                },
            ],
        },
        occupiedSpace: {
            seats: 0,
            items: [
                {
                    size: { width: 40, height: 30, depth: 20 },
                    weight: 10,
                },
            ],
        },
        occupiedBy: [],
        restrictions: [],
        info: ["Tägliche Fahrten möglich"],
        infoCar: ["Kleinwagen"],
        imageURL: "https://example.com/images/offer10.jpg",
    },
];


export async function fetchOffers(): Promise<Offer[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockOffers);
        }, 500);
    });
}

export async function fetchOffer(id: string | undefined): Promise<Offer | undefined> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockOffers.find(offer => offer.id === id));
        }, 500);
    });
}

export async function getOffer(id:string|undefined): Promise<Offer | undefined> {
    // In bereits vorhandenen offers suchen

    let foundOffer =  mockOffers.find(offer => offer.id === id);
    if(foundOffer == undefined){
        await fetchOffer(id).then(offer => foundOffer = offer);
    }
    return foundOffer;

}

export function getMaxPrice(): number {
    let price = 0;
    mockOffers.forEach((offer: Offer) => {
        if (offer.price > price) {
            price = offer.price;
        }
    })
    return price;
}

export async function fetchOffersWithFilter(filter: Filter): Promise<Offer[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredOffers = mockOffers.filter((offer) => {
                const matchesLocationFrom =
                    filter.locationFrom !== undefined &&
                    filter.locationFrom !== "" &&
                    offer.locationFrom.includes(filter.locationFrom);

                const matchesLocationTo =
                    filter.locationTo !== undefined &&
                    filter.locationTo !== "" &&
                    offer.locationTo.includes(filter.locationTo);

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

export async function createOffer(offer: OfferMessage): Promise<Offer> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOffer = offer as Offer;
            newOffer.id = "user1234";//TODO: user mit eingeloggten Benutzer ersetzen
            mockOffers.push(newOffer);
            resolve(newOffer);
        }, 500);
    });
}


const isSpaceAvailable = (can: Space, occupied: Space, newItem: Item, newSeatCount: number) => {
    const totalWeight = occupied.items.reduce((sum, i) => sum + i.weight, 0) + newItem.weight;
    const totalVolume = occupied.items.reduce((sum, i) => sum + i.size.width * i.size.height * i.size.depth, 0) +
        newItem.size.width * newItem.size.height * newItem.size.depth;

    const maxItem = can.items[0];
    const maxVolume = maxItem.size.width * maxItem.size.height * maxItem.size.depth;

    return (
        totalWeight <= maxItem.weight &&
        totalVolume <= maxVolume &&
        occupied.seats + newSeatCount <= can.seats
    );
};

