import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

interface CheckoutProps {
  cart: any[];
  total: number;
  onSuccess: () => void;
}

export default function Checkout({ cart, total, onSuccess }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) newErrors.name = "Kérjük adja meg a nevét";
    if (!address) newErrors.address = "Kérjük adja meg a címét";
    
    if (paymentMethod === "card") {
      if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
        newErrors.cardNumber = "Érvényes kártyaszám szükséges (16 számjegy)";
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = "Érvényes lejárati dátum szükséges (HH/EE)";
      }
      if (!cardCvc || !/^\d{3}$/.test(cardCvc)) {
        newErrors.cardCvc = "Érvényes CVC szükséges (3 számjegy)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSuccess();
      navigate("/termekek?tab=kosar&success=true");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Fizetés</h2>
      
      <div className="checkout-summary">
        <h3>Összegzés</h3>
        <p>Termékek száma: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
        <p>Végösszeg: {total} Ft</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h3>Szállítási információk</h3>
          
          <div className="form-group">
            <label>Teljes név</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Szállítási cím</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <label>Szállítási mód</label>
            <select 
              value={shippingMethod} 
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              <option value="standard">Standard (3-5 munkanap) - 1,490 Ft</option>
              <option value="express">Expressz (1-2 munkanap) - 2,990 Ft</option>
              <option value="pickup">Átvétel személyesen - 0 Ft</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Fizetési mód</h3>
          
          <div className="form-group">
            <label>
              <input 
                type="radio" 
                checked={paymentMethod === "card"} 
                onChange={() => setPaymentMethod("card")} 
              />
              Bankkártya
            </label>
            
            {paymentMethod === "card" && (
              <div className="card-details">
                <div className="form-group">
                  <label>Kártyaszám</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                  />
                  {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                </div>
                
                <div className="card-row">
                  <div className="form-group">
                    <label>Lejárati dátum</label>
                    <input 
                      type="text" 
                      placeholder="HH/EE" 
                      value={cardExpiry} 
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    {errors.cardExpiry && <span className="error">{errors.cardExpiry}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={cardCvc} 
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                    {errors.cardCvc && <span className="error">{errors.cardCvc}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="radio" 
                checked={paymentMethod === "transfer"} 
                onChange={() => setPaymentMethod("transfer")} 
              />
              Banki átutalás
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Megrendelés elküldése
        </button>
      </form>
    </div>
  );
}