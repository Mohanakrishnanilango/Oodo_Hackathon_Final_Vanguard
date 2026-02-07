import React, { useState } from 'react';
import PortalHeader from './components/PortalHeader';

const UserDetailsPage = () => {
    const themeColor = '#2ecc71';
    const [formData, setFormData] = useState({
        name: 'Gemini User',
        email: 'user@example.com',
        phone: '+91 98765 43210',
        company: 'Gemini Tech Solutions',
        address: '123 Tech Park, Sector 5\nNew City, 500081\nIndia'
    });

    const styles = {
        container: {
            backgroundColor: '#f8faf9',
            minHeight: '100vh',
            color: '#111813',
            fontFamily: 'Inter, sans-serif',
            padding: '0',
        },
        mainWrapper: {
            padding: '64px 32px',
            maxWidth: '1000px',
            margin: '0 auto',
        },
        headerRow: {
            marginBottom: '48px',
            textAlign: 'center',
        },
        title: {
            fontSize: '40px',
            fontWeight: '900',
            color: '#111813',
            letterSpacing: '-1.5px',
            marginBottom: '12px',
        },
        subtitle: {
            color: '#61896b',
            fontSize: '16px',
            fontWeight: '500',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            backgroundColor: '#ffffff',
            padding: '56px',
            borderRadius: '32px',
            border: `1px solid #dbe6de`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        },
        fieldGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        },
        label: {
            fontSize: '11px',
            fontWeight: '900',
            color: '#61896b',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        input: {
            backgroundColor: '#f8faf9',
            border: `1px solid #dbe6de`,
            padding: '16px 20px',
            borderRadius: '14px',
            color: '#111813',
            fontSize: '14px',
            fontWeight: '600',
            outline: 'none',
            transition: 'all 0.2s',
        },
        textarea: {
            backgroundColor: '#f8faf9',
            border: `1px solid #dbe6de`,
            padding: '16px 20px',
            borderRadius: '14px',
            color: '#111813',
            fontSize: '14px',
            fontWeight: '600',
            outline: 'none',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
        },
        saveButton: {
            backgroundColor: themeColor,
            color: '#ffffff',
            border: 'none',
            padding: '20px 48px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            marginTop: '16px',
            width: 'fit-content',
            transition: 'all 0.2s',
            boxShadow: '0 8px 30px rgba(46,204,113,0.2)',
        }
    };

    return (
        <div style={styles.container}>
            <PortalHeader themeColor={themeColor} />

            <div style={styles.mainWrapper}>
                <div style={styles.headerRow}>
                    <h1 style={styles.title}>Account Settings</h1>
                    <p style={styles.subtitle}>Manage your profile details and billing preferences.</p>
                </div>

                <div style={styles.formGrid}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(46,204,113,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#dbe6de'; e.target.style.backgroundColor = '#f8faf9'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email (Permanent)</label>
                        <input
                            style={{ ...styles.input, opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#f0f2f0' }}
                            value={formData.email}
                            disabled
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Contact Number</label>
                        <input
                            style={styles.input}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(46,204,113,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#dbe6de'; e.target.style.backgroundColor = '#f8faf9'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Organization</label>
                        <input
                            style={styles.input}
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(46,204,113,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#dbe6de'; e.target.style.backgroundColor = '#f8faf9'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div style={{ ...styles.fieldGroup, gridColumn: 'span 2' }}>
                        <label style={styles.label}>Shipping Address</label>
                        <textarea
                            style={styles.textarea}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            onFocus={(e) => { e.target.style.borderColor = themeColor; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(46,204,113,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#dbe6de'; e.target.style.backgroundColor = '#f8faf9'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <button
                        style={styles.saveButton}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
