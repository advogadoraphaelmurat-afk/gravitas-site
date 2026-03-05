import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PropertyForm from './pages/admin/PropertyForm';
import BlogForm from './pages/admin/BlogForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="imoveis" element={<Listings />} />
          <Route path="imovel/:id" element={<PropertyDetail />} />
          <Route path="sobre-nos" element={<About />} />
          <Route path="contato" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="imovel/:id" element={<PropertyForm />} />
          <Route path="blog/:id" element={<BlogForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
