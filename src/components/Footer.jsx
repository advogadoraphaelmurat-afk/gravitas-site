import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white text-dark p-8 pb-12 text-center border-t-4 border-primary mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto max-w-4xl">
                <img src="/logo-horizontal.png" alt="Gravitas Imobiliária" className="h-16 md:h-20 mx-auto mb-4 object-contain filter drop-shadow-sm" />
                <p className="text-gray-500 font-medium">© 2026 Gravitas Imobiliária. Todos os direitos reservados.</p>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center gap-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Empresa integrante do grupo</p>
                    <img src="/logo.png" alt="Logo Grupo" className="h-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-500 h-10 object-contain" />
                </div>

                <div className="mt-8">
                    <Link to="/admin/login" className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest font-semibold">
                        Área Restrita
                    </Link>
                </div>
            </div>
        </footer>
    );
}
