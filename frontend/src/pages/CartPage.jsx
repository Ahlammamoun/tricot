import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    postalCode: '',
    city: '',
    phone: '',
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.prix), 0);

  const shippingCost = total >= 50 ? 0 : 1;
  const grandTotal = total + shippingCost;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState(false);




  useEffect(() => {
    console.log('🧪 Utilisateur courant :', user);
  }, [user]);

  const handleCheckout = async () => {
    if (
      !user ||
      !Array.isArray(user.roles) ||
      !user.roles.some(role => role === 'ROLE_USER' || role === 'ROLE_ADMIN')
    ) {
      alert("❌ Vous devez être connecté à votre compte pour passer commande.");
      navigate('/login');
      return;
    }


    try {
      const res = await fetch("/api/order-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          products: cart.map(p => ({ id: p.id, quantity: p.quantity })), // 👈 changer 'items' en 'products'
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.postalCode} ${shippingInfo.city} - Tel: ${shippingInfo.phone}`
        })



      });

      const data = await res.json();

      if (data.orderId) {
        setIsRedirecting(true);
        clearCart();
        window.location.href = `/api/checkout/${data.orderId}`;
      } else {
        alert("Erreur de création de commande");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement");
    }
  };

  const isFormValid = () => {
    return (
      shippingInfo.address.trim() &&
      shippingInfo.postalCode.trim() &&
      shippingInfo.city.trim() &&
      shippingInfo.phone.trim()
    );
  };





  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛒 Votre panier</h1>

      {isRedirecting ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" />
          <p style={{ marginTop: '1rem' }}>Redirection vers le paiement en cours...</p>
        </div>
      ) : cart.length === 0 ? (
        <p style={styles.empty}>Votre panier est vide.</p>
      ) : (
        <div style={styles.columns}>
          {/* Colonne Gauche : Panier */}
          <div style={styles.leftColumn}>
            <div style={styles.cartList}>
              {cart.map(product => (
                <div key={product.id} style={styles.cartItem}>
                  <div>
                    <strong>{product.nom}</strong><br />
                    {product.quantity} × {product.prix} € ={" "}
                    <strong>{(product.quantity * parseFloat(product.prix)).toFixed(2)} €</strong>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={styles.removeBtn}
                  >
                    ❌
                  </button>
                </div>
              ))}

            </div>

            <div style={styles.total}>
              <p><strong>Sous-total : {total.toFixed(2)} €</strong></p>

              {total < 100 ? (
                <p style={{ color: "#c62828", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  🚚 Livraison offerte dès 100 € d'achat !
                </p>
              ) : (
                <p style={{ color: "#2e7d32", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  ✅ Livraison offerte !
                </p>
              )}
              <p><strong>Livraison : {shippingCost.toFixed(2)} €</strong></p>
              <p><strong>Total à payer : {grandTotal.toFixed(2)} €</strong></p>
            </div>


            <button
              onClick={() => navigate("/")}
              style={styles.continueBtn}
            >
              🛍️ Continuer ses achats
            </button>
          </div>

          {/* Colonne Droite : Livraison */}
          <div style={styles.rightColumn}>
            <h3 style={styles.deliveryTitle}>📦 Informations de livraison</h3>

            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Code postal</label>
            <input
              type="text"
              value={shippingInfo.postalCode}
              onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Ville</label>
            <input
              type="text"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
              style={styles.input}
            />

            <label style={styles.label}>Numéro de téléphone</label>
            <input
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
              style={styles.input}
            />

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.95rem" }}>
                <input
                  type="checkbox"
                  checked={acceptedConditions}
                  onChange={(e) => setAcceptedConditions(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                J'accepte les <a href="/conditions" target="_blank" rel="noopener noreferrer">conditions légales</a>
              </label>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                ...styles.payBtn,
                background: isFormValid() && acceptedConditions ? "#880e4f" : "#ccc",
                cursor: isFormValid() && acceptedConditions ? "pointer" : "not-allowed"
              }}
              disabled={!isFormValid() || !acceptedConditions}
            >
              💳 Payer
            </button>


          </div>
        </div>
      )}
    </div>
  );


}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto',
    background: 'radial-gradient(circle at 20% 30%, #1a1a1a, #000)',
    color: '#FFC660',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '1rem',
    border: '1px solid #FFC660',
    boxShadow: '0 0 30px rgba(255,105,180,0.2)',
  },

  heading: {
    marginBottom: '2rem',
    fontSize: '2.2rem',
    textAlign: 'center',
    fontFamily: 'Playfair Display, serif',
    color: '#FFC660',
    textShadow: '0 0 10px rgba(255,105,180,0.5)',
  },

  empty: {
    textAlign: 'center',
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#ccc',
  },

  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
  },

  leftColumn: {
    flex: '1 1 48%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #FFC660',
    boxShadow: '0 0 10px rgba(255,105,180,0.15)',
  },

  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#FFC660',
    fontSize: '1.4rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
  },

  total: {
    textAlign: 'right',
    fontSize: '1.2rem',
    marginTop: '1rem',
    fontWeight: 'bold',
  },

  continueBtn: {
    padding: '1rem 2rem',
    border: '2px solid #FFC660',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    background: '#000',
    color: '#FFC660',
    width: '100%',
    marginTop: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease-in-out',
  },

  rightColumn: {
    flex: '1 1 48%',
    backgroundColor: '#111',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #FFC660',
    boxShadow: '0 0 10px rgba(255,105,180,0.15)',
  },

  deliveryTitle: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    color: '#FFC660',
    textAlign: 'center',
    fontFamily: 'Playfair Display, serif',
    textShadow: '0 0 8px rgba(255, 105, 180, 0.3)',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    display: 'block',
    fontSize: '0.95rem',
    color: '#FFC660',
  },

  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #FFC660',
    marginBottom: '1rem',
    fontSize: '1rem',
    backgroundColor: '#000',
    color: '#fff',
  },

  payBtn: {
    marginTop: '1rem',
    padding: '1rem 2rem',
    background: '#FFC660',
    color: '#000',
    border: '2px solid #fff',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '100%',
    fontWeight: 'bold',
    transition: 'background 0.3s ease-in-out',
  },
};






export default CartPage;
