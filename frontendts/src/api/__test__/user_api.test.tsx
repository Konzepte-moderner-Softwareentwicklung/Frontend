import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    getUserID,
    getAllUsers,
    getUserByEmail,
    getUserByID,
    getUserRating,
    getUserRatingbyID,
    login,
    register,
    loginWithWebAuthn,
    registerWithWebAuthn,
    registerOptionsWithWebAuthn,
    updateUser,
    deleteUser,
} from '@/api/user_api.tsx'; // Pfad anpassen

describe('User API-Funktionen', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    test('getUserID ruft /user/self auf', async () => {
        const mockData = { id: 'user123' };
        mock.onGet('/user/self').reply(200, mockData);

        const result = await getUserID();
        expect(result).toEqual(mockData);
    });

    test('getAllUsers ruft /user auf', async () => {
        const mockData = [{ id: 'user1' }, { id: 'user2' }];
        mock.onGet('/user').reply(200, mockData);

        const result = await getAllUsers();
        expect(result).toEqual(mockData);
    });

    test('getUserByEmail ruft /user/email auf', async () => {
        const mockData = { email: 'test@example.com' };
        mock.onGet('/user/email').reply(200, mockData);

        const result = await getUserByEmail();
        expect(result).toEqual(mockData);
    });

    test('getUserByID ruft /user/:id auf', async () => {
        const userId = 'user123';
        const mockData = { id: userId, name: 'Test User' };
        mock.onGet(`/user/${userId}`).reply(200, mockData);

        const result = await getUserByID(userId);
        expect(result).toEqual(mockData);
    });

    test('getUserRating ruft /user/ auf', async () => {
        const mockData = [{ rating: 5 }, { rating: 4 }];
        mock.onGet('/user/').reply(200, mockData);

        const result = await getUserRating();
        expect(result).toEqual(mockData);
    });

    test('getUserRatingbyID ruft /user/:id/rating auf', async () => {
        const userId = 'user456';
        const mockData = [{ rating: 3 }];
        mock.onGet(`/user/${userId}/rating`).reply(200, mockData);

        const result = await getUserRatingbyID(userId);
        expect(result).toEqual(mockData);
    });

    test('login sendet Daten an /user/login', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const mockData = { token: 'abc123' };
        mock.onPost('/user/login', { email, password }).reply(200, mockData);

        const result = await login(email, password);
        expect(result).toEqual(mockData);
    });

    test('register sendet Daten an /user/', async () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const email = 'john@example.com';
        const password = 'pass';
        const mockData = { success: true };
        mock.onPost('/user/', { firstName, lastName, email, password }).reply(200, mockData);

        const result = await register(firstName, lastName, email, password);
        expect(result).toEqual(mockData);
    });

    // Für die WebAuthn-Methoden kannst du similar mocken, hier nur Platzhalter, da die Endpunkte noch unbestimmt sind.
    test('loginWithWebAuthn ruft POST auf', async () => {
        mock.onPost('/', {}).reply(200, { auth: 'webAuthnToken' });
        const result = await loginWithWebAuthn();
        expect(result).toEqual({ auth: 'webAuthnToken' });
    });

    test('registerWithWebAuthn ruft POST auf', async () => {
        mock.onPost('/', {}).reply(200, { register: true });
        const result = await registerWithWebAuthn();
        expect(result).toEqual({ register: true });
    });

    test('registerOptionsWithWebAuthn ruft POST auf', async () => {
        mock.onPost('/', {}).reply(200, { options: {} });
        const result = await registerOptionsWithWebAuthn();
        expect(result).toEqual({ options: {} });
    });

    test('updateUser sendet PUT an /', async () => {
        mock.onPut('/', {}).reply(200, { updated: true });
        const result = await updateUser();
        expect(result).toEqual({ updated: true });
    });

    test('deleteUser sendet DELETE an /', async () => {
        mock.onDelete('/', {}).reply(200, { deleted: true });
        const result = await deleteUser();
        expect(result).toEqual({ deleted: true });
    });
});