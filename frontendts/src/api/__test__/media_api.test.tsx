import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    uploadPicture,
    uploadPictureForCompound,
    healthCheck,
    downloadPicture,
    getCompoundImageLink,
} from '@/api/media_api'; // Pfad anpassen

describe('Media API-Funktionen', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    test('uploadPicture sendet Bild und gibt Daten zurück', async () => {
        const file = new File(['test content'], 'test.png', { type: 'image/png' });
        const mockResponse = { imageUrl: 'https://example.com/image.png' };
        mock.onPost('/api/media/image', file).reply(200, mockResponse, {
            'Content-Type': 'application/json',
        });

        const result = await uploadPicture(file);
        expect(result).toEqual(mockResponse);
    });

    test('uploadPictureForCompound sendet Bild für Compound und gibt Daten zurück', async () => {
        const file = new File(['test content'], 'compound.png', { type: 'image/png' });
        const compoundId = 'compound123';
        const mockResponse = { url: 'https://example.com/compound.png' };
        mock.onPost(`/api/media/multi/${compoundId}`, file).reply(200, mockResponse);

        const result = await uploadPictureForCompound(compoundId, file);
        expect(result).toEqual(mockResponse);
    });

    test('healthCheck ruft API auf und gibt Daten zurück', async () => {
        const mockData = { status: 'ok' };
        mock.onGet('/api/media/image').reply(200, mockData);

        const result = await healthCheck();
        expect(result).toEqual(mockData);
    });

    test('downloadPicture ruft API auf und gibt Bilddaten zurück', async () => {
        const pictureId = 'pic123';
        const mockData = { imageUrl: 'https://example.com/image.png' };
        mock.onGet(`/api/media/image/${pictureId}`).reply(200, mockData);

        const result = await downloadPicture(pictureId);
        expect(result).toEqual(mockData);
    });

    test('getCompoundImageLink ruft API auf und gibt Link zurück', async () => {
        const compoundId = 'compound456';
        const mockData = { link: 'https://example.com/compound.png' };
        mock.onGet(`/api/media/multi/${compoundId}`).reply(200, mockData);

        const result = await getCompoundImageLink(compoundId);
        expect(result).toEqual(mockData);
    });
});