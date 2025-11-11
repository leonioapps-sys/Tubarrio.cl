import React from 'react';
import { Listing, Vendor } from '../types';

interface RightSidebarProps {
    listings: Listing[];
    getVendorById: (id: number) => Vendor | undefined;
}

const PromotedPostCard: React.FC<{ listing: Listing; vendor: Vendor }> = ({ listing, vendor }) => (
    <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors">
        <img src={listing.image} alt={listing.title} className="w-14 h-14 rounded-md object-cover" />
        <div>
            <p className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2">{listing.title}</p>
            <p className="text-xs text-gray-500">{vendor.name}</p>
        </div>
    </a>
);


const RightSidebar: React.FC<RightSidebarProps> = ({ listings, getVendorById }) => {
    // Simulate promoted listings by taking the first few
    const promotedListings = listings.slice(0, 3);
    
    return (
        <aside className="sticky top-[70px] space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-cover bg-center h-28" style={{ backgroundImage: "url('https://picsum.photos/seed/party/300/120')"}}>
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">Invita a tus vecinos/as a una fiesta, una recogida de alimentos o una reunión</h3>
                </div>
                <div className="p-4">
                    <button className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-md hover:bg-gray-300 transition-colors">
                        Crear evento
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                 <img src="https://picsum.photos/seed/business/300/150" alt="Local business" className="w-full h-28 object-cover" />
                <div className="p-4">
                    <h3 className="font-bold text-gray-800">¿Tienes un negocio local?</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-3">Crea una página de negocio para conectar con los vecinos/as, publicar novedades y conseguir nuevos clientes.</p>
                    <a href="#" className="flex justify-between items-center text-sm font-semibold text-green-600 hover:text-green-700">
                        <span>Crear página</span>
                        <span>&gt;</span>
                    </a>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
                 <h3 className="font-bold text-gray-800 mb-3">Publicaciones Destacadas</h3>
                 <div className="space-y-2">
                    {promotedListings.map(listing => {
                        const vendor = getVendorById(listing.vendorId);
                        if(!vendor) return null;
                        return <PromotedPostCard key={`promo-${listing.id}`} listing={listing} vendor={vendor} />
                    })}
                 </div>
            </div>
        </aside>
    );
};

export default RightSidebar;