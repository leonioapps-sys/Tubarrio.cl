
export enum ListingType {
    Product = 'Producto',
    Service = 'Servicio',
    Barter = 'Trueque',
    GarageSale = 'Venta de Bodega',
    Free = 'Gratis',
    Rental = 'Arriendo',
    Transport = 'Transporte',
    LocalBusiness = 'Emprendimiento',
    Event = 'Evento',
    CitizenComplaint = 'Denuncia Ciudadana',
    Pet = 'Para tu mascota',
}

export type ViewCategory = 'home' | 'marketplace' | 'services' | 'pets' | 'rentals' | 'transport' | 'local-business' | 'events' | 'complaints';

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    isVendor: boolean; // True if the comment is from the business owner
}

export interface Listing {
    id: number;
    vendorId: number;
    title: string;
    description: string;
    type: ListingType;
    location: Coordinates;
    image: string;
    price: number; // 0 for barter/free
    likes?: number;
    createdAt: string; // ISO 8601 date string
    status: 'active' | 'closed';
    comments?: Comment[];
}

export interface Vendor {
    id: number;
    name: string;
    logo: string;
    description: string;
    rating: number;
    reviews: number;
    isVerified: boolean;
    // Extended fields for Business Profile
    coverImage?: string;
    gallery?: string[];
    address?: string;
    location?: Coordinates;
    phone?: string;
    website?: string;
    social?: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    };
    email?: string;
}

export interface Notification {
    id: string;
    type: 'like' | 'comment' | 'reply' | 'info';
    message: string;
    isRead: boolean;
    createdAt: string; // ISO string
    listingId?: number;
    actorName?: string; // Who performed the action
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoUrl: string;
    emailNotificationsEnabled: boolean;
}