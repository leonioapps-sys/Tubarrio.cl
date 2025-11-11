import React from 'react';
import { HomeIcon, ShoppingCartIcon, UsersIcon, CalendarIcon, PlusCircleIcon, GoogleIcon, WrenchIcon, KeyIcon, TruckIcon, StoreIcon } from './Icons';

interface LeftSidebarProps {
    onLogin: () => void;
    isLoggedIn: boolean;
}

const NavItem = ({ icon, label, isActive = false }: { icon: React.ReactNode, label: string, isActive?: boolean }) => (
    <li>
        <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
            {icon}
            <span>{label}</span>
        </a>
    </li>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onLogin, isLoggedIn }) => {
    return (
        <aside className="sticky top-[70px] h-[calc(100vh-80px)] flex flex-col">
            <div className="flex-grow">
                 {isLoggedIn ? (
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 mb-4">
                        <PlusCircleIcon className="w-6 h-6" />
                        <span>Publicar</span>
                    </button>
                 ) : (
                    <button 
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-md border border-gray-300 hover:bg-gray-50 transition-colors mb-4"
                    >
                        <GoogleIcon className="w-5 h-5" />
                        <span>Entrar con Google</span>
                    </button>
                 )}


                <nav>
                    <ul className="space-y-1">
                        <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Inicio" isActive />
                        <NavItem icon={<ShoppingCartIcon className="w-6 h-6" />} label="A la venta y gratis" />
                        <NavItem icon={<WrenchIcon className="w-6 h-6" />} label="Servicios" />
                        <NavItem icon={<KeyIcon className="w-6 h-6" />} label="Arriendos" />
                        <NavItem icon={<TruckIcon className="w-6 h-6" />} label="Transportes" />
                        <NavItem icon={<StoreIcon className="w-6 h-6" />} label="Emprendedores locales" />
                        <NavItem icon={<CalendarIcon className="w-6 h-6" />} label="Eventos" />
                    </ul>
                </nav>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
                <a href="#" className="hover:underline">Ajustes</a> &middot; 
                <a href="#" className="hover:underline"> Centro de ayuda</a> &middot;
                <a href="#" className="hover:underline"> Invitar a vecinos/as</a>
            </div>
        </aside>
    );
};

export default LeftSidebar;