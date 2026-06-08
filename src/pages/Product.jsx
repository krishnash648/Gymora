import "../App.css";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Product() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);
  const [hoverImageUrl, setHoverImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState([]);

  // get products
  useEffect(() => {
    const collectionRef = collection(db, "products");

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setProducts(productsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();

        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 800;

          const scaleSize = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;

          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, ".webp"),
                {
                  type: "image/webp",
                },
              );

              resolve(compressedFile);
            },
            "image/webp",
            0.7,
          );
        };
      };
    });
  };

  // reset form
  const resetForm = () => {
    setProductName("");
    setCategory("");
    setPrice("");
    setStock("");
    setImageFile(null);
    setImageUrl("");
    setEditId(null);
    setHoverImageFile(null);
    setHoverImageUrl("");
    setSpecifications([]);
  };

  // save product
  const saveProduct = async () => {
    try {
      let uploadedImageUrl = imageUrl;

      let uploadedHoverImageUrl = hoverImageUrl;

      // upload image
      if (imageFile) {
        setUploading(true);

        // compress image first
        const compressedFile = await compressImage(imageFile);

        const imageRef = ref(
          storage,
          `products/${Date.now()}-${compressedFile.name}`,
        );

        await uploadBytes(imageRef, compressedFile);

        uploadedImageUrl = await getDownloadURL(imageRef);

        setUploading(false);

        alert("Image Uploaded Successfully");
      }
      if (hoverImageFile) {
        const compressedHoverFile = await compressImage(hoverImageFile);

        const hoverImageRef = ref(
          storage,
          `products/hover-${Date.now()}-${compressedHoverFile.name}`,
        );

        await uploadBytes(hoverImageRef, compressedHoverFile);

        uploadedHoverImageUrl = await getDownloadURL(hoverImageRef);
      }

      const productData = {
        productName,
        category,
        price,
        stock,
        imageUrl: uploadedImageUrl,
        hoverImage: uploadedHoverImageUrl,
        description,
        specifications,
      };

      // update
      if (editId) {
        await updateDoc(doc(db, "products", editId), productData);

        alert("Product Updated");
      } else {
        // add
        await addDoc(collection(db, "products"), productData);

        alert("Product Added");
      }

      resetForm();
    } catch (error) {
      console.log(error.message);

      setUploading(false);
    }
    setDescription("");
  };

  // delete
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));

      alert("Product Deleted");
    } catch (error) {
      console.log(error.message);
    }
  };

  // edit
  const editProduct = (product) => {
    setEditId(product.id);

    setProductName(product.productName);

    setCategory(product.category);

    setPrice(product.price);

    setStock(product.stock);

    setImageUrl(product.imageUrl);

    setHoverImageUrl(product.hoverImage || "");

    setDescription(product.description || "");

    setSpecifications(product.specifications || []);
  };

  return (
    <>
      <h1 className="admin-title">Products</h1>

      <div className="dashboard-card">
        <div className="users-header">
          <h2>Product Management</h2>

          <p>Total Products: {products.length}</p>
        </div>

        {/* Product Form */}
        <div className="product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Stock"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
            }}
          />
          <div className="spec-section">
            <h3>Specifications</h3>

            {specifications.map((spec, index) => {
              return (
                <div key={index} className="spec-row">
                  <input
                    type="text"
                    placeholder="Label"
                    value={spec.label}
                    onChange={(e) => {
                      const updatedSpecs = [...specifications];

                      updatedSpecs[index].label = e.target.value;

                      setSpecifications(updatedSpecs);
                    }}
                  />

                  <button
                    type="button"
                    className="remove-spec-btn"
                    onClick={() => {
                      const updatedSpecs = specifications.filter(
                        (_, i) => i !== index,
                      );

                      setSpecifications(updatedSpecs);
                    }}
                  >
                    ×
                  </button>

                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const updatedSpecs = [...specifications];

                      updatedSpecs[index].value = e.target.value;

                      setSpecifications(updatedSpecs);
                    }}
                  />
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setSpecifications([
                  ...specifications,
                  {
                    label: "",
                    value: "",
                  },
                ]);
              }}
            >
              + Add Spec
            </button>
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          {/* Custom File Upload */}
          <div className="custom-file-upload">
            <label className="file-label">
              Choose File
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
            </label>

            {imageFile && (
              <div className="selected-file">
                <span>{imageFile.name}</span>

                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => {
                    setImageFile(null);
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div className="custom-file-upload">
            <label className="file-label secondary-upload">
              Hover Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setHoverImageFile(file);
                  }
                }}
              />
            </label>

            {hoverImageFile && (
              <div className="selected-file">
                <span>{hoverImageFile.name}</span>

                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => {
                    setHoverImageFile(null);
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Uploading */}
        {uploading && <p className="uploading-text">Uploading Image...</p>}

        {/* Add Button */}
        <button className="add-btn" onClick={saveProduct}>
          {uploading
            ? "Uploading..."
            : editId
              ? "Update Product"
              : "Add Product"}
        </button>

        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => {
              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={product.imageUrl}
                      alt="product"
                      className="product-image"
                      loading="lazy"
                      decoding="async"
                    />
                  </td>

                  <td>{product.productName}</td>

                  <td>{product.category}</td>

                  <td>${product.price}</td>

                  <td>{product.stock}</td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        editProduct(product);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        deleteProduct(product.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Product;
