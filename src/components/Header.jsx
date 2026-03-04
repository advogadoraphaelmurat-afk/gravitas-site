import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-white text-dark p-4 flex justify-between items-center fixed w-full top-0 z-50 shadow-md h-24">
            <Link to="/" className="flex items-center h-full gap-2 md:gap-3 group">
                <img src="/favicon.png" alt="Gravitas Logo Ícone" className="h-10 md:h-14 object-contain transition-transform group-hover:scale-105" />
                <span className="text-2xl md:text-3xl font-bold tracking-tighter md:tracking-normal" style={{ color: '#900603' }}>GRAVITAS</span>
            </Link>
            <nav className="hidden md:flex gap-6 font-medium">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <Link to="/imoveis" className="hover:text-primary transition-colors">Imóveis</Link>
                <Link to="/sobre-nos" className="hover:text-primary transition-colors">Sobre Nós</Link>
                <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <Link to="/contato" className="hover:text-primary transition-colors">Contato</Link>
            </nav>
            <Link to="/contato" className="bg-primary text-white hover:bg-red-800 px-3 md:px-6 py-2 rounded-md font-bold text-xs md:text-base transition-colors whitespace-nowrap">
                Fale Conosco
            </Link>
        </header>
    );
}
