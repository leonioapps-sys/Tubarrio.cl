
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, HeartIcon, MessageCircleIcon, InfoIcon, CheckCircleIcon, ChatBubbleIcon } from './Icons';
import { UserProfile, Notification } from '../types';

interface HeaderProps {
    isLoggedIn: boolean;
    user: UserProfile | null;
    notifications: Notification[];
    onToggleEmailNotifications: (enabled: boolean) => void;
    onMarkNotificationsRead: () => void;
    onSearch: (query: string) => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const diff = (new Date().getTime() - date.getTime()) / 1000;
        if (diff < 3600) return `${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
        return `${Math.floor(diff / 86400)} d`;
    };

    let icon;
    let bgColor;
    
    switch(notification.type) {
        case 'like': 
            icon = <HeartIcon className="w-4 h-4 text-pink-500 fill-current"/>; 
            bgColor = 'bg-pink-100';
            break;
        case 'comment':
        case 'reply':
            icon = <MessageCircleIcon className="w-4 h-4 text-blue-500"/>;
            bgColor = 'bg-blue-100';
            break;
        case 'info':
        default:
            icon = <InfoIcon className="w-4 h-4 text-gray-500"/>;
            bgColor = 'bg-gray-100';
    }

    return (
        <div className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${!notification.isRead ? 'bg-green-50/50' : ''}`}>
            <div className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-tight">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.isRead && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                )}
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, notifications, onToggleEmailNotifications, onMarkNotificationsRead, onSearch }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setIsMessagesOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsMessagesOpen(false);
        if (!isNotificationsOpen && unreadCount > 0) {
            onMarkNotificationsRead();
        }
    };

    const handleMessageClick = () => {
        setIsMessagesOpen(!isMessagesOpen);
        setIsNotificationsOpen(false);
    };

    // Mock messages for the chat dropdown
    const mockMessages = [
        { id: 1, user: 'Servicios La Portada', lastMessage: '¿Podemos coordinar para mañana?', time: '2min', unread: true, avatar: 'https://picsum.photos/seed/servicios/100/100' },
        { id: 2, user: 'Juanita', lastMessage: 'Gracias por la compra.', time: '1h', unread: false, avatar: 'https://picsum.photos/seed/vecina/100/100' },
        { id: 3, user: 'Pedro Rojas', lastMessage: 'Sigue disponible?', time: '1d', unread: false, avatar: 'https://picsum.photos/seed/user2/100/100' },
    ];

    return (
        <header className="bg-white shadow-sm z-30 sticky top-0 border-b border-gray-200 h-[60px]">
            <div className="max-w-[1200px] mx-auto px-4 h-full flex justify-between items-center">
                {/* Left Side - Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                        placeholder="Busca: 'ropa', 'gasfiter', 'pan'..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-transparent focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                     />
                </div>
                
                {/* Right Side - Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                   
                   {/* Messages Icon */}
                   <div className="relative" ref={messageRef}>
                        <button 
                            onClick={handleMessageClick}
                            className="text-gray-600 hover:text-gray-900 relative p-1" 
                            aria-label="Messages"
                        >
                            <ChatBubbleIcon className="w-6 h-6"/>
                            <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">1</span>
                        </button>

                         {/* Messages Dropdown */}
                         {isMessagesOpen && (
                           <div className="absolute right-[-40px] sm:right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in z-50">
                               <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                   <h3 className="font-bold text-gray-700 text-sm">Chats</h3>
                                   <span className="text-xs text-blue-600 font-medium cursor-pointer">Marcar leídos</span>
                               </div>
                               <div className="max-h-80 overflow-y-auto">
                                   {mockMessages.map(msg => (
                                       <div key={msg.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex gap-3 ${msg.unread ? 'bg-blue-50/30' : ''}`}>
                                            <img src={msg.avatar} className="w-10 h-10 rounded-full object-cover" alt={msg.user} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{msg.user}</p>
                                                    <p className="text-xs text-gray-500">{msg.time}</p>
                                                </div>
                                                <p className={`text-sm truncate ${msg.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{msg.lastMessage}</p>
                                            </div>
                                            {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                                       </div>
                                   ))}
                               </div>
                               <div className="p-2 text-center border-t border-gray-100">
                                   <button className="text-xs font-semibold text-blue-600 hover:underline">Ver todos los mensajes</button>
                               </div>
                           </div>
                       )}
                   </div>

                   {/* Notification Bell */}
                   <div className="relative" ref={notifRef}>
                       <button 
                            onClick={handleNotificationClick}
                            className="text-gray-600 hover:text-gray-900 relative p-1" 
                            aria-label="Notifications"
                        >
                            <BellIcon className="w-6 h-6"/>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                    {unreadCount}
                                </span>
                            )}
                       </button>
                       
                       {/* Notification Dropdown */}
                       {isNotificationsOpen && (
                           <div className="absolute right-[-60px] sm:right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in z-50">
                               <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                   <h3 className="font-bold text-gray-700 text-sm">Notificaciones</h3>
                                   {unreadCount > 0 && <span className="text-xs text-green-600 font-medium">{unreadCount} nuevas</span>}
                               </div>
                               <div className="max-h-80 overflow-y-auto">
                                   {notifications.length > 0 ? (
                                       notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                                   ) : (
                                       <div className="p-6 text-center text-gray-500 text-sm">
                                           No tienes notificaciones.
                                       </div>
                                   )}
                               </div>
                               <div className="p-2 text-center border-t border-gray-100">
                                   <button className="text-xs font-semibold text-green-600 hover:underline">Ver todas</button>
                               </div>
                           </div>
                       )}
                   </div>

                    <button className="text-gray-600 hover:text-gray-900 sm:hidden" aria-label="Search">
                        <SearchIcon className="w-6 h-6"/>
                   </button>

                    {/* User Profile */}
                    {isLoggedIn && user ? (
                        <div className="relative" ref={userRef}>
                             <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-1.5 hover:bg-gray-100 rounded-full pl-1 pr-2 py-1 transition-colors" 
                                aria-label="User menu"
                            >
                                <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                <ChevronDownIcon className="w-4 h-4 text-gray-500"/>
                            </button>
                            
                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mi Perfil</button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mis Publicaciones</button>
                                        
                                        <div className="border-t border-gray-100 my-1"></div>
                                        
                                        {/* Email Settings Toggle */}
                                        <div className="px-4 py-2 flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">Notificaciones</p>
                                                <p className="text-xs text-gray-500 leading-tight">Recibir alertas al correo</p>
                                            </div>
                                            <button 
                                                onClick={() => onToggleEmailNotifications(!user.emailNotificationsEnabled)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${user.emailNotificationsEnabled ? 'bg-green-600' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition shadow-sm ${user.emailNotificationsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 py-2">
                                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Cerrar Sesión</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
