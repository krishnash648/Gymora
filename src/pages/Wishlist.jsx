import "../App.css";

import { useNavigate } from "react-router-dom";

function Wishlist(props) {
  // navigate pages
  const navigate = useNavigate();

  // wishlist data from props
  const wishlist = props.wishlist || [];

  // update wishlist function
  const setWishlist = props.setWishlist;

  // update cart function
  const setCart = props.setCart;

  // remove item from wishlist
  const removeWishlistItem = (id) => {
    const updatedWishlist = wishlist.filter((item) => {
      return item.id !== id;
    });

    setWishlist(updatedWishlist);
  };

  // add product to cart
  const addProductToCart = (product) => {
    setCart((previousCart) => {
      // check if product already exists
      const existingProduct = previousCart.find((item) => {
        return item.id === product.id;
      });

      // if product already exists
      // increase quantity
      if (existingProduct) {
        return previousCart.map((item) => {
          return item.id === product.id
            ? {
                ...item,

                quantity: item.quantity + 1,
              }
            : item;
        });
      }

      // add new product in cart
      return [
        ...previousCart,

        {
          ...product,

          quantity: 1,
        },
      ];
    });
  };

  return (
    <div className="wishlist-page">
      {/* EMPTY WISHLIST */}
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          {/* HEART ICON */}
          <div className="wishlist-icon">♥</div>

          {/* TITLE */}
          <h1>YOUR WISHLIST IS EMPTY</h1>

          {/* MESSAGE */}
          <p>Save products you love and access them anytime.</p>

          {/* SHOP BUTTON */}
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            SHOP NOW
          </button>
        </div>
      ) : (
        <>
          {/* PAGE TITLE */}
          <h1 className="wishlist-title">My Wishlist</h1>

          {/* WISHLIST PRODUCTS */}
          <div className="wishlist-container">
            {wishlist.map((item) => {
              return (
                <div key={item.id} className="wishlist-card">
                  {/* PRODUCT IMAGE */}
                  <div className="wishlist-image-box">
                    <img src={item.imageUrl} alt={item.productName} />
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="wishlist-info">
                    <h3>{item.productName}</h3>

                    <p>${item.price}</p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="wishlist-actions">
                    {/* ADD TO CART */}
                    <button
                      className="add-cart-btn"
                      onClick={() => {
                        addProductToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>

                    {/* REMOVE ITEM */}
                    <button
                      className="remove-btn"
                      onClick={() => {
                        removeWishlistItem(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;
