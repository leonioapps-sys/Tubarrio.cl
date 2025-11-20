
import React, { useState, useRef } from 'react';
import { Listing, Vendor, ListingType, Comment } from '../types';
import { HeartIcon, MessageCircleIcon, ShareIcon, CheckCircleIcon, Loader2Icon, GoogleIcon } from './Icons';

interface PostCardProps {
    listing: Listing;
    vendor: Vendor;
    isLoggedIn?: boolean;
    onLoginRequest?: () => void;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return `hace ${Math.floor(seconds)} segundos`;
};

const ActionButton = ({ icon, label, onClick, active = false, badge }: { icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void, active?: boolean, badge?: number }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors font-semibold text-sm sm:text-base ${active ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        {icon}
        <span>{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full ml-1">{badge}</span>
        )}
    </button>
);

const getCategoryBadgeStyle = (type: ListingType) => {
    switch (type) {
        case ListingType.Product:
        case ListingType.Barter:
        case ListingType.GarageSale:
        case ListingType.Free:
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case ListingType.Service:
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case ListingType.Rental:
            return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case ListingType.Transport:
            return 'bg-amber-100 text-amber-700 border-amber-200';
        case ListingType.LocalBusiness:
            return 'bg-purple-100 text-purple-700 border-purple-200';
        case ListingType.Event:
            return 'bg-rose-100 text-rose-700 border-rose-200';
        case ListingType.CitizenComplaint:
            return 'bg-red-100 text-red-700 border-red-200';
        case ListingType.Pet:
            return 'bg-orange-100 text-orange-700 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const PostCard: React.FC<PostCardProps> = ({ listing, vendor, isLoggedIn = false, onLoginRequest }) => {
    const badgeStyle = getCategoryBadgeStyle(listing.type);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>(listing.comments || []);
    const [newCommentText, setNewCommentText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [localLikes, setLocalLikes] = useState(listing.likes || 0);
    const [hasLiked, setHasLiked] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoggedIn && onLoginRequest) {
            onLoginRequest();
            return;
        }
        
        if (hasLiked) {
            setLocalLikes(prev => prev - 1);
            setHasLiked(false);
        } else {
            setLocalLikes(prev => prev + 1);
            setHasLiked(true);
        }
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Viewing comments is allowed for everyone
        setShowComments(!showComments);
        // Only focus if logged in
        if (!showComments && isLoggedIn) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isLoggedIn && onLoginRequest) {
            onLoginRequest();
            return;
        }

        if (!newCommentText.trim()) return;

        const userComment: Comment = {
            id: `u-${Date.now()}`,
            author: 'Yo', // In a real app, this comes from auth context
            content: newCommentText,
            createdAt: new Date().toISOString(),
            isVendor: false
        };

        setComments(prev => [...prev, userComment]);
        setNewCommentText('');
        setIsReplying(true);

        // Simulate Vendor Reply
        setTimeout(() => {
            const vendorReply: Comment = {
                id: `v-${Date.now()}`,
                author: vendor.name,
                content: `¡Hola! Gracias por tu interés. ${listing.type === ListingType.Service ? '¿En qué horario te acomoda?' : '¿Te gustaría coordinar una visita?'}`,
                createdAt: new Date().toISOString(),
                isVendor: true
            };
            setComments(prev => [...prev, vendorReply]);
            setIsReplying(false);
        }, 3000);
    };

    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                        <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div>
                            <p className="font-bold text-gray-900 leading-tight hover:underline cursor-pointer">{vendor.name}</p>
                            <p className="text-xs text-gray-500">Antofagasta &middot; {timeAgo(listing.createdAt)}</p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border whitespace-nowrap ${badgeStyle}`}>
                        {listing.type}
                    </span>
                </div>
                <div className="text-gray-800 space-y-2">
                    <h3 className="font-bold text-lg leading-snug">{listing.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 whitespace-pre-line">{listing.description}</p>
                    
                    {listing.price > 0 && (
                         <p className="font-bold text-green-600 text-lg pt-1">
                            ${listing.price.toLocaleString('es-CL')}
                        </p>
                    )}
                    {listing.price === 0 && (
                        <p className="font-bold text-green-600 text-lg pt-1">
                             {listing.type === ListingType.Free ? 'GRATIS' : (listing.type === ListingType.Barter ? 'INTERCAMBIO' : (listing.type === ListingType.CitizenComplaint ? 'DENUNCIA' : 'Consultar'))}
                        </p>
                    )}
                </div>
            </div>
            
            {listing.image && (
                <div className="w-full h-[320px] bg-gray-100 relative group cursor-pointer">
                     <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
            )}

            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center">
                    <ActionButton 
                        icon={<HeartIcon className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />} 
                        label="Me interesa" 
                        badge={localLikes}
                        onClick={handleLikeClick}
                        active={hasLiked}
                    />
                    <ActionButton 
                        icon={<MessageCircleIcon className="w-5 h-5" />} 
                        label="Comentar"
                        badge={comments.length}
                        onClick={handleCommentClick}
                        active={showComments}
                    />
                    <ActionButton icon={<ShareIcon className="w-5 h-5" />} label="Compartir" onClick={(e) => e.stopPropagation()} />
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-gray-50 px-4 pb-4 pt-2 border-t border-gray-200 animate-fade-in">
                    
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-2">Aún no hay preguntas. ¡Sé el primero!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className={`flex gap-2 ${comment.isVendor ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${comment.isVendor ? 'bg-green-100 text-gray-800 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'}`}>
                                        <div className={`flex items-center gap-2 mb-1 ${comment.isVendor ? 'justify-end' : 'justify-start'}`}>
                                            <span className="font-bold text-xs">{comment.author}</span>
                                            {comment.isVendor && <CheckCircleIcon className="w-3 h-3 text-green-600" />}
                                        </div>
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isReplying && (
                             <div className="flex flex-row-reverse gap-2 animate-pulse">
                                <div className="max-w-[85%] p-3 rounded-2xl bg-gray-100 text-gray-500 text-sm rounded-tr-none flex items-center gap-2">
                                    <Loader2Icon className="w-3 h-3 animate-spin" />
                                    <span>{vendor.name} está escribiendo...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area - Conditional Auth */}
                    {isLoggedIn ? (
                        <form onSubmit={handleSubmitComment} className="relative">
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder={`Comenta en la publicación de ${vendor.name}...`}
                                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button 
                                type="submit"
                                disabled={!newCommentText.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:bg-green-50 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    ) : (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onLoginRequest && onLoginRequest(); }}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <GoogleIcon className="w-4 h-4" />
                            Inicia sesión para comentar
                        </button>
                    )}
                </div>
            )}
        </article>
    );
};

export default PostCard;
