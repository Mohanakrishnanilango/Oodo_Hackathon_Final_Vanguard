import React, { useState } from 'react';

const InvoiceForm = ({ customers, onSave, onDiscard }) => {
    const [formData, setFormData] = useState({
        customer: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        amount: '',
        subscription: 'Manual Invoice',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.customer || !formData.amount || parseFloat(formData.amount) <= 0) {
            alert('the field must be filled');
            return;
        }

        const newInvoice = {
            id: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 900) + 100}`,
            customer: formData.customer,
            subscription: formData.subscription,
            date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dueDate: new Date(formData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `$${parseFloat(formData.amount).toFixed(2)}`,
            status: 'Draft',
            paymentHistory: []
        };

        if (onSave) {
            onSave(newInvoice);
        }
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-[#1a2e1f] p-4 rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary-dark text-[#111813] font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={onDiscard}
                        className="bg-white dark:bg-transparent border border-[#dbe6de] dark:border-[#2a4531] text-[#61896b] hover:text-[#111813] font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                    >
                        Discard
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-[#dbe6de] dark:border-[#2a4531] p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#111813] dark:text-[#e0e7e1] mb-1">
                                Customer*
                            </label>
                            <select
                                name="customer"
                                value={formData.customer}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-shadow"
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#111813] dark:text-[#e0e7e1] mb-1">
                                Invoice Amount ($)*
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-shadow font-bold text-lg"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#111813] dark:text-[#e0e7e1] mb-1">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#111813] dark:text-[#e0e7e1] mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#dbe6de] dark:border-[#3a5840] bg-background-light dark:bg-[#15251a] text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-shadow"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
