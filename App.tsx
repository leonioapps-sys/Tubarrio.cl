
import React, { useState, useCallback, useMemo } from 'react';
import { Listing, Vendor, ViewCategory, ListingType, UserProfile, Notification } from './types';
import { MOCK_VENDORS, MOCK_LISTINGS, MOCK_USER, MOCK_NOTIFICATIONS } from './constants';
import Header from './components/Header';
import LeftSidebar from './components/MapView';
import Feed from './components/ListingsGrid';
import RightSidebar from './components/VendorProfile';
import CreateBusinessModal from './components/CreateBusinessModal';
import BusinessDetailView from './components/BusinessDetailView';
import PublicationFlow from './components/PublicationFlow';
import useGeolocation from './hooks/useGeolocation';
import LocalBusinessDirectory from './components/LocalBusinessDirectory';
import ListingDetailModal from './components/ListingDetailModal';


const App: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    // Initialize listings with some belonging to the mock user for testing deletion
    const [listings, setListings] = useState<Listing[]>(() => {
        return MOCK_LISTINGS.map(l => {
            // Assign ownership of specific mock items to the mock user for demo purposes
            if ([7, 8, 13].includes(l.id)) {
                return { ...l, userId: MOCK_USER.id };
            }
            return l;
        });
    });
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentView, setCurrentView] = useState<ViewCategory>('home');
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Geolocation for "Cercanos" logic
    const { location, requestLocation } = useGeolocation();

    // Recommendation/History States
    const [viewedListingIds, setViewedListingIds] = useState<number[]>([]);
    const [categoryPreferences, setCategoryPreferences] = useState<Record<ListingType, number>>({} as any);

    // Modal States
    const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    
    // Navigation State (View Detail)
    const [viewingVendorId, setViewingVendorId] = useState<number | null>(null);
    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

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
            userId: user?.id, // Assign current user as owner
            createdAt: new Date().toISOString(),
            status: 'active' 
        };

        setVendors(prev => [vendor, ...prev]);
        setListings(prev => [listing, ...prev]);
        setIsCreateBusinessOpen(false);
        setCurrentView('local-business'); // Navigate to the section to see the result
    };
    
    const handlePublish = (newListingData: Omit<Listing, 'id' | 'vendorId' | 'createdAt' | 'status'>) => {
        if (!user) return;
        
        const listingId = Math.max(...listings.map(l => l.id)) + 1;
        const vendorId = 999; 

        // Determine Status: Pending for Complaints, Active for others.
        const status = newListingData.type === ListingType.CitizenComplaint ? 'pending' : 'active';

        const listing: Listing = {
            ...newListingData,
            id: listingId,
            vendorId: vendorId,
            userId: user.id,
            createdAt: new Date().toISOString(),
            status: status
        };
        
        // We need a dummy vendor for this user if it doesn't exist to avoid crash in Feed looking for vendor
        const existingVendor = vendors.find(v => v.id === vendorId);
        if (!existingVendor) {
            const userVendor: Vendor = {
                id: vendorId,
                name: user.name,
                logo: user.photoUrl,
                description: 'Vecino de Antofagasta',
                rating: 5,
                reviews: 0,
                isVerified: true
            };
            setVendors(prev => [...prev, userVendor]);
        }

        setListings(prev => [listing, ...prev]);
        setIsPublishing(false);
        
        if (status === 'pending') {
            alert("Tu denuncia ciudadana ha sido enviada y está pendiente de aprobación por parte de los administradores.");
            setCurrentView('complaints');
        } else {
            // Determine view based on type
            if ([ListingType.Product, ListingType.Free, ListingType.Barter, ListingType.GarageSale].includes(listing.type)) {
                setCurrentView('marketplace');
            } else if (listing.type === ListingType.HealthBeauty) {
                setCurrentView('health-beauty');
            } else if (listing.type === ListingType.Service) {
                setCurrentView('services');
            } else if (listing.type === ListingType.Job) {
                setCurrentView('jobs');
            } else {
                setCurrentView('home');
            }
        }
    };

    const handleDeleteListing = (id: number) => {
        setListings(prev => prev.filter(l => l.id !== id));
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

        // If it is a purely LocalBusiness listing (the business profile card), open the business detail view
        // Otherwise (Products, Services, Jobs, etc.), open the new Modal Detail View
        if (listing.type === ListingType.LocalBusiness && listing.price === 0) {
             setViewingVendorId(listing.vendorId);
             window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setSelectedListingId(listing.id);
        }
    };

    const handleBackFromDetail = () => {
        setViewingVendorId(null);
    };

    const handleVendorClick = (vendorId: number) => {
        setViewingVendorId(vendorId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Helper to normalize text for search (remove accents, lowercase)
    const normalizeText = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredListings = useMemo(() => {
        const now = new Date();
        const EXPIRATION_DAYS = 15;

        return listings.filter(listing => {
            // 1. Status and Expiration Logic
            if (listing.status !== 'active') return false; // This handles 'pending' state automatically

            // "LocalBusiness" type does NOT expire.
            // All other types (Free, Product, Service, etc.) expire after 15 days.
            if (listing.type !== ListingType.LocalBusiness) {
                const created = new Date(listing.createdAt);
                const diffTime = Math.abs(now.getTime() - created.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > EXPIRATION_DAYS) {
                    return false; // Expired
                }
            }

            // 2. Search Query Filter
            if (searchQuery.trim()) {
                const q = normalizeText(searchQuery);
                const title = normalizeText(listing.title);
                const desc = normalizeText(listing.description);
                const type = normalizeText(listing.type);
                
                const vendor = vendors.find(v => v.id === listing.vendorId);
                const vendorName = vendor ? normalizeText(vendor.name) : '';

                // Check if query exists in title, description, type or vendor name
                const matchesSearch = title.includes(q) || desc.includes(q) || type.includes(q) || vendorName.includes(q);
                
                if (!matchesSearch) return false;
            }

            // 3. View Category Filter
            switch (currentView) {
                case 'home':
                    return true; // Show all (filtered by search)
                case 'marketplace':
                    return [ListingType.Product, ListingType.Barter, ListingType.GarageSale, ListingType.Free].includes(listing.type);
                case 'health-beauty':
                    return listing.type === ListingType.HealthBeauty;
                case 'jobs':
                    return listing.type === ListingType.Job;
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
    }, [listings, currentView, searchQuery, vendors]);

    const viewingVendor = viewingVendorId ? getVendorById(viewingVendorId) : null;
    const selectedListing = selectedListingId ? listings.find(l => l.id === selectedListingId) : null;
    const selectedListingVendor = selectedListing ? getVendorById(selectedListing.vendorId) : null;
    
    // Logic to determine if Right Sidebar should be visible
    // Only visible on 'home' and when NOT viewing a business detail
    const showRightSidebar = currentView === 'home' && !viewingVendorId;

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-gray-800">
            <Header 
                isLoggedIn={isLoggedIn} 
                user={user}
                notifications={notifications}
                onToggleEmailNotifications={handleToggleEmailNotifications}
                onMarkNotificationsRead={handleMarkNotificationsRead}
                onSearch={setSearchQuery} // Pass search handler
            />
            <main className={`max-w-[1200px] mx-auto grid gap-6 pt-6 px-4 transition-all duration-300 ${showRightSidebar ? 'grid-cols-[280px_minmax(0,_1fr)_300px]' : 'grid-cols-[280px_minmax(0,_1fr)]'}`}>
                <LeftSidebar 
                    onLogin={handleLogin} 
                    isLoggedIn={isLoggedIn} 
                    currentView={currentView}
                    onNavigate={(view) => {
                        setCurrentView(view);
                        setViewingVendorId(null); // Reset detail view on nav change
                    }}
                    onPublish={() => setIsPublishing(true)}
                />
                
                {/* Main Content Area: Swaps between Feed and Detail View */}
                {viewingVendorId && viewingVendor ? (
                    <BusinessDetailView vendor={viewingVendor} onBack={handleBackFromDetail} />
                ) : currentView === 'local-business' ? (
                    // New Directory View for Local Businesses
                    <LocalBusinessDirectory 
                         vendors={vendors}
                         onVendorClick={handleVendorClick}
                         searchQuery={searchQuery}
                    />
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
                        onDeleteListing={handleDeleteListing}
                        currentUserId={user?.id}
                    />
                )}

                {showRightSidebar && (
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
            
            {isPublishing && (
                <PublicationFlow 
                    onCancel={() => setIsPublishing(false)}
                    onPublish={handlePublish}
                />
            )}

            {/* Detail Modal */}
            {selectedListing && selectedListingVendor && (
                <ListingDetailModal 
                    listing={selectedListing}
                    vendor={selectedListingVendor}
                    onClose={() => setSelectedListingId(null)}
                    isLoggedIn={isLoggedIn}
                    onLoginRequest={handleLogin}
                />
            )}
        </div>
    );
};

export default App;
