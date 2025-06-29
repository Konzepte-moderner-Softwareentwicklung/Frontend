import type { Offer, Filter, SearchDialogFields, Item, Space } from '../drivesService';

// Mock-Daten 
const mockOffers = [
  {
    id: "offer-001",
    title: "Transport München → Berlin",
    description: "Fahre mit Transporter von München nach Berlin. Platz für Möbel.",
    price: 120,
    locationFrom: "München",
    locationTo: "Berlin", 
    driver: "user789",
    createdAt: new Date("2025-06-25T10:00:00Z"),
    isChat: true,
    chatId: "chat-001",
    isPhone: true,
    isEmail: false,
    startDateTime: new Date("2025-07-01T08:00:00Z"),
    endDateTime: new Date("2025-07-01T16:00:00Z"),
    canTransport: {
      seats: 2,
      items: [{ 
        size: { width: 200, height: 150, depth: 100 }, 
        weight: 500 
      }]
    },
    occupiedSpace: {
      seats: 0,
      items: []
    },
    passenger: [],
    restrictions: ["Keine Haustiere", "Nichtraucher"], 
    info: ["Flexible Zeiten", "Hilfe beim Laden"],
    infoCar: ["Mercedes Sprinter", "Rampe vorhanden"],
    car: "Mercedes Sprinter",
    imageURL: "https://example.com/images/sprinter.jpg",
    isGesuch: false,
    ended: false,
    rating: 4.8
  },
  {
    id: "offer-002", 
    title: "Mitfahrgelegenheit Hamburg",
    description: "Fahre täglich von Hamburg nach Bremen.",
    price: 25,
    locationFrom: "Hamburg",
    locationTo: "Bremen",
    driver: "user456",
    createdAt: new Date("2025-06-20T09:30:00Z"),
    isChat: false,
    chatId: "",
    isPhone: false,
    isEmail: true,
    startDateTime: new Date("2025-06-30T07:00:00Z"),
    endDateTime: new Date("2025-06-30T09:30:00Z"),
    canTransport: {
      seats: 3,
      items: [{ 
        size: { width: 50, height: 40, depth: 30 }, 
        weight: 20 
      }]
    },
    occupiedSpace: {
      seats: 1,
      items: []
    },
    passenger: ["user123"],
    restrictions: [],
    info: ["Pünktlich", "Musik erlaubt"],
    infoCar: ["BMW 3er", "Klimaanlage"],
    car: "BMW 3er",
    imageURL: "https://example.com/images/bmw.jpg", 
    isGesuch: false,
    ended: false,
    rating: 4.2
  }
];

// Alle Exports als Mock-Funktionen
export const fetchOffers = jest.fn(() => Promise.resolve(mockOffers));

export const fetchOffer = jest.fn((id) => 
  Promise.resolve(mockOffers.find(offer => offer.id === id))
);

export const getOffer = jest.fn((id) => 
  Promise.resolve(mockOffers.find(offer => offer.id === id))
);

export const fetchOffersWithFilter = jest.fn((filter, userId) => {
  let filtered = [...mockOffers];
  
  if (filter.locationFrom) {
    filtered = filtered.filter(offer => 
      offer.locationFrom.toLowerCase().includes(filter.locationFrom.toLowerCase())
    );
  }
  
  if (filter.maxPrice) {
    filtered = filtered.filter(offer => offer.price <= filter.maxPrice);
  }
  
  if (filter.type === 'angebote') {
    filtered = filtered.filter(offer => !offer.isGesuch);
  }
  
  return Promise.resolve(filtered);
});

export const createOffer = jest.fn((offer) => 
  Promise.resolve({ 
    ...mockOffers[0], 
    ...offer, 
    id: `new-offer-${Date.now()}` 
  })
);

export const getMaxPrice = jest.fn(() => 120);

export const isSpaceAvailable = jest.fn((canTransport, occupied, newItem) => {
  const availableSeats = canTransport.seats - occupied.seats;
  const availableWeight = canTransport.items.reduce((sum, item) => sum + item.weight, 0) -
                         occupied.items.reduce((sum, item) => sum + item.weight, 0);
  
  return availableSeats > 0 && availableWeight >= newItem.weight;
});

// Mock-Daten exportieren für Tests
export { mockOffers };
export const mockSearchFields = {
  title: "Suche Transport nach Berlin",
  description: "Brauche Transport für Umzug",
  creatorId: "user123",
  locationFrom: "München", 
  locationTo: "Berlin",
  passengers: 1,
  price: 100,
  package: {
    size: { width: 120, height: 80, depth: 60 },
    weight: 50
  },
  info: ["Flexibel mit Zeit"],
  restrictions: ["Nichtraucher"]
};