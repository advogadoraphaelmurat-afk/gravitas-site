import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function BlogPost() {
    const { slug } = useParams();

    // Mock content
    const title = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Artigo do Blog';

    return (
        <div className="bg-white min-h-screen py-10 animate-fade-in">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Back Button */}
                <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Voltar para o Blog
                </Link>

                {/* Article Header */}
                <header className="mb-10 text-center">
                    <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider inline-block mb-6">
                        Mercado
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-dark mb-6 leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2"><User size={16} /> Por <strong>Carolina Almeida</strong></div>
                        <div className="flex items-center gap-2"><Calendar size={16} /> 15 Março, 2026</div>
                        <div className="flex items-center gap-2 text-primary font-medium">Leitura: 5 min</div>
                    </div>
                </header>
            </div>

            {/* Featured Image */}
            <div className="w-full max-w-5xl mx-auto mb-12 px-4">
                <div className="aspect-[21/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Artigo"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-3xl">
                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-gray-700 mx-auto prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-headings:text-dark">
                    <p className="text-xl text-gray-500 mb-8 italic border-l-4 border-primary pl-4">
                        Descubra as técnicas de home staging e os detalhes que fazem a diferença na hora de valorizar sua propriedade no mercado de luxo.
                    </p>

                    <p>
                        Vender um imóvel de alto padrão exige muito mais do que apenas colocá-lo à disposição no mercado.
                        A primeira impressão é muitas vezes a única chance de capturar a atenção de um comprador exigente
                        que busca não apenas quatro paredes, mas sim um estilo de vida e uma realização.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">1. A Arte do Home Staging</h2>
                    <p>
                        O <em>home staging</em> (preparação da casa) é fundamental. Trata-se de despersonalizar o ambiente
                        para permitir que o potencial comprador se imagine vivendo ali. Cores neutras, organização impecável,
                        e a retirada temporária de fotos familiares e coleções muito pessoais são as primeiras etapas.
                    </p>

                    <div className="my-8 rounded-xl overflow-hidden bg-gray-50 p-6 border border-gray-100">
                        <h4 className="font-bold text-dark mb-2 flex items-center gap-2">
                            <span className="text-primary text-xl">💡</span> Dica do especialista
                        </h4>
                        <p className="text-sm m-0">A iluminação é 50% da percepção do ambiente. Mantenha todas as cortinas abertas e lâmpadas de temperatura quente (2700K a 3000K) ligadas durante a visita.</p>
                    </div>

                    <h2 className="text-2xl font-bold mt-10 mb-4">2. Manutenção Impecável</h2>
                    <p>
                        No mercado premium, não há espaço para pequenas imperfeições. Uma torneira vazando, uma porta
                        rangendo ou uma pintura desgastada podem comprometer a percepção de valor geral do imóvel de forma
                        desproporcional. Invista em uma revisão completa antes de iniciar as visitas.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4">3. Qualidade Audiovisual</h2>
                    <p>
                        Fotografias amadoras são o maior erro na divulgação de propriedades de luxo. A Gravitas Imobiliária
                        utiliza apenas fotografia arquitetônica profissional, vídeos com drones e tours virtuais 360º para
                        garantir que a grandiosidade da sua propriedade seja transmitida através da tela.
                    </p>

                    <blockquote className="border-l-4 border-dark bg-gray-50 p-6 my-8 italic text-lg text-dark">
                        "A exclusividade do produto demanda uma estratégia de apresentação e venda igualmente exclusiva.
                        O imóvel não é apenas apresentado; ele deve ser curado."
                    </blockquote>
                </div>

                {/* Share and Tags */}
                <div className="flex flex-col md:flex-row justify-between items-center py-8 mt-12 border-t border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="text-sm font-bold text-dark uppercase tracking-wider">Tags:</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-xs">Vendas</span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-xs">Alto Padrão</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
                            <Share2 size={16} /> Compartilhar:
                        </span>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></button>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></button>
                        <button className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin size={20} /></button>
                    </div>
                </div>

                {/* Author Box */}
                <div className="flex items-center gap-6 mt-12 bg-gray-50 p-8 rounded-xl border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Carolina Almeida" className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <h3 className="text-lg font-bold text-dark">Carolina Almeida</h3>
                        <p className="text-sm text-primary font-medium mb-2">Especialista Lançamentos e Alto Padrão</p>
                        <p className="text-gray-600 text-sm">Com mais de 12 anos de experiência no mercado imobiliário prime, Carolina lidera as negociações mais exclusivas da Gravitas.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
