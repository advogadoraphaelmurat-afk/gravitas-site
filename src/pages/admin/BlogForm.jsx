import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'novo';

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: 'Raphael Tartaruga',
        category: 'Mercado Imobiliário',
        main_image: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setForm(data);
                setImagePreview(data.main_image);
            }
        } catch (err) {
            setError('Erro ao carregar post: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const next = { ...prev, [name]: value };
            // Auto-generate slug from title if not editing a saved post
            if (name === 'title' && !isEditing) {
                next.slug = value.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
                    .replace(/[^\w\s-]/g, '') // remove special chars
                    .replace(/\s+/g, '-') // spaces to dashes
                    .replace(/--+/g, '-') // collapse dual dashes
                    .trim();
            }
            return next;
        });
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadFile = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            let mainImageUrl = form.main_image;
            if (imageFile) {
                mainImageUrl = await uploadFile(imageFile);
            }

            const payload = {
                ...form,
                main_image: mainImageUrl,
            };

            if (isEditing) {
                const { error } = await supabase.from('posts').update(payload).eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('posts').insert([payload]);
                if (error) throw error;
            }

            navigate('/admin?tab=blog');
        } catch (err) {
            setError('Erro ao salvar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={36} /></div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 max-w-5xl flex items-center gap-4">
                    <Link to="/admin?tab=blog" className="p-2 text-gray-500 hover:text-primary hover:bg-red-50 rounded-md transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-bold text-xl text-dark">{isEditing ? 'Editar Post' : 'Novo Post'}</h1>
                        <p className="text-gray-400 text-sm">Gerencie o conteúdo do seu blog.</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 max-w-5xl py-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Post</label>
                                    <input type="text" name="title" value={form.title} onChange={handleChange} required
                                        placeholder="Ex: Tendências do mercado de luxo em 2024"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-lg font-bold" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (HTML ou Texto plano)</label>
                                    <textarea name="content" value={form.content} onChange={handleChange} required
                                        rows={15} placeholder="Escreva o texto completo do post aqui..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="font-semibold text-dark mb-4">Resumo (Excerpt)</h2>
                            <textarea name="excerpt" value={form.excerpt} onChange={handleChange}
                                rows={3} placeholder="Um resumo curto que aparece na listagem do blog..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none text-sm" />
                        </div>
                    </div>

                    {/* Right Column - Meta Data */}
                    <div className="space-y-6">
                        {/* Status/Save Box */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <button type="submit" disabled={saving}
                                className="w-full bg-primary hover:bg-red-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {isEditing ? 'Atualizar Post' : 'Publicar Post'}
                            </button>
                            {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
                        </div>

                        {/* Image Box */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="font-semibold text-dark mb-4">Imagem de Destaque</h2>
                            <div className="space-y-4">
                                {imagePreview ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setForm(p => ({ ...p, main_image: '' })); }}
                                            className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-2 shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon size={32} strokeWidth={1} />
                                        <span className="text-[10px] mt-2">Nenhuma imagem selecionada</span>
                                    </div>
                                )}
                                <label className="cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium">
                                    <Upload size={16} /> {imagePreview ? 'Alterar' : 'Escolher Foto'}
                                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Taxonomy Box */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                                <input type="text" name="slug" value={form.slug} onChange={handleChange} required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option value="Mercado Imobiliário">Mercado Imobiliário</option>
                                    <option value="Dicas">Dicas</option>
                                    <option value="Decoração">Decoração</option>
                                    <option value="Jurídico">Jurídico</option>
                                    <option value="Novidades">Novidades</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Autor</label>
                                <input type="text" name="author" value={form.author} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
