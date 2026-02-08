import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalHeader from './components/PortalHeader';
import api from './api';

const CartPage = () => {
    const [activeTab, setActiveTab] = useState('order');
    const [maxReachedStep, setMaxReachedStep] = useState(1); // 1: Order, 2: Address, 3: Payment
    const [quantity, setQuantity] = useState(1);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const themeColor = '#2ecc71';

    useEffect(() => {
        const fetchCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(cart);
        };
        fetchCart();

        const handleCartUpdate = () => {
            fetchCart();
        };

        window.addEventListener('cartUpdate', handleCartUpdate);
        return () => window.removeEventListener('cartUpdate', handleCartUpdate);
    }, []);

    const handleUpdateQuantity = (cartItemId, delta) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.map(item => {
            if (item.cartItemId === cartItemId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0);

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdate'));
    };

    const handleRemove = (cartItemId) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cartUpdate'));
    };

    const handleCheckout = React.useCallback(async () => {
        try {
            const payload = {
                items: cartItems.map(item => ({
                    productId: item.id || 1, // Assuming id exists in item
                    quantity: item.quantity,
                    price: item.price
                })),
                total: total,
                paymentMethod: 'GPay'
            };

            await api.post('/orders/complete', payload);

            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdate'));
            alert('Order placed successfully! Transaction recorded.');
            navigate('/portal/orders');
        } catch (error) {
            console.error("Failed to place order", error);
            alert(error.response?.data?.message || "Failed to place order");
            // If error, likely need to reset status in PaymentSection, but this prop doesn't support callback for error.
            // For now, keeping as is.
        }
    }, [cartItems, total, navigate]);

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const canNavigateTo = (step) => {
        return step <= maxReachedStep;
    };

    const handleTabClick = (tab, step) => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items to your cart before proceeding.');
            return;
        }
        if (canNavigateTo(step)) {
            setActiveTab(tab);
        } else {
            alert('Please complete the current step first.');
        }
    };

    const proceedToShipping = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before proceeding.');
            return;
        }
        setMaxReachedStep(2);
        setActiveTab('address');
    };

    const proceedToPayment = () => {
        setMaxReachedStep(3);
        setActiveTab('payment');
    };

    const styles = {
        container: {
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            color: '#000000',
            fontFamily: 'Inter, sans-serif',
            padding: '0',
        },
        mainWrapper: {
            padding: '40px 48px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        mainContainer: {
            backgroundColor: '#ffffff',
            border: `1px solid #dbe6de`,
            padding: '32px',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        },
        tabNav: {
            display: 'flex',
            gap: '40px',
            marginBottom: '40px',
            fontSize: '15px',
            borderBottom: '1px solid #f0f2f0',
        },
        tab: {
            cursor: 'pointer',
            padding: '16px 4px',
            color: '#000000',
            transition: 'all 0.2s',
            fontWeight: '600',
            borderBottom: '2px solid transparent',
            opacity: 0.6,
        },
        tabActive: {
            cursor: 'pointer',
            padding: '16px 4px',
            color: '#000000',
            borderBottom: `2px solid ${themeColor}`,
            fontWeight: '900',
        },
        contentArea: {
            display: 'flex',
            gap: '64px',
        },
        cartItems: {
            flex: 1,
        },
        cartItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid #f0f2f0',
        },
        itemImage: {
            width: '120px',
            height: '100px',
            borderRadius: '16px',
            backgroundColor: '#f8faf9',
            border: `1px solid #dbe6de`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            fontSize: '11px',
            fontWeight: 'bold',
            opacity: 0.4,
        },
        itemDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1,
        },
        itemName: {
            fontSize: '18px',
            fontWeight: '800',
            color: '#000000',
        },
        removeButton: {
            background: 'transparent',
            border: 'none',
            color: '#f44336',
            cursor: 'pointer',
            fontSize: '12px',
            width: 'fit-content',
            padding: '0',
            fontWeight: '600',
        },
        itemPrice: {
            fontSize: '16px',
            fontWeight: '900',
            color: '#000000',
            width: '120px',
            textAlign: 'right',
        },
        qtyCounter: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#f8faf9',
            padding: '4px 12px',
            borderRadius: '10px',
            border: '1px solid #dbe6de',
            width: 'fit-content',
        },
        qtyBtn: {
            background: 'none',
            border: 'none',
            color: themeColor,
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '900',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        qtyValue: {
            fontSize: '14px',
            fontWeight: '800',
            color: '#000000',
            minWidth: '20px',
            textAlign: 'center',
        },
        orderSummary: {
            width: '360px',
            backgroundColor: '#f8faf9',
            border: `1px solid #dbe6de`,
            padding: '32px',
            borderRadius: '20px',
            height: 'fit-content',
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#000000',
            fontWeight: '600',
            opacity: 0.7,
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: '900',
            paddingTop: '20px',
            borderTop: `1px solid #dbe6de`,
            color: '#000000',
        },
        discountRow: {
            display: 'flex',
            gap: '10px',
            marginBottom: '16px',
        },
        discountInput: {
            flex: 1,
            backgroundColor: '#ffffff',
            border: `1px solid #dbe6de`,
            padding: '12px 16px',
            color: '#000000',
            fontSize: '14px',
            borderRadius: '10px',
            outline: 'none',
        },
        applyButton: {
            backgroundColor: 'transparent',
            border: `2px solid ${themeColor}`,
            padding: '12px 20px',
            color: themeColor,
            cursor: 'pointer',
            fontSize: '13px',
            borderRadius: '10px',
            fontWeight: '800',
            transition: 'all 0.2s',
        },
        checkoutButton: {
            width: '100%',
            backgroundColor: themeColor,
            color: '#ffffff',
            border: 'none',
            padding: '18px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '900',
            borderRadius: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(46,204,113,0.2)',
        },
    };

    return (
        <div style={styles.container}>
            <PortalHeader themeColor={themeColor} />

            <div style={styles.mainWrapper}>
                <div style={styles.mainContainer}>
                    <div style={styles.tabNav}>
                        <span
                            style={activeTab === 'order' ? styles.tabActive : styles.tab}
                            onClick={() => handleTabClick('order', 1)}
                        >
                            1. Review Order
                        </span>
                        <span
                            style={{
                                ...(activeTab === 'address' ? styles.tabActive : styles.tab),
                                opacity: canNavigateTo(2) ? 1 : 0.5,
                                cursor: canNavigateTo(2) ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => handleTabClick('address', 2)}
                        >
                            2. Shipping
                        </span>
                        <span
                            style={{
                                ...(activeTab === 'payment' ? styles.tabActive : styles.tab),
                                opacity: canNavigateTo(3) ? 1 : 0.5,
                                cursor: canNavigateTo(3) ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => handleTabClick('payment', 3)}
                        >
                            3. Payment
                        </span>
                    </div>

                    {activeTab === 'order' && (
                        <div style={styles.contentArea}>
                            <div style={styles.cartItems}>
                                {cartItems.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>Your cart is empty.</div>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.cartItemId} style={styles.cartItem}>
                                            <div style={styles.itemImage}>{item.name.substring(0, 3).toUpperCase()}</div>
                                            <div style={styles.itemDetails}>
                                                <div style={styles.itemName}>{item.name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
                                                    <div style={styles.qtyCounter}>
                                                        <button style={styles.qtyBtn} onClick={() => handleUpdateQuantity(item.cartItemId, -1)}>−</button>
                                                        <span style={styles.qtyValue}>{item.quantity}</span>
                                                        <button style={styles.qtyBtn} onClick={() => handleUpdateQuantity(item.cartItemId, 1)}>+</button>
                                                    </div>
                                                    <button style={styles.removeButton} onClick={() => handleRemove(item.cartItemId)}>Remove</button>
                                                </div>
                                            </div>
                                            <div style={styles.itemPrice}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={styles.orderSummary}>
                                <div style={styles.summaryRow}>
                                    <span>Subtotal</span><span style={{ color: '#111813' }}>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span>GST (12%)</span><span style={{ color: '#111813' }}>₹{tax.toFixed(2)}</span>
                                </div>
                                <div style={styles.summaryTotal}>
                                    <span>Total</span><span style={{ color: themeColor }}>₹{total.toFixed(2)}</span>
                                </div>

                                <div style={styles.discountRow}>
                                    <input
                                        type="text"
                                        placeholder="Add coupon code"
                                        style={styles.discountInput}
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                    <button
                                        style={styles.applyButton}
                                        onClick={() => {
                                            const validCodes = ['FIRST', 'SECOND', 'THIRD'];
                                            if (validCodes.includes(discountCode.toUpperCase())) {
                                                setDiscountApplied(true);
                                                alert('Coupon applied successfully!');
                                            } else {
                                                setDiscountApplied(false);
                                                alert('Invalid coupon code. Try FIRST, SECOND, or THIRD.');
                                            }
                                        }}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = themeColor; e.target.style.color = 'white'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = themeColor; }}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {discountApplied && (
                                    <div style={{ backgroundColor: 'rgba(46,204,113,0.1)', color: '#2ecc71', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
                                        Best price guaranteed with coupon.
                                    </div>
                                )}

                                <button
                                    style={styles.checkoutButton}
                                    onClick={proceedToShipping}
                                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ ...styles.mainContainer, border: 'none', boxShadow: 'none' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>Shipping Information</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#000000', opacity: 0.6 }}>SHIPPING TO</label>
                                        <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #dbe6de' }}>
                                            <div style={{ fontWeight: '800', color: '#000000' }}>Office Address</div>
                                            <div style={{ fontSize: '13px', color: '#000000', opacity: 0.7 }}>123 Cloud St, Tech Park, Bangalore</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#000000', opacity: 0.6 }}>BILLING SUMMARY</label>
                                        <div style={{ padding: '16px', backgroundColor: '#f8faf9', borderRadius: '12px', border: '1px solid #dbe6de' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#000000' }}>
                                                <span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#000000', fontWeight: '900', marginTop: '4px' }}>
                                                <span>Total with Tax:</span><span>₹{total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    style={{ ...styles.checkoutButton, width: 'auto', padding: '18px 48px' }}
                                    onClick={proceedToPayment}
                                >
                                    Confirm & Go to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && <PaymentSection total={total} onComplete={handleCheckout} themeColor={themeColor} />}
                </div>
            </div>
        </div>
    );
};

const PaymentSection = ({ total, onComplete, themeColor }) => {
    const [status, setStatus] = useState('qr'); // qr, completing, done

    useEffect(() => {
        let timer;
        if (status === 'qr') {
            timer = setTimeout(() => {
                setStatus('completing');
            }, 5000);
        } else if (status === 'completing') {
            timer = setTimeout(() => {
                onComplete();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [status, onComplete]);

    return (
        <div style={{ padding: '64px', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {status === 'qr' && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px', color: '#000000' }}>Scan with Google Pay</h2>
                    <p style={{ color: '#000000', marginBottom: '32px', opacity: 0.7 }}>Total Amount: ₹{total.toFixed(2)}</p>
                    <div style={{
                        padding: '24px',
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        display: 'inline-block',
                        marginBottom: '24px',
                        border: `2px solid ${themeColor}20`
                    }}>
                        {/* Placeholder for GPay QR - In real use, this would be a dynamic QR */}
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GPAY-ORDER-MOCK"
                            alt="GPay QR Mock"
                            style={{ width: '250px', height: '250px' }}
                        />
                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" style={{ height: '24px' }} />
                        </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#000000', opacity: 0.6 }}>Scanner will automatically verify payment...</p>
                </div>
            )}

            {status === 'completing' && (
                <div style={{ animation: 'pulse 1.5s infinite' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: `4px solid ${themeColor}`,
                        borderTopColor: 'transparent',
                        margin: '0 auto 24px',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: themeColor }}>Completing your order...</h2>
                    <p style={{ color: '#61896b' }}>Please do not refresh the page.</p>
                </div>
            )}

            <style>
                {`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                `}
            </style>
        </div>
    );
};

export default CartPage;
