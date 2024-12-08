import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const UpdateProductForm = () => {
  const [categories, setCategories] = useState([]); // Fixed state type to array
  const location = useLocation();
  const {id, name, price, imageUrl, category, description} = location.state || {};
  console.log(id);
  const [product, setProduct] = useState({
    name: name,
    price: price,
    imageUrl: imageUrl,
    category: category,
    description: description
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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
      id: id,  
      name: product.name,
      img: product.imageUrl,
      category: product.category,
      price: product.price,
      description: product.description,
    };

    try {
        const response = await axios.post("https://gofood-server-zeta.vercel.app/api/updateitem", data, {
          headers: { "Content-Type": "application/json" },
        });
      
        // Check for status code
        if (response.status === 200 || response.status === 201) {
          // Successfully added product
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

  // Fetch categories when the component loads
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="d-flex vh-100 bg-light nav-hero">
      <div className="container my-auto">
        <div className="row justify-content-center">
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
                <h4 className="mb-0">Update Product</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Name Input */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
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
                    <label htmlFor="price" className="form-label">
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
                    <label htmlFor="imageUrl" className="form-label">
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
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
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
                      <option value={product.category}>{product.category}</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.CategoryName}>
                          {category.CategoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Input */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
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
                    Update Product
                  </button>
                </form>
              </div>
            </div>

            {/* Link to View Items */}
            <Link
              to="/list"
              className="btn w-100 mt-3"
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
        <p>

        One Item successfully Updated in the database.
        </p>
        </Alert>
        
      
    </Snackbar>

    <Snackbar
      open={error}
      autoHideDuration={6000}
      onClose={handleErrorClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose = {handleErrorClose} severity="error"
      >
        <p>

      Error Updating Item. Try Again after some time. If the problem persists contact the administrator.        
        </p>
      </Alert>
    </Snackbar>
    </div>
  );
};

export default UpdateProductForm;
