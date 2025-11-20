
import React, { useState, useCallback, useMemo } from 'react';
import { Listing, Vendor, ViewCategory, ListingType, UserProfile, Notification } from './types';
import { MOCK_VENDORS, MOCK_LISTINGS, MOCK_USER, MOCK_NOTIFICATIONS } from './constants';
import Header from './components/Header';
import LeftSidebar from './components/MapView';
import Feed from './components/ListingsGrid';
import RightSidebar from './components/VendorProfile';
import CreateBusinessModal from './components/CreateBusinessModal';
import BusinessDetailView from './components/BusinessDetailView';
import useGeolocation from './hooks/useGeolocation';


const App: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentView, setCurrentView] = useState<ViewCategory>('home');
    
    // Geolocation for "Cercanos" logic
    const { location, requestLocation } = useGeolocation();

    // Recommendation/History States
    const [viewedListingIds, setViewedListingIds] = useState<number[]>([]);
    const [categoryPreferences, setCategoryPreferences] = useState<Record<ListingType, number>>({} as any);

    // Modal States
    const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);
    
    // Navigation State (View Detail)
    const [viewingVendorId, setViewingVendorId] = useState<number | null>(null);

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
        setUser(MOCK_USER); // Simulate fetching Google Profile
        setNotifications(MOCK_NOTIFICATIONS); // Load notifications
        console.log("User logged in with Google Profile:", MOCK_USER.name);
    }, []);

    const getVendorById = (id: number): Vendor | undefined => {
        return vendors.find(v => v.id === id);
    };

    const handleToggleEmailNotifications = (enabled: boolean) => {
        if (user) {
            setUser({ ...user, emailNotificationsEnabled: enabled });
            // Here you would typically make an API call to update settings
            console.log("Email notifications set to:", enabled);
        }
    };

    const handleMarkNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleCreateBusiness = (newVendor: Vendor, newListing: Omit<Listing, 'id' | 'vendorId' | 'createdAt' | 'status'>) => {
        // Generate IDs
        const vendorId = Math.max(...vendors.map(v => v.id)) + 1;
        const listingId = Math.max(...listings.map(l => l.id)) + 1;
        
        const vendor: Vendor = { ...newVendor, id: vendorId };
        const listing: Listing = { 
            ...newListing, 
            id: listingId, 
            vendorId: vendorId, 
            createdAt: new Date().toISOString(),
            status: 'active' 
        };

        setVendors(prev => [vendor, ...prev]);
        setListings(prev => [listing, ...prev]);
        setIsCreateBusinessOpen(false);
        setCurrentView('local-business'); // Navigate to the section to see the result
    };

    const handleListingClick = (listing: Listing) => {
        // Record history (Reciente)
        setViewedListingIds(prev => {
            // Remove if exists then add to front to keep unique and order by recency
            const newHistory = [listing.id, ...prev.filter(id => id !== listing.id)];
            return newHistory.slice(0, 20); // Keep last 20
        });

        // Record preference (Para ti)
        setCategoryPreferences(prev => ({
            ...prev,
            [listing.type]: (prev[listing.type] || 0) + 1
        }));

        // If it is a local business listing, open the business detail view
        if (listing.type === ListingType.LocalBusiness) {
            setViewingVendorId(listing.vendorId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log("Clicked listing:", listing.title);
        }
    };

    const handleBackFromDetail = () => {
        setViewingVendorId(null);
    };

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            if (listing.status !== 'active') return false;

            switch (currentView) {
                case 'home':
                    return true; // Show all
                case 'marketplace':
                    return [ListingType.Product, ListingType.Barter, ListingType.GarageSale, ListingType.Free].includes(listing.type);
                case 'services':
                    return listing.type === ListingType.Service;
                case 'pets':
                    return listing.type === ListingType.Pet;
                case 'rentals':
                    return listing.type === ListingType.Rental;
                case 'transport':
                    return listing.type === ListingType.Transport;
                case 'local-business':
                    return listing.type === ListingType.LocalBusiness;
                case 'events':
                    return listing.type === ListingType.Event;
                case 'complaints':
                    return listing.type === ListingType.CitizenComplaint;
                default:
                    return true;
            }
        });
    }, [listings, currentView]);

    const viewingVendor = viewingVendorId ? getVendorById(viewingVendorId) : null;

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-gray-800">
            <Header 
                isLoggedIn={isLoggedIn} 
                user={user}
                notifications={notifications}
                onToggleEmailNotifications={handleToggleEmailNotifications}
                onMarkNotificationsRead={handleMarkNotificationsRead}
            />
            <main className={`max-w-[1200px] mx-auto grid gap-6 pt-6 px-4 transition-all duration-300 ${viewingVendorId ? 'grid-cols-[280px_minmax(0,_1fr)]' : 'grid-cols-[280px_minmax(0,_1fr)_300px]'}`}>
                <LeftSidebar 
                    onLogin={handleLogin} 
                    isLoggedIn={isLoggedIn} 
                    currentView={currentView}
                    onNavigate={(view) => {
                        setCurrentView(view);
                        setViewingVendorId(null); // Reset detail view on nav change
                    }}
                />
                
                {/* Main Content Area: Swaps between Feed and Detail View */}
                {viewingVendorId && viewingVendor ? (
                    <BusinessDetailView vendor={viewingVendor} onBack={handleBackFromDetail} />
                ) : (
                    <Feed 
                        listings={filteredListings} 
                        vendors={vendors} 
                        getVendorById={getVendorById} 
                        currentView={currentView}
                        onListingClick={handleListingClick}
                        userLocation={location}
                        requestLocation={requestLocation}
                        viewedListingIds={viewedListingIds}
                        categoryPreferences={categoryPreferences}
                        isLoggedIn={isLoggedIn}
                        onLoginRequest={handleLogin}
                    />
                )}

                {!viewingVendorId && (
                    <RightSidebar 
                        listings={listings} 
                        getVendorById={getVendorById} 
                        onCreateBusiness={() => setIsCreateBusinessOpen(true)}
                    />
                )}
            </main>

            {isCreateBusinessOpen && (
                <CreateBusinessModal 
                    onClose={() => setIsCreateBusinessOpen(false)} 
                    onCreate={handleCreateBusiness} 
                />
            )}
        </div>
    );
};

export default App;
