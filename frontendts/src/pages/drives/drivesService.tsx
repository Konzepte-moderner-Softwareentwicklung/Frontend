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
    occupied: boolean;
    occupiedBy: string[];
    restrictions: string[];
    info: string[];
    infoCar: string[];
    imageURL: string;
}

export interface OfferMessage{
    title: string;
    description: string;
    price: number;
    locationFrom: string;
    locationTo: string;
    creator: string;
    startDateTime: Date;
    endDateTime: Date;
    canTransport: Space;
    occupied: boolean;
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

interface Item {
    size: Size;
    weight: number;
}

interface Size {
    width: number;
    height: number;
    depth: number;
}

export const mockOffers: Offer[] = [
    {
        id: "offer-001",
        title: "Transport von Möbeln nach Berlin",
        description: "Ich biete eine Fahrt von München nach Berlin am Wochenende an. Platz für Möbel und 2 Personen.",
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
                {size: {width: 80, height: 120, depth: 60}, weight: 30},
                {size: {width: 50, height: 70, depth: 40}, weight: 15},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: ["Haustiere", "Rauchen"],
        info: ["Fahrt findet bei jedem Wetter statt", "Pausen alle 2 Stunden"],
        infoCar: ["Transporter mit Rampe", "Klimaanlage vorhanden"],
        imageURL: "https://example.com/images/offer1.jpg",
    },
    {
        id: "offer-002",
        title: "Mitfahrgelegenheit nach Hamburg",
        description: "Fahre mit einem SUV von Köln nach Hamburg. 3 Sitzplätze verfügbar, kein großer Stauraum.",
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
            items: [],
        },
        occupied: true,
        occupiedBy: ["user789"],
        restrictions: ["Großes Gepäck"],
        info: ["Bitte pünktlich sein", "Zwischenstopp in Hannover"],
        infoCar: ["SUV, Nichtraucherfahrzeug"],
        imageURL: "https://example.com/images/offer2.jpg",
    },
    {
        id: "offer-003",
        title: "Kleintransporte Stuttgart → Nürnberg",
        description: "Fahre mit kleinem Van, perfekt für 1-2 Kartons oder kleine Möbelstücke.",
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
                {size: {width: 60, height: 40, depth: 40}, weight: 10},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: [],
        info: ["Nur kleinere Gegenstände", "Transportversicherung inklusive"],
        infoCar: ["Kleiner Van", "Rückfahrkamera"],
        imageURL: "https://example.com/images/offer3.jpg",
    },
    {
        id: "offer-004",
        title: "Studentenfahrt Leipzig → Dresden",
        description: "Ich pendle regelmäßig, gerne Mitfahrgelegenheit für Studierende.",
        price: 15,
        locationFrom: "Leipzig",
        locationTo: "Dresden",
        creator: "user789",
        createdAt: new Date("2025-06-11T16:00:00Z"),
        isChat: false,
        chatId: "",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-19T08:00:00Z"),
        endDateTime: new Date("2025-06-19T10:00:00Z"),
        canTransport: {
            seats: 4,
            items: [],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: ["Rauchen"],
        info: ["Pausen je nach Wunsch", "Snacks an Bord"],
        infoCar: ["Kombi, sehr geräumig"],
        imageURL: "https://example.com/images/offer4.jpg",
    },
    {
        id: "offer-005",
        title: "Lieferung von Paketen Frankfurt → Mainz",
        description: "Fahre werktags täglich zwischen Frankfurt und Mainz – Transport von kleinen Sendungen möglich.",
        price: 25,
        locationFrom: "Frankfurt",
        locationTo: "Mainz",
        creator: "user321",
        createdAt: new Date("2025-06-15T08:15:00Z"),
        isChat: true,
        chatId: "chat-321",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-06-17T07:30:00Z"),
        endDateTime: new Date("2025-06-17T09:00:00Z"),
        canTransport: {
            seats: 0,
            items: [
                {size: {width: 30, height: 30, depth: 30}, weight: 5},
                {size: {width: 40, height: 50, depth: 40}, weight: 8},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: ["Zerbrechliche Waren"],
        info: ["Nur werktags", "Sendungsverfolgung via App"],
        infoCar: ["Kastenwagen, Kameraüberwachung"],
        imageURL: "https://example.com/images/offer5.jpg",
    },
    {
        id: "offer-006",
        title: "Umzugshilfe Wien → Linz",
        description: "Großer Transporter mit Ladefläche. Ideal für Umzüge oder größere Lieferungen.",
        price: 180,
        locationFrom: "Wien",
        locationTo: "Linz",
        creator: "user900",
        createdAt: new Date("2025-06-13T10:45:00Z"),
        isChat: true,
        chatId: "chat-900",
        isPhone: true,
        isEmail: true,
        startDateTime: new Date("2025-06-25T06:00:00Z"),
        endDateTime: new Date("2025-06-25T12:00:00Z"),
        canTransport: {
            seats: 1,
            items: [
                {size: {width: 100, height: 200, depth: 80}, weight: 60},
                {size: {width: 90, height: 150, depth: 70}, weight: 45},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: [],
        info: ["Möbelspanner vorhanden", "Fahrer hilft beim Tragen"],
        infoCar: ["Sprinter 3.5t", "Hecklift"],
        imageURL: "https://example.com/images/offer6.jpg",
    },
    {
        id: "offer-007",
        title: "Kurierfahrt München → Salzburg",
        description: "Expresslieferung für Dokumente oder kleine Pakete.",
        price: 90,
        locationFrom: "München",
        locationTo: "Salzburg",
        creator: "user999",
        createdAt: new Date("2025-06-15T17:20:00Z"),
        isChat: false,
        chatId: "",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-20T13:00:00Z"),
        endDateTime: new Date("2025-06-20T15:00:00Z"),
        canTransport: {
            seats: 0,
            items: [
                {size: {width: 20, height: 10, depth: 5}, weight: 1},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: ["Gefahrgut"],
        info: ["Nur für eilige Sendungen", "Keine Rückfahrt geplant"],
        infoCar: ["PKW", "Sicheres Handschuhfach"],
        imageURL: "https://example.com/images/offer7.jpg",
    },
    {
        id: "offer-008",
        title: "Mitnahme für Fahrräder Köln → Bonn",
        description: "Transportmöglichkeit für 2 Fahrräder am Samstagvormittag.",
        price: 20,
        locationFrom: "Köln",
        locationTo: "Bonn",
        creator: "userbike",
        createdAt: new Date("2025-06-16T07:00:00Z"),
        isChat: true,
        chatId: "chat-bike",
        isPhone: true,
        isEmail: false,
        startDateTime: new Date("2025-06-21T10:00:00Z"),
        endDateTime: new Date("2025-06-21T11:00:00Z"),
        canTransport: {
            seats: 0,
            items: [
                {size: {width: 170, height: 100, depth: 40}, weight: 12},
                {size: {width: 180, height: 110, depth: 45}, weight: 14},
            ],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: [],
        info: ["Fahrradträger vorhanden", "Bitte vorher sauber machen"],
        infoCar: ["Van mit Heckträger"],
        imageURL: "https://example.com/images/offer8.jpg",
    },
    {
        id: "offer-009",
        title: "Langstreckenfahrt Paris → Berlin",
        description: "Internationale Fahrt über Nacht, bequemer Reisebus mit WLAN.",
        price: 250,
        locationFrom: "Paris",
        locationTo: "Berlin",
        creator: "userfrde",
        createdAt: new Date("2025-06-09T13:30:00Z"),
        isChat: false,
        chatId: "",
        isPhone: false,
        isEmail: true,
        startDateTime: new Date("2025-06-27T20:00:00Z"),
        endDateTime: new Date("2025-06-28T08:00:00Z"),
        canTransport: {
            seats: 10,
            items: [],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: ["Haustiere", "laute Musik"],
        info: ["Snacks & Getränke an Bord", "Pass/ID erforderlich"],
        infoCar: ["Reisebus mit Liegesitzen"],
        imageURL: "https://example.com/images/offer9.jpg",
    },
    {
        id: "offer-010",
        title: "Mitfahrgelegenheit Amsterdam → Düsseldorf",
        description: "Günstig, umweltfreundlich und gesellig – 2 Plätze frei!",
        price: 35,
        locationFrom: "Amsterdam",
        locationTo: "Düsseldorf",
        creator: "usertravel",
        createdAt: new Date("2025-06-16T18:00:00Z"),
        isChat: true,
        chatId: "chat-travel",
        isPhone: true,
        isEmail: true,
        startDateTime: new Date("2025-06-23T09:00:00Z"),
        endDateTime: new Date("2025-06-23T13:00:00Z"),
        canTransport: {
            seats: 2,
            items: [],
        },
        occupied: false,
        occupiedBy: [],
        restrictions: [],
        info: ["Stromanschluss im Auto", "Fahrt klimaneutral kompensiert"],
        infoCar: ["E-Auto (Tesla Model Y)", "Panoramadach"],
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

            resolve(filteredOffers); // <-- Richtige Position
        }, 500);
    });
}

export async function createOffer(offer: OfferMessage): Promise<Offer> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOffer = offer as Offer;
            mockOffers.push(newOffer);
            resolve(newOffer);
        }, 500);
    });
}



