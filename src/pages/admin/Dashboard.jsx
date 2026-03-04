import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Home as HomeIcon, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    }, []);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('properties')
            .select('id, title, price, status, type, location, created_at, main_image')
            .order('created_at', { ascending: false });
        if (!error) setProperties(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
        setDeleting(id);
        await supabase.from('properties').delete().eq('id', id);
        await fetchProperties();
        setDeleting(null);
    };

    const formatPrice = (price, status) => {
        const num = Number(price);
        const formatted = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
        return status === 'aluguel' ? `${formatted}/mês` : formatted;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/favicon.png" alt="Gravitas" className="h-8 object-contain" />
                        <span className="font-bold text-xl" style={{ color: '#900603' }}>GRAVITAS</span>
                        <span className="hidden md:inline-block text-gray-400 font-normal text-sm ml-2">Painel Administrativo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1 text-gray-500 hover:text-primary transition-colors text-sm">
                            <Eye size={14} /> Ver site
                        </a>
                        <span className="hidden md:inline-block text-xs text-gray-400">{user?.email}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium">
                            <LogOut size={16} /> Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-dark">Imóveis Cadastrados</h1>
                            <p className="text-gray-400 text-sm mt-1">{properties.length} imóvel(is) no sistema</p>
                        </div>
                        <Link
                            to="/admin/imovel/novo"
                            className="bg-primary hover:bg-red-800 text-white font-bold py-2 px-5 rounded-md transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} /> Novo Imóvel
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-primary" size={36} />
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-center py-20">
                            <HomeIcon size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum imóvel cadastrado</h3>
                            <p className="text-gray-400 mb-4 text-sm">Comece adicionando o primeiro imóvel ao seu catálogo.</p>
                            <Link to="/admin/imovel/novo" className="inline-flex items-center gap-1 text-primary hover:text-red-800 font-medium text-sm">
                                <Plus size={16} /> Adicionar primeiro imóvel
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Imóvel</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Tipo</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Localização</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Preço</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {properties.map(prop => (
                                            <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                                            {prop.main_image
                                                                ? <img src={prop.main_image} alt={prop.title} className="w-full h-full object-cover" />
                                                                : <HomeIcon size={20} className="text-gray-300 m-auto mt-3" />
                                                            }
                                                        </div>
                                                        <span className="font-medium text-dark leading-tight line-clamp-2 max-w-[200px]">{prop.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">{prop.type}</td>
                                                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-[200px] truncate">{prop.location}</td>
                                                <td className="px-4 py-3 font-semibold text-dark whitespace-nowrap">{formatPrice(prop.price, prop.status)}</td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${prop.status === 'venda' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                                        {prop.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/admin/imovel/${prop.id}`}
                                                            className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-md transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(prop.id)}
                                                            disabled={deleting === prop.id}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Excluir"
                                                        >
                                                            {deleting === prop.id
                                                                ? <Loader2 size={15} className="animate-spin" />
                                                                : <Trash2 size={15} />
                                                            }
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
