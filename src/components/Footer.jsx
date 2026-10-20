import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="text-white" />
            <p className="mt-4 text-sm max-w-sm">
              Delicious local meals delivered hot and fast. Made with love in Nigeria.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/menu" className="hover:text-brand-red">Menu</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-red">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Ilorin, Kwara State</li>
              <li>+234 800 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Food 101. All rights reserved.
        </div>
      </div>
    </footer>
  );
}