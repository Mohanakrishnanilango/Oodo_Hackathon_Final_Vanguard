import React, { useState } from 'react';

// Mock Data
const initialSubscriptions = [
    {
        id: 'S0001',
        customer: 'Acme Corp',
        nextInvoice: 'Feb 14, 2026',
        recurring: '$140.00',
        plan: 'Monthly',
        status: 'In Progress',
        template: 'Standard SaaS',
        expiration: 'Dec 31, 2026',
        paymentTerm: '15 Days',
        orderLines: [
            { product: 'Basic Subscription', quantity: 1, unitPrice: 100, taxes: 10, subtotal: 100 },
            { product: 'Maintenance', quantity: 1, unitPrice: 40, taxes: 0, subtotal: 40 }
        ],
        history: [
            { date: 'Jan 14, 2026', type: 'Invoice', reference: 'INV/2026/001', amount: '$140.00', status: 'Paid' },
            { date: 'Dec 14, 2025', type: 'Invoice', reference: 'INV/2025/128', amount: '$140.00', status: 'Paid' }
        ]
    },
    {
        id: 'S0002',
        customer: 'Globex Inc',
        nextInvoice: 'Feb 18, 2026',
        recurring: '$116.00',
        plan: 'Monthly',
        status: 'Churned',
        template: 'Basic Plan',
        expiration: 'Jan 01, 2026',
        paymentTerm: 'Immediate Payment',
        orderLines: [
            { product: 'Basic Subscription', quantity: 1, unitPrice: 100, taxes: 16, subtotal: 116 }
        ],
        history: [
            { date: 'Jan 18, 2026', type: 'Payment', reference: 'PAY/2026/005', amount: '$116.00', status: 'Failed' },
            { date: 'Dec 18, 2025', type: 'Invoice', reference: 'INV/2025/142', amount: '$116.00', status: 'Paid' }
        ]
    },
    {
        id: 'S0003',
        customer: 'Soylent Corp',
        nextInvoice: 'Feb 10, 2026',
        recurring: '$230.00',
        plan: 'Yearly',
        status: 'Quotation Sent',
        template: 'Enterprise Bundle',
        expiration: 'Mar 10, 2026',
        paymentTerm: '30 Days',
        orderLines: [
            { product: 'Enterprise License', quantity: 10, unitPrice: 23, taxes: 0, subtotal: 230 }
        ],
        history: []
    },
    {
        id: 'S0004',
        customer: 'Umbrella Corp',
        nextInvoice: 'Mar 01, 2026',
        recurring: '$5,000.00',
        plan: 'Yearly',
        status: 'In Progress',
        template: 'Custom Enterprise',
        expiration: 'Never',
        paymentTerm: 'End of Following Month',
        orderLines: [
            { product: 'Bio-Research Tool', quantity: 1, unitPrice: 5000, taxes: 0, subtotal: 5000 }
        ],
        history: [
            { date: 'Mar 01, 2025', type: 'Invoice', reference: 'INV/2025/055', amount: '$5,000.00', status: 'Paid' }
        ]
    },
    {
        id: 'S0005',
        customer: 'Cyberdyne Systems',
        nextInvoice: 'Feb 28, 2026',
        recurring: '$999.00',
        plan: 'Monthly',
        status: 'Confirmed',
        template: 'AI Cluster Access',
        expiration: 'Never',
        paymentTerm: 'Immediate Payment',
        orderLines: [
            { product: 'Cluster Node', quantity: 3, unitPrice: 333, taxes: 0, subtotal: 999 }
        ],
        history: []
    }
];

const RecurringPlans = ['Monthly', 'Yearly', 'Weekly'];
const PaymentTerms = ['Immediate Payment', '15 Days', '30 Days', 'End of Following Month'];

