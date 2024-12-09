import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddCategory from '../screens/AddCategory'
import CategoryModal from '../DescriptionModal'
import AdminLogin from './AdminLogin'

const AddProductForm = () => {
  const [categories, setCategories] = useState([]); // Fixed state type to array
  const [categoryTag, setCategoryTag] = useState("");
  const [adminLogin, setAdminLogin] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [addCategoryView, setAddCategoryView] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: product.name,
      img: product.imageUrl,
      category: product.category,
      price: product.price,
      description: product.description,
    };

    try {
      const response = await axios.post(
        "https://gofood-server-zeta.vercel.app/api/additem",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Check for status code
      if (response.status === 200 || response.status === 201) {
        // Successfully added product
        setProduct({
          name: "",
          price: "",
          imageUrl: "",
          category: "",
          description: "",
        }); // Reset form
        setSuccess(true);
      } else {
        // Handle unexpected status codes
        // alert(`Unexpected response from server: ${response.status} - ${response.statusText}`);
        setError(true);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError(true);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
      setCategories(data); // Assume the response is an array of category objects
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };



  const handleClose = () => {
    setSuccess(false);
  };

  const handleErrorClose = () => {
    setError(false);
  };

  const handleAddCategory = () => {
    setAddCategoryView(true);
  }

  const handleAddCategorySubmit = async (category) => {
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/addcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
       // Assume the response is an array of category objects
    } catch (error) {
      console.error("Error loading categories:", error);
    }
    setAddCategoryView(false);
    loadCategories();
  }
  // Fetch categories when the component loads
  useEffect(() => {

    if(localStorage.getItem('admin') === null){

      setAdminLogin(true);
    }
    
    loadCategories();
  }, []);

  return (
    <div className="d-flex bg-light nav-hero">
      <div className="container my-auto">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 col-lg-6">
            <div className="card shadow bg-white">
              <div
                className="card-header text-center"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#E4A11B",
                  color: "#0F172B",
                }}
              >
                <h4 className="mb-0">Add Product</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Name Input */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-dark">
                      Name of Item
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      className="form-control bg-white"
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  {/* Price Input */}
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label text-dark">
                      Price of Item
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="form-control bg-white"
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  {/* Image URL Input */}
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label text-dark">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={product.imageUrl}
                      onChange={handleChange}
                      className="form-control bg-white"
                      placeholder="Enter image URL"
                      required
                    />
                  </div>

                  {/* Categories Dropdown */}
<div className="mb-3 d-flex align-items-center">
  <div style={{ flex: "1" }}>
    <label htmlFor="category" className="form-label text-dark">
      Category
    </label>
    <select
      id="category"
      name="category"
      value={product.category}
      onChange={handleChange}
      className="form-control bg-white"
      required
    >
      <option value="">Select a category</option>
      {categories.map((category, index) => (
        <option key={index} value={category.CategoryName}>
          {category.CategoryName}
        </option>
      ))}
    </select>
  </div>
  <button
    type="button"
    className="btn btn-secondary ms-3"
    style={{
      height: "40px",
      alignSelf: "flex-end",
      backgroundColor: "#E4A11B",
      color: "#0F172B",
      fontWeight: "bold",
      border: "1px solid black",
      borderRadius: "6px",
    }}
    onClick={() => {
      // Logic to handle adding a new category (e.g., open a modal)
      handleAddCategory()
    }}
  >
    Add Category
  </button>
</div>


                  {/* Description Input */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label text-dark">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      className="form-control bg-white"
                      placeholder="Enter item description"
                      rows="3"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{
                      fontWeight: "bold",
                      border: "1px solid black",
                      borderRadius: "6px",
                      backgroundColor: "#0F172B",
                      color: "#E4A11B",
                    }}
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </div>

            {/* Link to View Items */}
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ marginTop: "20px", gap: "10px" }}
            >
              <Link
                to="/list"
                className="btn w-50 justify-content-center"
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                  backgroundColor: "#E4A11B",
                  color: "#0F172B",
                }}
              >
                View all Items
              </Link>

              <Link
                to="/adminorder"
                className="btn w-50 justify-content-center"
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                  backgroundColor: "#E4A11B",
                  color: "#0F172B",
                }}
              >
                View all orders
              </Link>
            </div>

          </div>
        </div>
      </div>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          <p>One Item successfully added to the database.</p>
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleErrorClose} severity="error">
          <p>
            Error Adding Item. Try Again after some time. If the problem
            persists contact the administrator.
          </p>
        </Alert>
      </Snackbar>
      {addCategoryView && (
        <CategoryModal onClose={() => setAddCategoryView(false)}>
          <AddCategory
            onCategorySubmit={handleAddCategorySubmit}
            initialCategory={categoryTag}
          />
        </CategoryModal>
      )}

      {
      adminLogin && 
      <AdminLogin/>
      }
    </div>
  );
};

export default AddProductForm;
