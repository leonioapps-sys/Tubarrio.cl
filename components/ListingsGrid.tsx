
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
    
    userLocation: Coordinates | null;
    requestLocation: () => void;
    viewedListingIds: number[];
    categoryPreferences: Record<string, number>;
    isLoggedIn: boolean;
    onLoginRequest: () => void;

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

const calculateDistance = (coord1: Coordinates, coord2: Coordinates) => {
    const R = 6371;
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
};

const FilterSelect = ({ 
    value, 
    onChange, 
    options, 
    disabled = false
}: { 
    value: string | number, 
    onChange: (val: string) => void, 
    options: { label: string, value: string | number }[],
    disabled?: boolean
}) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`appearance-none pl-4 pr-9 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDownIcon className="w-4 h-4" />
        </div>
    </div>
);


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
    // Feed Mode State
    const [activeFilter, setActiveFilter] = useState<FilterType>('recommended');

    // Grid Mode States
    const [priceFilter, setPriceFilter] = useState<'none' | 'asc' | 'desc'>('none');
    const [distanceFilter, setDistanceFilter] = useState<number>(10);
    const [relevanceFilter, setRelevanceFilter] = useState<'most' | 'least'>('most');

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

    const sortedListings = useMemo(() => {
        let processed = [...listings];

        if (layoutMode === 'feed') {
            // FEED LOGIC
            switch (activeFilter) {
                case 'recommended':
                    processed = processed.sort((a, b) => {
                        const scoreA = categoryPreferences[a.type] || 0;
                        const scoreB = categoryPreferences[b.type] || 0;
                        return scoreB - scoreA;
                    });
                    break;

                case 'recent':
                    processed = processed.filter(l => viewedListingIds.includes(l.id));
                    processed.sort((a, b) => {
                        return viewedListingIds.indexOf(a.id) - viewedListingIds.indexOf(b.id);
                    });
                    break;

                case 'nearby':
                    if (userLocation) {
                        processed = processed.sort((a, b) => {
                            const distA = calculateDistance(userLocation, a.location);
                            const distB = calculateDistance(userLocation, b.location);
                            return distA - distB;
                        });
                    }
                    break;

                case 'popular':
                    processed = processed.sort((a, b) => {
                        const interactionsA = (a.likes || 0) + (a.comments?.length || 0);
                        const interactionsB = (b.likes || 0) + (b.comments?.length || 0);
                        return interactionsB - interactionsA;
                    });
                    break;
            }
        } else {
            // GRID LOGIC
            
            // 1. Distance Filter (Only if location is available)
            if (userLocation) {
                 processed = processed.filter(l => {
                     const dist = calculateDistance(userLocation, l.location);
                     return dist <= distanceFilter;
                 });
            }

            // 2. Sorting
            // Priority: Price > Relevance (Engagement)
            if (priceFilter !== 'none') {
                processed.sort((a, b) => {
                    if (priceFilter === 'asc') return a.price - b.price;
                    return b.price - a.price;
                });
            } else {
                // Relevance sorting (using likes + comments as proxy)
                processed.sort((a, b) => {
                    const scoreA = (a.likes || 0) + (a.comments?.length || 0);
                    const scoreB = (b.likes || 0) + (b.comments?.length || 0);
                    return relevanceFilter === 'most' ? scoreB - scoreA : scoreA - scoreB;
                });
            }
        }
        return processed;
    }, [listings, activeFilter, viewedListingIds, categoryPreferences, userLocation, layoutMode, priceFilter, distanceFilter, relevanceFilter]);

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
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-[70px] z-20">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-gray-800">{getViewTitle(currentView)}</h2>
                        <button onClick={handlePublishClick} className="sm:hidden flex items-center gap-1 text-emerald-600 font-semibold text-sm">
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-[70px] z-20">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                             {getViewTitle(currentView)}
                        </h2>
                        <span className="text-xs text-gray-500 font-medium">{sortedListings.length} resultados</span>
                     </div>
                     <div className="p-3 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide items-center">
                         
                         {/* Price Filter */}
                         <FilterSelect 
                             value={priceFilter} 
                             onChange={(val) => setPriceFilter(val as 'none' | 'asc' | 'desc')} 
                             options={[
                                 { label: 'Precio: Todos', value: 'none' },
                                 { label: 'Precio: Menor a mayor', value: 'asc' },
                                 { label: 'Precio: Mayor a menor', value: 'desc' }
                             ]}
                         />

                         {/* Distance Filter */}
                         {userLocation ? (
                             <FilterSelect 
                                 value={distanceFilter}
                                 onChange={(val) => setDistanceFilter(Number(val))}
                                 options={Array.from({length: 10}, (_, i) => i + 1).map(km => ({
                                     label: `Distancia: ${km} km`,
                                     value: km
                                 }))}
                             />
                         ) : (
                             <button 
                                onClick={requestLocation}
                                className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                             >
                                 <MapPinIcon className="w-4 h-4" /> Activar ubicación
                             </button>
                         )}

                         {/* Relevance Sort */}
                         <FilterSelect 
                             value={relevanceFilter}
                             onChange={(val) => setRelevanceFilter(val as 'most' | 'least')}
                             options={[
                                 { label: 'Ordenar por: Más relevantes', value: 'most' },
                                 { label: 'Ordenar por: Menos relevantes', value: 'least' }
                             ]}
                         />
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
                    <div className={`${layoutMode === 'grid' ? 'col-span-full' : ''} bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[300px]`}>
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <PlusCircleIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">{getEmptyStateMessage(currentView, activeFilter)}</p>
                        {activeFilter === 'recent' && <p className="text-gray-400 text-sm mt-2">Tu historial de navegación aparecerá aquí.</p>}
                        {layoutMode === 'grid' && userLocation && distanceFilter < 10 && (
                             <button onClick={() => setDistanceFilter(10)} className="mt-4 text-emerald-600 hover:underline text-sm">
                                 Ampliar radio de búsqueda
                             </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Feed;
