import { render, screen, waitFor } from "@testing-library/react";
import Home from '@/pages/Home.tsx';
import { searchOffersByFilter } from "@/api/offers_api.tsx";
import RideCard from "@/components/RideCard.tsx";
import { jest } from '@jest/globals'; // Für `jest.fn()` und `jest.mock()`
import api from "@/api/api.tsx";

const mockupFahrten =  [{
    "0": {
        "id": "6dd3c3d5-1997-4730-b3a3-6ffe92f62c69",
        "driver": "c59154d0-b312-4201-8b88-56483d34ec82",
        "isGesuch": false,
        "title": "Schneller Ausflug nach Berlin",
        "description": "",
        "price": 5,
        "locationFrom": {
            "longitude": 8.6938161,
            "latitude": 50.5808795
        },
        "locationTo": {
            "longitude": 13.3989367,
            "latitude": 52.510885
        },
        "creator": "c59154d0-b312-4201-8b88-56483d34ec82",
        "createdAt": "2025-08-23T16:05:19.502Z",
        "isChat": true,
        "isPhone": true,
        "isEmail": true,
        "startDateTime": "2025-08-24T00:00:00Z",
        "endDateTime": "2025-08-25T00:00:00Z",
        "canTransport": {
            "occupiedBy": "c59154d0-b312-4201-8b88-56483d34ec82",
            "items": [
                {
                    "size": {
                        "width": 1,
                        "height": 1,
                        "depth": 1
                    },
                    "weight": 1
                }
            ],
            "seats": 3
        },
        "occupiedSpace": [
            {
                "occupiedBy": "b1fba847-5d22-4dcc-af95-489517a17707",
                "items": null,
                "seats": 0
            }
        ],
        "paidSpaces": [],
        "restrictions": [
            ""
        ],
        "info": [
            ""
        ],
        "infoCar": [
            ""
        ],
        "imageURL": "8219eba6-955e-4722-b977-ca190f66291c"
    }
},{
    "1": {
        "id": "c7c2b6e7-c155-4b04-a917-9b346c8a7a75",
        "driver": "c59154d0-b312-4201-8b88-56483d34ec82",
        "isGesuch": true,
        "title": "AA",
        "description": "",
        "price": 0,
        "locationFrom": {
            "longitude": 0,
            "latitude": 0
        },
        "locationTo": {
            "longitude": 0,
            "latitude": 0
        },
        "creator": "c59154d0-b312-4201-8b88-56483d34ec82",
        "createdAt": "2025-08-23T16:08:29.579Z",
        "isChat": false,
        "isPhone": false,
        "isEmail": false,
        "startDateTime": "2075-08-23T16:08:29.576Z",
        "endDateTime": "2075-08-23T16:08:29.576Z",
        "canTransport": {
            "occupiedBy": "c59154d0-b312-4201-8b88-56483d34ec82",
            "items": [
                {
                    "size": {
                        "width": 0,
                        "height": 0,
                        "depth": 0
                    },
                    "weight": 0
                }
            ],
            "seats": 4
        },
        "occupiedSpace": [
            {
                "occupiedBy": "c59154d0-b312-4201-8b88-56483d34ec82",
                "items": [
                    {
                        "size": {
                            "width": 0,
                            "height": 0,
                            "depth": 0
                        },
                        "weight": 0
                    }
                ],
                "seats": 4
            }
        ],
        "paidSpaces": [],
        "restrictions": [
            ""
        ],
        "info": [
            ""
        ],
        "infoCar": [
            ""
        ],
        "imageURL": "b331220e-5582-407f-8477-3ea1ca1d96da"
    }
}];

const date = new Date();
// Mock components to avoid rendering complexity
jest.mock("@/components/OfferWrapper.tsx", () => () => (
    <RideCard
        from={"Gießen"}
        to={"Frankfurt Am Main"}
        price={20}
        startDateTime={date.setDate(date.getDate()+1).toString()}
        endDateTime={date.setDate(date.getDate()+2).toString()}
    />
));
const mockedApi = api as jest.Mocked<typeof api>;
jest.mock('@/api/offers_api.tsx', () => ({
    searchOffersByFilter: jest.fn()
}));
jest.mock('@/api/api.tsx');
describe("Home component", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Zeigt Ladezustand an", async () => {
        mockedApi.post.mockResolvedValueOnce({
            data:mockupFahrten
        });

        render(<Home />);

        // Sofort sollte Ladezustand erscheinen
        expect(screen.getByText(/Lade Fahrten/i)).toBeInTheDocument();

        // Warten bis API-Call fertig
        await waitFor(() => {
            expect(searchOffersByFilter).toHaveBeenCalled();
        });
    });

    test("Zeigt Hinweis wenn keine Fahrten vorhanden sind", async () => {
        mockedApi.post.mockResolvedValueOnce({
            data: []
        });

        render(<Home />);

        await waitFor(() =>
            expect(
                screen.getByText(/Aktuell gibt es keine Fahrten/i)
            ).toBeInTheDocument()
        );
    });

    test("Zeigt Fahrten wenn welche vorhanden sind", async () => {
        const mockRides = [
            { title: "Fahrt 1" },
            { title: "Fahrt 2" },
        ];
        mockedApi.post.mockResolvedValueOnce({
            data: mockupFahrten
        });

        render(<Home />);

        await waitFor(() =>
            expect(screen.getByText(/Aktuelle Fahrten/i)).toBeInTheDocument()
        );

        // Wrapper prüfen
        const offers = screen.getAllByTestId("offer-wrapper");
        expect(offers).toHaveLength(mockRides.length);
    });

    test("zeigt maximal 5 Fahrten an", async () => {
        const testFahrten = Array.from({ length: 10 }, (_, i) => ({ title: `Fahrt ${i+1}` }));
        mockedApi.post.mockResolvedValueOnce({
            data: testFahrten
        });

        render(<Home />);


        await waitFor(() =>
            expect(screen.getByText(/Aktuelle Fahrten/i)).toBeInTheDocument()
        );
        expect(searchOffersByFilter).toHaveBeenCalled();
        const offers = screen.getAllByTestId("offer-wrapper");
        expect(offers).toHaveLength(5); // Begrenzung prüfen
    });
});
