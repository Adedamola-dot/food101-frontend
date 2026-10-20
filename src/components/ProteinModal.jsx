import { X } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '../lib/utils';

export default function ProteinModal({ item, isOpen, onClose, onConfirm }) {
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedProtein) {
      setError('Please select a protein option.');
      return;
    }
    onConfirm(selectedProtein);
    onClose();
    setSelectedProtein(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text-dark">Choose Protein</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-text-dark">{item.name}</h3>
              <p className="text-brand-red font-bold">{formatCurrency(item.price)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {item.proteins.map((protein) => (
              <label
                key={protein}
                className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  selectedProtein === protein
                    ? 'border-brand-red bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="protein"
                  value={protein}
                  checked={selectedProtein === protein}
                  onChange={(e) => {
                    setSelectedProtein(e.target.value);
                    setError('');
                  }}
                  className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-3 font-medium text-text-dark">{protein}</span>
              </label>
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleConfirm}
            className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}