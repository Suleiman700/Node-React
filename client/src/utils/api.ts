import {CFG_SERVER} from "../config-global";

const API_ROUTES = {
    BASE: `${CFG_SERVER.url}:${CFG_SERVER.port}/api`
}

export const API_ROUTES_USER = {
    LOGIN: `${API_ROUTES.BASE}/user/login`,
    GET_ME: `${API_ROUTES.BASE}/user/me`,
    GET_CAMPAIGNS: `${API_ROUTES.BASE}/user/campaigns`,
    GET_CAMPAIGN: `${API_ROUTES.BASE}/user/campaign`,
    GET_LEADS: `${API_ROUTES.BASE}/user/leads`,
};

export const API_ROUTES_CAMPAIGNS = {
    CAMPAIGNS: `${API_ROUTES.BASE}/campaigns`,
    EDIT: `${API_ROUTES.BASE}/campaigns/edit`,
    CREATE: `${API_ROUTES.BASE}/campaigns/create`,
    DELETE: `${API_ROUTES.BASE}/campaigns/delete`,
};

export const API_ROUTES_USER_CAMPAIGN_PLATFORMS = {
    PLATFORMS: `${API_ROUTES.BASE}/user-campaign-platforms`,
    DELETE: `${API_ROUTES.BASE}/user-campaign-platforms/delete`,
};

export const API_ROUTES_LEAD = {
    LIST: `${API_ROUTES.BASE}/lead`,
    DELETE: `${API_ROUTES.BASE}/lead/delete`,
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
    return authenticatedRequest(API_ROUTES_USER.GET_ME);
};