import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BedDouble, Bath, Square, Car, MapPin, Check, Share2, Heart, MessageCircle, Loader2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';

export default function PropertyDetail() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: 'Olá, tenho interesse neste imóvel.' });

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        supabase.from('properties').select('*').eq('id', id).single().then(({ data }) => {
            setProperty(data);
            setActiveImage(data?.main_image || null);
            setLoading(false);
        });
        supabase.from('properties').select('id, title, price, location, bedrooms, bathrooms, area, status, type, image:main_image')
            .neq('id', id).limit(3).then(({ data }) => setSimilarProperties(data || []));
    }, [id]);

    // Dynamic gallery logic: use property.images if available, otherwise fallback
    const gallery = property ? (
        property.images && property.images.length > 0
            ? property.images
            : [
                property.main_image,
                'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1505691938895-1758d7def515?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            ]
    ).filter(Boolean) : [];

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-light">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    if (!property) return (
        <div className="min-h-screen flex items-center justify-center bg-light text-gray-500">
            <p>Imóvel não encontrado.</p>
        </div>
    );

    return (
        <div className="bg-light min-h-screen pb-20 animate-fade-in">
            {/* Property Header */}
            <div className="bg-white border-b border-gray-200 py-6 mt-4">
                <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-sm font-semibold uppercase">{property.status}</span>
                            <span>•</span>
                            <span className="uppercase">{property.type}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-dark mb-2">{property.title}</h1>
                        <div className="flex items-center text-gray-500">
                            <MapPin size={18} className="mr-1" />
                            <span>{property.location}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                        <div className="text-4xl font-bold text-primary mb-3">
                            {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Share2 size={16} /> Compartilhar
                            </button>
                            <button className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-primary transition-colors hover:border-primary">
                                <Heart size={16} /> Favoritar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content Area */}
                    <div className="w-full lg:w-2/3">
                        {/* Gallery */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-8 p-4">
                            <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-gray-100 flex items-center justify-center relative">
                                <img
                                    src={activeImage}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2 md:gap-4">
                                {gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-[4/3] rounded-md overflow-hidden relative ${activeImage === img ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6 md:p-8 flex items-center justify-between overflow-x-auto gap-8">
                            <div className="flex flex-col items-center min-w-[80px]">
                                <BedDouble size={32} className="text-gray-400 mb-2" />
                                <span className="font-bold text-dark text-xl">{property.bedrooms}</span>
                                <span className="text-gray-500 text-sm">Quartos</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[80px]">
                                <Bath size={32} className="text-gray-400 mb-2" />
                                <span className="font-bold text-dark text-xl">{property.bathrooms}</span>
                                <span className="text-gray-500 text-sm">Banheiros</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[80px]">
                                <Car size={32} className="text-gray-400 mb-2" />
                                <span className="font-bold text-dark text-xl">4</span>
                                <span className="text-gray-500 text-sm">Vagas</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[80px]">
                                <Square size={32} className="text-gray-400 mb-2" />
                                <span className="font-bold text-dark text-xl">{property.area} m²</span>
                                <span className="text-gray-500 text-sm">Área Útil</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Descrição do Imóvel</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
                                <p>{property.description}</p>
                                <p className="mt-4">
                                    O imóvel conta com acabamentos de primeiríssima linha, projeto luminotécnico e paisagismo integrado.
                                    Excelente incidência de luz natural durante todo o dia. Agende uma visita para conhecer pessoalmente
                                    cada detalhe deste projeto exclusivo.
                                </p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Características</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="bg-red-50 text-primary p-1 rounded-full">
                                            <Check size={16} />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Vídeo do Imóvel</h2>
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" // Generic placeholder video
                                    title="Tour Virtual"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Localização</h2>
                            <p className="text-gray-600 mb-4">{property.location}</p>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden bg-gray-100 relative">
                                {/* Embedded google maps placeholder */}
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.7032768564176!2d-46.66699192466922!3d-23.578913978788414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59cd3e8006bf%3A0x6bba52a26c483259!2sParque%20Ibirapuera!5e0!3m2!1spt-BR!2sbr!4v1709832715939!5m2!1spt-BR!2sbr"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Contact */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-dark text-white p-8 rounded-xl shadow-xl sticky top-28">
                            <div className="flex flex-col items-center mb-8 border-b border-white/20 pb-8 text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-600">
                                        <img src="/01.png" alt="Raphael Tartaruga" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1">Raphael Tartaruga</h3>
                                <p className="text-gray-400 text-sm">Especialista em Imóveis de alto padrão</p>
                                <p className="text-gray-400 text-sm mt-1">OAB/RJ: 211.850</p>
                            </div>

                            <h4 className="text-lg font-bold mb-4">Interessou? Fale agora!</h4>

                            <form className="flex flex-col gap-4 text-dark" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Seu nome"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-md bg-white border-0 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Seu e-mail"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-md bg-white border-0 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Seu telefone/WhatsApp"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-md bg-white border-0 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                                <textarea
                                    name="message"
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-3 rounded-md bg-white border-0 focus:ring-2 focus:ring-primary outline-none resize-none"
                                    required
                                ></textarea>

                                <button type="submit" className="w-full bg-primary hover:bg-red-800 text-white font-bold py-3 rounded-md transition-colors mt-2">
                                    Agendar Visita
                                </button>
                            </form>

                            <div className="mt-4 pt-4 border-t border-white/20">
                                <a
                                    href="https://wa.me/5521968815872"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    Chamar no WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Similar Properties */}
            <div className="container mx-auto px-4 max-w-7xl pt-12 border-t border-gray-200 mt-8">
                <h2 className="text-3xl font-bold text-dark mb-8">Imóveis Similares</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarProperties.map(property => (
                        <PropertyCard key={`similar-${property.id}`} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
}
