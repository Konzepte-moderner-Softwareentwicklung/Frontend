import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Drives from "@/pages/drives/Drives.tsx";

import * as drivesService from "@/pages/drives/drivesService";

// Mocks für API-Funktionen
jest.mock("@/pages/drives/drivesService.tsx");
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
describe("Drives Seite", () => {
    beforeEach(() => {
        // Mock alle API-Methoden
        (drivesService.fetchOffersWithFilter as jest.Mock).mockResolvedValue(mockupFahrten);
        (drivesService.getMaxPrice as jest.Mock).mockReturnValue(500);
        (drivesService.getLocationByCity as jest.Mock).mockResolvedValue({ latitude: 52.52, longitude: 13.405 });
    });

    test("lädt Angebote bei Initialisierung", async () => {
        render(<Drives />);
        // Warten auf API-Call
        await waitFor(() => {
            expect(drivesService.fetchOffersWithFilter).toHaveBeenCalled();
        });
        // Überprüfen, ob Angebote gerendert werden
        expect(screen.getByText("Fahrt nach Berlin")).toBeInTheDocument();
        expect(screen.getByText("Gesuch für München")).toBeInTheDocument();
    });

    test("Filter ändert die Angebote", async () => {
        render(<Drives />);
        await waitFor(() => expect(drivesService.fetchOffersWithFilter).toHaveBeenCalled());

        // Filter ändern (z.B. Ort)
        const inputVon = screen.getByPlaceholderText("Ort");
        fireEvent.change(inputVon, { target: { value: "Berlin" } });
        // Die API sollte erneut aufgerufen werden
        await waitFor(() => expect(drivesService.fetchOffersWithFilter).toHaveBeenCalledTimes(2));
    });

    test("Pagination funktioniert", async () => {
        // Mehr Angebote mocken, um mehrere Seiten zu testen
        (drivesService.fetchOffersWithFilter as jest.Mock).mockResolvedValue([
            ...Array(15).fill(0).map((_, i) => ({ id: `${i}`, title: `Fahrt ${i}` }))
        ]);
        render(<Drives />);
        // Warten, bis die Angebote geladen sind
        await waitFor(() => {
            expect(screen.getByText("Fahrt 0")).toBeInTheDocument();
        });

        // Seitenwechsel
        const nextBtn = screen.getByText("Next");
        fireEvent.click(nextBtn);
        // Prüfen, ob die Angebote für Seite 2 gerendert werden
        expect(screen.getByText("Fahrt 10")).toBeInTheDocument();
    });

    test("Fahrt erstellen Button ist aktiviert bei eingeloggt", () => {
        sessionStorage.setItem("token", "abc");
        render(<Drives />);
        expect(screen.getByText("Fahrt erstellen")).not.toBeDisabled();
    });

    test("Fahrt erstellen Button ist deaktiviert bei nicht eingeloggt", () => {
        sessionStorage.removeItem("token");
        render(<Drives />);
        expect(screen.getByText("Fahrt erstellen")).toBeDisabled();
    });
});