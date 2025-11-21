
import React, { useState, useMemo } from 'react';
import { Listing, Vendor, ViewCategory, Coordinates } from '../types';
import PostCard from './ListingCard';
import { PlusCircleIcon, MapPinIcon, ChevronDownIcon } from './Icons';


interface FeedProps {
    listings: Listing[];
    vendors: Vendor[];
    getVendorById: (id: number) => Vendor | undefined;
    currentView: ViewCategory;
    onListingClick: (listing: Listing) => void;
    
    // New props for Smart Filters
    userLocation: Coordinates | null;
    requestLocation: () => void;
    viewedListingIds: number[];
    categoryPreferences: Record<string, number>;
    isLoggedIn: boolean;
    onLoginRequest: () => void;

    // Deletion Props
    onDeleteListing: (id: number) => void;
    currentUserId?: string;
}

type FilterType = 'recommended' | 'recent' | 'nearby' | 'popular';

const getViewTitle = (view: ViewCategory): string => {
    switch (view) {
        case 'home': return 'Inicio';
        case 'marketplace': return 'A la venta y gratis';
        case 'health-beauty': return 'Salud y belleza';
        case 'jobs': return 'Bolsa de Empleos';
        case 'services': return 'Servicios profesionales';
        case 'pets': return 'Para tu mascota';
        case 'rentals': return 'Arriendos inmobiliarios';
        case 'transport': return 'Transportes y Fletes';
        case 'local-business': return 'Emprendedores Locales';
        case 'events': return 'Eventos en tu zona';
        case 'complaints': return 'Denuncias Ciudadanas';
        default: return 'Publicaciones';
    }
};

const getEmptyStateMessage = (view: ViewCategory, activeFilter: FilterType) => {
    if (activeFilter === 'recent') return 'No has visto avisos recientemente.';
    if (activeFilter === 'nearby') return 'No encontramos avisos cercanos con tu ubicación actual.';
    
    switch (view) {
        case 'marketplace': return 'No hay productos a la venta o gratis por el momento.';
        case 'health-beauty': return 'No hay servicios de salud o belleza por el momento.';
        case 'jobs': return 'No hay ofertas de empleo disponibles.';
        case 'services': return 'No hay servicios disponibles por ahora.';
        case 'pets': return 'No hay publicaciones de mascotas por ahora.';
        case 'rentals': return 'No hay propiedades en arriendo disponibles.';
        case 'transport': return 'No hay servicios de transporte registrados.';
        case 'local-business': return 'No hay emprendimientos registrados aún.';
        case 'events': return 'No hay eventos próximos.';
        case 'complaints': return 'No hay denuncias activas en este momento.';
        default: return 'No hay publicaciones aún en esta categoría.';
    }
};

// Haversine formula to calculate distance in KM
const calculateDistance = (coord1: Coordinates, coord2: Coordinates) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
};


