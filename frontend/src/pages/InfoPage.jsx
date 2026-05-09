import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, Truck, RefreshCcw, Mail, Shield, FileText, ArrowLeft, BookOpen, Leaf, Ruler } from 'lucide-react';

const InfoPage = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[1];

    const contentMap = {
        faq: {
            title: 'Frequently Asked Questions',
            icon: <HelpCircle className="text-blue-500" />,
            text: 'Find answers to common questions about our products, shipping, and more.'
        },
        shipping: {
            title: 'Shipping Policy',
            icon: <Truck className="text-green-500" />,
            text: 'We offer free shipping on all orders over $100. Deliveries usually take 2-4 business days.'
        },
        returns: {
            title: 'Returns & Exchanges',
            icon: <RefreshCcw className="text-orange-500" />,
            text: 'Not satisfied? Return any item within 30 days for a full refund or exchange.'
        },
        about: {
            title: 'Our Story',
            icon: <BookOpen className="text-amber-600" />,
            text: 'Born from a passion for design, ShopNest was created to bring premium quality and minimalist aesthetics to your doorstep.'
        },
        sustainability: {
            title: 'Sustainability',
            icon: <Leaf className="text-emerald-500" />,
            text: 'We believe in fashion that respects the Earth. Our products are sourced responsibly and built to last.'
        },
        'size-guide': {
            title: 'Size Guide',
            icon: <Ruler className="text-indigo-500" />,
            text: 'Find your perfect fit with our comprehensive measurement guide for all our apparel and footwear.'
        },
        contact: {
            title: 'Contact Us',
            icon: <Mail className="text-purple-500" />,
            text: 'Have questions? Reach out to our support team at support@shopnest.com.'
        },
        privacy: {
            title: 'Privacy Policy',
            icon: <Shield className="text-red-500" />,
            text: 'We value your privacy. Learn how we protect and manage your personal data.'
        },
        terms: {
            title: 'Terms of Service',
            icon: <FileText className="text-gray-500" />,
            text: 'The rules and guidelines for using our platform and purchasing our products.'
        }
    };

    const content = contentMap[path] || contentMap.faq;

    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <Link to="/" className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors mb-12 font-bold text-sm">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-12 shadow-premium border border-gray-100"
            >
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        {React.cloneElement(content.icon, { size: 32 })}
                    </div>
                    <h1 className="text-4xl font-bold text-primary tracking-tight">{content.title}</h1>
                </div>

                <div className="prose prose-lg max-w-none text-secondary leading-relaxed">
                    <p className="text-xl mb-8 font-medium">{content.text}</p>
                    <div className="h-px bg-gray-100 w-full mb-8"></div>
                    <p>
                        This is a dedicated page for <strong>{content.title}</strong>. At ShopNest, we believe that transparency and clarity are key to an elite shopping experience.
                    </p>
                    <p>
                        Whether you're exploring our brand heritage or checking for the perfect fit, we are here to ensure every interaction with ShopNest is seamless.
                    </p>
                    <p className="text-sm italic text-gray-400 mt-12">
                        For more detailed inquiries, please contact our concierge team.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InfoPage;
