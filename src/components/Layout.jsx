import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow mt-20">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
