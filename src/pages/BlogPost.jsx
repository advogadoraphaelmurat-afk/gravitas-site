import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (!error && data) {
            setPost(data);
        }
        setLoading(false);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = post?.title || 'Confira este artigo no Blog da Gravitas';

        const links = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        };

        window.open(links[platform], '_blank');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-light">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light text-gray-500">
            <p className="text-xl font-bold mb-4">Artigo não encontrado.</p>
            <Link to="/blog" className="text-primary hover:underline flex items-center gap-2 font-medium">
                <ArrowLeft size={16} /> Voltar para o Blog
            </Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen py-10 animate-fade-in">
            <div className="container mx-auto px-4 max-w-4xl">

                <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Voltar para o Blog
                </Link>

                <header className="mb-10 text-center">
                    <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider inline-block mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-dark mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2"><User size={16} /> Por <strong>{post.author}</strong></div>
                        <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                </header>
            </div>

            {post.main_image && (
                <div className="w-full max-w-5xl mx-auto mb-12 px-4">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <img src={post.main_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-3xl">
                {/* Content */}
                <div
                    className="prose prose-lg max-w-none text-gray-700 mx-auto prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-headings:text-dark prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                />

                {/* Share and Tags */}
                <div className="flex flex-col md:flex-row justify-between items-center py-8 mt-12 border-t border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="text-sm font-bold text-dark uppercase tracking-wider">Tags:</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-xs">{post.category}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                            <Share2 size={16} /> Compartilhar:
                        </span>
                        <button onClick={() => handleShare('facebook')} className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></button>
                        <button onClick={() => handleShare('twitter')} className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></button>
                        <button onClick={() => handleShare('linkedin')} className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin size={20} /></button>
                    </div>
                </div>

                {/* Author Box */}
                <div className="flex items-center gap-6 mt-12 mb-12 bg-gray-50 p-8 rounded-xl border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-md">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark">{post.author}</h3>
                        <p className="text-sm text-primary font-medium mb-1">Autor Autorizado</p>
                        <p className="text-gray-600 text-sm">Especialista dedicado ao mercado imobiliário de alto padrão e curadoria de conteúdo para a Gravitas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
