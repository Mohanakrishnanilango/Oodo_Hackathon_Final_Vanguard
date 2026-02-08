const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function runTests() {
    try {
        console.log('--- Setting up Test Environment ---');

        // 1. Create Admins and Staff
        const adminEmail = `admin_mt_${Date.now()}@test.com`;
        const staffAEmail = `staffA_${Date.now()}@test.com`;
        const staffBEmail = `staffB_${Date.now()}@test.com`;
        const custEmail = `cust_mt_${Date.now()}@test.com`;

        const adminRes = await axios.post(`${API_URL}/auth/register`, { name: 'Admin MT', email: adminEmail, password: 'Password123!', role: 'admin' });
        const staffARes = await axios.post(`${API_URL}/auth/register`, { name: 'Staff A', email: staffAEmail, password: 'Password123!', role: 'internal_staff' });
        const staffBRes = await axios.post(`${API_URL}/auth/register`, { name: 'Staff B', email: staffBEmail, password: 'Password123!', role: 'internal_staff' });
        const custRes = await axios.post(`${API_URL}/auth/register`, { name: 'Customer C', email: custEmail, password: 'Password123!', role: 'user' });

        const adminToken = adminRes.data.token;
        const staffAToken = staffARes.data.token;
        const staffBToken = staffBRes.data.token;
        const custToken = custRes.data.token;

        const staffAId = staffARes.data.id;

        const adminConfig = { headers: { Authorization: `Bearer ${adminToken}` } };
        const staffAConfig = { headers: { Authorization: `Bearer ${staffAToken}` } };
        const staffBConfig = { headers: { Authorization: `Bearer ${staffBToken}` } };
        const custConfig = { headers: { Authorization: `Bearer ${custToken}` } };

        console.log('Users created.');

        // 2. Staff A creates Product A
        const prodARes = await axios.post(`${API_URL}/products`, {
            name: 'Product A (Staff A)', type: 'cloud', price: 100, cost: 50, is_active: true
        }, staffAConfig);
        const prodAId = prodARes.data.id;
        console.log(`Product A created by Staff A (ID: ${prodAId})`);

        // 3. Staff B creates Product B
        const prodBRes = await axios.post(`${API_URL}/products`, {
            name: 'Product B (Staff B)', type: 'software', price: 200, cost: 100, is_active: true
        }, staffBConfig);
        const prodBId = prodBRes.data.id;
        console.log(`Product B created by Staff B (ID: ${prodBId})`);

        // 4. Verify Visibility (Dashboard/Admin View)
        console.log('\n--- Verifying Dashboard Visibility ---');

        // Staff A View
        const staffAView = await axios.get(`${API_URL}/products?admin=true`, staffAConfig);
        const hasA = staffAView.data.some(p => p.id === prodAId);
        const hasB = staffAView.data.some(p => p.id === prodBId);

        if (hasA && !hasB) {
            console.log('✅ Staff A sees Product A but NOT Product B.');
        } else {
            console.error(`❌ Staff A Visibility Fail: Sees A: ${hasA}, Sees B: ${hasB}`);
        }

        // Staff B View
        const staffBView = await axios.get(`${API_URL}/products?admin=true`, staffBConfig);
        const bHasA = staffBView.data.some(p => p.id === prodAId);
        const bHasB = staffBView.data.some(p => p.id === prodBId);

        if (!bHasA && bHasB) {
            console.log('✅ Staff B sees Product B but NOT Product A.');
        } else {
            console.error(`❌ Staff B Visibility Fail: Sees A: ${bHasA}, Sees B: ${bHasB}`);
        }

        // Admin View
        const adminView = await axios.get(`${API_URL}/products?admin=true`, adminConfig);
        const adminHasA = adminView.data.some(p => p.id === prodAId);
        const adminHasB = adminView.data.some(p => p.id === prodBId);

        if (adminHasA && adminHasB) {
            console.log('✅ Admin sees BOTH Product A and Product B.');
        } else {
            console.error(`❌ Admin Visibility Fail: Sees A: ${adminHasA}, Sees B: ${adminHasB}`);
        }

        // Public View
        const publicView = await axios.get(`${API_URL}/products`); // No token
        const pubHasA = publicView.data.some(p => p.id === prodAId);
        const pubHasB = publicView.data.some(p => p.id === prodBId);

        if (pubHasA && pubHasB) {
            console.log('✅ Public Shop sees BOTH Product A and Product B.');
        } else {
            console.error(`❌ Public Visibility Fail: Sees A: ${pubHasA}, Sees B: ${pubHasB}`);
        }

        // 5. Customer buys Product A (Staff A's product)
        console.log('\n--- Verifying Customer Assignment ---');
        try {
            const orderPayload = {
                items: [{ productId: prodAId, quantity: 1, price: 100 }],
                total: 100,
                paymentMethod: 'Test'
            };
            await axios.post(`${API_URL}/orders/complete`, orderPayload, custConfig);
            console.log('Order placed for Product A.');

            // Verify Customer is assienged to Staff A
            // We need to check customer details. Admin can check users.
            const usersRes = await axios.get(`${API_URL}/auth/users`, adminConfig);
            const customerData = usersRes.data.find(u => u.email === custEmail);

            if (customerData.sales_person_id === staffAId) {
                console.log(`✅ Customer assigned to Staff A (ID: ${staffAId}).`);
            } else {
                console.error(`❌ Customer Assignment Fail: Assigned to ${customerData.sales_person_id}, Expected ${staffAId}`);
            }

        } catch (e) {
            console.error('Order/Assignment Test Failed:', e.response?.data || e.message);
        }

    } catch (error) {
        console.error('Test Suite Failed:', error.message);
    }
}

runTests();
