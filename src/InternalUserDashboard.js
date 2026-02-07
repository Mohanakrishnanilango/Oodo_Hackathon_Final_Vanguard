import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SubscriptionManager from './SubscriptionManager';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import ProductsTable from './ProductsTable';
import ProductForm from './ProductForm';
import PaymentHistory from './PaymentHistory';

// Mock Data
const initialCustomers = [
    { id: 'C001', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '+1 555-0101', subscriptions: 1, totalRevenue: '$1,680.00', status: 'Active' },
    { id: 'C002', name: 'Globex Inc', email: 'info@globexinc.com', phone: '+1 555-0102', subscriptions: 1, totalRevenue: '$1,392.00', status: 'Churned' },
    { id: 'C003', name: 'Soylent Corp', email: 'sales@soylentcorp.com', phone: '+1 555-0103', subscriptions: 1, totalRevenue: '$0.00', status: 'Prospect' },
    { id: 'C004', name: 'Umbrella Corp', email: 'research@umbrella.com', phone: '+1 555-0104', subscriptions: 1, totalRevenue: '$5,000.00', status: 'Active' },
    { id: 'C005', name: 'Cyberdyne Systems', email: 'skynet@cyberdyne.com', phone: '+1 555-0105', subscriptions: 1, totalRevenue: '$0.00', status: 'Active' },
    { id: 'C006', name: 'Stark Industries', email: 'tony@stark.com', phone: '+1 555-0106', subscriptions: 0, totalRevenue: '$0.00', status: 'Prospect' },
    { id: 'C007', name: 'Wayne Enterprises', email: 'bruce@wayne.com', phone: '+1 555-0107', subscriptions: 0, totalRevenue: '$0.00', status: 'Prospect' }
];

