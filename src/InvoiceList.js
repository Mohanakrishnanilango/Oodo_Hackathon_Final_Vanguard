import React, { useState } from 'react';

// Mock Invoice Data with Payment History
const mockInvoices = [
    {
        id: 'INV/2026/001',
        customer: 'Acme Corp',
        subscription: 'S0001',
        date: 'Jan 14, 2026',
        dueDate: 'Jan 29, 2026',
        amount: '$140.00',
        status: 'Paid',
        paymentHistory: [
            { date: 'Jan 15, 2026', method: 'Credit Card', reference: 'PAY/2026/001', amount: '$140.00' }
        ]
    },
    {
        id: 'INV/2025/128',
        customer: 'Acme Corp',
        subscription: 'S0001',
        date: 'Dec 14, 2025',
        dueDate: 'Dec 29, 2025',
        amount: '$140.00',
        status: 'Paid',
        paymentHistory: [
            { date: 'Dec 16, 2025', method: 'Bank Transfer', reference: 'PAY/2025/128', amount: '$140.00' }
        ]
    },
    {
        id: 'INV/2026/005',
        customer: 'Globex Inc',
        subscription: 'S0002',
        date: 'Jan 18, 2026',
        dueDate: 'Feb 02, 2026',
        amount: '$116.00',
        status: 'Overdue',
        paymentHistory: []
    },
    {
        id: 'INV/2025/142',
        customer: 'Globex Inc',
        subscription: 'S0002',
        date: 'Dec 18, 2025',
        dueDate: 'Jan 02, 2026',
        amount: '$116.00',
        status: 'Paid',
        paymentHistory: [
            { date: 'Dec 20, 2025', method: 'Credit Card', reference: 'PAY/2025/142', amount: '$116.00' }
        ]
    },
    {
        id: 'INV/2025/055',
        customer: 'Umbrella Corp',
        subscription: 'S0004',
        date: 'Mar 01, 2025',
        dueDate: 'Apr 30, 2025',
        amount: '$5,000.00',
        status: 'Paid',
        paymentHistory: [
            { date: 'Apr 15, 2025', method: 'Wire Transfer', reference: 'PAY/2025/055', amount: '$5,000.00' }
        ]
    },
    {
        id: 'INV/2026/012',
        customer: 'Soylent Corp',
        subscription: 'S0003',
        date: 'Feb 10, 2026',
        dueDate: 'Mar 12, 2026',
        amount: '$230.00',
        status: 'Draft',
        paymentHistory: []
    },
    {
        id: 'INV/2026/018',
        customer: 'Cyberdyne Systems',
        subscription: 'S0005',
        date: 'Jan 28, 2026',
        dueDate: 'Feb 12, 2026',
        amount: '$999.00',
        status: 'Sent',
        paymentHistory: []
    }
];

const InvoiceList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const filteredInvoices = mockInvoices.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (invoice) => {
        setSelectedInvoice(selectedInvoice?.id === invoice.id ? null : invoice);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-[#1a2e1f] p-4 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                <div className="flex items-center gap-2">
                    <button className="bg-primary hover:bg-primary-dark text-[#111813] font-bold py-2 px-6 rounded-lg shadow-sm transition-colors">
                        New Invoice
                    </button>
                </div>

                <div className="relative w-full sm:w-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#61896b]">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-sm focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-[#2a4531]/30 text-[#61896b] font-semibold border-b border-[#dbe6de] dark:border-[#2a4531]">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Subscription</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dbe6de] dark:divide-[#2a4531]">
                            {filteredInvoices.map((invoice) => (
                                <React.Fragment key={invoice.id}>
                                    <tr
                                        className="hover:bg-gray-50 dark:hover:bg-[#2a4531]/20 cursor-pointer transition-colors"
                                        onClick={() => handleRowClick(invoice)}
                                    >
                                        <td className="px-6 py-4 font-medium text-primary hover:underline">{invoice.id}</td>
                                        <td className="px-6 py-4 text-[#111813] dark:text-[#e0e7e1]">{invoice.customer}</td>
                                        <td className="px-6 py-4 text-[#61896b] dark:text-[#a0cfa5]">{invoice.subscription}</td>
                                        <td className="px-6 py-4 text-[#61896b] dark:text-[#a0cfa5]">{invoice.date}</td>
                                        <td className="px-6 py-4 text-[#61896b] dark:text-[#a0cfa5]">{invoice.dueDate}</td>
                                        <td className="px-6 py-4 font-medium text-[#111813] dark:text-white">{invoice.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                    invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                                        invoice.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                    </tr>
                                    {selectedInvoice?.id === invoice.id && invoice.paymentHistory.length > 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 bg-gray-50 dark:bg-[#15251a]">
                                                <div className="ml-8">
                                                    <h4 className="text-sm font-semibold text-[#111813] dark:text-white mb-3">Payment History</h4>
                                                    <table className="w-full text-sm">
                                                        <thead className="text-[#61896b] text-xs">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left">Date</th>
                                                                <th className="px-4 py-2 text-left">Method</th>
                                                                <th className="px-4 py-2 text-left">Reference</th>
                                                                <th className="px-4 py-2 text-right">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {invoice.paymentHistory.map((payment, idx) => (
                                                                <tr key={idx} className="border-t border-[#dbe6de] dark:border-[#2a4531]">
                                                                    <td className="px-4 py-2 text-[#111813] dark:text-white">{payment.date}</td>
                                                                    <td className="px-4 py-2 text-[#61896b]">{payment.method}</td>
                                                                    <td className="px-4 py-2 text-primary font-medium">{payment.reference}</td>
                                                                    <td className="px-4 py-2 text-right text-[#111813] dark:text-white font-medium">{payment.amount}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredInvoices.length === 0 && (
                    <div className="p-8 text-center text-[#61896b]">No invoices found.</div>
                )}
            </div>
        </div>
    );
};

export default InvoiceList;
