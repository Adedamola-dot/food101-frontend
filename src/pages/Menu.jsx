import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import MenuCard from '../components/MenuCard';
import ProteinModal from '../components/ProteinModal';
import { useCartStore } from '../store/cartStore';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const { data } = await api.get('/menu');
      return data.data.items;
    },
  });

  const categories = ['All', 'Party Rice', 'Chicken & Chips', 'Shawarma', 'Burger', 'Pastries', 'Desserts'];

  const filteredItems = data?.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const handleAddClick = (item) => {
    if (item.proteins && item.proteins.length > 0) {
      // Open modal for protein selection
      setSelectedItem(item);
    } else {
      // Add directly to cart
      addItem({ id: item.id, name: item.name, price: item.price, qty: 1, image: item.image });
    }
  };

  const handleModalConfirm = (protein) => {
    if (selectedItem) {
      addItem({
        id: `${selectedItem.id}-${protein}`, // unique cart ID for different proteins
        menuId: selectedItem.id,
        name: `${selectedItem.name} (${protein})`,
        price: selectedItem.price,
        qty: 1,
        image: selectedItem.image,
      });
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center text-xl font-bold">Loading Menu...</div>;
  }

  if (isError) {
    return <div className="p-20 text-center text-red-500 font-bold">Failed to load menu. Please try again.</div>;
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-text-dark mb-4">Our Menu</h1>
          <p className="text-text-muted text-lg">Freshly prepared local meals, delivered hot.</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2 justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-white text-text-dark hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems?.map((item) => (
            <MenuCard key={item.id} item={item} onAdd={handleAddClick} />
          ))}
        </div>
        
        {filteredItems?.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            No items found in this category.
          </div>
        )}

      </div>

      {/* Protein Modal */}
      {selectedItem && (
        <ProteinModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}