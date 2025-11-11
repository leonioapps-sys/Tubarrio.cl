import React from 'react';
import { Listing, Vendor } from '../types';
import PostCard from './ListingCard'; // Repurposed from ListingCard
import { PlusCircleIcon } from './Icons';


interface FeedProps {
    listings: Listing[];
    vendors: Vendor[];
    getVendorById: (id: number) => Vendor | undefined;
}

const Feed: React.FC<FeedProps> = ({ listings, getVendorById }) => {
    
    const activeListings = listings.filter(l => l.status === 'active');

    const FilterButton = ({ label, isActive = false }: { label: string, isActive?: boolean}) => (
        <button className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
        </button>
    );

    return (
        <section className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                <div className="flex gap-2">
                    <FilterButton label="Para ti" isActive />
                    <FilterButton label="Reciente" />
                    <FilterButton label="Cercanos" />
                    <FilterButton label="Popular" />
                </div>
                 <button className="flex items-center gap-2 bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Publicar</span>
                </button>
            </div>
            <div className="space-y-4">
                {activeListings.map(listing => {
                    const vendor = getVendorById(listing.vendorId);
                    if (!vendor) return null;
                    return <PostCard key={listing.id} listing={listing} vendor={vendor} />
                })}
            </div>
        </section>
    );
};

export default Feed;