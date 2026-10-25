import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Check, X, Package } from 'lucide-react';
import api from '../../lib/axios';
import { formatCurrency } from '../../lib/utils';

export default function MenuManagement() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [savingId, setSavingId] = useState(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: async () => {
      const { data } = await api.get('/admin/menu');
      return data.data.items;
    },
  });

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleSave = async (item) => {
    setSavingId(item.id);
    try {
      const newPrice = parseInt(editPrice, 10);
      if (!Number.isInteger(newPrice) || newPrice < 0) {
        alert('Price must be a positive whole number');
        return;
      }

      await api.patch(`/admin/menu/${item.id}`, { price: newPrice });
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setEditingId(null);
      setEditPrice('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update price');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.patch(`/admin/menu/${item.id}`, { available: !item.available });
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update availability');
    }
  };

  if (isLoading) return <div className="bg-white rounded-3xl p-12 text-center text-text-muted">Loading menu...</div>;
  if (!items || items.length === 0) return <div className="bg-white rounded-3xl p-12 text-center"><Package size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-text-muted">No menu items yet.</p></div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />

          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-text-dark">{item.name}</h3>
            <p className="text-xs text-text-muted">{item.category}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {editingId === item.id ? (
              <div className="flex items-center gap-1">
                <span className="text-brand-red font-bold">₦</span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-24 px-2 py-1.5 border border-brand-red rounded-lg text-sm font-bold text-brand-red outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleSave(item)}
                  disabled={savingId === item.id}
                  className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 bg-gray-200 text-text-dark rounded-lg hover:bg-brand-gold hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-brand-red font-bold">{formatCurrency(item.price)}</span>
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-1.5 text-text-muted hover:text-brand-gold transition-colors"
                  title="Edit price"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}

            <button
              onClick={() => handleToggleAvailability(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                item.available
                  ? 'bg-green-100 text-green-700 hover:bg-brand-gold hover:text-white'
                  : 'bg-red-100 text-red-700 hover:bg-brand-gold hover:text-white'
              }`}
            >
              {item.available ? 'Available' : 'Sold Out'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}