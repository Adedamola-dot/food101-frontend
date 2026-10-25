import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Utensils, Zap, Flame, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);

  const { data: items } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const { data } = await api.get('/menu');
      return data.data.items;
    },
  });

  const bestsellers = items ? items.slice(0, 4) : [];

  const handleAddToCart = (item) => {
    addItem({ id: item.id, menuId: item.id, name: item.name, price: item.price, qty: 1, image: item.image });
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {/* HERO SECTION */}
      <section className="relative bg-brand-cream pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side Text */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-100 text-brand-red text-sm font-semibold mb-6">
                <Flame size={16} /> Hot & Fresh Meals
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-text-dark leading-tight mb-6">
                Your Local Food, <br/><span className="text-brand-red">Delivered Fast.</span>
              </h1>
              <p className="text-lg text-text-muted mb-8 leading-relaxed font-medium">
                No Queue. Just Jollof. Order ahead for pickup at Polygate or Teaching Hospital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white rounded-2xl font-bold text-lg hover:bg-brand-gold transition-all active:scale-95 shadow-lg shadow-red-500/30"
                >
                  Order Now - Skip Queue <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Side Image (Meta AI Upgrade) */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center animate-float">
                
                {/* Soft blurred orange blob background */}
                <div className="absolute inset-0 bg-[#FFF0E6] rounded-[40px] blur-2xl opacity-60 scale-110"></div>

                {/* Main food image floating without a box */}
                <img
                  src="/images/plate-chicken.jpg"
                  alt="Party Rice"
                  className="relative w-full h-full object-cover rounded-full border-4 border-white drop-shadow-xl z-10"
                />
                
                {/* Badge 1 - Chicken */}
                <div className="absolute -left-4 top-8 bg-white px-3 py-2 rounded-full shadow-md flex items-center gap-2 text-xs font-medium z-20 animate-float-delayed">
                  <div className="bg-orange-100 p-1.5 rounded-full text-brand-gold">
                    <Utensils size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-text-dark leading-none mb-1">Chicken</p>
                    <p className="text-[10px] text-text-muted leading-none">Included</p>
                  </div>
                </div>

                {/* Badge 2 - Hot & Fresh */}
                <div className="absolute -right-2 bottom-16 bg-white px-3 py-2 rounded-full shadow-md flex items-center gap-2 text-xs font-medium z-20 animate-float-delayed-2">
                  <div className="bg-pink-100 p-1.5 rounded-full text-red-500">
                    <Flame size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-text-dark leading-none mb-1">Hot &</p>
                    <p className="text-[10px] text-text-muted leading-none">Fresh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER SECTION */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-text-dark mb-2">How to Order</h2>
              <p className="text-text-muted">3 simple steps to get your meal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Yellow */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">1. Choose Location</h3>
              <p className="text-sm text-text-muted">Select your nearest branch for pickup or enter a delivery address.</p>
            </div>
            
            {/* Card 2: Red */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Utensils size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">2. Select Meal</h3>
              <p className="text-sm text-text-muted">Pick from our delicious party rice, shawarma, and sides.</p>
            </div>
            
            {/* Card 3: Black */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">3. Get it Fast</h3>
              <p className="text-sm text-text-muted">We prepare it hot and notify you when it's ready for pickup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS PREVIEW SECTION */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-text-dark mb-2">Menu Preview / Best Sellers</h2>
              <p className="text-text-muted">Our most popular dishes</p>
            </div>
            <Link to="/menu" className="text-brand-red font-bold hover:text-brand-gold transition-colors hidden sm:block">See all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-text-dark text-lg mb-1">{item.name}</h3>
                  <p className="font-black text-brand-red mb-4">{formatCurrency(item.price)}</p>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2.5 bg-brand-red text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors"
                  >
                    Add to Cart <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/menu" className="text-brand-red font-bold hover:text-brand-gold transition-colors">See Full Menu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}