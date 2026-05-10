import React from 'react';
import { motion } from 'framer-motion';

const SizeChart = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Size Guide</h1>
                <p className="text-secondary text-lg">Find your perfect fit across all our premium collections.</p>
            </div>

            <div className="space-y-16">
                {/* Women's Size Chart */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-premium"
                >
                    <h2 className="text-2xl font-bold text-primary mb-8 border-b border-gray-100 pb-4">Women's Clothing</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Size</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Bust (in)</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Waist (in)</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Hips (in)</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary text-sm">
                                {[['XS', '32-34', '26-28', '34-36'], ['S', '35-37', '29-31', '37-39'], ['M', '38-40', '32-34', '40-42'], ['L', '41-43', '35-37', '43-45'], ['XL', '44-46', '38-40', '46-48'], ['XXL', '47-49', '41-43', '49-51']].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        {row.map((val, j) => <td key={j} className="py-4">{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>

                {/* Men's Size Chart */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-premium"
                >
                    <h2 className="text-2xl font-bold text-primary mb-8 border-b border-gray-100 pb-4">Men's Clothing</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Size</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Chest (in)</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Waist (in)</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">Hips (in)</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary text-sm">
                                {[['XS', '32-34', '26-28', '34-36'], ['S', '35-37', '29-31', '37-39'], ['M', '38-40', '32-34', '40-42'], ['L', '41-43', '35-37', '43-45'], ['XL', '44-46', '38-40', '46-48'], ['XXL', '47-49', '41-43', '49-51']].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        {row.map((val, j) => <td key={j} className="py-4">{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>

                {/* Footwear Size Chart */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-premium"
                >
                    <h2 className="text-2xl font-bold text-primary mb-8 border-b border-gray-100 pb-4">Footwear</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">US</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">UK</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">EU</th>
                                    <th className="py-4 font-bold text-sm text-primary uppercase tracking-wider">CM</th>
                                </tr>
                            </thead>
                            <tbody className="text-secondary text-sm">
                                {[['7', '6', '40', '25'], ['8', '7', '41', '26'], ['9', '8', '42.5', '27'], ['10', '9', '44', '28'], ['11', '10', '45', '29'], ['12', '11', '46', '30']].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        {row.map((val, j) => <td key={j} className="py-4">{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            </div>
            
            <div className="mt-16 bg-gray-50 p-8 rounded-[2.5rem] text-center border border-gray-100">
                <h3 className="font-bold text-primary mb-2">Still not sure about your size?</h3>
                <p className="text-secondary text-sm">Our customer support team is happy to help you find the perfect fit.</p>
            </div>
        </div>
    );
};

export default SizeChart;
