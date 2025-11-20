
import { Listing, Vendor, ListingType, UserProfile, Notification } from './types';

export const ANTOFAGASTA_COORDS = { lat: -23.65, lng: -70.4 };

export const MOCK_USER: UserProfile = {
    id: 'u_google_123',
    name: 'Juan Pérez',
    email: 'juan.perez@gmail.com',
    photoUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c', // Simulated Google Profile Pic
    emailNotificationsEnabled: true,
};

const now = new Date();

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        type: 'comment',
        message: 'María González comentó en "Aceite de Oliva Artesanal"',
        isRead: false,
        createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 mins ago
        actorName: 'María González',
        listingId: 1
    },
    {
        id: 'n2',
        type: 'like',
        message: 'A 5 personas les interesa "Sillón para regalar"',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        listingId: 13
    },
    {
        id: 'n3',
        type: 'reply',
        message: 'Servicios "La Portada" respondió a tu pregunta',
        isRead: true,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        actorName: 'Servicios La Portada',
        listingId: 3
    },
    {
        id: 'n4',
        type: 'info',
        message: 'Tu denuncia sobre la luminaria ha sido aprobada y publicada.',
        isRead: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        listingId: 14
    }
];

export const MOCK_VENDORS: Vendor[] = [
    {
        id: 1,
        name: 'Emporio "El Cobre"',
        logo: 'https://picsum.photos/seed/emporio/100/100',
        description: 'Pequeña Pyme familiar dedicada a la venta de productos gourmet locales y artesanías de la región de Antofagasta.',
        rating: 4.8,
        reviews: 124,
        isVerified: true,
        coverImage: 'https://picsum.photos/seed/emporio_cover/800/300',
        address: 'Calle Prat 456, Centro',
        location: { lat: -23.648, lng: -70.398 },
        phone: '+56 9 1234 5678',
        social: {
            instagram: '@emporioelcobre',
            whatsapp: '+56912345678'
        },
        gallery: [
            'https://picsum.photos/seed/prod1/300/300',
            'https://picsum.photos/seed/prod2/300/300',
            'https://picsum.photos/seed/prod3/300/300'
        ]
    },
    {
        id: 2,
        name: 'Servicios Rápidos "La Portada"',
        logo: 'https://picsum.photos/seed/servicios/100/100',
        description: 'Ofrecemos soluciones rápidas para el hogar: gasfitería, electricidad y reparaciones menores. ¡Confianza y calidad!',
        rating: 4.5,
        reviews: 88,
        isVerified: true,
        phone: '+56 9 8765 4321',
        social: {
            facebook: 'Servicios La Portada'
        }
    },
    {
        id: 3,
        name: 'Comunidad de Trueque "Mano a Mano"',
        logo: 'https://picsum.photos/seed/trueque/100/100',
        description: 'Un espacio para intercambiar objetos y habilidades sin dinero de por medio. Fomentamos la economía circular y el apoyo mutuo.',
        rating: 5.0,
        reviews: 210,
        isVerified: false,
    },
    {
        id: 4,
        name: 'Juanita - Ventas de Garaje',
        logo: 'https://picsum.photos/seed/vecina/100/100',
        description: '¡Hola! Soy Juanita, vecina del sector centro. Vendo cositas que ya no uso pero que están en perfecto estado. ¡Una segunda vida para todo!',
        rating: 4.9,
        reviews: 22,
        isVerified: false,
    },
    {
        id: 5,
        name: 'Transportes "El Norteño"',
        logo: 'https://picsum.photos/seed/flete/100/100',
        description: 'Fletes y mudanzas dentro y fuera de la ciudad.',
        rating: 4.7,
        reviews: 45,
        isVerified: true,
        phone: '+56 9 5555 4444'
    },
    {
        id: 6,
        name: 'Eventos Plaza',
        logo: 'https://picsum.photos/seed/evento/100/100',
        description: 'Organización de eventos comunitarios.',
        rating: 5.0,
        reviews: 10,
        isVerified: true,
    },
     {
        id: 7,
        name: 'Mascotas Felices',
        logo: 'https://picsum.photos/seed/petlover/100/100',
        description: 'Servicio de paseo y cuidado de mascotas.',
        rating: 4.9,
        reviews: 34,
        isVerified: true,
    }
];


