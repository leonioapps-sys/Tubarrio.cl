
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Listing, ListingType, Coordinates } from '../types';
import { ANTOFAGASTA_COORDS } from '../constants';
import useGeolocation from '../hooks/useGeolocation';
import { geminiService } from '../services/geminiService';
import { UploadCloudIcon, MapPinIcon, InfoIcon, SparklesIcon, XIcon, Loader2Icon, LocateFixedIcon } from './Icons';

export const LocationPicker: React.FC<{ onLocationSet: (coords: Coordinates) => void; initialCoords?: Coordinates }> = ({ onLocationSet, initialCoords }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        initialCoords ? [initialCoords.lat, initialCoords.lng] : null
    );
    const { location, requestLocation } = useGeolocation();

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarkerPosition([lat, lng]);
                onLocationSet({ lat, lng });
            },
        });
        return null;
    };

    const handleUseCurrentLocation = useCallback(() => {
        if(location) {
            setMarkerPosition([location.lat, location.lng]);
            onLocationSet(location);
        } else {
            requestLocation();
        }
    }, [location, onLocationSet, requestLocation]);
    
    React.useEffect(() => {
        if (location && !markerPosition) {
            setMarkerPosition([location.lat, location.lng]);
            onLocationSet(location);
        }
    }, [location, markerPosition, onLocationSet]);


    const markerIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const center: [number, number] = markerPosition || [ANTOFAGASTA_COORDS.lat, ANTOFAGASTA_COORDS.lng];

    return (
        <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden relative border border-slate-200">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                     url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapEvents />
                {markerPosition && <Marker position={markerPosition} icon={markerIcon}></Marker>}
            </MapContainer>
            <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute top-2 right-2 z-[1000] bg-white/80 backdrop-blur-sm text-sky-600 px-3 py-2 text-sm font-semibold rounded-lg shadow-md hover:bg-white flex items-center gap-2 transition-colors"
            >
                <LocateFixedIcon className="w-4 h-4" /> Mi ubicación
            </button>
        </div>
    );
};

interface PublicationFlowProps {
    onPublish: (newListing: Omit<Listing, 'id' | 'vendorId' | 'createdAt' | 'status'>) => void;
    onCancel: () => void;
}

const PublicationFlow: React.FC<PublicationFlowProps> = ({ onPublish, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: ListingType.Product,
        price: 0,
        location: null as Coordinates | null,
        image: 'https://picsum.photos/seed/newitem/400/300', // Placeholder
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'type') {
             const newType = value as ListingType;
             // Auto-set price to 0 for Barter, Free, LocalBusiness (usually display), Event (sometimes free)
             // For simplicity, only force 0 on Barter and Free
             let newPrice = formData.price;
             if (newType === ListingType.Barter || newType === ListingType.Free) {
                 newPrice = 0;
             }
             setFormData(prev => ({ ...prev, type: newType, price: newPrice }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleGenerateDescription = async () => {
        if (!formData.title) {
            setError("Por favor, ingresa un título primero.");
            return;
        }
        setIsGenerating(true);
        setError(null);
        try {
            const description = await geminiService.generateDescription(formData.title);
            setFormData(prev => ({...prev, description}));
        } catch (err) {
            setError("No se pudo generar la descripción. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    const nextStep = () => {
        // Validation
        if (step === 1 && (!formData.title || !formData.description)) {
            setError("El título y la descripción son obligatorios.");
            return;
        }
        if (step === 2 && !formData.location) {
            setError("Debes seleccionar una ubicación en el mapa.");
            return;
        }
        setError(null);
        setStep(s => s + 1);
    };
    
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = () => {
        if (!formData.location) {
            setError("La ubicación es obligatoria.");
            return;
        }
        const listingData = {
            ...formData,
            price: Number(formData.price)
        };
        onPublish(listingData);
    };

    const isPriceDisabled = formData.type === ListingType.Barter || formData.type === ListingType.Free;

    return (
        <div className="flex-grow flex items-center justify-center p-4 bg-slate-100">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 md:p-8 relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Publica en Tubarrio</h2>
                <p className="text-center text-slate-500 mb-6">Sigue los pasos para conectar con tu comunidad.</p>
                
                {/* Stepper */}
                <div className="flex justify-center items-center mb-8">
                    {[1, 2, 3].map(s => (
                        <React.Fragment key={s}>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step >= s ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                               {s}
                            </div>
                            {s < 3 && <div className={`flex-auto border-t-2 transition-all duration-300 ${step > s ? 'border-sky-500' : 'border-slate-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                {/* Step 1: Info */}
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2 text-slate-600">
                           <InfoIcon className="w-5 h-5" />
                           <h3 className="text-lg font-semibold">1. ¿Qué quieres ofrecer?</h3>
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Título del anuncio</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900"></textarea>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating}
                                className="mt-2 flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? <Loader2Icon className="w-4 h-4 animate-spin"/> : <SparklesIcon className="w-4 h-4" />}
                                {isGenerating ? 'Generando...' : 'Sugerir con IA'}
                            </button>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                 <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                 <select name="type" id="type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-900">
                                     {Object.values(ListingType).map(type => <option key={type} value={type}>{type}</option>)}
                                 </select>
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Precio (CLP)</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    id="price" 
                                    value={formData.price} 
                                    onChange={handleInputChange} 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-100 bg-white text-slate-900"
                                    disabled={isPriceDisabled}
                                    placeholder={isPriceDisabled ? 'Gratis / Intercambio' : 'Ej: 15000'}
                                 />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Step 2: Location */}
                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2 text-slate-600">
                           <MapPinIcon className="w-5 h-5" />
                           <h3 className="text-lg font-semibold">2. ¿Dónde se encuentra?</h3>
                        </div>
                        <p className="text-sm text-slate-500">Haz clic en el mapa para establecer la ubicación. ¡Es obligatorio!</p>
                        <LocationPicker onLocationSet={(coords) => setFormData(prev => ({ ...prev, location: coords }))} initialCoords={formData.location || undefined} />
                    </div>
                )}

                {/* Step 3: Media & Review */}
                {step === 3 && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2 text-slate-600">
                           <UploadCloudIcon className="w-5 h-5" />
                           <h3 className="text-lg font-semibold">3. Sube una imagen y revisa</h3>
                        </div>
                        <div>
                            <p className="block text-sm font-medium text-slate-700 mb-2">Imagen del anuncio</p>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-slate-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                            <span>Sube un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">o arrástralo aquí</p>
                                    </div>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                            <h4 className="font-semibold mb-2 text-slate-700">Resumen:</h4>
                            <p className="text-slate-600"><strong>Título:</strong> {formData.title}</p>
                            <p className="text-slate-600"><strong>Categoría:</strong> {formData.type}</p>
                            <p className="text-slate-600"><strong>Precio:</strong> {isPriceDisabled ? 'Gratis/Intercambio' : `$${formData.price}`}</p>
                            <p className="text-slate-600"><strong>Ubicación:</strong> {formData.location ? 'Establecida' : 'No establecida'}</p>
                        </div>
                    </div>
                )}


                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button onClick={prevStep} className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors">Anterior</button>
                    ) : <div></div>}
                    {step < 3 ? (
                        <button onClick={nextStep} className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors shadow-md">Siguiente</button>
                    ) : (
                        <button onClick={handleSubmit} className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors shadow-md">Publicar Anuncio</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicationFlow;
