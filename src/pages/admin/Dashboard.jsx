import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { LogOut, Plus, Home as HomeIcon, Pencil, Trash2, Eye, Loader2, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'properties';

    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    }, []);

    const fetchProperties = useCallback(async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('id, title, price, status, type, location, created_at, main_image')
            .order('created_at', { ascending: false });
        if (!error) setProperties(data || []);
    }, []);

    const fetchPosts = useCallback(async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, category, author, created_at, main_image, slug')
            .order('created_at', { ascending: false });
        if (!error) setPosts(data || []);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        if (activeTab === 'properties') {
            await fetchProperties();
        } else {
            await fetchPosts();
        }
        setLoading(false);
    }, [activeTab, fetchProperties, fetchPosts]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleDeleteProperty = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
        setDeleting(id);
        await supabase.from('properties').delete().eq('id', id);
        await fetchProperties();
        setDeleting(null);
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este post?')) return;
        setDeleting(id);
        await supabase.from('posts').delete().eq('id', id);
        await fetchPosts();
        setDeleting(null);
    };

    const formatPrice = (price, status) => {
        const num = Number(price);
        const formatted = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
        return status === 'aluguel' ? `${formatted}/mês` : formatted;
    };

    const renderProperties = () => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Imóvel</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Tipo</th>
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
                                        <span className="font-medium text-dark leading-tight line-clamp-2 max-w-[250px]">{prop.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">{prop.type}</td>
                                <td className="px-4 py-3 font-semibold text-dark whitespace-nowrap">{formatPrice(prop.price, prop.status)}</td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${prop.status === 'venda' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                        {prop.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/admin/imovel/${prop.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-md transition-colors"><Pencil size={15} /></Link>
                                        <button onClick={() => handleDeleteProperty(prop.id)} disabled={deleting === prop.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                            {deleting === prop.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBlog = () => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Título do Post</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Categoria</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Data</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-8 rounded bg-gray-100 shrink-0 overflow-hidden">
                                            {post.main_image && <img src={post.main_image} className="w-full h-full object-cover" />}
                                        </div>
                                        <span className="font-medium text-dark leading-tight line-clamp-1">{post.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{post.category}</td>
                                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{new Date(post.created_at).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/admin/blog/${post.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-md transition-colors"><Pencil size={15} /></Link>
                                        <button onClick={() => handleDeletePost(post.id)} disabled={deleting === post.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                            {deleting === post.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/favicon.png" alt="Gravitas" className="h-8 object-contain" />
                        <span className="font-bold text-xl" style={{ color: '#900603' }}>GRAVITAS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1 text-gray-500 hover:text-primary text-sm transition-colors"><Eye size={14} /> Ver site</a>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm font-medium transition-colors"><LogOut size={16} /> Sair</button>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            <button onClick={() => setSearchParams({ tab: 'properties' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-bold ${activeTab === 'properties' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <LayoutDashboard size={18} /> Imóveis
                            </button>
                            <button onClick={() => setSearchParams({ tab: 'blog' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-bold ${activeTab === 'blog' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <BookOpen size={18} /> Blog
                            </button>
                        </div>

                        <Link to={activeTab === 'properties' ? "/admin/imovel/novo" : "/admin/blog/novo"}
                            className="bg-dark hover:bg-black text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg transform hover:-translate-y-0.5">
                            <Plus size={18} /> {activeTab === 'properties' ? 'Novo Imóvel' : 'Novo Post'}
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-primary" size={36} /></div>
                    ) : (
                        activeTab === 'properties' ? (properties.length > 0 ? renderProperties() : <div className="text-center py-20 bg-white rounded-lg border border-gray-200">Nenhum imóvel encontrado.</div>)
                            : (posts.length > 0 ? renderBlog() : <div className="text-center py-20 bg-white rounded-lg border border-gray-200">Nenhum post encontrado.</div>)
                    )}
                </div>
            </main>
        </div>
    );
}
