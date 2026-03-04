import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';

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
};

export default function PropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'novo';

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            supabase.from('properties').select('*').eq('id', id).single().then(({ data, error }) => {
                if (data) {
                    setForm({ ...EMPTY_FORM, ...data, features: (data.features || []).join(', ') });
                    if (data.main_image) setImagePreview(data.main_image);
                }
                if (error) setError('Imóvel não encontrado.');
                setLoading(false);
            });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return form.main_image;
        setUploadingImage(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error } = await supabase.storage.from('property-images').upload(filePath, imageFile);
        if (error) { setError(`Erro ao fazer upload: ${error.message}`); setUploadingImage(false); return null; }

        const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
        setUploadingImage(false);
        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        let imageUrl = form.main_image;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) { setSaving(false); return; }
        }

        const payload = {
            ...form,
            main_image: imageUrl,
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

        if (result.error) {
            setError(result.error.message);
            setSaving(false);
        } else {
            navigate('/admin');
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

                    {/* Imagem Principal */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold text-dark mb-4">Foto Principal</h2>
                        <div className="flex flex-col items-start gap-4">
                            {imagePreview && (
                                <div className="relative w-full max-w-sm">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); setForm(p => ({ ...p, main_image: '' })); }}
                                        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors font-medium text-sm">
                                <Upload size={16} /> {imagePreview ? 'Trocar foto' : 'Selecionar foto'}
                                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                            </label>
                            <p className="text-xs text-gray-400">Ou coloque a URL diretamente:</p>
                            <input
                                type="url"
                                name="main_image"
                                placeholder="https://..."
                                value={form.main_image}
                                onChange={(e) => { handleChange(e); setImagePreview(e.target.value); setImageFile(null); }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
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
                        <button type="submit" disabled={saving || uploadingImage}
                            className="bg-primary hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center gap-2 disabled:opacity-70">
                            {(saving || uploadingImage) && <Loader2 size={16} className="animate-spin" />}
                            {saving ? 'Salvando...' : uploadingImage ? 'Enviando imagem...' : isEditing ? 'Salvar alterações' : 'Publicar imóvel'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
