import { Link } from "react-router-dom";

function ProductCard(props) {
  const {
    product,
    hoveredProduct,
    setHoveredProduct,
    wishlist,
    toggleWishlist,
    setSelectedProduct,
  } = props;

  // check wishlist
  const isWishlisted = wishlist.some((item) => {
    return item.id === product.id;
  });

  return (
    <div
      className="product-card"
      onMouseEnter={() => {
        setHoveredProduct(product.id);
      }}
      onMouseLeave={() => {
        setHoveredProduct(null);
      }}
    >
      {/* PRODUCT IMAGE */}
      <div className="product-img">
        <div className="hover-image-wrapper">
          {/* MAIN IMAGE */}
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt="product"
            className={`main-product-image ${
              product.category === "Clothing" ? "clothing-img" : ""
            }`}
          />

          {/* HOVER IMAGE */}
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt="hover-product"
              className={`hover-product-image ${
                hoveredProduct === product.id ? "active-hover-image" : ""
              }`}
            />
          )}
        </div>

        {/* PRICE */}
        <span className="price">${product.price}</span>

        {/* WISHLIST */}
        <div
          className={
            isWishlisted ? "wishlist-btn active-wishlist" : "wishlist-btn"
          }
          onClick={() => {
            toggleWishlist(product);
          }}
        >
          ♥
        </div>
      </div>

      {/* PRODUCT NAME */}
      <h3>{product.productName}</h3>
      <p className="product-rating">
        ⭐ {product.rating || 0}({product.reviewCount || 0}
        Reviews)
      </p>

      {/* BUTTONS */}
      <div className="product-card-buttons">
        <button
          onClick={() => {
            setSelectedProduct(product);
          }}
        >
          Quick View
        </button>

        <Link to={`/product/${product.id}`}>
          <button className="details-page-btn">View Product</button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
