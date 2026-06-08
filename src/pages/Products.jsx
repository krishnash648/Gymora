import "../App.css";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import ProductDrawer from "../components/ProductDrawer";
import Categories from "../components/Categories";
import useChat from "../hooks/useChat";

function Products(props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState([]);

  // AUTH
  const { currentUser, userData } = useAuth();
  const { messages, message, handleMessageChange, sendMessage } = useChat(
    currentUser,
    userData,
    selectedProduct,
  );

  // props
  const cart = props.cart;
  const setCart = props.setCart;
  const wishlist = props.wishlist;
  const setWishlist = props.setWishlist;
  const searchText = props.searchText ?? "";
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // categories
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // filtered products
  const filteredProducts = products.filter((item) => {
    const searchValue = searchText.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "All" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      item.productName?.toLowerCase().includes(searchValue) ||
      item.category?.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  // get products
  useEffect(() => {
    const productsCollection = collection(db, "products");

    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsList = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          productName: doc.data().productName || "",
          category: doc.data().category || "",
          price: doc.data().price || 0,
          stock: doc.data().stock || 0,
          imageUrl: doc.data().imageUrl || "",
          hoverImage: doc.data().hoverImage || "",
          description: doc.data().description || "",
          brand: doc.data().brand || "",
          weight: doc.data().weight || "",
          flavor: doc.data().flavor || "",

          rating: doc.data().rating || 0,

          reviewCount: doc.data().reviewCount || 0,
        };
      });

      setProducts(productsList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      if (product.hoverImage) {
        const img = new Image();

        img.src = product.hoverImage;
      }
    });
  }, [products]);

  // add to cart
  const addProductToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => {
        return item.id === product.id;
      });

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Maximum stock reached");

          return prev;
        }

        return prev.map((item) => {
          return item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item;
        });
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // decrease quantity
  const decreaseQty = (id) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          return item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item;
        })
        .filter((item) => {
          return item.quantity > 0;
        });
    });
  };

  // get cart item
  const getCartItem = (id) => {
    return cart.find((item) => {
      return item.id === id;
    });
  };

  // add button
  const showAddToCartToast = (product) => {
    addProductToCart(product);

    setToast("Added to cart");

    setTimeout(() => {
      setToast("");
    }, 1500);
  };

  // wishlist
  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => {
      return item.id === product.id;
    });

    if (exists) {
      setWishlist(
        wishlist.filter((item) => {
          return item.id !== product.id;
        }),
      );
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="products">
      <div className="products-bg"></div>

      {toast && <div className="toast">{toast}</div>}

      <div className="products-container">
        <h2>Gym Products</h2>

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Products */}
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  hoveredProduct={hoveredProduct}
                  setHoveredProduct={setHoveredProduct}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  setSelectedProduct={setSelectedProduct}
                />
              );
            })
          ) : (
            <div className="no-products">No products found</div>
          )}
        </div>
      </div>
      <ProductDrawer
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        cart={cart}
        addtoCart={addProductToCart}
        decreaseQty={decreaseQty}
        getCartItem={getCartItem}
        handleAdd={showAddToCartToast}
        messages={messages}
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default Products;
