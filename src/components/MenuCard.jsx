import { Plus } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function MenuCard({ item, onAdd }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-text-dark mb-1">{item.name}</h3>
        <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-grow">{item.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-brand-red">{formatCurrency(item.price)}</span>
          <button
            onClick={() => onAdd(item)}
            className="flex items-center gap-1.5 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-gold active:bg-brand-gold active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}