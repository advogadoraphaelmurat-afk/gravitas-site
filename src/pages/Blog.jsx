import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
    const categories = ['Todos', 'Dicas', 'Mercado', 'Financiamento', 'Lançamentos'];

    const posts = [
        {
            id: 1,
            title: 'Como preparar seu imóvel de alto padrão para venda',
            excerpt: 'Descubra as técnicas de home staging e os detalhes que fazem a diferença na hora de valorizar sua propriedade no mercado de luxo.',
            category: 'Dicas',
            date: '15 Mar 2026',
            author: 'Carolina Almeida',
            image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'preparar-imovel-alto-padrao-venda'
        },
        {
            id: 2,
            title: 'Tendências do Mercado Imobiliário para 2026',
            excerpt: 'Uma análise profunda sobre o comportamento dos investidores e as regiões com maior potencial de valorização neste ano.',
            category: 'Mercado',
            date: '02 Mar 2026',
            author: 'Ricardo Mendes',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'tendencias-mercado-imobiliario-2026'
        },
        {
            id: 3,
            title: 'Taxas de Financiamento: O melhor momento para investir?',
            excerpt: 'Entenda os cenários econômicos atuais e saiba como alavancar seu capital com as melhores taxas do mercado financeiro.',
            category: 'Financiamento',
            date: '28 Fev 2026',
            author: 'Marina Silva',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'taxas-financiamento-momento-investir'
        },
        {
            id: 4,
            title: 'Lançamento exclusivo no Jardim América',
            excerpt: 'Conheça o novo empreendimento que vai redefinir o conceito de luxo e exclusividade em um dos bairros mais nobres de São Paulo.',
            category: 'Lançamentos',
            date: '20 Fev 2026',
            author: 'João Paulo',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'lancamento-exclusivo-jardim-america'
        }
    ];

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
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${index === 0
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                <div className="mb-16">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row group cursor-pointer border border-gray-100">
                        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                            <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider z-10">
                                {posts[0].category}
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1"><Calendar size={14} /> {posts[0].date}</div>
                                <div className="flex items-center gap-1"><User size={14} /> {posts[0].author}</div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                                <Link to={`/blog/${posts[0].slug}`}>{posts[0].title}</Link>
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                {posts[0].excerpt}
                            </p>
                            <Link to={`/blog/${posts[0].slug}`} className="inline-flex items-center text-primary font-bold hover:text-red-800 transition-colors w-max">
                                Ler artigo completo <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {posts.slice(1).map((post) => (
                        <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group">
                            <div className="relative h-56 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-dark text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider z-10 transition-colors group-hover:bg-primary">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    <Link to={`/blog/${posts[0].slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm flex-grow line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto text-xs text-gray-500">
                                    <div className="flex items-center gap-1"><Calendar size={14} /> {post.date}</div>
                                    <Link to={`/blog/${post.slug}`} className="text-primary font-bold flex items-center hover:underline">
                                        Ler mais <ArrowRight size={14} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center">
                    <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-md transition-colors">
                        Carregar mais artigos
                    </button>
                </div>
            </div>
        </div>
    );
}
