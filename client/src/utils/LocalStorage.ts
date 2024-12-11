export class LocalStorage {
    private static _preafix: string = 'my_app_';

    // Store a value in localStorage
    static setItem(key: string, value: string): void {
        localStorage.setItem(LocalStorage._preafix + key, value);
    }

    // Retrieve a value from localStorage
    static getItem(key: string): string | null {
        return localStorage.getItem(LocalStorage._preafix + key);
    }

    // Remove a value from localStorage
    static removeItem(key: string): void {
        localStorage.removeItem(LocalStorage._preafix + key);
    }

    // Clear all values from localStorage
    static clear(): void {
        localStorage.clear();
    }
}

export const LOCAL_STORAGE_KEYS = {
    JWT: {
        TOKEN: 'token',
    },
    USER: {
        BASIC_INFO: 'basic_info',
    },
}
