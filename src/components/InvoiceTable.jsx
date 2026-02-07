import React from 'react';

const InvoiceTable = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#dbe6de] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-[11px] uppercase bg-[#f8faf9] text-[#61896b] font-black border-b border-[#dbe6de] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4 text-right">Quantity</th>
                            <th className="px-6 py-4 text-right">Unit Price</th>
                            <th className="px-6 py-4 text-right">Taxes</th>
                            <th className="px-6 py-4 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f0]">
                        <tr className="hover:bg-[#f8faf9]/50 transition-colors">
                            <td className="px-6 py-5">
                                <div className="font-bold text-[#111813]">Main SaaS Product</div>
                                <div className="text-[11px] text-[#61896b]">Cloud Subscription - Professional</div>
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-[#111813]">
                                2.00 Units
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-[#111813]">
                                ₹1,200.00
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-[#111813]">
                                15%
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-[#111813]">
                                ₹2,400.00
                            </td>
                        </tr>
                        <tr className="bg-[#f8faf9]/30">
                            <td className="px-6 py-5">
                                <span className="font-bold text-[#2ecc71]">10% Special Discount</span>
                                <div className="text-[11px] text-[#61896b]">Promotional adjustment</div>
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-[#111813]">
                                1.00 Units
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-[#111813]">
                                -₹120.00
                            </td>
                            <td className="px-6 py-5 text-right text-[#61896b]">
                                —
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-[#2ecc71]">
                                -₹120.00
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;
