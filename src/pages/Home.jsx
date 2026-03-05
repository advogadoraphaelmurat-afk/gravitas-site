import { useState, useEffect } from 'react';
import { Search, ShieldCheck, Award, Clock, Star, MapPin, Building, DollarSign } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Home() {
    const [searchParams, setSearchParams] = useState({ type: '', location: '', price: '' });
    const [featuredProperties, setFeaturedProperties] = useState([]);

    useEffect(() => {
        supabase
            .from('properties')
            .select('id, title, price, location, bedrooms, bathrooms, area, status, type, image:main_image')
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data }) => { if (data) setFeaturedProperties(data); });
    }, []);

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchParams);
    };

    return (
        <div className="flex flex-col min-h-screen animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center w-full max-w-5xl pt-16">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                        Encontre o imóvel que <br className="hidden md:block" /> <span className="text-primary italic font-serif relative inline-block after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-full after:h-1 after:bg-primary/30">move sua vida</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md">
                        Especialistas em propriedades de alto padrão, oferecendo exclusividade e discrição em cada transação imobiliária.
                    </p>

                    {/* Search Bar Widget */}
                    <div className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl border border-white/20">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                    <Building size={20} />
                                </div>
                                <select
                                    name="type"
                                    value={searchParams.type}
                                    onChange={handleSearchChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                                    <option value="">Tipo de Imóvel</option>
                                    <option value="comprar">Comprar</option>
                                    <option value="alugar">Alugar</option>
                                </select>
                            </div>

                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                    <MapPin size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Localização, Bairro..."
                                    value={searchParams.location}
                                    onChange={handleSearchChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                    <DollarSign size={20} />
                                </div>
                                <select
                                    name="price"
                                    value={searchParams.price}
                                    onChange={handleSearchChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                                    <option value="">Faixa de Preço</option>
                                    <option value="low">Até R$ 1.000.000</option>
                                    <option value="medium">R$ 1M a R$ 3M</option>
                                    <option value="high">Acima de R$ 3M</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="bg-primary hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/50 whitespace-nowrap"
                            >
                                <Search size={20} />
                                <span className="md:hidden lg:inline">Buscar Ideal</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-20 bg-light">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">Destaques</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark">Imóveis Exclusivos</h2>
                        </div>
                        <Link to="/imoveis" className="hidden md:flex items-center text-primary font-medium hover:text-red-800 transition-colors group">
                            Ver todos
                            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/imoveis" className="inline-block bg-white text-dark border border-gray-300 font-medium py-3 px-8 rounded-md hover:border-primary hover:text-primary transition-colors">
                            Explorar Todos os Imóveis
                        </Link>
                    </div>
                </div>
            </section>

            {/* Differentials / Why Choose Us */}
            <section className="py-20 bg-white border-y border-gray-50">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">Nosso Diferencial</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-16">Por que escolher a Gravitas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-light rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md">
                                <ShieldCheck size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Segurança Jurídica</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Nossa assessoria jurídica especializada garante que toda transação seja sólida, transparente e livre de riscos para ambas as partes.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-light rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md">
                                <Award size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Carteira Exclusiva</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Acesso a propriedades off-market de alto padrão e negociações diretas com proprietários, garantindo oportunidades únicas.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-light rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md">
                                <Clock size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Atendimento Prime</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Acompanhamento personalizado 24/7 por consultores seniores em todo o processo, do primeiro contato à entrega das chaves.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-dark text-white relative overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary rounded-full filter blur-[120px] opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">O que dizem nossos clientes</h2>
                        <div className="w-24 h-1 bg-primary mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                id: 1,
                                text: "A equipe da Gravitas entendeu perfeitamente o perfil da casa que buscávamos. O nível de curadoria e o acompanhamento durante toda a negociação foram impecáveis. Recomendo fortemente a quem busca excelência e discrição.",
                                author: "Ricardo Mendonça",
                                role: "Empresário",
                                rating: 5
                            },
                            {
                                id: 2,
                                text: "Vender um imóvel de alto padrão exige uma estratégia diferente. A Gravitas trouxe compradores qualificados e fechamos negócio em tempo recorde, com total segurança jurídica graças à equipe deles.",
                                author: "Patrícia Viana",
                                role: "Médica",
                                rating: 5
                            },
                            {
                                id: 3,
                                text: "Profissionalismo do mais alto nível. O corretor responsável tinha conhecimento profundo sobre a região e sobre o mercado de luxo. Sem dúvida a melhor experiência imobiliária que já tive.",
                                author: "Henrique Carvalho",
                                role: "Diretor Executivo",
                                rating: 5
                            }
                        ].map((testimonial) => (
                            <div key={testimonial.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="flex text-primary mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-8 italic leading-relaxed">"{testimonial.text}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-800 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{testimonial.author}</h4>
                                        <span className="text-gray-400 text-sm">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