const initialSubscriptions = [
    {
        id: 'S0001',
        customer: 'Acme Corp',
        nextInvoice: 'Feb 14, 2026',
        recurring: '$140.00',
        plan: 'Monthly',
        status: 'In Progress',
        template: 'Standard SaaS',
        expiration: '2026-12-31',
        paymentTerm: '15 Days',
        salesPerson: 'Mitchell Admin',
        startDate: '2026-01-14',
        paymentMethod: 'Credit Card',
        paymentDone: true,
        orderLines: [
            { product: 'Basic Subscription', quantity: 1, unitPrice: 100, discount: 0, taxes: 10, subtotal: 100 },
            { product: 'Maintenance', quantity: 1, unitPrice: 40, discount: 0, taxes: 0, subtotal: 40 }
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
        expiration: '2026-01-01',
        paymentTerm: 'Immediate Payment',
        salesPerson: 'Marc Demo',
        startDate: '2025-12-18',
        paymentMethod: 'Manual Payment',
        paymentDone: true,
        orderLines: [
            { product: 'Basic Subscription', quantity: 1, unitPrice: 100, discount: 0, taxes: 16, subtotal: 116 }
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
        expiration: '2026-03-10',
        paymentTerm: '30 Days',
        salesPerson: 'Mitchell Admin',
        startDate: '2026-02-10',
        paymentMethod: 'Credit Card',
        paymentDone: false,
        orderLines: [
            { product: 'Enterprise License', quantity: 10, unitPrice: 23, discount: 0, taxes: 0, subtotal: 230 }
        ],
        history: []
    }
];

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

const initialProducts = [
    { id: 'PROD001', name: 'Basic Subscription', price: 29.00, cost: 10.00, type: 'service' },
    { id: 'PROD002', name: 'Pro Subscription', price: 59.00, cost: 20.00, type: 'service' },
    { id: 'PROD003', name: 'Enterprise License', price: 199.00, cost: 50.00, type: 'software' },
    { id: 'PROD004', name: 'Onboarding Package', price: 500.00, cost: 150.00, type: 'service' },
    { id: 'PROD005', name: 'Support Add-on', price: 15.00, cost: 5.00, type: 'service' },
];

const InternalUserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = location.state?.userRole || 'admin';
    const [activeTab, setActiveTab] = useState('dashboard');
    const [tabPayload, setTabPayload] = useState(null);
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [invoices, setInvoices] = useState(mockInvoices);
    const [products, setProducts] = useState(initialProducts);
    const [customers, setCustomers] = useState(initialCustomers);
    const [productView, setProductView] = useState('list'); // 'list' or 'form'
    const [customerView, setCustomerView] = useState('list'); // 'list' or 'form'
    const [invoiceView, setInvoiceView] = useState('list'); // 'list', 'detail', or 'form'

    const handleTabChange = (tab, payload = null) => {
        setActiveTab(tab);
        setTabPayload(payload);
        // Reset sub-views when switching main tabs
        setProductView('list');
        setCustomerView('list');
        setInvoiceView(payload ? 'detail' : 'list');
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleInvoiceStatusChange = (invoiceId, newStatus) => {
        // 1. Update Invoices state
        const updatedInvoices = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv);
        setInvoices(updatedInvoices);

        // 2. Update Subscription History
        const invoice = updatedInvoices.find(inv => inv.id === invoiceId);
        if (invoice && invoice.subscription) {
            setSubscriptions(prevSubs => prevSubs.map(sub => {
                if (sub.id === invoice.subscription) {
                    const updatedHistory = (sub.history || []).map(item =>
                        item.reference === invoiceId ? { ...item, status: newStatus } : item
                    );
                    return { ...sub, history: updatedHistory };
                }
                return sub;
            }));
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Active Subscriptions</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">{subscriptions.filter(s => s.status === 'In Progress' || s.status === 'Confirmed').length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Pending Invoices</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">{invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Today's Collections</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">$3,450</p>
                        </div>
                    </div>
                );
            case 'subscriptions':
                return (
                    <SubscriptionManager
                        onNavigate={handleTabChange}
                        subscriptions={subscriptions}
                        setSubscriptions={setSubscriptions}
                        invoices={invoices}
                        setInvoices={setInvoices}
                        userRole={userRole}
                    />
                );
            case 'customers':
                return customerView === 'list' ? (
                    <CustomerList
                        customers={customers}
                        onNew={() => setCustomerView('form')}
                        userRole={userRole}
                    />
                ) : (
                    <CustomerForm
                        onSave={(newCust) => {
                            setCustomers([...customers, newCust]);
                            setCustomerView('list');
                        }}
                        onDiscard={() => setCustomerView('list')}
                    />
                );
            case 'products':
                return productView === 'list' ? (
                    <ProductsTable
                        products={products}
                        onNew={() => setProductView('form')}
                    />
                ) : (
                    <ProductForm
                        onSave={(newProd) => {
                            setProducts([...products, newProd]);
                            setProductView('list');
                        }}
                        onDiscard={() => setProductView('list')}
                    />
                );
            case 'invoices':
                if (invoiceView === 'form') {
                    return (
                        <InvoiceForm
                            customers={customers}
                            onSave={(newInv) => {
                                setInvoices([...invoices, newInv]);
                                setInvoiceView('list');
                            }}
                            onDiscard={() => setInvoiceView('list')}
                        />
                    );
                }
                return (
                    <InvoiceList
                        initialInvoice={tabPayload}
                        invoices={invoices}
                        onStatusChange={handleInvoiceStatusChange}
                        onNew={() => setInvoiceView('form')}
                    />
                );
            case 'payments':
                return <PaymentHistory />;
            case 'reports':
                return <div className="p-6 bg-white dark:bg-[#1a2e1f] rounded-xl border border-[#dbe6de] dark:border-[#2a4531]">Operational Reports Placeholder</div>;
            default:
                return <div>Select an item</div>;
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#1a2e1f] border-r border-[#dbe6de] dark:border-[#2a4531] flex flex-col">
                <div className="p-6 border-b border-[#dbe6de] dark:border-[#2a4531]">
                    <h1 className="text-xl font-bold text-primary">Internal Portal</h1>
                    <p className="text-xs text-[#61896b]">Operational Access Only</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <button
                                onClick={() => handleTabChange('dashboard')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Dashboard
                            </button>
                        </li>

                        <div className="pt-4 pb-2 px-3 text-xs font-semibold text-[#61896b]/60 uppercase tracking-wider">
                            Management
                        </div>

                        <li>
                            <button
                                onClick={() => handleTabChange('subscriptions')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">subscriptions</span>
                                Subscriptions
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('products')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">inventory_2</span>
                                Products
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('customers')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customers' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">group</span>
                                Customers
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('invoices')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'invoices' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                Invoices
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('payments')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">payments</span>
                                Payments
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('reports')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">bar_chart</span>
                                Reports
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-[#dbe6de] dark:border-[#2a4531]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#111813] dark:text-white truncate">Admin User</p>
                            <p className="text-xs text-[#61896b] truncate">internal@test.com</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white dark:bg-[#1a2e1f] border-b border-[#dbe6de] dark:border-[#2a4531] p-4 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-[#111813] dark:text-white capitalize">{activeTab}</h2>
                </header>

                <div className="p-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default InternalUserDashboard;
