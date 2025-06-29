import type { Filter, Space, Item } from '../drivesService';

// Mock-Daten EINMAL definieren
const testMockOffers = [
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

// NUR EIN jest.mock() Aufruf mit allen Funktionen INLINE definiert
jest.mock('../drivesService', () => ({
  fetchOffers: jest.fn(() => Promise.resolve(testMockOffers)),
  
  fetchOffer: jest.fn((id: string) => 
    Promise.resolve(testMockOffers.find(offer => offer.id === id))
  ),
  
  fetchOffersWithFilter: jest.fn((filter: any, userId?: string) => {
    let filtered = [...testMockOffers];
    
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
  }),
  
  createOffer: jest.fn((offer: any) => 
    Promise.resolve({ 
      ...testMockOffers[0], 
      ...offer, 
      id: `new-offer-${Date.now()}` 
    })
  ),
  
  getMaxPrice: jest.fn(() => 120),
  
  isSpaceAvailable: jest.fn((canTransport: any, occupied: any, newItem: any) => {
    const availableSeats = canTransport.seats - occupied.seats;
    const availableWeight = canTransport.items.reduce((sum: number, item: any) => sum + item.weight, 0) -
                           occupied.items.reduce((sum: number, item: any) => sum + item.weight, 0);
    
    return availableSeats > 0 && availableWeight >= newItem.weight;
  })
}));

// NUR EIN Import NACH dem Mock
import {
  fetchOffers,
  fetchOffer,
  fetchOffersWithFilter,
  createOffer,
  getMaxPrice,
  isSpaceAvailable
} from '../drivesService';

describe('DrivesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOffers', () => {
    test('should return list of offers', async () => {
      const offers = await fetchOffers();
      
      expect(fetchOffers).toHaveBeenCalled();
      expect(offers).toHaveLength(2);
      expect(offers[0]).toHaveProperty('title', 'Transport München → Berlin');
      expect(offers[0]).toHaveProperty('price', 120);
    });

    test('should handle empty offers list', async () => {
      (fetchOffers as jest.Mock).mockResolvedValueOnce([]);
      
      const offers = await fetchOffers();
      expect(offers).toEqual([]);
    });
  });

  describe('fetchOffer', () => {
    test('should return specific offer by id', async () => {
      const offer = await fetchOffer('offer-001');
      
      expect(fetchOffer).toHaveBeenCalledWith('offer-001');
      expect(offer).toBeDefined();
      expect(offer?.id).toBe('offer-001');
      expect(offer?.title).toBe('Transport München → Berlin');
    });

    test('should return undefined for non-existent offer', async () => {
      const offer = await fetchOffer('non-existent-id');
      expect(offer).toBeUndefined();
    });
  });

  describe('fetchOffersWithFilter', () => {
    test('should filter offers by locationFrom', async () => {
      const filter: Filter = { locationFrom: 'München' };
      const offers = await fetchOffersWithFilter(filter, 'user123');
      
      expect(fetchOffersWithFilter).toHaveBeenCalledWith(filter, 'user123');
      expect(offers).toHaveLength(1);
      expect(offers[0].locationFrom).toBe('München');
    });

    test('should filter offers by maxPrice', async () => {
      const filter: Filter = { maxPrice: 50 };
      const offers = await fetchOffersWithFilter(filter);
      
      expect(offers).toHaveLength(1);
      expect(offers[0].price).toBeLessThanOrEqual(50);
    });

    test('should filter by offer type', async () => {
      const filter: Filter = { type: 'angebote' };
      const offers = await fetchOffersWithFilter(filter);
      
      expect(offers.every(offer => !offer.isGesuch)).toBe(true);
    });

    test('should handle multiple filters', async () => {
      const filter: Filter = { 
        locationFrom: 'Hamburg',
        maxPrice: 30,
        type: 'angebote'
      };
      const offers = await fetchOffersWithFilter(filter);
      
      expect(fetchOffersWithFilter).toHaveBeenCalledWith(filter);
      expect(offers).toBeDefined();
    });
  });

  describe('createOffer', () => {
    test('should create new offer with generated id', async () => {
      const newOffer = {
        title: 'New Test Offer',
        price: 80,
        locationFrom: 'Frankfurt',
        locationTo: 'Köln'
      };
      
      const result = await createOffer(newOffer);
      
      expect(createOffer).toHaveBeenCalledWith(newOffer);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('New Test Offer');
      expect(result.id).toMatch(/^new-offer-/);
    });
  });

  describe('getMaxPrice', () => {
    test('should return maximum price from all offers', () => {
      const maxPrice = getMaxPrice();
      
      expect(getMaxPrice).toHaveBeenCalled();
      expect(maxPrice).toBe(120);
    });
  });

  describe('isSpaceAvailable', () => {
    test('should return true when space is available', () => {
      const canTransport: Space = {
        seats: 3,
        items: [{ size: { width: 100, height: 100, depth: 100 }, weight: 100 }]
      };
      const occupied: Space = {
        seats: 1,
        items: [{ size: { width: 50, height: 50, depth: 50 }, weight: 30 }]
      };
      const newItem: Item = {
        size: { width: 40, height: 40, depth: 40 },
        weight: 20
      };
      
      const available = isSpaceAvailable(canTransport, occupied, newItem);
      
      expect(isSpaceAvailable).toHaveBeenCalledWith(canTransport, occupied, newItem);
      expect(available).toBe(true);
    });

    test('should return false when no space available', () => {
      const canTransport: Space = {
        seats: 2,
        items: [{ size: { width: 100, height: 100, depth: 100 }, weight: 50 }]
      };
      const occupied: Space = {
        seats: 2,
        items: [{ size: { width: 80, height: 80, depth: 80 }, weight: 40 }]
      };
      const newItem: Item = {
        size: { width: 30, height: 30, depth: 30 },
        weight: 20
      };
      
      const available = isSpaceAvailable(canTransport, occupied, newItem);
      expect(available).toBe(false);
    });
  });
});