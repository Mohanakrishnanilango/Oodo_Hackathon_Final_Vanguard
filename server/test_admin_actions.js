const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function runTests() {
    try {
        // 1. Register New Admin (to bypass login issues)
        console.log('--- Registering New Admin ---');
        const adminEmail = 'newadmin' + Date.now() + '@test.com';
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'New Admin',
            email: adminEmail,
            password: 'Password123!',
            role: 'admin'
        });
        const token = registerRes.data.token;
        console.log('Admin Registered. Token acquired.', token);

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Create Product
        console.log('\n--- Creating Product ---');
        const productPayload = {
            name: "Test Product " + Date.now(),
            type: "service",
            price: 100,
            cost: 50,
            description: "Test Description",
            is_active: true
        };
        try {
            const prodRes = await axios.post(`${API_URL}/products`, productPayload, config);
            console.log('Product Created:', prodRes.data.id);
        } catch (e) {
            console.error('Product Creation Failed:', e.response?.data || e.message);
        }

        // 3. Create Customer
        console.log('\n--- Creating Customer ---');
        const customerPayload = {
            name: "Test Customer " + Date.now(),
            email: "customer" + Date.now() + "@test.com",
            password: "Password123!",
            phone: "1234567890",
            company: "Test Co",
            address: "123 Test St",
            role: "user"
        };
        let customerId;
        try {
            const custRes = await axios.post(`${API_URL}/auth/register`, customerPayload); // Register is usually public, but we can check if it works
            customerId = custRes.data.id;
            console.log('Customer Created:', customerId);
        } catch (e) {
            console.error('Customer Creation Failed:', e.response?.data || e.message);
        }

        if (customerId) {
            // 4. Create Subscription
            console.log('\n--- Creating Subscription ---');
            const subPayload = {
                customer_id: customerId,
                plan: "Monthly",
                start_date: new Date().toISOString().split('T')[0],
                payment_term: "Immediate Payment",
                sales_person: "Admin User",
                orderLines: [
                    {
                        product: "Test Product " + Date.now(), // New product name to trigger backend creation logic
                        quantity: 1,
                        unitPrice: 100,
                        subtotal: 100
                    }
                ]
            };
            try {
                const subRes = await axios.post(`${API_URL}/subscriptions`, subPayload, config); // Should NOT have protect yet, but I'll send token anyway
                console.log('Subscription Created:', subRes.data.id);
            } catch (e) {
                console.error('Subscription Creation Failed:', e.response?.data || e.message);
            }

            // 5. Create Invoice
            console.log('\n--- Creating Invoice ---');
            const invPayload = {
                customer_id: customerId,
                subscription_id: null,
                amount: 100,
                date: new Date().toISOString().split('T')[0],
                due_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
            };
            try {
                const invRes = await axios.post(`${API_URL}/invoices`, invPayload, config);
                console.log('Invoice Created:', invRes.data.id);
            } catch (e) {
                console.error('Invoice Creation Failed:', e.response?.data || e.message);
            }
        } else {
            console.log('Skipping Subscription/Invoice tests due to Customer creation failure.');
        }

    } catch (error) {
        console.error('Test Suite Failed:', error.response?.data || error.message);
    }
}

runTests();
