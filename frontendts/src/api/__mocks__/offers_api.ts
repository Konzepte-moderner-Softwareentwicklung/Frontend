export const createOffer = jest.fn(() => 
  Promise.resolve({ 
    success: true, 
    id: 'new-offer-123',
    message: 'Offer created successfully' 
  })
);

export const searchOffersByFilter = jest.fn((filter: any) => 
  Promise.resolve([
    { id: 'offer-1', title: 'Test Offer 1' },
    { id: 'offer-2', title: 'Test Offer 2' }
  ])
);

export const occupyOffer = jest.fn((id: string) => 
  Promise.resolve({ 
    success: true, 
    message: `Offer ${id} occupied successfully` 
  })
);