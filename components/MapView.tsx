
import React from 'react';
import { HomeIcon, ShoppingCartIcon, CalendarIcon, PlusCircleIcon, GoogleIcon, WrenchIcon, KeyIcon, TruckIcon, StoreIcon, MegaphoneIcon, PawIcon, ShareIcon, HeartPulseIcon, BriefcaseIcon, XIcon } from './Icons';
import { ViewCategory } from '../types';

interface LeftSidebarProps {
    onLogin: () => void;
    isLoggedIn: boolean;
    currentView: ViewCategory;
    onNavigate: (view: ViewCategory) => void;
    onPublish: () => void;
    isOpen: boolean; // New prop for mobile visibility
    onClose: () => void; // New prop to close mobile menu
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <li>
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-semibold transition-colors text-left ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-gray-500'}` })}
            <span>{label}</span>
        </button>
    </li>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onLogin, isLoggedIn, currentView, onNavigate, onPublish, isOpen, onClose }) => {
    
    const handleShare = () => {
        const url = 'https://www.nuestrobarrio.cl';
        const shareData = {
            title: 'NuestroBarrio',
            text: 'Únete a tu comunidad en NuestroBarrio.',
            url: url
        };

        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert('¡Enlace copiado al portapapeles! Compártelo con tus vecinos: ' + url);
            });
        }
    };

    // CSS classes for mobile vs desktop
    const containerClasses = isOpen 
        ? "fixed inset-0 z-40 flex" // Mobile Open
        : "hidden lg:block sticky top-[70px] h-[calc(100vh-80px)]"; // Mobile Closed / Desktop Visible

    return (
        <>
            {/* Mobile Overlay Background */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" 
                    onClick={onClose}
                ></div>
            )}

            <aside className={`${containerClasses} lg:bg-transparent`}>
                
                {/* Sidebar Content Container */}
                <div className={`
                    w-[280px] bg-white lg:bg-transparent h-full lg:h-auto overflow-y-auto p-4 lg:p-0 border-r border-gray-200 lg:border-0 shadow-xl lg:shadow-none transition-transform duration-300 transform
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                `}>
                    {/* Mobile Close Button */}
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <h2 className="text-xl font-bold text-gray-800">Menú</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-grow">
                        {/* Primary CTA - Publish */}
                        <button 
                            onClick={isLoggedIn ? onPublish : onLogin}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-600 transition-all transform hover:scale-105 mb-4"
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                            <span>Publicar</span>
                        </button>

                        {/* Removed secondary login button - now in Header */}

                        <nav>
                            <ul className="space-y-1">
                                <NavItem 
                                    icon={<HomeIcon />} 
                                    label="Inicio" 
                                    isActive={currentView === 'home'} 
                                    onClick={() => onNavigate('home')}
                                />
                                <NavItem 
                                    icon={<ShoppingCartIcon />} 
                                    label="A la venta y gratis" 
                                    isActive={currentView === 'marketplace'} 
                                    onClick={() => onNavigate('marketplace')}
                                />
                                <NavItem 
                                    icon={<HeartPulseIcon />} 
                                    label="Salud y belleza" 
                                    isActive={currentView === 'health-beauty'} 
                                    onClick={() => onNavigate('health-beauty')}
                                />
                                 <NavItem 
                                    icon={<BriefcaseIcon />} 
                                    label="Empleos o trabajos" 
                                    isActive={currentView === 'jobs'} 
                                    onClick={() => onNavigate('jobs')}
                                />
                                <NavItem 
                                    icon={<WrenchIcon />} 
                                    label="Servicios" 
                                    isActive={currentView === 'services'} 
                                    onClick={() => onNavigate('services')}
                                />
                                <NavItem 
                                    icon={<PawIcon />} 
                                    label="Para tu mascota" 
                                    isActive={currentView === 'pets'} 
                                    onClick={() => onNavigate('pets')}
                                />
                                <NavItem 
                                    icon={<KeyIcon />} 
                                    label="Arriendos" 
                                    isActive={currentView === 'rentals'} 
                                    onClick={() => onNavigate('rentals')}
                                />
                                <NavItem 
                                    icon={<TruckIcon />} 
                                    label="Transportes" 
                                    isActive={currentView === 'transport'} 
                                    onClick={() => onNavigate('transport')}
                                />
                                <NavItem 
                                    icon={<StoreIcon />} 
                                    label="Emprendedores locales" 
                                    isActive={currentView === 'local-business'} 
                                    onClick={() => onNavigate('local-business')}
                                />
                                <NavItem 
                                    icon={<CalendarIcon />} 
                                    label="Eventos" 
                                    isActive={currentView === 'events'} 
                                    onClick={() => onNavigate('events')}
                                />
                                <NavItem 
                                    icon={<MegaphoneIcon />} 
                                    label="Haz tu denuncia ciudadana" 
                                    isActive={currentView === 'complaints'} 
                                    onClick={() => onNavigate('complaints')}
                                />
                            </ul>
                        </nav>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-2 text-emerald-700 font-bold hover:bg-emerald-50 p-2 rounded-md transition-colors mb-4 text-sm border border-emerald-200 bg-emerald-50/50"
                        >
                            <ShareIcon className="w-4 h-4" />
                            <span>Invitar a vecinos/as</span>
                        </button>

                        <div className="text-xs text-gray-500 space-y-2">
                            <p className="leading-relaxed">
                                ¿Tienes dudas? ¿Tienes un reclamo? ¿Necesitas ponerte en contacto con nosotros?
                            </p>
                            <a href="mailto:contacto@nuestrobarrio.cl" className="block font-semibold text-gray-700 hover:text-emerald-600 hover:underline transition-colors">
                                escríbenos a contacto@nuestrobarrio.cl
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default LeftSidebar;
