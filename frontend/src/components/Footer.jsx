import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#090909] text-gray-200 py-10 mt-10 border-t border-orange-500/10">
      <div className="container mx-auto px-4 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-400">Mophix Studio</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Professional photography and event coverage in Kigali, Rwanda.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-orange-300">Home</Link></li>
            <li><Link to="/portfolio" className="hover:text-orange-300">Portfolio</Link></li>
            <li><Link to="/services" className="hover:text-orange-300">Services</Link></li>
            <li><Link to="/contact" className="hover:text-orange-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-400">Contact</h3>
          <p className="text-sm text-gray-300">KG Kaserenge, Kigali</p>
          <p className="text-sm text-gray-300">+250 788 242290</p>
          <p className="text-sm text-gray-300">info@mophixstudio.rw</p>
        </div>
      </div>
      <div className="mt-8 border-t border-orange-500/20 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Mophix Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
