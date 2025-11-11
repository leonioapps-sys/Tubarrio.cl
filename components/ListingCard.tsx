import React from 'react';
import { Listing, Vendor } from '../types';
import { HeartIcon, MessageCircleIcon, ShareIcon } from './Icons';

interface PostCardProps {
    listing: Listing;
    vendor: Vendor;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return `hace ${Math.floor(seconds)} segundos`;
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors font-semibold">
        {icon}
        <span>{label}</span>
    </button>
);


const PostCard: React.FC<PostCardProps> = ({ listing, vendor }) => {
    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-gray-800">{vendor.name}</p>
                        <p className="text-xs text-gray-500">Antofagasta &middot; {timeAgo(listing.createdAt)}</p>
                    </div>
                </div>
                <div className="mt-4 text-gray-700 space-y-2">
                    <h3 className="font-bold text-lg">{listing.title}</h3>
                    <p>{listing.description}</p>
                    {listing.price > 0 && (
                         <p className="font-bold text-green-600 text-lg">
                            ${listing.price.toLocaleString('es-CL')}
                        </p>
                    )}
                </div>
            </div>
            
            <img src={listing.image} alt={listing.title} className="w-full max-h-[400px] object-cover" />

            <div className="p-2 border-t border-gray-200">
                <div className="flex justify-around items-center">
                    <ActionButton icon={<HeartIcon className="w-5 h-5" />} label="Reaccionar" />
                    <ActionButton icon={<MessageCircleIcon className="w-5 h-5" />} label="Comentar" />
                    <ActionButton icon={<ShareIcon className="w-5 h-5" />} label="Compartir" />
                </div>
            </div>

        </article>
    );
};

export default PostCard;