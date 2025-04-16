import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Termekek.css";

interface TermekekProduct {
  id: number;
  name: string;
  price: number;
  tokens: number;
  images: string[];
  description: string;
}

interface TermekekCartItem extends TermekekProduct {
  quantity: number;
}

interface TermekekCoupon {
  id: number;
  name: string;
  tokensRequired: number;
  description: string;
}

interface TermekekNotification {
  id: number;
  message: string;
  type: 'termekek-success' | 'termekek-error' | 'termekek-info';
}

export default function Termekek() {
  const { isLoggedIn } = useAuth();
  const [termekekProducts, setTermekekProducts] = useState<TermekekProduct[]>([]);
  const [termekekCart, setTermekekCart] = useState<TermekekCartItem[]>([]);
  const [termekekActiveTab, setTermekekActiveTab] = useState<"termekek-products" | "termekek-cart" | "termekek-coupons">("termekek-products");
  const [termekekActiveImageIndex, setTermekekActiveImageIndex] = useState<{[key: number]: number}>({});
  const [termekekUserTokens, setTermekekUserTokens] = useState(0);
  const [termekekCoupons, setTermekekCoupons] = useState<TermekekCoupon[]>([]);
  const [termekekShowCheckout, setTermekekShowCheckout] = useState(false);
  const [termekekNotifications, setTermekekNotifications] = useState<TermekekNotification[]>([]);
  const navigate = useNavigate();

  // Initialize products and coupons
  useEffect(() => {
    const sampleProducts: TermekekProduct[] = [
      {
        id: 1,
        name: "Póló",
        price: 4990,
        tokens: 50,
        images: ["/src/images/polo.png", "/src/images/polo2.png"],
        description: "Kényelmes edzős póló, jó szellőzőképességgel."
      },
      {
        id: 2,
        name: "Trikó",
        price: 5990,
        tokens: 60,
        images: ["/src/images/triko.png", "/src/images/triko2.png"],
        description: "Minőségi anyagból készült trikó, kiváló viselet."
      },
      {
        id: 3,
        name: "Sapka",
        price: 2990,
        tokens: 30,
        images: ["/src/images/sapka.png", "/src/images/sapka2.png"],
        description: "Stílusos baseball sapka, több színben elérhető."
      },
      {
        id: 4,
        name: "Gallérós Póló",
        price: 6990,
        tokens: 70,
        images: ["/src/images/galleros.png", "/src/images/galleros2.png"],
        description: "Melegítő felső gallérral, kényelmes viselet."
      },
      {
        id: 5,
        name: "Női Top",
        price: 5490,
        tokens: 55,
        images: ["/src/images/noifelso.png", "/src/images/noifelso2.png"],
        description: "Női edzőfelső, kiváló anyagminőség."
      },
      {
        id: 6,
        name: "Női Póló",
        price: 4590,
        tokens: 45,
        images: ["/src/images/noipolo.png", "/src/images/noipolo2.png"],
        description: "Női edzőpóló, kényelmes és divatos."
      }
    ];

    const sampleCoupons: TermekekCoupon[] = [
      {
        id: 1,
        name: "10% kedvezmény",
        tokensRequired: 100,
        description: "10% kedvezmény bármely szolgáltatásra"
      },
      {
        id: 2,
        name: "Ingyenes edzés",
        tokensRequired: 200,
        description: "Egy ingyenes csoportos edzés"
      },
      {
        id: 3,
        name: "25% kedvezmény",
        tokensRequired: 300,
        description: "25% kedvezmény bármely edzőre"
      }
    ];

    setTermekekProducts(sampleProducts);
    setTermekekCoupons(sampleCoupons);
    
    const initialImageIndex: {[key: number]: number} = {};
    sampleProducts.forEach(product => {
      initialImageIndex[product.id] = 0;
    });
    setTermekekActiveImageIndex(initialImageIndex);

    const savedCart = sessionStorage.getItem('termekek-cart');
    if (savedCart) {
      setTermekekCart(JSON.parse(savedCart));
    }

    setTermekekUserTokens(500); // Kezdeti token mennyiség
  }, []);

  // Save cart to session storage
  useEffect(() => {
    sessionStorage.setItem('termekek-cart', JSON.stringify(termekekCart));
  }, [termekekCart]);

  // Notification system
  const termekekShowNotification = (message: string, type: 'termekek-success' | 'termekek-error' | 'termekek-info' = 'termekek-info') => {
    const id = Date.now();
    setTermekekNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => termekekRemoveNotification(id), 3000);
  };

  const termekekRemoveNotification = (id: number) => {
    setTermekekNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Product image navigation
  const termekekNextImage = (productId: number) => {
    setTermekekActiveImageIndex(prev => {
      const product = termekekProducts.find(p => p.id === productId);
      if (!product) return prev;
      const nextIndex = ((prev[productId] || 0) + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const termekekPrevImage = (productId: number) => {
    setTermekekActiveImageIndex(prev => {
      const product = termekekProducts.find(p => p.id === productId);
      if (!product) return prev;
      const prevIndex = ((prev[productId] || 0) - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  // Cart management
  const termekekAddToCart = (product: TermekekProduct) => {
    setTermekekCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      return existingItem
        ? prevCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });
    termekekShowNotification(`${product.name} hozzáadva a kosárhoz`, 'termekek-success');
  };

  const termekekRemoveFromCart = (productId: number) => {
    setTermekekCart(prev => prev.filter(item => item.id !== productId));
    termekekShowNotification("Termék eltávolítva", 'termekek-info');
  };

  const termekekUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      termekekRemoveFromCart(productId);
      return;
    }
    setTermekekCart(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculations
  const termekekCalculateTotal = () => {
    return termekekCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const termekekCalculateTotalTokens = () => {
    return termekekCart.reduce((total, item) => total + (item.tokens * item.quantity), 0);
  };

  // Checkout
  const termekekHandleCheckout = () => {
    setTermekekShowCheckout(true);
  };

  const termekekHandleCheckoutSuccess = () => {
    setTermekekUserTokens(prev => prev + termekekCalculateTotalTokens());
    setTermekekCart([]);
    setTermekekShowCheckout(false);
    termekekShowNotification("Sikeres vásárlás! Köszönjük!", 'termekek-success');
    navigate("/termekek?tab=cart&success=true");
  };

  // Coupons
  const termekekRedeemCoupon = (couponId: number) => {
    const coupon = termekekCoupons.find(c => c.id === couponId);
    if (!coupon) return;
    
    if (termekekUserTokens >= coupon.tokensRequired) {
      setTermekekUserTokens(prev => prev - coupon.tokensRequired);
      termekekShowNotification(`${coupon.name} beváltva`, 'termekek-success');
    } else {
      termekekShowNotification("Nincs elég token", 'termekek-error');
    }
  };

  // Checkout component
  const TermekekCheckout = ({ cart, total, onSuccess }: { 
    cart: TermekekCartItem[], 
    total: number, 
    onSuccess: () => void 
  }) => {
    const [termekekPaymentMethod, setTermekekPaymentMethod] = useState("card");
    const [termekekFormData, setTermekekFormData] = useState({
      name: "",
      address: "",
      cardNumber: "",
      expiry: "",
      cvc: ""
    });
    const [termekekErrors, setTermekekErrors] = useState<Record<string, string>>({});

    const termekekValidateForm = () => {
      const errors: Record<string, string> = {};
      if (!termekekFormData.name) errors.name = "Kötelező mező";
      if (!termekekFormData.address) errors.address = "Kötelező mező";
      if (termekekPaymentMethod === "card") {
        if (!/^\d{16}$/.test(termekekFormData.cardNumber)) errors.cardNumber = "Érvénytelen kártyaszám";
        if (!/^\d{2}\/\d{2}$/.test(termekekFormData.expiry)) errors.expiry = "Érvénytelen lejárat";
        if (!/^\d{3}$/.test(termekekFormData.cvc)) errors.cvc = "Érvénytelen CVC";
      }
      setTermekekErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const termekekHandleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (termekekValidateForm()) {
        onSuccess();
      }
    };

    return (
      <div className="termekek-checkout-container">
        <h2 className="termekek-checkout-title">Pénztár</h2>
        <div className="termekek-checkout-summary">
          <h3>Összegzés</h3>
          <p>Termékek: {cart.reduce((sum, item) => sum + item.quantity, 0)} db</p>
          <p>Összesen: {total} Ft</p>
        </div>
        
        <form onSubmit={termekekHandleSubmit} className="termekek-checkout-form">
          <div className="termekek-form-section">
            <h3>Szállítási adatok</h3>
            <div className="termekek-form-group">
              <label>Teljes név</label>
              <input
                type="text"
                value={termekekFormData.name}
                onChange={(e) => setTermekekFormData({...termekekFormData, name: e.target.value})}
              />
              {termekekErrors.name && <span className="termekek-error">{termekekErrors.name}</span>}
            </div>
            <div className="termekek-form-group">
              <label>Szállítási cím</label>
              <input
                type="text"
                value={termekekFormData.address}
                onChange={(e) => setTermekekFormData({...termekekFormData, address: e.target.value})}
              />
              {termekekErrors.address && <span className="termekek-error">{termekekErrors.address}</span>}
            </div>
          </div>

          <div className="termekek-form-section">
            <h3>Fizetési mód</h3>
            <div className="termekek-payment-methods">
              <label>
                <input
                  type="radio"
                  checked={termekekPaymentMethod === "card"}
                  onChange={() => setTermekekPaymentMethod("card")}
                />
                Bankkártya
              </label>
              
              {termekekPaymentMethod === "card" && (
                <div className="termekek-card-details">
                  <div className="termekek-form-group">
                    <label>Kártyaszám</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={termekekFormData.cardNumber}
                      onChange={(e) => setTermekekFormData({...termekekFormData, cardNumber: e.target.value.replace(/\s/g, '')})}
                    />
                    {termekekErrors.cardNumber && <span className="termekek-error">{termekekErrors.cardNumber}</span>}
                  </div>
                  <div className="termekek-card-row">
                    <div className="termekek-form-group">
                      <label>Lejárat</label>
                      <input
                        type="text"
                        placeholder="HH/EE"
                        value={termekekFormData.expiry}
                        onChange={(e) => setTermekekFormData({...termekekFormData, expiry: e.target.value})}
                      />
                      {termekekErrors.expiry && <span className="termekek-error">{termekekErrors.expiry}</span>}
                    </div>
                    <div className="termekek-form-group">
                      <label>CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={termekekFormData.cvc}
                        onChange={(e) => setTermekekFormData({...termekekFormData, cvc: e.target.value})}
                      />
                      {termekekErrors.cvc && <span className="termekek-error">{termekekErrors.cvc}</span>}
                    </div>
                  </div>
                </div>
              )}
              
              <label>
                <input
                  type="radio"
                  checked={termekekPaymentMethod === "transfer"}
                  onChange={() => setTermekekPaymentMethod("transfer")}
                />
                Fizetés átvételkor
              </label>
            </div>
          </div>

          <button type="submit" className="termekek-submit-button">
            Megrendelés elküldése
          </button>
        </form>
      </div>
    );
  };

  return (
    <div id="termekek-root">
      {/* Notifications */}
      <div id="termekek-notifications">
        {termekekNotifications.map(notification => (
          <div 
            key={notification.id}
            className={`termekek-notification ${notification.type}`}
          >
            <div className="termekek-notification-content">
              {notification.message}
            </div>
          </div>
        ))}
      </div>
      
      {termekekShowCheckout ? (
        <TermekekCheckout 
          cart={termekekCart} 
          total={termekekCalculateTotal()} 
          onSuccess={termekekHandleCheckoutSuccess} 
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="termekek-tabs">
            <button
              className={`termekek-tab ${termekekActiveTab === "termekek-products" ? "termekek-active" : ""}`}
              onClick={() => setTermekekActiveTab("termekek-products")}
            >
              Termékek
            </button>
            <button
              className={`termekek-tab ${termekekActiveTab === "termekek-cart" ? "termekek-active" : ""}`}
              onClick={() => setTermekekActiveTab("termekek-cart")}
            >
              Kosár ({termekekCart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
            {isLoggedIn && (
              <button
                className={`termekek-tab ${termekekActiveTab === "termekek-coupons" ? "termekek-active" : ""}`}
                onClick={() => setTermekekActiveTab("termekek-coupons")}
              >
                Kuponok
              </button>
            )}
          </div>

          {/* Products Tab */}
          {termekekActiveTab === "termekek-products" && (
            <div className="termekek-products-grid">
              {termekekProducts.map(product => (
                <div key={product.id} className="termekek-product-card">
                  <div className="termekek-product-image-container">
                    <img 
                      src={product.images[termekekActiveImageIndex[product.id] || 0]} 
                      alt={product.name} 
                      className="termekek-product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Kép+nem+elérhető";
                      }}
                    />
                    {product.images.length > 1 && (
                      <>
                        <button 
                          className="termekek-image-nav termekek-prev"
                          onClick={() => termekekPrevImage(product.id)}
                        >
                          &lt;
                        </button>
                        <button 
                          className="termekek-image-nav termekek-next"
                          onClick={() => termekekNextImage(product.id)}
                        >
                          &gt;
                        </button>
                      </>
                    )}
                  </div>
                  <div className="termekek-product-info">
                    <h3 className="termekek-product-name">{product.name}</h3>
                    <p className="termekek-product-description">{product.description}</p>
                    <div className="termekek-product-price">
                      <span className="termekek-price">{product.price.toLocaleString()} Ft</span>
                      <span className="termekek-tokens">+{product.tokens} token</span>
                    </div>
                    <button 
                      className="termekek-add-to-cart"
                      onClick={() => termekekAddToCart(product)}
                    >
                      Kosárba
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cart Tab */}
          {termekekActiveTab === "termekek-cart" && (
            <div className="termekek-cart-container">
              {termekekCart.length === 0 ? (
                <p className="termekek-empty-cart">A kosarad üres</p>
              ) : (
                <>
                  <div className="termekek-cart-items">
                    {termekekCart.map(item => (
                      <div key={item.id} className="termekek-cart-item">
                        <div className="termekek-cart-item-image">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Kép+nem+elérhető";
                            }}
                          />
                        </div>
                        <div className="termekek-cart-item-details">
                          <h4 className="termekek-cart-item-name">{item.name}</h4>
                          <div className="termekek-quantity-controls">
                            <button 
                              className="termekek-quantity-btn"
                              onClick={() => termekekUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="termekek-quantity">{item.quantity}</span>
                            <button 
                              className="termekek-quantity-btn"
                              onClick={() => termekekUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="termekek-cart-item-price">
                          <span className="termekek-item-total">{(item.price * item.quantity).toLocaleString()} Ft</span>
                          <span className="termekek-item-tokens">+{item.tokens * item.quantity} token</span>
                        </div>
                        <button 
                          className="termekek-remove-item"
                          onClick={() => termekekRemoveFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="termekek-cart-summary">
                    <div className="termekek-summary-row">
                      <span>Összesen:</span>
                      <span>{termekekCalculateTotal().toLocaleString()} Ft</span>
                    </div>
                    <div className="termekek-summary-row">
                      <span>Tokenek:</span>
                      <span>+{termekekCalculateTotalTokens()}</span>
                    </div>
                    <button 
                      className="termekek-checkout-button"
                      onClick={termekekHandleCheckout}
                    >
                      Tovább a fizetéshez
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Coupons Tab */}
          {termekekActiveTab === "termekek-coupons" && isLoggedIn && (
            <div className="termekek-coupons-container">
              <div className="termekek-user-tokens">
                <h3 className="termekek-tokens-title">Tokenjeid</h3>
                <div className="termekek-token-count">{termekekUserTokens}</div>
              </div>
              <div className="termekek-coupons-grid">
                {termekekCoupons.map(coupon => (
                  <div key={coupon.id} className="termekek-coupon-card">
                    <h4 className="termekek-coupon-name">{coupon.name}</h4>
                    <p className="termekek-coupon-description">{coupon.description}</p>
                    <div className="termekek-coupon-footer">
                      <span className="termekek-tokens-required">{coupon.tokensRequired} token</span>
                      <button
                        className={`termekek-redeem-button ${termekekUserTokens >= coupon.tokensRequired ? "" : "termekek-disabled"}`}
                        onClick={() => termekekRedeemCoupon(coupon.id)}
                        disabled={termekekUserTokens < coupon.tokensRequired}
                      >
                        Beváltás
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}