import React, { useState } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";
import "./Card.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import AddDescription from "../screens/AddDescription";
import DescModal from "../DescriptionModal";

export default function Card(props) {
  const dispatch = useDispatchCart();
  const data = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [cartView, setCartView] = useState(false);
  const [descCartView, setDescCartView] = useState(false);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleQty = (e) => setQty(e.target.value);
  const handleOptions = (e) => setSize(e.target.value);

  const handleAddToCart = async () => {
    
      const food = data.find((item) => item.id === props.item._id);
      setOpen(true);

      if (food && food.size === size) {
        await dispatch({
          type: "UPDATE",
          id: props.item._id,
          price: parseInt(finalPrice),
          qty: parseInt(qty),
          description: description,
        });
      } else {
        await dispatch({
          type: "ADD",
          id: props.item._id,
          name: props.item.name,
          price: parseInt(finalPrice),
          qty: parseInt(qty),
          size: size,
          img: props.ImgSrc,
          description: description,
        });
      }
    
  };

  const loadCart = () => {
    setCartView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const handleDescriptionSubmit = (desc) => {
    setDescription(desc);
    setDescCartView(false);
  };

  const handleAddDescription = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDescCartView(true);
  };

  const handleSuccessClose = () => setOrderSuccess(false);

  const handleErrorClose = () => setOrderError(false);

  const handleClose = () => {
    setOpen(false);
  };
  const finalPrice = props.price * qty;

  return (
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // minHeight: "100vh", // Optional: Ensures the container takes full height for centering vertically as well
  }}
>
  <div
    className={`card-container ${isFlipped ? "flipped" : ""}`}
    style={{ perspective: "1000px" }}
  >
    {/* Card Content */}
    <div className="card-content">
      {/* Front of the Card */}
      <div className="card-front">
        <img
          src={props.ImgSrc}
          alt={props.foodName}
          className="card-img-top"
          style={{ height: "150px", objectFit: "fill" }}
        />
        {!props.isStockAvailable && (
          <div
            className="overlay"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "#FFD700",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              zIndex: "10",
            }}
          >
            Currently Not Available
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title fw-bold fs-5 text-light">
            {props.foodName}
          </h5>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <select
              className="m-2 h-100 rounded"
              onChange={handleQty}
              style={{
                backgroundColor: "#E4A11B",
                color: "#0F172B",
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div
              className="text-light h-100 fs-5 fw-bold"
              style={{ marginLeft: "10px" }}
            >
              ₹{finalPrice}/-
            </div>
          </div>
          <button
            className="btn btn-secondary mt-2 grow-on-hover"
            style={{
              fontWeight: "bold",
              backgroundColor: "#0F172B",
              color: "#E4A11B",
              borderRadius: "8px",
              width: "60%",
            }}
            onClick={handleAddToCart}
          >
            {props.isStockAvailable ? "Add to Cart" : "Unavailable"}
          </button>
          <button
            className="btn btn-primary mt-3"
            onClick={handleFlip}
            style={{
              backgroundColor: "#E4A11B",
              color: "#0F172B",
              borderRadius: "8px",
            }}
          >
            View Description
          </button>
          <div className="mt-2">
            <p
              className="text-muted"
              style={{
                fontSize: "15px",
                fontFamily: "Arial, sans-serif",
                color: "white",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={handleAddDescription}
            >
              {description === ""
                ? "Add a note or special instructions:"
                : "View or Edit your instructions"}
            </p>
          </div>
        </div>
      </div>

      {/* Back of the Card */}
      <div className="card-back">
        <div className="card-body text-light">
          <h5 className="fw-bold fs-5">{props.foodName}</h5>
          <img
            src={props.ImgSrc}
            alt={props.foodName}
            style={{ height: "130px", objectFit: "fill" }}
          />
          <p className="mt-3">
            {props.description || "No description available."}
          </p>
          <button
            className="btn btn-secondary mt-2"
            onClick={handleFlip}
            style={{
              backgroundColor: "#0F172B",
              color: "#E4A11B",
              borderRadius: "8px",
            }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  </div>
  <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div
          style={{
            backgroundColor: "#E4A11B",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {qty} {size} {props.foodName} successfully added to the cart.
          <div style={{ marginTop: "10px" }}>
            <button
              className="mt-4 fs-5 "
              style={{
                fontWeight: "bold",
                border: "1px solid black",
                borderRadius: "6px",
                padding: "10px",
                backgroundColor: "#0F172B",
                color: "#E4A11B",
              }}
              onClick={loadCart}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </Snackbar>

      {/* Cart Modal */}
      {cartView && (
        <Modal onClose={() => setCartView(false)}>
          <Cart
            onClose={() => setCartView(false)}
            orderConfirmation={() => setOrderSuccess(true)}
            orderErrorFn={() => setOrderError(true)}
          />
        </Modal>
      )}

      {descCartView && (
        <DescModal onClose={() => setDescCartView(false)}>
          <AddDescription
            onDescriptionSubmit={handleDescriptionSubmit}
            initialDescription={description}
          />
        </DescModal>
      )}

      <Snackbar
        open={orderSuccess}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          <p>
            Your order is successfully noted. Hold on tight while we prepare it
            for you.
          </p>
        </Alert>
      </Snackbar>

      <Snackbar
        open={orderError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleErrorClose} severity="error">
          <p>
            Some Error occurred while noting your order. Please try again. If
            problem persists, please contact your nearest staff.
          </p>
        </Alert>
      </Snackbar>
</div>

  );
}
