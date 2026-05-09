import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-primary mb-6 block">
                            Shop<span className="text-gray-400">Nest</span>
                        </Link>
                        <p className="text-secondary text-sm leading-relaxed mb-6">
                            Experience the future of online shopping with ShopNest. Curated collections for the modern lifestyle.
                        </p>
                        <div className="flex space-x-4">
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link to="/shop" className="text-secondary text-sm hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/about" className="text-secondary text-sm hover:text-primary transition-colors">Our Story</Link></li>
                            <li><Link to="/sustainability" className="text-secondary text-sm hover:text-primary transition-colors">Sustainability</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link to="/faq" className="text-secondary text-sm hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-secondary text-sm hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="text-secondary text-sm hover:text-primary transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/contact" className="text-secondary text-sm hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-secondary text-sm">
                                <Mail size={16} />
                                <span>support@shopnest.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-secondary text-sm">
                                <Phone size={16} />
                                <span>+1 (555) 000-0000</span>
                            </li>
                            <li className="flex items-center space-x-3 text-secondary text-sm">
                                <MapPin size={16} />
                                <span>123 Design St, Creative City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-secondary text-xs">
                        &copy; {new Date().getFullYear()} ShopNest Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="text-secondary text-xs hover:text-primary">Privacy Policy</Link>
                        <Link to="/terms" className="text-secondary text-xs hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
