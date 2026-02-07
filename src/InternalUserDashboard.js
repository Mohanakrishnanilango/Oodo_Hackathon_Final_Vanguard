import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionManager from './SubscriptionManager';
import CustomerList from './CustomerList';
import InvoiceList from './InvoiceList';
import PaymentHistory from './PaymentHistory';

const InternalUserDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Active Subscriptions</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">124</p>
                        </div>
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Pending Invoices</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">12</p>
                        </div>
                        <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                            <h3 className="text-[#61896b] font-semibold mb-2">Today's Collections</h3>
                            <p className="text-3xl font-bold text-[#111813] dark:text-white">$3,450</p>
                        </div>
                    </div>
                );
            case 'subscriptions':
                return <SubscriptionManager />;
            case 'customers':
                return <CustomerList />;
            case 'invoices':
                return <InvoiceList />;
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
                                onClick={() => setActiveTab('dashboard')}
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
                                onClick={() => setActiveTab('subscriptions')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">subscriptions</span>
                                Subscriptions
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('customers')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customers' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">group</span>
                                Customers
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('invoices')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'invoices' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                Invoices
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'text-[#61896b] hover:bg-gray-50 dark:hover:bg-[#2a4531]/50'}`}
                            >
                                <span className="material-symbols-outlined">payments</span>
                                Payments
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('reports')}
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
                            <p className="text-sm font-medium text-[#111813] dark:text-white truncate">Internal User</p>
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
