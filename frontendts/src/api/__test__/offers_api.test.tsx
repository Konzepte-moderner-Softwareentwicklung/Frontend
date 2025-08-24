import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    createOffer,
    searchOffersByFilter,
    occupyOffer,
    getOfferDetails,
    postRating,
    payOffer,
} from '@/api/offers_api.tsx';
import type {Offer} from "@/pages/drives/drivesService.tsx";

describe('Offer API-Funktionen', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
        // Mock sessionStorage für userID
        sessionStorage.setItem('userID', 'user123');
    });

    afterEach(() => {
        mock.restore();
        sessionStorage.clear();
    });

    test('createOffer sendet Offer und gibt Daten zurück', async () => {
        const offer: Offer = {
            id: "offer123",
            title: "Fahrgelegenheit nach Berlin",
            description: "Ich biete eine Mitfahrgelegenheit nach Berlin an. Platz für 3 Personen.",
            price: 20,
            locationFrom: { latitude: 52.5200, longitude: 13.4050 }, // Berlin
            locationTo: { latitude: 52.5200, longitude: 13.4050 },   // Berlin
            creator: "user123",
            driver: "user123",
            createdAt: new Date().toISOString(),
            isChat: true,
            chatId: "chat456",
            isPhone: true,
            isEmail: false,
            startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // morgen
            endDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // übermorgen
            canTransport: {
                occupiedBy: "user789",
                items: [
                    { size: { width: 50, height: 30, depth: 20 }, weight: 10 },
                    { size: { width: 30, height: 20, depth: 15 }, weight: 2 }
                ],
                seats: 3
            },
            paidSpaces: [
                {
                    occupiedBy: "user789",
                    items: [
                        { size: { width: 50, height: 30, depth: 20 }, weight: 10 },
                        { size: { width: 30, height: 20, depth: 15 }, weight: 2 }
                    ],
                    seats: 3
                }
            ],
            occupiedSpace: [
                {
                    occupiedBy: "user456",
                    items: [
                        { size: { width: 20, height: 10, depth: 10 }, weight: 1 }
                    ],
                    seats: 1
                },
                {
                    occupiedBy: "user789",
                    items: [
                        { size: { width: 40, height: 20, depth: 15 }, weight: 8 }
                    ],
                    seats: 1
                }
            ],
            restrictions: ["Nichtraucher", "Haustiere erlaubt"],
            info: ["Abholort ist die Bushaltestelle am Hauptbahnhof."],
            infoCar: ["Auto ist schwarz, Modell: VW Golf."],
            imageURL: "https://via.placeholder.com/150",
            isGesuch: false,
            ended: false
        };
        const mockResponse = { success: true, offerId: 'offer1' };
        mock.onPost('/angebot', offer).reply(200, mockResponse);

        const result = await createOffer(offer);
        expect(result).toEqual(mockResponse);
    });

    test('searchOffersByFilter sendet Filter und gibt Angebote zurück', async () => {
        const filter = { location: 'Berlin' };
        const mockOffers = [{ id: 'offer1' }, { id: 'offer2' }];
        mock.onPost('/angebot/filter', { filter }).reply(200, mockOffers);

        const result = await searchOffersByFilter(filter);
        expect(result).toEqual(mockOffers);
    });

    test('occupyOffer sendet Nutzer- und Space-Daten und gibt Antwort zurück', async () => {
        const offerId = 'offer123';
        const space = { id: 'space1' };
        const mockResponse = { success: true };
        mock.onPost(`/angebot/${offerId}/occupy`, {
            userId: 'user123',
            space: space,
        }).reply(200, mockResponse);

        const result = await occupyOffer(offerId, space);
        expect(result).toEqual(mockResponse);
    });

    test('getOfferDetails ruft Angebotsdetails ab', async () => {
        const offerId = 'offer456';
        const mockDetails = { id: offerId, name: 'Testangebot' };
        mock.onGet(`/angebot/${offerId}`).reply(200, mockDetails);

        const result = await getOfferDetails(offerId);
        expect(result).toEqual(mockDetails);
    });

    test('postRating sendet Bewertung und gibt Antwort zurück', async () => {
        const offerId = 'offer789';
        const rating = {
            answers: [{ content: 'Gut', value: 4 }],
            comment: 'Sehr zufrieden',
            targetId: 'target1',
            userId: 'user123',
        };
        const mockResponse = { success: true };
        mock.onPost(`/angebot/${offerId}/rating`, { rating }).reply(200, mockResponse);

        const result = await postRating(offerId, rating);
        expect(result).toEqual(mockResponse);
    });

    test('payOffer sendet Zahlungsanfrage und gibt Antwort zurück', async () => {
        const offerId = 'offer101';
        const userId = 'user123';
        const mockResponse = { success: true, paymentId: 'pay123' };
        mock.onPost(`/angebot/${offerId}/pay`, { userId }).reply(200, mockResponse);

        const result = await payOffer(offerId, userId);
        expect(result).toEqual(mockResponse);
    });
});