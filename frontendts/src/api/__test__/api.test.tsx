
import MockAdapter from 'axios-mock-adapter';
import api from '@/api/api'; // Passe den Pfad zu deiner Datei an

describe('API', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Setze sessionStorage Werte vor jedem Test
        sessionStorage.setItem('token', 'meinToken123');
        sessionStorage.setItem('UserID', 'benutzer123');

        // Erstelle eine neue Mock-Instanz
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
        sessionStorage.clear();
    });

    test('soll Header mit Token und UserID bei Anfrage setzen', async () => {
        // Mocken der GET-Anfrage
        mock.onGet('/api/test').reply((config) => {
            // Prüfe, ob die Header gesetzt wurden
            expect(config.headers['Authorization']).toBe('meinToken123');
            expect(config.headers['UserId']).toBe('benutzer123');
            return [200, { success: true }];
        });

        // Führe die Anfrage aus
        const response = await api.get('/test');

        expect(response.status).toBe(200);
        expect(response.data).toEqual({ success: true });
    });

    test('soll keine Header setzen, wenn kein Token vorhanden ist', async () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('UserID');

        mock.onGet('/api/test').reply((config) => {
            // Header sollten nicht gesetzt sein
            expect(config.headers['Authorization']).toBeUndefined();
            expect(config.headers['UserId']).toBeUndefined();
            return [200, { success: true }];
        });

        const response = await api.get('/test');
        expect(response.status).toBe(200);
    });

    test('soll Fehler loggen bei Response Fehler', async () => {
        // Mocken der Fehlerantwort
        mock.onGet('/api/error').reply(500, { message: 'Server Fehler' });
        console.error = jest.fn();

        try {
            await api.get('/error');
        } catch (err) {
            // Erwartung, dass der Fehler abgeworfen wird
            // @ts-ignore
            expect(err.response.status).toBe(500);
        }

        expect(console.error).toHaveBeenCalledWith(
            'API Fehler:',
            expect.objectContaining({ response: expect.any(Object) })
        );
    });
});