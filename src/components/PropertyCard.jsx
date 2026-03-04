import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';

export default function PropertyCard({ property }) {
    if (!property) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="relative h-64 overflow-hidden group">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-sm uppercase tracking-wider z-10">
                    {property.status === 'venda' ? 'Venda' : 'Aluguel'}
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0"></div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{property.location}</span>
                </div>

                <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/imovel/${property.id}`}>{property.title}</Link>
                </h3>

                <div className="flex items-center gap-4 text-gray-600 mb-6 text-sm">
                    <div className="flex items-center" title="Quartos">
                        <BedDouble size={18} className="mr-1" />
                        <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center" title="Banheiros">
                        <Bath size={18} className="mr-1" />
                        <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center" title="Área">
                        <Square size={18} className="mr-1" />
                        <span>{property.area} m²</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="text-xl font-bold text-primary">
                        {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <Link
                        to={`/imovel/${property.id}`}
                        className="text-sm font-bold text-dark border border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                        Ver detalhes
                    </Link>
                </div>
            </div>
        </div>
    );
}
