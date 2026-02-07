import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalHeader from './components/PortalHeader';
import AddressCard from './components/AddressCard';

const OrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const themeColor = '#2ecc71';

    const styles = {
        container: {
            backgroundColor: '#f8faf9',
            minHeight: '100vh',
            color: '#111813',
            fontFamily: 'Inter, sans-serif',
            padding: '0',
        },
        mainWrapper: {
            padding: '40px 48px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        headerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
        },
        orderTitle: {
            fontSize: '32px',
            fontWeight: '900',
            color: '#111813',
            letterSpacing: '-1px',
        },
        statusBadge: {
            padding: '8px 20px',
            backgroundColor: 'rgba(241,196,15,0.1)',
            color: '#f1c40f',
            borderRadius: '24px',
            fontSize: '12px',
            fontWeight: '900',
            border: `1px solid rgba(241,196,15,0.2)`,
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: '40px',
        },
        card: {
            backgroundColor: '#ffffff',
            border: `1px solid #dbe6de`,
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        },
        sectionTitle: {
            fontSize: '14px',
            fontWeight: '900',
            color: '#111813',
            marginBottom: '24px',
            borderBottom: `1px solid #f0f2f0`,
            paddingBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        productRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 0',
            borderBottom: '1px solid #f0f2f0',
        },
        productInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        },
        productName: {
            fontWeight: '800',
            color: '#111813',
            fontSize: '16px',
        },
        productQty: {
            fontSize: '13px',
            color: '#61896b',
            fontWeight: '500',
        },
        productPrice: {
            fontWeight: '900',
            color: '#111813',
            fontSize: '16px',
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#61896b',
            fontWeight: '500',
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '24px',
            fontWeight: '900',
            color: '#111813',
            borderTop: `1px solid #dbe6de`,
            paddingTop: '20px',
            marginTop: '20px',
        },
        invoiceLink: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#f8faf9',
            borderRadius: '16px',
            border: `1px solid #dbe6de`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '12px',
        },
    };

    return (
        <div style={styles.container}>
            <PortalHeader themeColor={themeColor} />

            <div style={styles.mainWrapper}>
                <div style={styles.headerRow}>
                    <div style={styles.orderTitle}>Order <span style={{ color: themeColor }}>{id}</span></div>
                    <span style={styles.statusBadge}>In Progress</span>
                </div>

                <div style={styles.grid}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Items Section */}
                        <div style={styles.card}>
                            <div style={styles.sectionTitle}>Order Items</div>
                            <div style={styles.productRow}>
                                <div style={styles.productInfo}>
                                    <span style={styles.productName}>Professional Analytics Suite</span>
                                    <span style={styles.productQty}>1 Unit × ₹1,200.00</span>
                                </div>
                                <span style={styles.productPrice}>₹1,200.00</span>
                            </div>
                            <div style={{ ...styles.productRow, borderBottom: 'none' }}>
                                <div style={styles.productInfo}>
                                    <span style={styles.productName}>Tax (GST 12%)</span>
                                </div>
                                <span style={styles.productPrice}>₹144.00</span>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div style={styles.card}>
                            <div style={styles.sectionTitle}>Financial Summary</div>
                            <div style={styles.summaryRow}>
                                <span>Untaxed Amount</span>
                                <span style={{ color: '#111813', fontWeight: '700' }}>₹1,200.00</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Total Taxes</span>
                                <span style={{ color: '#111813', fontWeight: '700' }}>₹144.00</span>
                            </div>
                            <div style={styles.summaryTotal}>
                                <span>Grand Total</span>
                                <span style={{ color: themeColor }}>₹1,344.00</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Address Section */}
                        <div style={styles.card}>
                            <AddressCard />
                        </div>

                        {/* Invoices Section */}
                        <div style={styles.card}>
                            <div style={styles.sectionTitle}>Related Invoices</div>
                            <div
                                style={styles.invoiceLink}
                                onClick={() => navigate('/portal/invoices')}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = themeColor; e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.02)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#dbe6de'; e.currentTarget.style.backgroundColor = '#f8faf9'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(46,204,113,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>description</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#111813' }}>INV/2026/001</div>
                                    <div style={{ fontSize: '12px', color: '#61896b', fontWeight: '500' }}>Feb 06, 2026 · Paid</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
