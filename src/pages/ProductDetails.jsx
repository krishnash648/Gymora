import "../App.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase-config";

function ProductDetails({ cart, setCart, wishlist, setWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // get single product
  useEffect(() => {
    const docRef = doc(db, "products", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        setProduct(data);

        setSelectedImage(data.imageUrl);
      }
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const reviewsQuery = query(
      collection(db, "reviews"),
      where("productId", "==", product.id),
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [product]);
  // SAVE RECENTLY VIEWED PRODUCT
  useEffect(() => {
    if (!currentUser || !product) return;

    const saveRecentProduct = async () => {
      try {
        await setDoc(
          doc(db, "users", currentUser.uid, "recentlyViewed", product.id),
          {
            productId: product.id,
            productName: product.productName,
            imageUrl: product.imageUrl,
            price: product.price,
            viewedAt: serverTimestamp(),
          },
        );
      } catch (error) {
        console.log(error);
      }
    };

    saveRecentProduct();
  }, [product, currentUser]);

  // related products
  useEffect(() => {
    if (!product) return;

    const productsCollection = collection(db, "products");

    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (item) =>
            item.category === product.category && item.id !== product.id,
        )
        .slice(0, 4);

      setRelatedProducts(productsList);
    });

    return () => unsubscribe();
  }, [product]);

  // add to cart
  const addProductToCart = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity,
        },
      ];
    });

    alert("Added To Cart");
  };

  // wishlist
  const toggleProductWishlist = () => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  if (!product) {
    return <div className="details-loading">Loading Product...</div>;
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Home / {product.category} / {product.productName}
      </div>

      {/* Main Section */}
      <div className="details-container">
        {/* LEFT */}
        <div className="details-left">
          <div className="main-image-box">
            <img src={selectedImage} alt="" className="main-details-image" />
          </div>

          {/* Thumbnails */}
          <div className="thumbnail-row">
            <img
              src={product.imageUrl}
              alt=""
              onClick={() => setSelectedImage(product.imageUrl)}
              className={
                selectedImage === product.imageUrl ? "active-thumb" : ""
              }
            />

            {product.hoverImage && (
              <img
                src={product.hoverImage}
                alt=""
                onClick={() => setSelectedImage(product.hoverImage)}
                className={
                  selectedImage === product.hoverImage ? "active-thumb" : ""
                }
              />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="details-right">
          <h1>{product.productName}</h1>

          <div className="details-rating">
            ★★★★☆ <span>(124 Reviews)</span>
          </div>

          <h2>${product.price}</h2>

          <div className="stock-status">
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out Of Stock"}
          </div>

          <p className="details-description">{product.description}</p>

          <div className="product-specifications">
            {product.specifications &&
              product.specifications.map((spec, index) => {
                return (
                  <p key={index}>
                    <strong>{spec.label}:</strong> {spec.value}
                  </p>
                );
              })}
          </div>

          {/* Quantity */}
          <div className="details-qty">
            <button
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => {
                setQuantity(quantity + 1);
              }}
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="details-buttons">
            <button className="details-cart-btn" onClick={addProductToCart}>
              Add To Cart
            </button>

            <button
              className="details-wishlist-btn"
              onClick={toggleProductWishlist}
            >
              {wishlist.find((item) => item.id === product.id)
                ? "♥ Wishlisted"
                : "♡ Add Wishlist"}
            </button>
          </div>

          {/* Delivery */}
          <div className="delivery-box">
            <p>✓ Free Delivery Available</p>

            <p>✓ Secure Checkout</p>

            <p>✓ 7 Days Return Policy</p>
          </div>
        </div>
      </div>
      <div className="details-reviews">
        <h2>Customer Reviews</h2>

        {reviews.length > 0 ? (
          reviews.map((review) => {
            return (
              <div key={review.id} className="details-review-card">
                <div className="details-review-top">
                  <h3>{review.userName}</h3>

                  <span>{"⭐".repeat(review.rating)}</span>
                </div>

                <p>{review.comment}</p>
              </div>
            );
          })
        ) : (
          <p>No Reviews Yet</p>
        )}
      </div>
      {/* Related Products */}
      <div className="related-products">
        <h2>You May Also Like</h2>

        <div className="related-grid">
          {relatedProducts.map((item) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              className="related-card"
            >
              <img src={item.imageUrl} alt="" />

              <h3>{item.productName}</h3>

              <p>${item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
