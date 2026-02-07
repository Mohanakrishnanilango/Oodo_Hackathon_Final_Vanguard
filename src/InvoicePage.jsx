import React from 'react';
import PortalHeader from './components/PortalHeader';
import AddressCard from './components/AddressCard';
import InvoiceTable from './components/InvoiceTable';
import SummaryBox from './components/SummaryBox';

const InvoicePage = () => {
    const themeColor = '#2ecc71';

    return (
        <div className="bg-[#f8faf9] min-h-screen font-['Inter']">
            <PortalHeader themeColor={themeColor} />

            <main className="max-w-7xl mx-auto px-12 py-16">
                {/* Header Information */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-black rounded-full border border-[#2ecc71]/20 uppercase tracking-widest">Official Invoice</span>
                        </div>
                        <h1 className="text-5xl font-black text-[#111813] tracking-tight mb-4">
                            <span className="opacity-30">#</span>INV/2026/0001
                        </h1>
                        <div className="flex gap-8 text-[13px] text-[#61896b] font-medium">
                            <span><span className="font-bold text-[#111813] uppercase text-[11px] mr-2 opacity-50">Issued:</span> Feb 20, 2026</span>
                            <span><span className="font-bold text-[#111813] uppercase text-[11px] mr-2 opacity-50">Due:</span> Feb 20, 2026</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-[#dbe6de] text-[#111813] rounded-2xl text-[13px] font-bold hover:bg-[#f8faf9] transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Download PDF
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 bg-[#2ecc71] text-white rounded-2xl text-[13px] font-black hover:opacity-90 transition-all shadow-md shadow-[#2ecc71]/20">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                            Pay Invoice
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-white border border-[#dbe6de] p-1.5 rounded-full mb-16 flex items-center justify-between text-xs font-black shadow-sm max-w-2xl">
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2ecc71]/10 text-[#2ecc71] rounded-full">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        DRAFT
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 text-[#dbe6de]">
                        SENT
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 text-[#dbe6de]">
                        PAID
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Table & Addresses */}
                    <div className="lg:col-span-2 space-y-12">
                        <InvoiceTable />

                        <div className="grid grid-cols-2 gap-8 bg-white p-10 rounded-[32px] border border-[#dbe6de] shadow-sm">
                            <AddressCard />
                            <div className="border-l border-[#f0f2f0] pl-10">
                                <h3 className="text-base font-black text-[#111813] mb-5 border-b border-[#f0f2f0] pb-2 uppercase tracking-wide">Merchant Details</h3>
                                <div className="space-y-1 text-[#61896b] text-[13px] leading-relaxed font-medium">
                                    <p className="font-black text-[#111813] text-sm">SaaS Global Solutions Ltd.</p>
                                    <p>456 Enterprise Boulevard</p>
                                    <p>Tech District, 10001</p>
                                    <p>United States</p>
                                    <p className="pt-3 text-[#2ecc71] font-bold">support@saasglobal.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Actions */}
                    <div className="space-y-8">
                        <SummaryBox />

                        <div className="bg-white p-8 rounded-[32px] border border-[#dbe6de] shadow-sm">
                            <h4 className="text-[#111813] font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-[#2ecc71]">history</span>
                                Payment Activity
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[13px] font-medium">
                                    <span className="text-[#61896b]">Card ending in *4242</span>
                                    <span className="text-[#111813] font-black">₹2,640.00</span>
                                </div>
                                <div className="text-[11px] text-[#2ecc71] bg-[#2ecc71]/10 p-3 rounded-xl text-center font-bold">
                                    Transaction successful on Feb 20, 14:30
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvoicePage;
