
export enum ListingType {
    Product = 'Producto',
    Service = 'Servicio',
    Barter = 'Trueque',
    GarageSale = 'Venta de Bodega',
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Listing {
    id: number;
    vendorId: number;
    title: string;
    description: string;
    type: ListingType;
    location: Coordinates;
    image: string;
    price: number; // 0 for barter
    createdAt: string; // ISO 8601 date string
    status: 'active' | 'closed';
}

export interface Vendor {
    id: number;
    name: string;
    logo: string;
    description: string;
    rating: number;
    reviews: number;
    isVerified: boolean;
}
