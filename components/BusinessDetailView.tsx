
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Vendor } from '../types';
import { ArrowLeftIcon, MapPinIcon, CheckCircleIcon, StarIcon, ShareIcon, PhoneIcon, GlobeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from './Icons';

interface BusinessDetailViewProps {
    vendor: Vendor;
    onBack: () => void;
}

const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({ vendor, onBack }) => {
    
    const markerIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const whatsappNumber = vendor.social?.whatsapp ? vendor.social.whatsapp.replace(/[^0-9]/g, '') : (vendor.phone ? vendor.phone.replace(/[^0-9]/g, '') : '');
    const whatsappDisplay = vendor.social?.whatsapp || vendor.phone;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[80vh]">
            {/* Header / Cover */}
            <div className="relative h-48 md:h-72 bg-gray-200 group">
                <img 
                    src={vendor.coverImage || 'https://picsum.photos/seed/default_cover/800/300'} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                <button 
                    onClick={onBack}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                
                <div className="absolute -bottom-12 left-6 md:left-10 z-10">
                    <div className="relative">
                        <img 
                            src={vendor.logo} 
                            alt={vendor.name} 
                            className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                        />
                        {vendor.isVerified && (
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Info Container */}
            <div className="pt-16 px-6 md:px-10 pb-10">
                {/* Header Info: Name, Rating, Main Call to Action */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight break-words">
                            {vendor.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm mt-3">
                            <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                                <StarIcon className="w-4 h-4 fill-current mr-1" />
                                {vendor.rating}
                            </div>
                            <span className="text-gray-400 hidden md:inline">&bull;</span>
                            <span className="text-gray-600 underline decoration-dotted cursor-pointer hover:text-gray-900">{vendor.reviews} Reseñas</span>
                            <span className="text-gray-400 hidden md:inline">&bull;</span>
                            <span className="text-green-700 font-bold bg-green-100 px-3 py-0.5 rounded-full">Abierto ahora</span>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto flex-shrink-0">
                        {vendor.phone && (
                            <a 
                                href={`tel:${vendor.phone}`}
                                className="flex-1 md:flex-none px-8 py-3 bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <PhoneIcon className="w-5 h-5" /> <span>Llamar</span>
                            </a>
                        )}
                        <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors" title="Compartir">
                            <ShareIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Contact Bar */}
                <div className="mb-10 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-wrap gap-y-6 gap-x-10 items-center">
                    
                    {whatsappDisplay && (
                         <div className="flex items-center gap-3 min-w-max">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-green-500 flex items-center justify-center shadow-sm">
                                <WhatsAppIcon className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp</p>
                                <a 
                                    href={`https://wa.me/${whatsappNumber}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                                >
                                    {whatsappDisplay}
                                </a>
                            </div>
                        </div>
                    )}

                    {vendor.social?.instagram && (
                        <div className="flex items-center gap-3 min-w-max">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-pink-600 flex items-center justify-center shadow-sm">
                                <InstagramIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instagram</p>
                                <a href="#" className="font-semibold text-gray-900 hover:text-pink-600 transition-colors">{vendor.social.instagram}</a>
                            </div>
                        </div>
                    )}
                    
                    {vendor.social?.facebook && (
                         <div className="flex items-center gap-3 min-w-max">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-blue-600 flex items-center justify-center shadow-sm">
                                <FacebookIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Facebook</p>
                                <span className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">{vendor.social.facebook}</span>
                            </div>
                        </div>
                    )}

                    {vendor.website && (
                        <div className="flex items-center gap-3 min-w-max">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-emerald-600 flex items-center justify-center shadow-sm">
                                <GlobeIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Web</p>
                                <a href="#" className="font-semibold text-gray-900 hover:text-emerald-600 block max-w-[150px] truncate transition-colors">{vendor.website}</a>
                            </div>
                        </div>
                    )}

                     {vendor.address && (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                <MapPinIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dirección</p>
                                <p className="font-semibold text-gray-900">{vendor.address}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre nosotros</h3>
                            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                                {vendor.description}
                            </div>
                        </section>

                        {vendor.gallery && vendor.gallery.length > 0 && (
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Galería de fotos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {vendor.gallery.map((img, idx) => (
                                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in shadow-sm">
                                            <img 
                                                src={img} 
                                                alt={`Gallery ${idx}`} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                         <div className="sticky top-24">
                            {vendor.location && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <MapPinIcon className="w-4 h-4" /> Ubicación
                                    </h3>
                                    <div className="h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                                        <MapContainer center={[vendor.location.lat, vendor.location.lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                                            <TileLayer
                                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                            />
                                            <Marker position={[vendor.location.lat, vendor.location.lng]} icon={markerIcon} />
                                        </MapContainer>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 text-center border border-gray-100">
                                        {vendor.address}
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailView;
