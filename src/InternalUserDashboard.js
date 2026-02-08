import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { getStoredUser, logout } from './authService';
import SubscriptionManager from './SubscriptionManager';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import ProductsTable from './ProductsTable';
import ProductForm from './ProductForm';
import PaymentHistory from './PaymentHistory';

const InternalUserDashboard = () => {
    const navigate = useNavigate();
    const user = getStoredUser();

    // Fallback or early exit if no user
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const userRole = user?.role || 'admin';
    const userName = user?.name || 'Internal User';
    const userEmail = user?.email || '';
    const [activeTab, setActiveTab] = useState('dashboard');
    const [tabPayload, setTabPayload] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ activeSubscriptions: 0, pendingInvoices: 0, todaysCollections: 0 });
    const [recentActivity, setRecentActivity] = useState([]);

    const [productView, setProductView] = useState('list'); // 'list' or 'form'
    const [customerView, setCustomerView] = useState('list'); // 'list' or 'form'
    const [invoiceView, setInvoiceView] = useState('list'); // 'list', 'detail', or 'form'

    const fetchData = async () => {
        try {
            const results = await Promise.allSettled([
                api.get('/subscriptions'),
                api.get('/invoices'),
                api.get('/products?admin=true'),
                api.get('/auth/users'),
                api.get('/dashboard/stats'),
                api.get('/dashboard/activity')
            ]);

            const [subsRes, invsRes, prodsRes, custsRes, statsRes, activityRes] = results;

            if (subsRes.status === 'fulfilled') setSubscriptions(subsRes.value.data);
            if (invsRes.status === 'fulfilled') setInvoices(invsRes.value.data);
            if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value.data);
            if (statsRes.status === 'fulfilled') setDashboardStats(statsRes.value.data);
            if (activityRes.status === 'fulfilled') setRecentActivity(activityRes.value.data);

            if (custsRes.status === 'fulfilled' && subsRes.status === 'fulfilled') {
                const rawCustomers = custsRes.value.data;
                const subs = subsRes.value.data;
                // Filter customers for internal_staff?
                // The /auth/users endpoint returns global users.
                // We should filter them here to only show assigned ones for internal_staff.
                let relevantCustomers = rawCustomers.filter(u => u.role !== 'admin');

                if (userRole === 'internal_staff') {
                    relevantCustomers = relevantCustomers.filter(u => u.sales_person_id === user.id);
                }

                const enrichedCustomers = relevantCustomers.map(cust => {
                    const userSubs = subs.filter(s => s.customer_id === cust.id || s.customer === cust.name);
                    const activeSubs = userSubs.filter(s => s.status === 'Confirmed' || s.status === 'Active');
                    const totalRevenue = userSubs.reduce((acc, s) => acc + (parseFloat(s.recurring_amount) || 0), 0);
                    const status = activeSubs.length > 0 ? 'Active' : userSubs.length > 0 ? 'Churned' : 'Prospect';

                    return {
                        ...cust,
                        subscriptions: activeSubs.length,
                        totalRevenue: `$${totalRevenue.toFixed(2)}`,
                        status: status
                    };
                });
                setCustomers(enrichedCustomers);
            } else if (custsRes.status === 'fulfilled') {
                // Fallback
                let relevantCustomers = custsRes.value.data.filter(u => u.role !== 'admin');
                if (userRole === 'internal_staff') {
                    relevantCustomers = relevantCustomers.filter(u => u.sales_person_id === user.id);
                }
                setCustomers(relevantCustomers);
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [userRole]); // Dependency on userRole to ensure correct filtering

    const handleTabChange = (tab, payload = null) => {
        setActiveTab(tab);
        setTabPayload(payload);
        setProductView('list');
        setCustomerView('list');
        setInvoiceView(payload ? 'detail' : 'list');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInvoiceStatusChange = async (invoiceId, newStatus) => {
        try {
            await api.patch(`/invoices/${invoiceId}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error("Failed to update invoice status", error);
            alert("Failed to update invoice status");
        }
    };

    const handleInvoiceCreate = () => {
        fetchData();
        setInvoiceView('list');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                                <h3 className="text-[#61896b] font-semibold mb-2">Active Subscriptions</h3>
                                <p className="text-3xl font-bold text-[#111813] dark:text-white">{dashboardStats.activeSubscriptions}</p>
                            </div>
                            <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                                <h3 className="text-[#61896b] font-semibold mb-2">Pending Invoices</h3>
                                <p className="text-3xl font-bold text-[#111813] dark:text-white">{dashboardStats.pendingInvoices}</p>
                            </div>
                            <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                                <h3 className="text-[#61896b] font-semibold mb-2">Today's Collections</h3>
                                <p className="text-3xl font-bold text-[#111813] dark:text-white">${dashboardStats.todaysCollections}</p>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-lg font-bold text-[#111813] dark:text-white mb-4">Recent Activity</h3>
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-gray-500">No recent activity.</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivity.map((act, idx) => (
                                        <div key={idx} className="flex items-center justify-between border-b border-[#f0f2f0] dark:border-[#2a4531] pb-3 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${act.type === 'Subscription' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                                    <span className="material-symbols-outlined text-sm">{act.type === 'Subscription' ? 'subscriptions' : 'receipt_long'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#111813] dark:text-white">{act.type} - {act.description}</p>
                                                    <p className="text-xs text-[#61896b]">{act.customer}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(act.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'subscriptions':
                return (
                    <SubscriptionManager
                        onNavigate={handleTabChange}
                        subscriptions={subscriptions}
                        setSubscriptions={setSubscriptions} // Or handleSave inside to call fetchData
                        invoices={invoices}
                        setInvoices={setInvoices}
                        userRole={userRole}
                        products={products}
                        customers={customers}
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
                        onSave={() => {
                            fetchData(); // Refresh list including new customer
                            setCustomerView('list');
                        }}
                        onDiscard={() => setCustomerView('list')}
                        userRole={userRole}
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
                        onSave={() => {
                            fetchData(); // Refresh list including new product
                            setProductView('list');
                        }}
                        onDiscard={() => setProductView('list')}
                    />
                );
            case 'invoices':
                // The provided change uses 'currentView' and 'setCurrentView'
                // Assuming 'invoiceView' is intended to be 'currentView' for this context
                // and 'setInvoiceView' is intended to be 'setCurrentView'.
                // Also, 'user' is used in the original, but 'getStoredUser()' in the change.
                // We'll use 'user' if available, otherwise fallback to 'getStoredUser()'.
                const filteredCustomersForInvoiceForm = userRole === 'admin'
                    ? customers
                    : customers.filter(c => c.sales_person_id === (user?.id || getStoredUser()?.id));

                return invoiceView === 'list' ? (
                    <InvoiceList
                        initialInvoice={tabPayload} // Keep initialInvoice if it's still needed
                        invoices={invoices}
                        onStatusChange={handleInvoiceStatusChange}
                        onNew={() => setInvoiceView('form')}
                    />
                ) : (
                    <InvoiceForm
                        customers={filteredCustomersForInvoiceForm}
                        onSave={handleInvoiceCreate} // Use the new handler
                        onDiscard={() => setInvoiceView('list')}
                        userRole={userRole} // Keep userRole prop if needed
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
                            <p className="text-sm font-medium text-[#111813] dark:text-white truncate">{userName}</p>
                            <p className="text-xs text-[#61896b] truncate">{userEmail}</p>
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
                <header className="flex h-16 items-center justify-between border-b border-[#dbe6de] bg-white px-6 dark:border-[#2a4531] dark:bg-[#1a2e1f]">
                    <h2 className="text-xl font-bold text-[#111813] dark:text-white">
                        {user?.role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}
                    </h2>
                </header>

                <div className="p-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default InternalUserDashboard;
