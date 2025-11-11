import React from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon } from './Icons';

interface HeaderProps {
    isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
    return (
        <header className="bg-white shadow-sm z-20 sticky top-0 border-b border-gray-200 h-[60px]">
            <div className="max-w-[1200px] mx-auto px-4 h-full flex justify-between items-center">
                {/* Left Side - Logo */}
                <div className="flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-green-600" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
                    </svg>
                    <span className="text-xl font-bold text-gray-800 tracking-tighter">Tubarrio</span>
                </div>
                
                {/* Center - Search */}
                <div className="relative w-full max-w-md hidden sm:block">
                     <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                     <input
                        type="text"
                        placeholder="Busca en Tubarrio"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                     />
                </div>
                
                {/* Right Side - Actions */}
                <div className="flex items-center gap-4">
                   <button className="text-gray-600 hover:text-gray-900" aria-label="Notifications">
                        <BellIcon className="w-6 h-6"/>
                   </button>
                    <button className="text-gray-600 hover:text-gray-900 sm:hidden" aria-label="Search">
                        <SearchIcon className="w-6 h-6"/>
                   </button>
                    {isLoggedIn ? (
                         <button className="flex items-center gap-1.5" aria-label="User menu">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                J
                            </div>
                            <ChevronDownIcon className="w-5 h-5 text-gray-500"/>
                        </button>
                    ) : (
                         <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;