import "../App.css";

import ProductChat from "./ProductChat";

function ProductDrawer(props) {
  // props
  const {
    selectedProduct,
    setSelectedProduct,
    getCartItem,
    addtoCart,
    decreaseQty,
    messages,
    message,
    handleMessageChange,
    sendMessage,
    handleAdd,
  } = props;

  return (
    selectedProduct && (
      <div
        className="drawer"
        onClick={() => {
          setSelectedProduct(null);
        }}
      >
        {/* DRAWER CONTENT */}
        <div
          className="drawer-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            className="drawer-close"
            onClick={() => {
              setSelectedProduct(null);
            }}
          >
            ✕
          </button>

          {/* PRODUCT TOP */}
          <div className="product-top">
            <div className="product-preview">
              {/* PRODUCT IMAGE */}
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.productName}
              />

              {/* PRODUCT INFO */}
              <div className="product-info">
                <h2>{selectedProduct.productName}</h2>

                <p>${selectedProduct.price}</p>

                <p className="drawer-rating">
                  ⭐ {selectedProduct.rating || 0}(
                  {selectedProduct.reviewCount || 0} Reviews)
                </p>

                {/* TAGS */}
                <div className="product-tags">
                  <span>Free Delivery</span>

                  <span>In Stock</span>

                  <span>Premium</span>
                </div>

                {/* CART CONTROLS */}
                {getCartItem(selectedProduct.id) ? (
                  <div className="qty-controls">
                    {/* DECREASE */}
                    <button
                      onClick={() => {
                        decreaseQty(selectedProduct.id);
                      }}
                    >
                      -
                    </button>

                    {/* QUANTITY */}
                    <span>{getCartItem(selectedProduct.id).quantity}</span>

                    {/* INCREASE */}
                    <button
                      onClick={() => {
                        addtoCart(selectedProduct);
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="drawer-cart-btn"
                    disabled={selectedProduct.stock <= 0}
                    onClick={() => {
                      handleAdd(selectedProduct);
                    }}
                  >
                    {selectedProduct.stock <= 0
                      ? "Out Of Stock"
                      : "Add To Cart"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CHAT */}
          <ProductChat
            messages={messages}
            message={message}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    )
  );
}

export default ProductDrawer;