export const MOCK_LISTINGS: Listing[] = [
    {
        id: 1,
        vendorId: 1,
        title: 'Aceite de Oliva Artesanal',
        description: 'Exquisito aceite de oliva extra virgen, producido en el valle cercano. Ideal para ensaladas y cocina gourmet.',
        type: ListingType.Product,
        location: { lat: -23.65, lng: -70.40 },
        image: 'https://picsum.photos/seed/aceite/400/300',
        price: 12000,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 12,
        comments: [
            {
                id: 'c1',
                author: 'María González',
                content: '¿Tienen despacho a domicilio en el sector sur?',
                createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
                isVendor: false
            },
            {
                id: 'c2',
                author: 'Emporio "El Cobre"',
                content: '¡Hola María! Sí, hacemos despachos los martes y jueves. El costo depende de la ubicación exacta.',
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                isVendor: true
            }
        ]
    },
    {
        id: 2,
        vendorId: 1,
        title: 'Artesanía en Cobre',
        description: 'Figuras decorativas hechas a mano por artesanos locales, representando la cultura del norte.',
        type: ListingType.Product,
        location: { lat: -23.645, lng: -70.395 },
        image: 'https://picsum.photos/seed/cobre/400/300',
        price: 25000,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 5,
    },
    {
        id: 3,
        vendorId: 2,
        title: 'Reparación de Enchufes',
        description: 'Servicio rápido y seguro para reparación e instalación de enchufes en tu hogar.',
        type: ListingType.Service,
        location: { lat: -23.63, lng: -70.39 },
        image: 'https://picsum.photos/seed/enchufe/400/300',
        price: 15000,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 8,
        comments: [
            {
                id: 'c3',
                author: 'Pedro Rojas',
                content: 'Necesito cambiar 3 enchufes, ¿cuánto saldría el total?',
                createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                isVendor: false
            }
        ]
    },
     {
        id: 4,
        vendorId: 2,
        title: 'Gasfitería de Emergencia',
        description: 'Atendemos urgencias de gasfitería 24/7. Fugas, destapes y más.',
        type: ListingType.Service,
        location: { lat: -23.66, lng: -70.41 },
        image: 'https://picsum.photos/seed/gasfiteria/400/300',
        price: 30000,
        createdAt: new Date().toISOString(),
        status: 'active',
        likes: 24,
    },
    {
        id: 5,
        vendorId: 3,
        title: 'Intercambio Guitarra por Bicicleta',
        description: 'Ofrezco guitarra acústica en excelente estado, busco bicicleta de montaña aro 26 o similar.',
        type: ListingType.Barter,
        location: { lat: -23.652, lng: -70.405 },
        image: 'https://picsum.photos/seed/guitarra/400/300',
        price: 0,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 3,
    },
    {
        id: 6,
        vendorId: 3,
        title: 'Busco clases de inglés',
        description: 'Ofrezco clases de matemáticas a cambio de clases de inglés conversacional.',
        type: ListingType.Barter,
        location: { lat: -23.638, lng: -70.402 },
        image: 'https://picsum.photos/seed/clases/400/300',
        price: 0,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 1,
    },
    {
        id: 7,
        vendorId: 4,
        title: 'Lote Ropa de Bebé (niña)',
        description: 'Vendo lote de ropa para bebé de 0 a 6 meses, en excelente estado. Poca usada, marcas variadas. Ideal para nueva mamá.',
        type: ListingType.GarageSale,
        location: { lat: -23.642, lng: -70.398 },
        image: 'https://picsum.photos/seed/ropabebe/400/300',
        price: 20000,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 0,
    },
    {
        id: 8,
        vendorId: 4,
        title: 'Juguera Oster Clásica',
        description: 'Juguera Oster en perfecto funcionamiento. Vaso de vidrio, ideal para batidos y jugos. La vendo por renovación.',
        type: ListingType.GarageSale,
        location: { lat: -23.643, lng: -70.399 },
        image: 'https://picsum.photos/seed/juguera/400/300',
        price: 18000,
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 2,
    },
    {
        id: 9,
        vendorId: 4,
        title: 'Departamento en Arriendo',
        description: 'Se arrienda departamento 2 dormitorios, 1 baño, sector sur. Gastos comunes incluidos.',
        type: ListingType.Rental,
        location: { lat: -23.68, lng: -70.41 },
        image: 'https://picsum.photos/seed/depto/400/300',
        price: 450000,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 45,
    },
    {
        id: 10,
        vendorId: 5,
        title: 'Fletes dentro de la ciudad',
        description: 'Camión 3/4 disponible para fletes y mudanzas pequeñas. Precio conversable según distancia.',
        type: ListingType.Transport,
        location: { lat: -23.62, lng: -70.38 },
        image: 'https://picsum.photos/seed/camion/400/300',
        price: 25000,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 7,
    },
    {
        id: 11,
        vendorId: 1,
        title: 'Panadería Artesanal "La Masa"',
        description: 'Nuevo emprendimiento de pan de masa madre. Reparto a domicilio los fines de semana. ¡Síguenos en redes!',
        type: ListingType.LocalBusiness,
        location: { lat: -23.655, lng: -70.402 },
        image: 'https://picsum.photos/seed/pan/400/300',
        price: 0,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 98,
    },
    {
        id: 12,
        vendorId: 6,
        title: 'Bingo Bailable Vecinal',
        description: 'Gran bingo a beneficio de la junta de vecinos. Música en vivo, comida y premios sorpresa.',
        type: ListingType.Event,
        location: { lat: -23.64, lng: -70.40 },
        image: 'https://picsum.photos/seed/bingo/400/300',
        price: 2000,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 56,
    },
     {
        id: 13,
        vendorId: 4,
        title: 'Sillón para regalar',
        description: 'Regalo sillón de 2 cuerpos, tiene un pequeño detalle en el tapiz pero la estructura está buena. Retiro en domicilio.',
        type: ListingType.Free,
        location: { lat: -23.641, lng: -70.397 },
        image: 'https://picsum.photos/seed/sillon/400/300',
        price: 0,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 15,
    },
    {
        id: 14,
        vendorId: 4,
        title: 'Luminaria pública apagada hace 2 semanas',
        description: 'La luminaria frente a la plaza está apagada y en la noche se pone muy oscuro. ¡Necesitamos reparación urgente!',
        type: ListingType.CitizenComplaint,
        location: { lat: -23.645, lng: -70.40 },
        image: 'https://picsum.photos/seed/light/400/300',
        price: 0,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 30,
    },
    {
        id: 15,
        vendorId: 7,
        title: 'Paseo de perros sector sur',
        description: 'Paseador de perros responsable y con experiencia. Paseos grupales e individuales en el sector sur. ¡Tu perrito feliz y ejercitado!',
        type: ListingType.Pet,
        location: { lat: -23.66, lng: -70.405 },
        image: 'https://picsum.photos/seed/dogwalker/400/300',
        price: 5000,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        likes: 10,
    }
];