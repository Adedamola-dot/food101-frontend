import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShoppingBag, Truck, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-brand-cream pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-100 text-brand-red text-sm font-semibold mb-6">
                <Flame size={16} fill="currentColor" /> Hot & Fresh Meals
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-text-dark leading-tight mb-6">
                Your Favorite <span className="text-brand-red">Local</span> Meals, Delivered Hot.
              </h1>
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                Enjoy delicious Jollof, Shawarma, Burgers and more prepared fresh and delivered fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/30"
                >
                  Order Now <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative hidden lg:flex justify-center">
              <img
                src="/images/party-rice-big.jpg"
                alt="Party Rice"
                className="relative w-96 h-96 object-cover rounded-full border-[12px] border-white shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-text-dark mb-4">How to Order</h2>
            <p className="text-text-muted text-lg">Just 3 simple steps to get your meal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-brand-cream p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-brand-red mb-6">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Choose Your Meal</h3>
              <p className="text-text-muted">Browse our menu and pick your favorite Jollof, Shawarma, Burger or pastry.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-brand-cream p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-brand-gold mb-6">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Place Your Order</h3>
              <p className="text-text-muted">Add items to cart, enter your delivery details and confirm your order in seconds.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-brand-cream p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-brand-dark mb-6">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Get It Delivered</h3>
              <p className="text-text-muted">Sit back while we prepare your food and our rider brings it hot to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-text-dark mb-6">Hungry already?</h2>
          <p className="text-xl text-text-muted mb-10">Order now and get your meal delivered fast.</p>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-red text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/30"
          >
            Browse Menu <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}