const SubscriptionManager = () => {
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Actions ---

    const handleNewClick = () => {
        setCurrentSubscription({
            id: 'New', // Placeholder ID
            customer: '',
            nextInvoice: '',
            recurring: '',
            plan: 'Monthly',
            status: 'Quotation', // Initial status
            // Form specific fields
            template: 'Default Subscription',
            expiration: '',
            paymentTerm: 'Immediate Payment',
            orderLines: [{ product: 'Demo Product', quantity: 1, unitPrice: 10, taxes: 0, subtotal: 10 }]
        });
        setView('form');
    };

    const handleRowClick = (sub) => {
        // Hydrate with more details if needed
        setCurrentSubscription({
            ...sub,
            template: 'Default Subscription',
            expiration: 'Mar 14, 2026',
            paymentTerm: 'Immediate Payment',
            orderLines: [{ product: 'Service A', quantity: 1, unitPrice: parseFloat(sub.recurring.replace('$', '')), taxes: 0, subtotal: parseFloat(sub.recurring.replace('$', '')) }]
        });
        setView('form');
    };

    const handleSave = () => {
        if (currentSubscription.id === 'New') {
            const newId = `S000${subscriptions.length + 1}`;
            setSubscriptions([...subscriptions, { ...currentSubscription, id: newId, recurring: `$${currentSubscription.orderLines.reduce((acc, line) => acc + line.subtotal, 0)}` }]);
        } else {
            setSubscriptions(subscriptions.map(s => s.id === currentSubscription.id ? { ...currentSubscription, recurring: `$${currentSubscription.orderLines.reduce((acc, line) => acc + line.subtotal, 0)}` } : s));
        }
        setView('list');
    };

    // const handleDelete = () => {
    //     if (currentSubscription.id !== 'New') {
    //         setSubscriptions(subscriptions.filter(s => s.id !== currentSubscription.id));
    //     }
    //     setView('list');
    // };

    const handlePipelineClick = (status) => {
        setCurrentSubscription({ ...currentSubscription, status: status });
    };

    // --- Sub-Components ---

    const Pipeline = ({ status, onStatusChange }) => {
        const stages = ['Quotation', 'Quotation Sent', 'Confirmed'];
        return (
            <div className="flex border border-primary rounded-md overflow-hidden bg-white dark:bg-[#1a2e1f] self-end sm:self-auto">
                {stages.map((stage) => (
                    <button
                        key={stage}
                        onClick={() => onStatusChange(stage)}
                        className={`px-4 py-1.5 text-sm font-medium transition-colors border-r border-primary/20 last:border-0 ${status === stage
                            ? 'bg-primary text-[#111813]'
                            : 'text-[#61896b] hover:bg-primary/10'
                            }`}
                    >
                        {stage}
                    </button>
                ))}
            </div>
        );
    };

    // --- Views ---

    const renderListView = () => {
        const filteredSubs = subscriptions.filter(sub =>
            sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="flex flex-col gap-4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-[#1a2e1f] p-4 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNewClick}
                            className="bg-primary hover:bg-primary-dark text-[#111813] font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                        >
                            New
                        </button>
                        <div className="flex gap-1 ml-2 text-[#61896b]">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a4531] rounded-md"><span className="material-symbols-outlined">print</span></button>

                        </div>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#61896b]">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
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
                                    <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" /></th>
                                    <th className="px-6 py-4">Number</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Next Invoice</th>
                                    <th className="px-6 py-4">Recurring</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dbe6de] dark:divide-[#2a4531]">
                                {filteredSubs.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="hover:bg-gray-50 dark:hover:bg-[#2a4531]/20 cursor-pointer transition-colors"
                                        onClick={() => handleRowClick(sub)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" /></td>
                                        <td className="px-6 py-4 font-medium text-[#111813] dark:text-white">{sub.id}</td>
                                        <td className="px-6 py-4 text-[#111813] dark:text-[#e0e7e1]">{sub.customer}</td>
                                        <td className="px-6 py-4 text-[#61896b] dark:text-[#a0cfa5]">{sub.nextInvoice}</td>
                                        <td className="px-6 py-4 font-medium text-[#111813] dark:text-white">{sub.recurring}</td>
                                        <td className="px-6 py-4 text-[#61896b] dark:text-[#a0cfa5]">{sub.plan}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                                                sub.status === 'Churned' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredSubs.length === 0 && (
                        <div className="p-8 text-center text-[#61896b]">No subscriptions found.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderFormView = () => {
        return (
            <div className="flex flex-col gap-4">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-[#1a2e1f] p-4 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleSave}
                            className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-colors border ${currentSubscription.id === 'New'
                                ? 'bg-primary text-[#111813] border-primary hover:bg-primary-dark'
                                : 'bg-white dark:bg-transparent text-[#61896b] border-[#dbe6de] dark:border-[#2a4531] hover:bg-gray-50'
                                }`}
                        >
                            {currentSubscription.id === 'New' ? 'Save' : 'Save Changes'}
                        </button>
                        {currentSubscription.id !== 'New' && (
                            <button
                                className="px-6 py-2 rounded-lg font-bold text-[#61896b] border border-[#dbe6de] dark:border-[#2a4531] hover:bg-gray-50 bg-white dark:bg-transparent transition-colors"
                            >
                                Send
                            </button>
                        )}
                        {currentSubscription.id !== 'New' && (
                            <button
                                className="px-6 py-2 rounded-lg font-bold text-[#61896b] border border-[#dbe6de] dark:border-[#2a4531] hover:bg-gray-50 bg-white dark:bg-transparent transition-colors"
                            >
                                Confirm
                            </button>
                        )}

                        <div className="h-6 w-px bg-gray-300 dark:bg-[#2a4531] mx-2"></div>

                        <button onClick={() => setView('list')} className="text-[#61896b] hover:text-[#111813] text-sm font-medium">
                            Discard
                        </button>
                    </div>

                    <Pipeline status={currentSubscription.status} onStatusChange={handlePipelineClick} />
                </div>

                {/* Main Form Area */}
                <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531] p-8">
                    <div className="flex justify-between items-start mb-8">
                        <h1 className="text-3xl font-bold text-[#111813] dark:text-white">
                            {currentSubscription.id === 'New' ? 'New Subscription' : currentSubscription.id}
                        </h1>
                        <div className="text-right">
                            {/* Save Icon Shortcut */}
                            <button onClick={handleSave} className="p-2 text-[#61896b] hover:text-primary transition-colors" title="Save">
                                <span className="material-symbols-outlined text-3xl">save</span>
                            </button>
                            {/* Delete Icon Shortcut */}

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-[#111813] dark:text-[#e0e7e1]">Customer</label>
                                <input
                                    type="text"
                                    className="form-input rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    value={currentSubscription.customer}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, customer: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-[#111813] dark:text-[#e0e7e1]">Quotation Template</label>
                                <select
                                    className="form-select rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    value={currentSubscription.template}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, template: e.target.value })}
                                >
                                    <option>Default Subscription</option>
                                    <option>Premium Plan</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-[#111813] dark:text-[#e0e7e1]">Expiration</label>
                                <input
                                    type="date"
                                    className="form-input rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    value={currentSubscription.expiration} // Basic native date picker
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, expiration: e.target.value })}
                                />
                                <p className="text-xs text-[#61896b]">Quotation expires after this date</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-[#111813] dark:text-[#e0e7e1]">Recurring Plan</label>
                                <select
                                    className="form-select rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    value={currentSubscription.plan}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, plan: e.target.value })}
                                >
                                    {RecurringPlans.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-[#111813] dark:text-[#e0e7e1]">Payment Terms</label>
                                <select
                                    className="form-select rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    value={currentSubscription.paymentTerm}
                                    onChange={(e) => setCurrentSubscription({ ...currentSubscription, paymentTerm: e.target.value })}
                                >
                                    {PaymentTerms.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Area */}
                    <div className="mt-8">
                        <div className="flex border-b border-[#dbe6de] dark:border-[#2a4531] mb-6 gap-6">
                            <button className="px-2 py-3 font-semibold text-primary border-b-2 border-primary">Order Lines</button>
                            <button className="px-2 py-3 font-semibold text-[#61896b] hover:text-[#111813] transition-colors">Invoices & History</button>
                            <button className="px-2 py-3 font-semibold text-[#61896b] hover:text-[#111813] transition-colors">Other Info</button>
                        </div>

                        {/* Order Lines Table */}
                        <div className="overflow-x-auto border border-[#dbe6de] dark:border-[#2a4531] rounded-lg mb-8">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-[#2a4531]/30 text-[#61896b] font-semibold border-b border-[#dbe6de] dark:border-[#2a4531]">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3 w-32">Quantity</th>
                                        <th className="px-4 py-3">Unit Price</th>
                                        <th className="px-4 py-3">Taxes</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dbe6de] dark:divide-[#2a4531]">
                                    {currentSubscription.orderLines.map((line, idx) => (
                                        <tr key={idx} className="bg-white dark:bg-[#1a2e1f]">
                                            <td className="px-4 py-3">{line.product}</td>
                                            <td className="px-4 py-3">{line.quantity}</td>
                                            <td className="px-4 py-3">${line.unitPrice}</td>
                                            <td className="px-4 py-3">{line.taxes}%</td>
                                            <td className="px-4 py-3 text-right font-medium">${line.subtotal}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Add Line Placeholder */}
                                    <tr>
                                        <td colSpan="6" className="px-4 py-3 text-primary hover:underline cursor-pointer font-medium">Add a line</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* History Section (Mock) */}
                        {currentSubscription.history && currentSubscription.history.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-[#111813] dark:text-white mb-4">Payment & Invoice History</h3>
                                <div className="overflow-x-auto border border-[#dbe6de] dark:border-[#2a4531] rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-[#2a4531]/30 text-[#61896b] font-semibold border-b border-[#dbe6de] dark:border-[#2a4531]">
                                            <tr>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Type</th>
                                                <th className="px-4 py-3">Reference</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#dbe6de] dark:divide-[#2a4531]">
                                            {currentSubscription.history.map((item, idx) => (
                                                <tr key={idx} className="bg-white dark:bg-[#1a2e1f]">
                                                    <td className="px-4 py-3 text-[#111813] dark:text-white">{item.date}</td>
                                                    <td className="px-4 py-3 text-[#61896b]">{item.type}</td>
                                                    <td className="px-4 py-3 font-medium text-primary hover:underline cursor-pointer">{item.reference}</td>
                                                    <td className="px-4 py-3 text-[#111813] dark:text-white">{item.amount}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                                item.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            {view === 'list' ? renderListView() : renderFormView()}
        </div>
    );
};

export default SubscriptionManager;