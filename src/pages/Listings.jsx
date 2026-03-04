import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';

export default function Listings() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [allProperties, setAllProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        supabase
            .from('properties')
            .select('id, title, price, location, bedrooms, bathrooms, area, status, type, main_image as image')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                setAllProperties(data || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-light min-h-screen py-10 animate-fade-in">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 mt-4 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark">Imóveis Disponíveis</h1>
                        <p className="text-gray-500 mt-2">{allProperties.length} imóvel(is) encontrado(s)</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="md:hidden flex items-center justify-center gap-2 flex-1 bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm"
                        >
                            <Filter size={18} /> Filtros
                        </button>
                        <select className="bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm w-full md:w-auto focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                            <option>Mais Recentes</option>
                            <option>Menor Preço</option>
                            <option>Maior Preço</option>
                            <option>Maior Área</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-full md:w-1/4 lg:w-1/5 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-28">
                            <div className="flex items-center gap-2 font-bold text-dark mb-6 border-b pb-4">
                                <SlidersHorizontal size={20} className="text-primary" />
                                <h2>Filtros</h2>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Status</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="status" defaultChecked className="text-primary focus:ring-primary accent-primary" />
                                        <span className="text-gray-600 text-sm">Todos</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="status" className="text-primary focus:ring-primary accent-primary" />
                                        <span className="text-gray-600 text-sm">Comprar</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="status" className="text-primary focus:ring-primary accent-primary" />
                                        <span className="text-gray-600 text-sm">Alugar</span>
                                    </label>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Tipo de Imóvel</h3>
                                <select className="w-full bg-light border border-gray-200 text-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                                    <option>Todos</option>
                                    <option>Apartamento</option>
                                    <option>Casa</option>
                                    <option>Cobertura</option>
                                    <option>Comercial</option>
                                    <option>Terreno</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Faixa de Preço</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Mínimo" className="w-full bg-light border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-primary" />
                                    <input type="text" placeholder="Máximo" className="w-full bg-light border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Quartos</h3>
                                <div className="grid grid-cols-5 gap-1">
                                    {[1, 2, 3, 4, '5+'].map((num) => (
                                        <button key={num} className="bg-light border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary rounded-md py-1 text-sm transition-colors object-center">
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Area */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Área Útil (m²)</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Min" className="w-full bg-light border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-primary" />
                                    <input type="text" placeholder="Max" className="w-full bg-light border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-red-800 text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2">
                                <Search size={18} /> Filtrar
                            </button>
                        </div>
                    </aside>

                    {/* Properties Grid */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {loading ? (
                                <div className="col-span-3 flex justify-center py-20">
                                    <Loader2 className="animate-spin text-primary" size={36} />
                                </div>
                            ) : allProperties.length === 0 ? (
                                <div className="col-span-3 text-center py-20 text-gray-400">
                                    <p className="font-medium text-lg">Nenhum imóvel encontrado.</p>
                                    <p className="text-sm mt-2">Em breve novos imóveis serão adicionados.</p>
                                </div>
                            ) : allProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 border-t border-gray-200 pt-8 mt-auto">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {[1, 2, 3, 4, 5].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md border font-medium transition-colors ${currentPage === page
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
