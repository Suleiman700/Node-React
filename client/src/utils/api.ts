import {CFG_SERVER} from "../config-global";

const API_ROUTES = {
    BASE: `${CFG_SERVER.url}:${CFG_SERVER.port}/api`
}

export const API_ROUTES_ADMIN = {
    // GET_DATA: `${API_ROUTES.BASE}/admin/`,
    LOGIN: `${API_ROUTES.BASE}/admin/login`,
    GET_ME: `${API_ROUTES.BASE}/admin/me`
};

// User data interface
interface UserData {
    id: string;
    name: string;
    role: string;
}

// Store user data in localStorage
export const storeUserData = (userData: UserData, token: string) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', token);
};

// Get stored user data
export const getStoredUserData = (): UserData | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

// Get auth token
export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// API request helper with auth header
export const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    return response.json();
};

// Get logged in user data from server
export const fetchUserData = async (): Promise<UserData> => {
    return authenticatedRequest(API_ROUTES_ADMIN.GET_USER);
};