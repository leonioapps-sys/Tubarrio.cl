
import React, { useMemo } from 'react';
import { Vendor } from '../types';
import { StarIcon, MapPinIcon, StoreIcon, PhoneIcon, WhatsAppIcon } from './Icons';

interface LocalBusinessDirectoryProps {
    vendors: Vendor[];
    onVendorClick: (vendorId: number) => void;
    searchQuery: string;
}

const LocalBusinessDirectory: React.FC<LocalBusinessDirectoryProps> = ({ vendors, onVendorClick, searchQuery }) => {
    
    // Group vendors by category
    const groupedVendors = useMemo(() => {
        const filtered = vendors.filter(v => 
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const groups: Record<string, Vendor[]> = {};
        
        filtered.forEach(vendor => {
            const category = vendor.category || 'Otros Emprendimientos';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(vendor);
        });

        return groups;
    }, [vendors, searchQuery]);

    const categories = Object.keys(groupedVendors).sort();

    return (
        <section className="space-y-8 pb-10">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                     <StoreIcon className="w-7 h-7 text-purple-600" />
                     Directorio de Emprendedores
                 </h2>
                 <p className="text-gray-600 mt-2">Apoya el comercio local. Encuentra panaderías, farmacias, servicios y más cerca de ti.</p>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">No se encontraron emprendimientos que coincidan con tu búsqueda.</p>
                </div>
            ) : (
                categories.map(category => (
                    <div key={category} className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-700 border-l-4 border-purple-500 pl-3 uppercase tracking-wide">
                            {category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedVendors[category].map(vendor => (
                                <div 
                                    key={vendor.id} 
                                    onClick={() => onVendorClick(vendor.id)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col"
                                >
                                    <div className="h-24 bg-gray-100 relative">
                                        <img 
                                            src={vendor.coverImage || `https://picsum.photos/seed/${vendor.id}/400/150`} 
                                            alt="cover" 
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute -bottom-6 left-4">
                                            <img 
                                                src={vendor.logo} 
                                                alt={vendor.name} 
                                                className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover bg-white" 
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-8 px-4 pb-4 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-1">
                                                {vendor.name}
                                            </h4>
                                            <div className="flex items-center bg-amber-50 text-amber-700 text-xs px-1.5 py-0.5 rounded font-bold">
                                                <StarIcon className="w-3 h-3 fill-current mr-1"/> {vendor.rating}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">
                                            {vendor.description}
                                        </p>
                                        
                                        <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-50">
                                            {vendor.address && (
                                                <div className="flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    <span className="truncate">{vendor.address}</span>
                                                </div>
                                            )}
                                            {vendor.phone && (
                                                <div className="flex items-center gap-1">
                                                    <PhoneIcon className="w-3 h-3" />
                                                    <span>{vendor.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </section>
    );
};

export default LocalBusinessDirectory;