const Feed: React.FC<FeedProps> = ({ 
    listings, 
    vendors, 
    getVendorById, 
    currentView, 
    onListingClick,
    userLocation,
    requestLocation,
    viewedListingIds,
    categoryPreferences,
    isLoggedIn,
    onLoginRequest,
    onDeleteListing,
    currentUserId
}) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('recommended');

    // Determine Layout Mode
    // 'feed' for Home, 'grid' for Marketplace, Services, etc.
    const layoutMode = currentView === 'home' ? 'feed' : 'grid';

    const FilterButton = ({ label, type }: { label: string, type: FilterType }) => (
        <button 
            onClick={() => {
                setActiveFilter(type);
                if (type === 'nearby' && !userLocation) {
                    requestLocation();
                }
            }}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors whitespace-nowrap ${activeFilter === type ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
            {label}
        </button>
    );

    const DropdownFilter = ({ label }: { label: string }) => (
        <button className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            {label}
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        </button>
    );

    const sortedListings = useMemo(() => {
        let processed = [...listings];

        switch (activeFilter) {
            case 'recommended': // "Para ti" - Based on category preferences
                processed = processed.sort((a, b) => {
                    const scoreA = categoryPreferences[a.type] || 0;
                    const scoreB = categoryPreferences[b.type] || 0;
                    return scoreB - scoreA; // Higher score first
                });
                break;

            case 'recent': // "Reciente" - Based on viewed history
                processed = processed.filter(l => viewedListingIds.includes(l.id));
                // Sort by index in viewedListingIds (most recent first)
                processed.sort((a, b) => {
                    return viewedListingIds.indexOf(a.id) - viewedListingIds.indexOf(b.id);
                });
                break;

            case 'nearby': // "Cercanos" - Based on User Location
                if (userLocation) {
                    processed = processed.sort((a, b) => {
                        const distA = calculateDistance(userLocation, a.location);
                        const distB = calculateDistance(userLocation, b.location);
                        return distA - distB; // Closest first
                    });
                }
                break;

            case 'popular': // "Populares" - Likes + Comments
                processed = processed.sort((a, b) => {
                    const interactionsA = (a.likes || 0) + (a.comments?.length || 0);
                    const interactionsB = (b.likes || 0) + (b.comments?.length || 0);
                    return interactionsB - interactionsA; // Highest interactions first
                });
                break;
        }
        return processed;
    }, [listings, activeFilter, viewedListingIds, categoryPreferences, userLocation]);

    const handlePublishClick = () => {
        if (!isLoggedIn) {
            onLoginRequest();
        } else {
            console.log("Open publish modal");
        }
    };

    return (
        <section className="space-y-4 pb-10">
            
            {/* --- HEADER & FILTER SECTION --- */}
            {layoutMode === 'feed' ? (
                 // HOME / FEED HEADER
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-[70px] z-20">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-gray-800">{getViewTitle(currentView)}</h2>
                        <button onClick={handlePublishClick} className="sm:hidden flex items-center gap-1 text-green-600 font-semibold text-sm">
                            <PlusCircleIcon className="w-5 h-5" /> Publicar
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
                            <FilterButton label="Para ti" type="recommended" />
                            <FilterButton label="Reciente" type="recent" />
                            <FilterButton label="Cercanos" type="nearby" />
                            <FilterButton label="Popular" type="popular" />
                        </div>
                        {activeFilter === 'nearby' && !userLocation && (
                            <div onClick={requestLocation} className="bg-blue-50 text-blue-700 text-xs p-2 rounded flex items-center gap-2 cursor-pointer hover:bg-blue-100">
                                <MapPinIcon className="w-4 h-4" />
                                Activa tu ubicación para ver avisos cerca de ti.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // GRID VIEW HEADER (CATALOG STYLE)
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-[70px] z-20">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                             {getViewTitle(currentView)}
                        </h2>
                        <span className="text-xs text-gray-500 font-medium">{sortedListings.length} resultados</span>
                     </div>
                     <div className="p-3 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide">
                         <DropdownFilter label="Categorías" />
                         <DropdownFilter label="Precio" />
                         <DropdownFilter label="Distancia: 10 km" />
                         <DropdownFilter label="Ordenar por: Más relevantes" />
                     </div>
                </div>
            )}
            
            {/* --- LISTINGS GRID / FEED --- */}
            <div className={`
                ${layoutMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                    : 'space-y-6'
                }
            `}>
                {sortedListings.length > 0 ? (
                    sortedListings.map(listing => {
                        const vendor = getVendorById(listing.vendorId);
                        if (!vendor) return null;
                        return (
                            <div key={listing.id} onClick={() => onListingClick(listing)} className="cursor-pointer block h-full">
                                <PostCard 
                                    listing={listing} 
                                    vendor={vendor} 
                                    isLoggedIn={isLoggedIn}
                                    onLoginRequest={onLoginRequest}
                                    onDelete={() => onDeleteListing(listing.id)}
                                    isOwner={isLoggedIn && !!currentUserId && listing.userId === currentUserId}
                                    layout={layoutMode}
                                />
                            </div>
                        );
                    })
                ) : (
                     // EMPTY STATE - Needs to span full width in grid
                    <div className={`${layoutMode === 'grid' ? 'col-span-full' : ''} bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[300px]`}>
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <PlusCircleIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">{getEmptyStateMessage(currentView, activeFilter)}</p>
                        {activeFilter === 'recent' && <p className="text-gray-400 text-sm mt-2">Tu historial de navegación aparecerá aquí.</p>}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Feed;
