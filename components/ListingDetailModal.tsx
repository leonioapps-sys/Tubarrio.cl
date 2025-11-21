
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Listing, Vendor, ListingType } from '../types';
import { XIcon, HeartIcon, ShareIcon, MessageCircleIcon, MapPinIcon, ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, CheckCircleIcon } from './Icons';

interface ListingDetailModalProps {
    listing: Listing;
    vendor: Vendor;
    onClose: () => void;
    isLoggedIn: boolean;
    onLoginRequest: () => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, vendor, onClose, isLoggedIn, onLoginRequest }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const images = [listing.image, 'https://picsum.photos/seed/extra1/800/600', 'https://picsum.photos/seed/extra2/800/600'];

    const markerIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            onLoginRequest();
            return;
        }
        alert(`Mensaje enviado a ${vendor.name}: "${message}"`);
        setMessage('');
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'GRATIS / Intercambio';
        return `$${price.toLocaleString('es-CL')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-fade-in">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/20 rounded-full"
            >
                <XIcon className="w-8 h-8" />
            </button>

            <div className="bg-white w-full max-w-6xl h-full md:h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                
                {/* Left: Image Gallery */}
                <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative group h-[40vh] md:h-auto">
                    <img 
                        src={images[currentImageIndex]} 
                        alt={listing.title} 
                        className="max-w-full max-h-full object-contain"
                    />
                    
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={handlePrevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={handleNextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ArrowRightIcon className="w-6 h-6" />
                            </button>
                        </>
                    )}
                    
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Right: Details Panel */}
                <div className="w-full md:w-[40%] bg-white flex flex-col h-full overflow-hidden">
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        
                        {/* Header Info */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">{listing.type}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsSaved(!isSaved)} className="text-gray-400 hover:text-gray-700">
                                        <BookmarkIcon className={`w-6 h-6 ${isSaved ? 'fill-current text-yellow-500' : ''}`} />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-700">
                                        <ShareIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{listing.title}</h1>
                            <p className="text-2xl font-bold text-emerald-600">{formatPrice(listing.price)}</p>
                        </div>

                        {/* Vendor / User Profile */}
                        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                            <img src={vendor.logo} alt={vendor.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                    {vendor.name}
                                    {vendor.isVerified && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>{vendor.reviews} reseñas</span>
                                    <span>&bull;</span>
                                    <span>Antofagasta</span>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded">Ver perfil</button>
                        </div>

                        {/* Chat / Message Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <MessageCircleIcon className="w-5 h-5" />
                                Enviar mensaje al vendedor
                            </h4>
                            <form onSubmit={handleSendMessage}>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={isLoggedIn ? `Hola, ¿sigue disponible?` : "Inicia sesión para enviar mensaje"}
                                        disabled={!isLoggedIn}
                                        className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-gray-100"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!isLoggedIn || !message.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-1.5 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                                    >
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                            {!isLoggedIn && (
                                <p className="text-xs text-center mt-2 text-gray-500 cursor-pointer hover:underline" onClick={onLoginRequest}>
                                    Debes iniciar sesión para chatear.
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-2">Descripción</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-gray-500" />
                                Ubicación aproximada
                            </h3>
                            <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200 relative z-0">
                                <MapContainer center={[listing.location.lat, listing.location.lng]} zoom={14} scrollWheelZoom={false} className="h-full w-full">
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    />
                                    <Marker position={[listing.location.lat, listing.location.lng]} icon={markerIcon} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                            <p className="font-bold mb-1">Consejos de seguridad:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>No envíes dinero por adelantado.</li>
                                <li>Reúnete en lugares públicos y concurridos.</li>
                                <li>Revisa bien el producto antes de pagar.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center shrink-0 md:hidden">
                         <button 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border ${isLiked ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-300 text-gray-700'}`}
                        >
                            <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            {isLiked ? 'Te interesa' : 'Me interesa'}
                         </button>
                         <button onClick={onClose} className="text-gray-600 font-semibold">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailModal;
