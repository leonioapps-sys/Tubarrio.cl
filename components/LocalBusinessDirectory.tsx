import React, { useState, useMemo } from 'react';
import { Vendor } from '../types';
import { StarIcon, MapPinIcon, StoreIcon, PhoneIcon, CheckCircleIcon, FilterIcon } from './Icons';

interface LocalBusinessDirectoryProps {
    vendors: Vendor[];
    onVendorClick: (vendorId: number) => void;
    searchQuery: string;
}

const CATEGORY_FILTERS = [
    'Todas',
    'Servicios para el Hogar y Personales',
    'Servicios Profesionales y Empresariales',
    'Servicios de Alimentación y Eventos',
    'Mecánica',
    'Tecnología',
    'Regalos',
    'Servicios de Educación',
    'Servicios técnicos',
    'Farmacias',
    'Almacenes',
    'Locales comerciales'
];

const LocalBusinessDirectory: React.FC<LocalBusinessDirectoryProps> = ({ vendors, onVendorClick, searchQuery }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    
    // Filter vendors based on search query AND selected category
    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                v.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'Todas' || v.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [vendors, searchQuery, selectedCategory]);

    return (
        <section className="space-y-6 pb-10">
            {/* Header & Filters Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <StoreIcon className="w-7 h-7 text-emerald-600" />
                        Directorio de Emprendedores
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">Apoya el comercio local. Encuentra todo lo que necesitas en tu barrio.</p>
                </div>
                
                {/* Category Filters - Wrapped Layout */}
                <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex items-center gap-1 mt-1.5 min-w-fit">
                            <FilterIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Filtrar por:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_FILTERS.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
                                        selectedCategory === cat 
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-white hover:border-emerald-300 hover:text-emerald-600 hover:shadow-sm'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vendors Grid */}
            {filteredVendors.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <StoreIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No se encontraron resultados</h3>
                    <p className="text-gray-500 mt-1">
                        {selectedCategory !== 'Todas' 
                            ? `No hay negocios en la categoría "${selectedCategory}".` 
                            : "Intenta cambiar la búsqueda."}
                    </p>
                    {selectedCategory !== 'Todas' && (
                         <button 
                            onClick={() => setSelectedCategory('Todas')}
                            className="mt-4 text-emerald-600 font-semibold hover:underline"
                         >
                            Ver todos los negocios
                         </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
                    {filteredVendors.map(vendor => (
                        <div 
                            key={vendor.id} 
                            onClick={() => onVendorClick(vendor.id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group flex flex-col h-full"
                        >
                            {/* Cover Image */}
                            <div className="h-32 bg-gray-100 relative overflow-hidden">
                                <img 
                                    src={vendor.coverImage || `https://picsum.photos/seed/${vendor.id}/400/150`} 
                                    alt="cover" 
                                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                
                                {vendor.isVerified && (
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 text-emerald-600 shadow-sm" title="Verificado">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Avatar & Info */}
                            <div className="px-4 pb-4 pt-0 flex-grow flex flex-col relative">
                                {/* Avatar overlapping cover */}
                                <div className="-mt-9 mb-2 flex justify-between items-end">
                                    <img 
                                        src={vendor.logo} 
                                        alt={vendor.name} 
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover bg-white" 
                                    />
                                    <div className="flex items-center bg-amber-50 text-amber-700 border border-amber-100 text-xs px-2 py-1 rounded-md font-bold mb-1 shadow-sm">
                                        <StarIcon className="w-3 h-3 fill-current mr-1"/> {vendor.rating}
                                    </div>
                                </div>

                                <div className="mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm inline-block mb-1 line-clamp-1 border border-emerald-100">
                                        {vendor.category || 'Comercio'}
                                    </span>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {vendor.name}
                                    </h4>
                                </div>

                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow leading-relaxed">
                                    {vendor.description}
                                </p>
                                
                                <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-50 mt-auto">
                                    {vendor.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{vendor.address}</span>
                                        </div>
                                    )}
                                    {vendor.phone && (
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{vendor.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default LocalBusinessDirectory;