import { React, useRef, useState, useEffect } from "react";
import { useDispatchCart, useCart } from "../components/ContextReducer";
import "../components/Card.css";
import { Link, useNavigate } from "react-router-dom";
import DescModal from "../DescriptionModal";
import Snackbar from "@mui/material/Snackbar";
import Modal from "../Modal";
import axios from "axios";
import Alert from "@mui/material/Alert";

export default function Card(props) {
  const navigate = useNavigate();
  const dispatch = useDispatchCart();
  let data = useCart();
  let options = props.options;
//   let priceOptions = Object.keys(options);
  const priceRef = useRef();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [cartView, setCartView] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [description, setDescription] = useState(""); // New state for description
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [outOfStockSuccess, setOutOfStockSuccess] = useState(false);
  const [outOfStockError, setOutOfStockError] = useState(false);


  let finalPrice = 100;

  const confirmDelete = async() => {
    try {
        const response = await axios.delete("https://gofood-server-zeta.vercel.app/api/deleteitem", {
          data: { id: props.id }, // Send ID in the request body
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 200) {
            setSuccess(true);
            setModalView(false);
            props.loadFoodItems();
            console.log("object")
        } else {
            setError(true);
        }
      } catch (error) {
        setError(true);
        console.error("Error deleting item:", error.response ? error.response.data : error.message);
      }
  };

  const handleOutOfStock = () => {
    setStockModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const handleDelete = () => {
    setModalView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleClose = () => setModalView(false);

  const handleSuccessClose = () => setSuccess(false);

  const handleErrorClose = () => setError(false);

  const handleStockSuccessClose = () => setOutOfStockSuccess(false);

  const handleStockErrorClose = () => setOutOfStockError(false);

  const handleStockClose = () => setStockModal(false);

  const confirmOutOfStock = async () => {
    try {
        console.log(props.id)
        const response = await axios.post("https://gofood-server-zeta.vercel.app/api/outofstock", {
          data: { id: props.id }, // Send ID in the request body
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 200 || response.status === 201) {
            setOutOfStockSuccess(true);
            setStockModal(false);
            props.loadFoodItems();
        } else {
            setOutOfStockError(true);
            setStockModal(false);
        }
      } catch (error) {
        setOutOfStockError(true);
        setStockModal(false);
        console.log(error.message)
        console.error("Error deleting item:", error.response ? error.response.data : error.message);
      }
  }

  return (
    <div>
      {/* Food Card */}
      <div
        className="card mt-3 sm-3 resp grow-on-hover-card"
        style={{ width: "20rem", maxHeight: "375px" }}
      >
        <img
          src={props.ImgSrc}
          className="card-img-top"
          alt={props.foodName}
          style={{ height: "150px", objectFit: "fill" }}
        />
        <div className="card-body">
          <h5 className="card-title fw-bold fs-5 text-light">{props.foodName}</h5>
          <div className="container w-100 p-0">
            {/* Quantity Selector */}
            
            {/* Size Selector */}
            
            {/* Price */}
            <div className="d-inline text-light h-100 fs-5 fw-bold"> ₹{props.price}/-</div>

            {/* Buttons */}
            <div className="mt-3 d-flex justify-content-between">
              {/* Out of Stock Button */}
              <button
                className="p-2 fs-5 grow-on-hover"
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                  backgroundColor: "#0F172B",
                  color: "#E4A11B",
                }}
                onClick={handleOutOfStock}
              >
                
               {!props.isStockAvailable ? 
                "Out of Stock" : "Live the item"
            }
              </button>
              
              {/* Delete Item Button */}
              <button
                className="p-2 fs-5 grow-on-hover"
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                  backgroundColor: "#D9534F", // Red color for delete
                  color: "#FFF",
                }}
                onClick={handleDelete} // Placeholder for delete functionality
              >
                Delete Item
              </button>
            </div>
            <div className="mt-3">
              <Link
              to="/update"
                className="p-2 fs-5 grow-on-hover w-100 bg-warning"
                state={{
                    img: props.ImgSrc,
                    name: props.foodName,
                    price: finalPrice || 0,
                    description: props.description,
                    imageUrl: props.ImgSrc,
                    category: props.CategoryName,
                    id: props.id
                }}
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                //   backgroundColor: "#4CAF50", // Green color for update
                  color: "#0F172B",
                  textDecoration: "none"
                }}
                
              >
                Update Item
              </Link>
            </div>
          </div>
        </div>
      </div>
      {modalView && (
        <Modal onClose={handleClose}>
          <div
            className="text-warning"
            style={{
              display: "flex",
              justifyContent: "center", // Centers content horizontally
              alignItems: "center", // Centers content vertically
              height: "50vh", // Full viewport height to ensure vertical centering
              textAlign: "center", // Centers text inside the content
              flexDirection: "column", // Stacks the content vertically
            }}
          >
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this item?</p>
            <div>
              <button
                className="btn btn-danger mx-2 mt-2"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary mx-2 mt-2"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

{stockModal && (
        <Modal onClose={handleStockClose}>
          <div
            className="text-warning"
            style={{
              display: "flex",
              justifyContent: "center", // Centers content horizontally
              alignItems: "center", // Centers content vertically
              height: "50vh", // Full viewport height to ensure vertical centering
              textAlign: "center", // Centers text inside the content
              flexDirection: "column", // Stacks the content vertically
            }}
          >
            {!props.isStockAvailable ? 
            <p>Are you sure you want to make this item Out of Stock?</p>
            :
            <p>Are you sure you want to make this item Live?</p>
        }
            <div>
              <button
                className="btn btn-danger mx-2 mt-2"
                onClick={confirmOutOfStock}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary mx-2 mt-2"
                onClick={handleStockClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

<Snackbar
      open={success}
      autoHideDuration={6000}
      onClose={handleSuccessClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleSuccessClose} severity="success">
        <p>

        One Item successfully deleted from the database.
        </p>
        
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

      Error Deleting Item. Try Again after some time. If the problem persists contact the administrator.        
        </p>
      </Alert>
    </Snackbar>

    <Snackbar
      open={outOfStockSuccess}
      autoHideDuration={6000}
      onClose={handleStockSuccessClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
           <Alert onClose={handleStockSuccessClose} severity="success">

{
    !props.isStockAvailable ? 
    <p>Changed the availability status to Live</p>
    :
    <p>Changed the availability status to Out of Stock</p>
}        
      </Alert>
    </Snackbar>

    <Snackbar
      open={outOfStockError}
      autoHideDuration={6000}
      onClose={handleStockErrorClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
            <Alert onClose={handleStockErrorClose} severity="error">
<p>

      Error changing the availability status of the Item. Try Again after some time. If the problem persists contact the administrator.        
</p>
      </Alert>
    </Snackbar>
    </div>
  );
}
