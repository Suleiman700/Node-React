import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUserData, fetchUserData, UserData } from '../utils/api';

interface AccountContextType {
    user: UserData | null;
    loading: boolean;
    updateUser: (userData: UserData) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(() => getStoredUserData());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                // First, check localStorage
                const storedUser = getStoredUserData();
                
                if (storedUser) {
                    setUser(storedUser);
                    // Fetch fresh data in the background
                    try {
                        const freshUserData = await fetchUserData();
                        setUser(freshUserData);
                    } catch (error) {
                        // If the fetch fails, we still have the stored data
                        console.error('Failed to fetch fresh user data:', error);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const updateUser = (userData: UserData) => {
        setUser(userData);
    };

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <AccountContext.Provider value={{ user, loading, updateUser }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};
