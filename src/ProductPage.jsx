import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortalHeader from './components/PortalHeader';
import api from './api';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const themeColor = '#2ecc71';

    const getDomainImage = (name, type) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('cloud') || type === 'cloud') return `https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop`;
        if (lowerName.includes('software') || type === 'software') return `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop`;
        if (lowerName.includes('service') || type === 'service') return `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop`;
        if (lowerName.includes('infra') || type === 'infra') return `https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=600&auto=format&fit=crop`;
        return `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get('/products');
                const found = data.find(p => p.id === parseInt(id));
                if (found) {
                    setProduct({
                        ...found,
                        numericPrice: parseFloat(found.price),
                        image: getDomainImage(found.name, found.type)
                    });
                }
            } catch (error) {
                console.error("Failed to fetch product detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = (prod) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Find if item already exists with the same plan
        const existingItemIndex = cart.findIndex(item => item.id === prod.id && item.plan === selectedPlan);

        if (existingItemIndex > -1) {
            // Increment existing item quantity
            cart[existingItemIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdate'));
            alert(`${prod.name} (${selectedPlan}) quantity updated in cart!`);
        } else {
            // Add new item
            const planPricing = {
                weekly: (prod.numericPrice * 0.3),
                monthly: prod.numericPrice,
                yearly: (prod.numericPrice * 10)
            };

            const cartItem = {
                id: prod.id,
                cartItemId: Date.now() + Math.random(),
                name: `${prod.name} (${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)})`,
                price: planPricing[selectedPlan].toFixed(2),
                quantity: 1,
                image: prod.image,
                plan: selectedPlan
            };

            localStorage.setItem('cart', JSON.stringify([...cart, cartItem]));
            window.dispatchEvent(new Event('cartUpdate'));
            alert('Added to cart!');
        }
    };

    const handleBuyNow = (prod) => {
        addToCart(prod);
        navigate('/portal/cart');
    };

    const styles = {
        container: {
            backgroundColor: '#f8faf9',
            minHeight: '100vh',
            color: '#111813',
            fontFamily: 'Inter, sans-serif',
            padding: '0',
        },
        mainWrapper: {
            padding: '48px 32px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        productGrid: {
            display: 'grid',
            gridTemplateColumns: 'minmax(400px, 1fr) 520px',
            gap: '80px',
            alignItems: 'start',
        },
        imageSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        mainImage: {
            aspectRatio: '1.2',
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            border: `1px solid #dbe6de`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dbe6de',
            fontSize: '14px',
            fontWeight: '900',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        },
        breadcrumb: {
            display: 'flex',
            gap: '12px',
            fontSize: '13px',
            color: '#61896b',
            marginBottom: '32px',
            fontWeight: '600',
        },
        infoSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            backgroundColor: '#ffffff',
            padding: '48px',
            borderRadius: '32px',
            border: '1px solid #dbe6de',
            boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
        },
        productTitle: {
            fontSize: '44px',
            fontWeight: '900',
            color: '#111813',
            lineHeight: '1',
            letterSpacing: '-1.5px',
        },
        productPrice: {
            fontSize: '32px',
            color: themeColor,
            fontWeight: '900',
        },
        sectionLabel: {
            fontSize: '11px',
            fontWeight: '900',
            color: '#61896b',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '16px',
        },
        variantGrid: {
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
        },
        variantButton: {
            padding: '14px 28px',
            borderRadius: '14px',
            border: `1px solid #dbe6de`,
            backgroundColor: '#f8faf9',
            color: '#111813',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            transition: 'all 0.2s',
        },
        variantButtonActive: {
            borderColor: themeColor,
            backgroundColor: 'rgba(46,204,113,0.1)',
            color: themeColor,
            boxShadow: `0 4px 15px rgba(46,204,113,0.1)`,
        },
        quantityControls: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8faf9',
            border: `1px solid #dbe6de`,
            borderRadius: '14px',
            width: 'fit-content',
            overflow: 'hidden',
        },
        qtyBtn: {
            border: 'none',
            background: 'transparent',
            color: '#111813',
            padding: '14px 24px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        addToCart: {
            flex: 1,
            backgroundColor: themeColor,
            color: '#ffffff',
            border: 'none',
            padding: '22px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 8px 30px rgba(46,204,113,0.2)',
        },
        buyNow: {
            flex: 1,
            backgroundColor: '#111813',
            color: '#ffffff',
            border: 'none',
            padding: '22px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        description: {
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#61896b',
            fontWeight: '500',
        },
        planCard: {
            flex: 1,
            padding: '16px',
            borderRadius: '16px',
            border: '2px solid #f0f2f0',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
        },
        planCardActive: {
            borderColor: themeColor,
            backgroundColor: `${themeColor}08`,
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: 'bold' }}>Loading product...</div>;
    if (!product) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: 'bold' }}>Product not found.</div>;

    const plans = [
        { id: 'weekly', label: 'Weekly', sub: 'Standard', price: (product.numericPrice * 0.3).toFixed(2) },
        { id: 'monthly', label: 'Monthly', sub: 'Premium', price: product.numericPrice.toFixed(2) },
        { id: 'yearly', label: 'Yearly', sub: 'Premium Pro', price: (product.numericPrice * 10).toFixed(2) }
    ];

    return (
        <div style={styles.container}>
            <PortalHeader themeColor={themeColor} />

            <div style={styles.mainWrapper}>
                <div style={styles.breadcrumb}>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/portal/shop')}>Shop Marketplace</span>
                    <span style={{ opacity: 0.3 }}>/</span>
                    <span style={{ color: '#000000' }}>{product.name}</span>
                </div>

                <div style={styles.productGrid}>
                    <div style={styles.imageSection}>
                        <div style={{ ...styles.mainImage, padding: '0', overflow: 'hidden' }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ aspectRatio: '1', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #dbe6de', overflow: 'hidden' }}>
                                    <img src={product.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.infoSection}>
                        <div>
                            <div style={{ color: themeColor, fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{product.type === 'software' ? 'Enterprise License' : 'Cloud Service'}</div>
                            <h1 style={{ ...styles.productTitle, color: '#000000' }}>{product.name}</h1>
                        </div>

                        <div style={{ ...styles.productPrice, color: themeColor }}>
                            ₹{plans.find(p => p.id === selectedPlan).price}
                            <span style={{ fontSize: '15px', color: '#61896b', fontWeight: '500' }}> / {selectedPlan}</span>
                        </div>

                        <div>
                            <div style={{ ...styles.sectionLabel, color: '#000000' }}>Select Subscription Tier</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {plans.map(plan => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        style={selectedPlan === plan.id ? { ...styles.planCard, ...styles.planCardActive } : styles.planCard}
                                    >
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#000000' }}>{plan.label}</div>
                                        <div style={{ fontSize: '11px', color: '#61896b', marginBottom: '8px' }}>{plan.sub}</div>
                                        <div style={{ fontSize: '16px', fontWeight: '900', color: themeColor }}>₹{plan.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button
                                style={styles.addToCart}
                                onClick={() => addToCart(product)}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Add to Cart
                            </button>
                            <button
                                style={styles.buyNow}
                                onClick={() => handleBuyNow(product)}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#222'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#111813'}
                            >
                                Buy Subscription Now
                            </button>
                        </div>

                        <div style={{ borderTop: '1px solid #f0f2f0', paddingTop: '32px' }}>
                            <div style={{ ...styles.sectionLabel, color: '#000000' }}>Product Highlights</div>
                            <p style={{ ...styles.description, color: '#000000' }}>
                                High-performance {product.type} solution tailored for enterprise-scale operations.
                                Includes dedicated support, advanced security features, and seamless integration
                                with your existing infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
