import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white text-dark p-8 text-center border-t-4 border-primary mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <img src="/logo-horizontal.png" alt="Gravitas Imobiliária" className="h-16 md:h-20 mx-auto mb-4 object-contain filter drop-shadow-sm" />
            <p className="text-gray-500 font-medium">© 2026 Gravitas Imobiliária. Todos os direitos reservados.</p>
            <div className="mt-4">
                <Link to="/admin/login" className="text-xs text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest font-semibold">
                    Área Restrita
                </Link>
            </div>
        </footer>
    );
}
