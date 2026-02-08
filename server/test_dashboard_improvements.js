const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function runTests() {
    try {
        console.log('--- Setting up Test Environment ---');

        // 1. Create Staff and Admin
        const adminEmail = `admin_dash_${Date.now()}@test.com`;
        const staffEmail = `staff_dash_${Date.now()}@test.com`;
        const custEmail = `cust_dash_${Date.now()}@test.com`;

        const adminRes = await axios.post(`${API_URL}/auth/register`, { name: 'Admin Dash', email: adminEmail, password: 'Password123!', role: 'admin' });
        const staffRes = await axios.post(`${API_URL}/auth/register`, { name: 'Staff Dash', email: staffEmail, password: 'Password123!', role: 'internal_staff' });
        const custRes = await axios.post(`${API_URL}/auth/register`, { name: 'Cust Dash', email: custEmail, password: 'Password123!', role: 'user' }); // self-register

        const adminToken = adminRes.data.token;
        const staffToken = staffRes.data.token;
        const custToken = custRes.data.token;
        const staffId = staffRes.data.id;
        const custId = custRes.data.id;

        const adminConfig = { headers: { Authorization: `Bearer ${adminToken}` } };
        const staffConfig = { headers: { Authorization: `Bearer ${staffToken}` } };
        const custConfig = { headers: { Authorization: `Bearer ${custToken}` } };

        // 2. Assign Customer to Staff (Simulate Order Assignment or Manual)
        // Let's use manual assignment for speed if exists, or just update DB via admin
        // Actually we can update user via PUT /users/:id if admin
        await axios.put(`${API_URL}/auth/users/${custId}`, { sales_person_id: staffId }, adminConfig);
        console.log(`Assigned Customer ${custId} to Staff ${staffId}`);

        // 3. Create Subscription for Customer (by Admin or System)
        // Using Order Complete to simulate full flow is better but user is created.
        // Let's just create a subscription directly if possible or use order complete
        // Order complete creates sub, invoice, payment. Good for activity test.
        const orderPayload = {
            items: [{ productId: 1, quantity: 1, price: 50 }], // Assuming prod 1 exists
            total: 50,
            paymentMethod: 'Test'
        };
        await axios.post(`${API_URL}/orders/complete`, orderPayload, custConfig);
        console.log('Order completed for Customer');

        // 4. Verify Dashboard Stats
        console.log('\n--- Verifying Dashboard Content ---');

        // Staff View
        const staffStats = await axios.get(`${API_URL}/dashboard/stats`, staffConfig);
        console.log('Staff Stats:', staffStats.data);

        if (staffStats.data.activeSubscriptions >= 1 && staffStats.data.todaysCollections >= 50) {
            console.log('✅ Staff Stats reflect the new subscription/payment.');
        } else {
            console.error('❌ Staff Stats Mismatch');
        }

        const staffActivity = await axios.get(`${API_URL}/dashboard/activity`, staffConfig);
        console.log('Staff Activity Count:', staffActivity.data.length);
        if (staffActivity.data.length > 0) {
            console.log('✅ Staff sees recent activity.');
            console.log('Activity Sample:', staffActivity.data[0]);
        } else {
            console.error('❌ Staff Activity Empty');
        }

    } catch (error) {
        console.error('Test Suite Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

runTests();
