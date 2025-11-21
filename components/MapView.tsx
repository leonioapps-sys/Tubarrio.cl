
import React from 'react';
import { HomeIcon, ShoppingCartIcon, CalendarIcon, PlusCircleIcon, GoogleIcon, WrenchIcon, KeyIcon, TruckIcon, StoreIcon, MegaphoneIcon, PawIcon, ShareIcon, HeartPulseIcon, BriefcaseIcon } from './Icons';
import { ViewCategory } from '../types';

interface LeftSidebarProps {
    onLogin: () => void;
    isLoggedIn: boolean;
    currentView: ViewCategory;
    onNavigate: (view: ViewCategory) => void;
    onPublish: () => void; // Added prop
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <li>
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-semibold transition-colors text-left ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    </li>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onLogin, isLoggedIn, currentView, onNavigate, onPublish }) => {
    
    const handleShare = () => {
        const url = 'https://www.tubarrio.cl';
        const shareData = {
            title: 'Tubarrio',
            text: 'Únete a tu comunidad en Tubarrio.',
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

    return (
        <aside className="sticky top-[70px] h-[calc(100vh-80px)] flex flex-col overflow-y-auto pb-4 custom-scrollbar">
            <div className="flex-grow">
                {/* Primary CTA - Publish (Login Trigger) */}
                <button 
                    onClick={isLoggedIn ? onPublish : onLogin}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 mb-4"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                    <span>Publicar</span>
                </button>

                {/* Secondary Login CTA if not logged in */}
                {!isLoggedIn && (
                     <button 
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors mb-4 text-sm"
                    >
                        <GoogleIcon className="w-4 h-4" />
                        <span>Entrar con Google</span>
                    </button>
                )}


                <nav>
                    <ul className="space-y-1">
                        <NavItem 
                            icon={<HomeIcon className="w-6 h-6" />} 
                            label="Inicio" 
                            isActive={currentView === 'home'} 
                            onClick={() => onNavigate('home')}
                        />
                        <NavItem 
                            icon={<ShoppingCartIcon className="w-6 h-6" />} 
                            label="A la venta y gratis" 
                            isActive={currentView === 'marketplace'} 
                            onClick={() => onNavigate('marketplace')}
                        />
                        <NavItem 
                            icon={<HeartPulseIcon className="w-6 h-6" />} 
                            label="Salud y belleza" 
                            isActive={currentView === 'health-beauty'} 
                            onClick={() => onNavigate('health-beauty')}
                        />
                         <NavItem 
                            icon={<BriefcaseIcon className="w-6 h-6" />} 
                            label="Empleos o trabajos" 
                            isActive={currentView === 'jobs'} 
                            onClick={() => onNavigate('jobs')}
                        />
                        <NavItem 
                            icon={<WrenchIcon className="w-6 h-6" />} 
                            label="Servicios" 
                            isActive={currentView === 'services'} 
                            onClick={() => onNavigate('services')}
                        />
                        <NavItem 
                            icon={<PawIcon className="w-6 h-6" />} 
                            label="Para tu mascota" 
                            isActive={currentView === 'pets'} 
                            onClick={() => onNavigate('pets')}
                        />
                        <NavItem 
                            icon={<KeyIcon className="w-6 h-6" />} 
                            label="Arriendos" 
                            isActive={currentView === 'rentals'} 
                            onClick={() => onNavigate('rentals')}
                        />
                        <NavItem 
                            icon={<TruckIcon className="w-6 h-6" />} 
                            label="Transportes" 
                            isActive={currentView === 'transport'} 
                            onClick={() => onNavigate('transport')}
                        />
                        <NavItem 
                            icon={<StoreIcon className="w-6 h-6" />} 
                            label="Emprendedores locales" 
                            isActive={currentView === 'local-business'} 
                            onClick={() => onNavigate('local-business')}
                        />
                        <NavItem 
                            icon={<CalendarIcon className="w-6 h-6" />} 
                            label="Eventos" 
                            isActive={currentView === 'events'} 
                            onClick={() => onNavigate('events')}
                        />
                        <NavItem 
                            icon={<MegaphoneIcon className="w-6 h-6 text-red-500" />} 
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
                    className="w-full flex items-center justify-center gap-2 text-green-700 font-bold hover:bg-green-50 p-2 rounded-md transition-colors mb-4 text-sm border border-green-200 bg-green-50/50"
                >
                    <ShareIcon className="w-4 h-4" />
                    <span>Invitar a vecinos/as</span>
                </button>

                <div className="text-xs text-gray-500 space-y-2">
                    <p className="leading-relaxed">
                        ¿Tienes dudas? ¿Tienes un reclamo? ¿Necesitas ponerte en contacto con nosotros?
                    </p>
                    <a href="mailto:contacto@tubarrio.cl" className="block font-semibold text-gray-700 hover:text-green-600 hover:underline transition-colors">
                        escríbenos a contacto@tubarrio.cl
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
