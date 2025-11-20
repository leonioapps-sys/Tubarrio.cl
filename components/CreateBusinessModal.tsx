
import React, { useState } from 'react';
import { XIcon, MapPinIcon, UploadCloudIcon, StoreIcon, CheckCircleIcon, Loader2Icon, CameraIcon, TrashIcon } from './Icons';
import { Coordinates, Vendor, Listing, ListingType } from '../types';
import { LocationPicker } from './PublicationFlow';

interface CreateBusinessModalProps {
    onClose: () => void;
    onCreate: (vendor: Vendor, listing: Omit<Listing, 'id' | 'vendorId' | 'createdAt' | 'status'>) => void;
}

const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({ onClose, onCreate }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        address: '',
        instagram: '',
        facebook: '',
        website: '',
        location: null as Coordinates | null,
        logo: 'https://picsum.photos/seed/newlogo/100/100',
        coverImage: 'https://picsum.photos/seed/newcover/800/300',
        gallery: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPhoto = () => {
        // Simulate adding a photo by generating a random picsum url
        const newPhoto = `https://picsum.photos/seed/gallery${Date.now()}/400/300`;
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, newPhoto] }));
    };

    const handleRemovePhoto = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handlePaymentAndPublish = () => {
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            const newVendor: Vendor = {
                id: Math.random(), // Temporary ID
                name: formData.name,
                description: formData.description,
                logo: formData.logo,
                rating: 5.0,
                reviews: 0,
                isVerified: true,
                coverImage: formData.coverImage,
                address: formData.address,
                location: formData.location || undefined,
                phone: formData.phone,
                website: formData.website,
                social: {
                    instagram: formData.instagram,
                    facebook: formData.facebook
                },
                gallery: formData.gallery,
            };

            const newListing: Omit<Listing, 'id' | 'vendorId' | 'createdAt' | 'status'> = {
                title: formData.name, // Title of the listing is the business name
                description: formData.description.substring(0, 100) + '...', // Short description for the card
                type: ListingType.LocalBusiness,
                location: formData.location || { lat: 0, lng: 0 },
                image: formData.coverImage,
                price: 0,
            };

            onCreate(newVendor, newListing);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <XIcon className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                        <div className={`flex flex-col items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 1 ? 'bg-green-100' : 'bg-gray-200'}`}>1</div>
                            <span className="text-xs font-medium">Datos</span>
                        </div>
                        <div className={`h-1 flex-grow mx-2 ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 2 ? 'bg-green-100' : 'bg-gray-200'}`}>2</div>
                            <span className="text-xs font-medium">Galería</span>
                        </div>
                        <div className={`h-1 flex-grow mx-2 ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 3 ? 'bg-green-100' : 'bg-gray-200'}`}>3</div>
                            <span className="text-xs font-medium">Pago</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex-grow">
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <StoreIcon className="w-8 h-8 text-green-600"/> Crea tu Página de Negocio
                            </h2>
                            <p className="text-gray-500 mb-6">Completa la información básica de tu emprendimiento para que tus vecinos te conozcan.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Ej: Panadería La Estrella" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción completa</label>
                                    <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Cuenta la historia de tu negocio, productos principales, horarios..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="+56 9 ..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web (Opcional)</label>
                                    <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (Opcional)</label>
                                    <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="@usuario" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook (Opcional)</label>
                                    <input type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                         <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6 text-green-600"/> Ubicación y Fotos
                            </h2>
                             
                            {/* Location Section */}
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Dirección Comercial</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4" placeholder="Ej: Av. Brasil 123, Antofagasta" />
                                <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                                    <LocationPicker onLocationSet={(coords) => setFormData(prev => ({ ...prev, location: coords }))} initialCoords={formData.location || undefined} />
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <CameraIcon className="w-5 h-5 text-green-600"/> Galería de Fotos
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">Sube fotos de tus productos, tu local o tus servicios. (Simulado)</p>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                                    {/* Upload Button */}
                                    <button 
                                        onClick={handleAddPhoto}
                                        className="aspect-square rounded-lg border-2 border-dashed border-green-300 bg-green-50 flex flex-col items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                                    >
                                        <UploadCloudIcon className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-bold">Agregar</span>
                                    </button>
                                    
                                    {/* Images Grid */}
                                    {formData.gallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square group">
                                            <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                            <button 
                                                onClick={() => handleRemovePhoto(idx)}
                                                className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Logo y Portada se generan automáticamente para esta demo.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6 animate-fade-in">
                             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-8 h-8" />
                             </div>
                             <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Casi listo!</h2>
                             <p className="text-gray-600 mb-8 max-w-md mx-auto">Para activar tu página de negocio y aparecer en la sección "Emprendedores Locales", suscríbete al plan mensual.</p>
                             
                             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-sm mx-auto mb-8 text-left shadow-sm">
                                <h3 className="font-bold text-lg text-gray-900">Plan Emprendedor</h3>
                                <div className="flex items-baseline my-2">
                                    <span className="text-3xl font-extrabold text-gray-900">$4.990</span>
                                    <span className="text-gray-500 ml-1">/mes</span>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-3 mt-4">
                                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-500"/> Perfil verificado de negocio</li>
                                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-500"/> Galería de fotos ilimitada</li>
                                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-500"/> Botón directo a WhatsApp</li>
                                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-green-500"/> Aparición destacada en Feed</li>
                                </ul>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between rounded-b-xl">
                    {step > 1 ? (
                        <button onClick={handleBack} className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors">Atrás</button>
                    ) : <div></div>}
                    
                    {step < 3 ? (
                        <button onClick={handleNext} disabled={!formData.name} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Continuar</button>
                    ) : (
                        <button onClick={handlePaymentAndPublish} disabled={isLoading} className="bg-black text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2">
                            {isLoading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : null}
                            {isLoading ? 'Procesando...' : 'Pagar y Publicar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateBusinessModal;
