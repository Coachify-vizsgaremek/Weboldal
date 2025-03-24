import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "./Termekek.css";

interface Product {
  id: number;
  name: string;
  price: number;
  tokens: number;
  images: string[];
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Coupon {
  id: number;
  name: string;
  tokensRequired: number;
  description: string;
}

export default function Termekek() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<"termekek" | "kosar" | "kuponok">("termekek");
  const [activeImageIndex, setActiveImageIndex] = useState<{[key: number]: number}>({});
  const [userTokens, setUserTokens] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Sample products data - in a real app, you would fetch this from your backend
  useEffect(() => {
    const sampleProducts: Product[] = [
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
        name: "Gallérós",
        price: 6990,
        tokens: 70,
        images: ["/src/images/galleros.png", "/src/images/galleros2.png"],
        description: "Melegítő felső gallérral, kényelmes viselet."
      },
      {
        id: 5,
        name: "Noifelső",
        price: 5490,
        tokens: 55,
        images: ["/src/images/noifelso.png", "/src/images/noifelso2.png"],
        description: "Női edzőfelső, kiváló anyagminőség."
      },
      {
        id: 6,
        name: "Noipóló",
        price: 4590,
        tokens: 45,
        images: ["/src/images/noipolo.png", "/src/images/noipolo2.png"],
        description: "Női edzőpóló, kényelmes és divatos."
      }
    ];

    setProducts(sampleProducts);
    
    // Initialize active image index for each product
    const initialImageIndex: {[key: number]: number} = {};
    sampleProducts.forEach(product => {
      initialImageIndex[product.id] = 0;
    });
    setActiveImageIndex(initialImageIndex);

    // Sample coupons
    const sampleCoupons: Coupon[] = [
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
    setCoupons(sampleCoupons);

    // Load cart from session storage
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load user tokens (in a real app, you would fetch this from the backend)
    setUserTokens(150); // Sample value
  }, []);

  // Save cart to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const nextImage = (productId: number) => {
    setActiveImageIndex(prev => {
      const product = products.find(p => p.id === productId);
      if (!product) return prev;
      const currentIndex = prev[productId] || 0;
      const nextIndex = (currentIndex + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const prevImage = (productId: number) => {
    setActiveImageIndex(prev => {
      const product = products.find(p => p.id === productId);
      if (!product) return prev;
      const currentIndex = prev[productId] || 0;
      const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalTokens = () => {
    return cart.reduce((total, item) => total + item.tokens * item.quantity, 0);
  };

  const handleCheckout = () => {
    // In a real app, you would send this to your backend
    alert(`Sikeres vásárlás! Összeg: ${calculateTotal()} Ft, szerzett tokenek: ${calculateTotalTokens()}`);
    // Update user tokens
    setUserTokens(prev => prev + calculateTotalTokens());
    // Clear cart
    setCart([]);
  };

  const redeemCoupon = (couponId: number) => {
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;
    
    if (userTokens >= coupon.tokensRequired) {
      setUserTokens(prev => prev - coupon.tokensRequired);
      alert(`Kupon beváltva: ${coupon.name}`);
    } else {
      alert("Nincs elég tokened a kupon beváltásához!");
    }
  };

  return (
    <div className="termekek-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "termekek" ? "active" : ""}`}
          onClick={() => setActiveTab("termekek")}
        >
          Termékek
        </button>
        <button
          className={`tab ${activeTab === "kosar" ? "active" : ""}`}
          onClick={() => setActiveTab("kosar")}
        >
          Kosár ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
        {isLoggedIn && (
          <button
            className={`tab ${activeTab === "kuponok" ? "active" : ""}`}
            onClick={() => setActiveTab("kuponok")}
          >
            Kuponok
          </button>
        )}
      </div>

      {activeTab === "termekek" && (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.images[activeImageIndex[product.id] || 0]} 
                  alt={product.name} 
                  className="product-image"
                />
                <button className="image-nav prev" onClick={() => prevImage(product.id)}>
                  &lt;
                </button>
                <button className="image-nav next" onClick={() => nextImage(product.id)}>
                  &gt;
                </button>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">
                  <span>{product.price} Ft</span>
                  <span className="tokens">+{product.tokens} token</span>
                </div>
                <button 
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Kosárba
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "kosar" && (
        <div className="cart-container">
          {cart.length === 0 ? (
            <p className="empty-cart">A kosarad üres</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                      />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <span>{item.price * item.quantity} Ft</span>
                      <span className="tokens">+{item.tokens * item.quantity} token</span>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Összesen:</span>
                  <span>{calculateTotal()} Ft</span>
                </div>
                <div className="summary-row">
                  <span>Tokenek:</span>
                  <span>+{calculateTotalTokens()}</span>
                </div>
                <button 
                  className="checkout-button"
                  onClick={handleCheckout}
                >
                  Tovább a fizetéshez
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "kuponok" && isLoggedIn && (
        <div className="coupons-container">
          <div className="user-tokens">
            <h3>Tokenjeid</h3>
            <div className="token-count">{userTokens}</div>
          </div>
          <div className="coupons-grid">
            {coupons.map(coupon => (
              <div key={coupon.id} className="coupon-card">
                <h4>{coupon.name}</h4>
                <p>{coupon.description}</p>
                <div className="coupon-footer">
                  <span className="tokens-required">{coupon.tokensRequired} token</span>
                  <button
                    className={`redeem-button ${userTokens >= coupon.tokensRequired ? "" : "disabled"}`}
                    onClick={() => redeemCoupon(coupon.id)}
                    disabled={userTokens < coupon.tokensRequired}
                  >
                    Beváltás
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}