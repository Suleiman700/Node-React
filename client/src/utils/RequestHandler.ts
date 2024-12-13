
import { LocalStorage, LOCAL_STORAGE_KEYS } from "./LocalStorage";

class RequestHandler {

    constructor() {}

    private static getToken(): string | null {
        return LocalStorage.getItem(LOCAL_STORAGE_KEYS.JWT.TOKEN);
    }

    public static async get(endpoint: string, params: object = {}): Promise<any> {
        const token = RequestHandler.getToken();
        const headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        // Convert params object to query string
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const urlWithParams = queryString ? `${endpoint}?${queryString}` : endpoint;

        const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: headers,
        });

        const result = {
            status: response.status,
            data: await response.json(),
        };

        return result;
    }

    public static async post(endpoint: string, data: any): Promise<any> {
        const token = RequestHandler.getToken();
        const headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        const result = {
            status: response.status,
            data: await response.json(),
        }

        return result
    }
}

export default RequestHandler;