import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = `Olá Gravitas! Meu nome é ${formData.name}. Gostaria de entrar em contato.\n\nE-mail: ${formData.email}\nTelefone: ${formData.phone}\nAssunto: ${formData.subject}\n\nMensagem: ${formData.message}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5521968815872?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="bg-light min-h-screen py-16 animate-fade-in">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Fale Conosco</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Estamos à disposição para entender o seu projeto e oferecer as melhores opções do mercado imobiliário.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Contact Info Sidebar */}
                    <div className="lg:w-1/3 bg-dark text-white p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-8">Informações de Contato</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary mt-1">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Nosso Escritório</h3>
                                        <p className="text-gray-400">Av. Brigadeiro Faria Lima, 3477<br />Itaim Bibi, São Paulo - SP</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary mt-1">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Telefone</h3>
                                        <p className="text-gray-400">+55 (11) 3000-0000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary mt-1">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">E-mail</h3>
                                        <p className="text-gray-400">contato@gravitas.com.br</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-full text-primary mt-1">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Horário de Atendimento</h3>
                                        <p className="text-gray-400">Seg a Sex: 09h às 19h<br />Sábados: 09h às 13h</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
                            <p className="text-lg font-bold mb-4">Prefere mensagens?</p>
                            <a
                                href="https://wa.me/5521968815872"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={24} /> WhatsApp Direto
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3 p-10 lg:p-14">
                        <h2 className="text-2xl font-bold text-dark mb-6">Envie uma mensagem</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border-gray-300 rounded-md bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Seu nome" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border-gray-300 rounded-md bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="seu@email.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border-gray-300 rounded-md bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="(11) 90000-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border-gray-300 rounded-md bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-700">
                                        <option value="">Selecione o assunto</option>
                                        <option value="buy">Desejo comprar imóvel</option>
                                        <option value="sell">Desejo vender imóvel</option>
                                        <option value="rent">Locação</option>
                                        <option value="other">Outros assuntos</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full border-gray-300 rounded-md bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="Como podemos ajudar?"></textarea>
                            </div>

                            <button type="submit" className="bg-primary hover:bg-red-800 text-white font-bold py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
                                <Send size={18} /> Enviar Mensagem
                            </button>
                        </form>
                    </div>

                </div>

                {/* Map Full Width */}
                <div className="mt-16 rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white p-2">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14626.832962295697!2d-46.6853689128418!3d-23.578901842994443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5775314ccb43%3A0xe5a3c0cbf8686fdb!2sFaria%20Lima%20-%20Itaim%20Bibi%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1709834167909!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </div>
        </div>
    );
}
