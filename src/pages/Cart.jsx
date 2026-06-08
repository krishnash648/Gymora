import "../App.css";
import { useNavigate } from "react-router-dom";

function Cart(props) {
  // cart data
  const cart = props.cart || [];

  const setCart = props.setCart;
  const navigate = useNavigate();

  // remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => {
      return item.id !== id;
    });

    setCart(updatedCart);
  };

  // decrease quantity
  const decreaseQty = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        })
        .filter((item) => {
          return item.quantity > 0;
        });

      return updatedCart;
    });
  };

  // increase quantity
  const increaseQty = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      });

      return updatedCart;
    });
  };

  // total price
  let total = 0;

  cart.forEach((item) => {
    total = total + item.price * item.quantity;
  });

  return (
    <div className="cart-container">
      {/* Left Side */}
      <div className="cart-left">
        <h2>Shopping Cart</h2>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item) => {
            return (
              <div className="cart-item" key={item.id}>
                {/* Product Image */}
                <img src={item.imageUrl} alt={item.productName} />

                {/* Product Details */}
                <div className="item-details">
                  <h4>{item.productName}</h4>

                  <p>${item.price}</p>

                  {/* Quantity Buttons */}
                  <div className="qty">
                    <button
                      onClick={() => {
                        decreaseQty(item.id);
                      }}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        increaseQty(item.id);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  className="remove-btn"
                  onClick={() => {
                    removeItem(item.id);
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Right Side */}
      <div className="cart-right">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>

          <span>${total}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>

          <span>Free</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>

          <span>${total}</span>
        </div>

        {/* Checkout Button */}
        <button
          className="checkout-btn"
          onClick={() => {
            navigate("/checkout");
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
