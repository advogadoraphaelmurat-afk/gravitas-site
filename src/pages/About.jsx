import { Target, Eye, Heart } from 'lucide-react';

export default function About() {
    const agents = [
        { name: 'Carolina Almeida', specialty: 'Lançamentos e Alto Padrão', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { name: 'Raphael Tartaruga', specialty: 'Especialista em Imóveis de alto padrão', image: '/01.png' },
        { name: 'Marina Silva', specialty: 'Comercial e Investimentos', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
        { name: 'João Paulo', specialty: 'Coberturas de Luxo', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    ];

    return (
        <div className="bg-light min-h-screen animate-fade-in">
            {/* Hero Banner */}
            <div className="relative h-[400px] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
                <div className="relative z-10 text-center text-white p-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre a Gravitas</h1>
                    <p className="text-xl max-w-2xl mx-auto">Elevando o padrão de excelência no mercado imobiliário desde 2010.</p>
                </div>
            </div>

            {/* History */}
            <div className="container mx-auto px-4 max-w-5xl py-20">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-dark mb-6">Nossa História</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Fundada com o propósito de redefinir o mercado de imóveis de luxo, a Gravitas Imobiliária
                            nasceu da necessidade de um atendimento verdadeiramente exclusivo, pautado na discrição
                            e no profundo conhecimento técnico e mercadológico.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            A palavra 'Gravitas' remete a peso, prestígio e responsabilidade. É com essa filosofia
                            que conduzimos cada transação, entendendo que não lidamos apenas com propriedades,
                            mas com o patrimônio de vida de nossos clientes.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Escritório Gravitas"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* MVV */}
            <div className="bg-white py-20 border-y border-gray-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-primary mx-auto rounded-full flex items-center justify-center mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Missão</h3>
                            <p className="text-gray-600">Proporcionar jornadas imobiliárias seguras, ágeis e rentáveis, superando as expectativas em serviço e resultados.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-primary mx-auto rounded-full flex items-center justify-center mb-6">
                                <Eye size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Visão</h3>
                            <p className="text-gray-600">Ser a marca de referência nacional e o parceiro preferencial no segmento de propriedades premium.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-primary mx-auto rounded-full flex items-center justify-center mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-4">Valores</h3>
                            <p className="text-gray-600">Integridade inegociável, excelência, discrição absoluta, e compromisso a longo prazo com nossos clientes.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agents */}
            <div className="container mx-auto px-4 max-w-6xl py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-dark mb-4">Nossos Especialistas</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Uma equipe selecionada de profissionais altamente qualificados, prontos para entender e atender a sua demanda.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {agents.map((agent, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={agent.image}
                                    alt={agent.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-dark mb-1">{agent.name}</h3>
                                <p className="text-primary font-medium text-sm">{agent.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
