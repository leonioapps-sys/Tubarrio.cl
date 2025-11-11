import React, { useState, useCallback } from 'react';
import { Listing, Vendor } from './types';
import { MOCK_VENDORS, MOCK_LISTINGS } from './constants';
import Header from './components/Header';
import LeftSidebar from './components/MapView'; // Repurposed from MapView
import Feed from './components/ListingsGrid'; // Repurposed from ListingsGrid
import RightSidebar from './components/VendorProfile'; // Repurposed from VendorProfile


const App: React.FC = () => {
    const [vendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = useCallback(() => {
        // In a real app, this would trigger the Google OAuth flow.
        // For this demo, we'll just simulate being logged in.
        setIsLoggedIn(true);
        console.log("User logged in (simulated).");
    }, []);

    const getVendorById = (id: number): Vendor | undefined => {
        return vendors.find(v => v.id === id);
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-gray-800">
            <Header isLoggedIn={isLoggedIn} />
            <main className="max-w-[1200px] mx-auto grid grid-cols-[280px_minmax(0,_1fr)_300px] gap-6 pt-6 px-4">
                <LeftSidebar onLogin={handleLogin} isLoggedIn={isLoggedIn} />
                <Feed listings={listings} vendors={vendors} getVendorById={getVendorById} />
                <RightSidebar listings={listings} getVendorById={getVendorById} />
            </main>
        </div>
    );
};

export default App;