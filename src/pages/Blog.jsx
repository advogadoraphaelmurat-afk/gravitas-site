import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const categories = ['Todos', 'Mercado Imobiliário', 'Dicas', 'Decoração', 'Jurídico', 'Novidades'];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    const filteredPosts = activeCategory === 'Todos'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-light">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="bg-light min-h-screen py-16 animate-fade-in">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16 mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Blog Gravitas</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Insights, análises de mercado e as principais tendências do universo imobiliário de alto padrão.</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${activeCategory === category
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl font-medium">Nenhum artigo encontrado nesta categoria.</p>
                        <p className="mt-2">Em breve postaremos novidades!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post (Only on 'Todos' or if results exist) */}
                        {activeCategory === 'Todos' && filteredPosts.length > 0 && (
                            <div className="mb-16">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row group cursor-pointer border border-gray-100">
                                    <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                        <img src={filteredPosts[0].main_image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={filteredPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider z-10">
                                            {filteredPosts[0].category}
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(filteredPosts[0].created_at).toLocaleDateString('pt-BR')}</div>
                                            <div className="flex items-center gap-1"><User size={14} /> {filteredPosts[0].author}</div>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                                            <Link to={`/blog/${filteredPosts[0].slug}`}>{filteredPosts[0].title}</Link>
                                        </h2>
                                        <p className="text-gray-600 mb-8 leading-relaxed text-lg line-clamp-3">
                                            {filteredPosts[0].excerpt}
                                        </p>
                                        <Link to={`/blog/${filteredPosts[0].slug}`} className="inline-flex items-center text-primary font-bold hover:text-red-800 transition-colors w-max">
                                            Ler artigo completo <ArrowRight size={16} className="ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(activeCategory === 'Todos' ? filteredPosts.slice(1) : filteredPosts).map((post) => (
                                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={post.main_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-4 left-4 bg-dark text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider z-10 transition-colors group-hover:bg-primary">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p className="text-gray-600 mb-6 text-sm flex-grow line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto text-xs text-gray-500">
                                            <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('pt-BR')}</div>
                                            <Link to={`/blog/${post.slug}`} className="text-primary font-bold flex items-center hover:underline">
                                                Ler mais <ArrowRight size={14} className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
