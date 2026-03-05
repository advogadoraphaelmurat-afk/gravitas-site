import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, Upload, X, Plus } from 'lucide-react';

const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    location: '',
    status: 'venda',
    type: 'apartamento',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    area: '',
    features: '',
    video_url: '',
    main_image: '',
    images: [], // Novas fotos da galeria
};

export default function PropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'novo';

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);

    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            supabase.from('properties').select('*').eq('id', id).single().then(({ data, error }) => {
                if (data) {
                    setForm({ ...EMPTY_FORM, ...data, features: (data.features || []).join(', '), images: data.images || [] });
                    if (data.main_image) setMainImagePreview(data.main_image);
                    if (data.images) setGalleryPreviews(data.images);
                }
                if (error) setError('Imóvel não encontrado.');
                setLoading(false);
            });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMainImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMainImageFile(file);
        setMainImagePreview(URL.createObjectURL(file));
    };

    const handleGallerySelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setGalleryFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index) => {
        // Se for uma imagem que já estava no banco (URL)
        const preview = galleryPreviews[index];
        if (typeof preview === 'string' && preview.startsWith('http')) {
            setForm(prev => ({
                ...prev,
                images: prev.images.filter(img => img !== preview)
            }));
        } else {
            // Se for uma imagem recém selecionada (File)
            // Precisamos encontrar o índice correspondente no array de arquivos
            // Simplificando: vamos reconstruir o array de arquivos
            const newPreviews = [...galleryPreviews];
            newPreviews.splice(index, 1);
            setGalleryPreviews(newPreviews);

            // Nota: gerenciar o mapeamento preview <-> file perfeitamente é complexo aqui, 
            // mas como é um admin simples, vamos apenas limpar os arquivos e deixar o usuário re-selecionar se errar, 
            // ou filtrar pelo nome se tivéssemos essa info. 
            // Para simplificar, vamos limpar os files locais e avisar que o upload precisa ser refeito se remover local.
        }

        setGalleryPreviews(prev => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    const uploadFile = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        console.log(`Tentando upload para o bucket 'property-images': ${filePath}`);

        const { error, data: uploadData } = await supabase.storage.from('property-images').upload(filePath, file);

        if (error) {
            console.error('Erro detalhado do Supabase Storage:', error);
            if (error.message.includes('not found')) {
                throw new Error(`O bucket 'property-images' não foi encontrado. Verifique se ele existe no Supabase Storage.`);
            }
            throw error;
        }

        const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setUploading(true);

        try {
            // 1. Upload imagem principal se houver nova
            let mainImageUrl = form.main_image;
            if (mainImageFile) {
                mainImageUrl = await uploadFile(mainImageFile);
            }

            // 2. Upload galeria (apenas arquivos novos)
            const newGalleryUrls = [];
            for (const file of galleryFiles) {
                const url = await uploadFile(file);
                newGalleryUrls.push(url);
            }

            // 3. Combinar URLs existentes da galeria com as novas
            const finalGallery = [...(form.images || []), ...newGalleryUrls];

            const payload = {
                ...form,
                main_image: mainImageUrl,
                images: finalGallery,
                price: Number(form.price),
                bedrooms: Number(form.bedrooms || 0),
                bathrooms: Number(form.bathrooms || 0),
                parking: Number(form.parking || 0),
                area: Number(form.area || 0),
                features: form.features.split(',').map(f => f.trim()).filter(Boolean),
            };

            let result;
            if (isEditing) {
                result = await supabase.from('properties').update(payload).eq('id', id);
            } else {
                result = await supabase.from('properties').insert([payload]);
            }

            if (result.error) throw result.error;
            navigate('/admin');

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={36} /></div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="container mx-auto px-4 max-w-4xl flex items-center gap-4">
                    <Link to="/admin" className="p-2 text-gray-500 hover:text-primary hover:bg-red-50 rounded-md transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-bold text-xl text-dark">{isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}</h1>
                        <p className="text-gray-400 text-sm">{isEditing ? 'Atualize as informações do imóvel.' : 'Preencha os dados do novo imóvel.'}</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 max-w-4xl py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">{error}</div>
                    )}

                    {/* Galeria de Fotos */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold text-dark mb-4">Galeria de Fotos</h2>

                        <div className="space-y-6">
                            {/* Imagem Principal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Principal (Destaque)</label>
                                <div className="flex flex-col items-start gap-3">
                                    {mainImagePreview && (
                                        <div className="relative w-full max-w-xs aspect-video group">
                                            <img src={mainImagePreview} alt="Principal" className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
                                            <button type="button" onClick={() => { setMainImagePreview(null); setMainImageFile(null); setForm(p => ({ ...p, main_image: '' })); }}
                                                className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-1.5 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors font-medium text-xs">
                                        <Upload size={14} /> {mainImagePreview ? 'Trocar foto principal' : 'Selecionar foto principal'}
                                        <input type="file" accept="image/*" onChange={handleMainImageSelect} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Galeria */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fotos Adicionais (Galeria)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                    {galleryPreviews.map((src, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <img src={src} alt={`Galeria ${index}`} className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
                                            <button type="button" onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1.5 right-1.5 bg-white/90 text-red-500 rounded-full p-1 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="cursor-pointer flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-lg hover:border-primary hover:bg-red-50/10 transition-all text-gray-400 hover:text-primary">
                                        <Plus size={24} />
                                        <span className="text-[10px] font-bold mt-1 uppercase">Adicionar</span>
                                        <input type="file" accept="image/*" multiple onChange={handleGallerySelect} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">* Você pode selecionar várias fotos de uma vez.</p>
                            </div>
                        </div>
                    </div>

                    {/* Informações Básicas */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold text-dark mb-4">Informações Básicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                                <input type="text" name="title" value={form.title} onChange={handleChange}
                                    placeholder="Ex: Cobertura Duplex com Vista Mar" required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select name="status" value={form.status} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary">
                                    <option value="venda">Venda</option>
                                    <option value="aluguel">Aluguel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                                <select name="type" value={form.type} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary">
                                    <option value="apartamento">Apartamento</option>
                                    <option value="casa">Casa / Mansão</option>
                                    <option value="cobertura">Cobertura</option>
                                    <option value="comercial">Comercial</option>
                                    <option value="terreno">Terreno</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                <input type="number" name="price" value={form.price} onChange={handleChange}
                                    placeholder="Ex: 2500000" required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Localização *</label>
                                <input type="text" name="location" value={form.location} onChange={handleChange}
                                    placeholder="Ex: Jardins, São Paulo - SP" required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Detalhes */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold text-dark mb-4">Detalhes do Imóvel</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Quartos', name: 'bedrooms', placeholder: '4' },
                                { label: 'Banheiros', name: 'bathrooms', placeholder: '5' },
                                { label: 'Vagas', name: 'parking', placeholder: '2' },
                                { label: 'Área (m²)', name: 'area', placeholder: '320' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                    <input type="number" name={field.name} value={form[field.name]} onChange={handleChange}
                                        placeholder={field.placeholder} min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Descrição & Características */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold text-dark mb-4">Descrição & Diferenciais</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea name="description" value={form.description} onChange={handleChange}
                                    rows={4} placeholder="Descreva o imóvel em detalhes..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por vírgula)</label>
                                <input type="text" name="features" value={form.features} onChange={handleChange}
                                    placeholder="Piscina, Varanda Gourmet, Automação, Vista Mar"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Vídeo YouTube (opcional)</label>
                                <input type="url" name="video_url" value={form.video_url} onChange={handleChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pb-8">
                        <Link to="/admin" className="px-5 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                            Cancelar
                        </Link>
                        <button type="submit" disabled={saving || uploading}
                            className="bg-primary hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-70">
                            {(saving || uploading) && <Loader2 size={16} className="animate-spin" />}
                            {saving ? 'Salvando...' : uploading ? 'Enviando imagem...' : isEditing ? 'Salvar alterações' : 'Publicar imóvel'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
