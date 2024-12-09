import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import ViewMoreModal from "../ViewMoreModal";
import ViewMore from "./ViewMore";
import LoaderModal from "../LoaderModal";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";

export default function Cart({ onClose, orderConfirmation, orderErrorFn }) {
  let data = useCart();
  let dispatch = useDispatchCart();
  const [coupon, setCoupon] = useState({ name: "" });
  const [discount, setDiscount] = useState(0);
  const [show, setShow] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const [orderLoader, setOrderLoader] = useState(false);

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  // const handleCartToHome = () => {
  //   onClose();
  // }

  const handleCheckOut = async () => {
    setOrderLoader(true);
    window.scrollTo({ top: '50%', behavior: "smooth" });
    try {
      const userMail = localStorage.getItem("email");
      const userName = sessionStorage.getItem("userName");
      // const today = new Date();
      // const exactDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      // console.log(exactDate);

      data.forEach((obj) => {
        obj.currentTime = getCurrentTime();
      });
      console.log(data);

      console.log("User Email:", userMail);

      const orderDetails = {
        order_data: data,
        email: userMail,
        name: userName,
        order_time: getCurrentTime(),
        table: localStorage.getItem("table"),
        // order_date: exactDate
        order_date: new Date().toDateString(),
      };

      const response = await fetch("https://gofood-server-zeta.vercel.app/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.status === 200) {
        console.log("Order confirmed");
        orderConfirmation();
        setOrderLoader(false);
        dispatch({ type: "DROP" }); // Clear cart

        // Close modal after successful checkout
        if (onClose) {
          onClose(); // 6000 milliseconds = 6 seconds
        }
        
      } else {
        orderErrorFn();
        setOrderLoader(false);
        console.error("Order confirmation failed");
      }
    } catch (error) {
      orderErrorFn();
      setOrderLoader(false);
      console.error("Error during checkout:", error.message);
    }
  };

  if (data.length === 0) {
    return (
      <div>
        <div className="mt-5 w-100 text-center text-white fs-3">
          The Cart is Empty!
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
  <Link 
    className="btn btn-warning text-dark fw-bold mt-4 d-flex justify-content-center" 
    to="/"
    state={{ menuFlag: true }}
  >
    Order Something Now
  </Link>
</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      Coupon: coupon.name,
    };
    axios
      .post("https://gofood-server-zeta.vercel.app/api/discount", data)
      .then((res) => {
        const dist = res.data.dis;
        setShow(false);
        setDiscount(parseInt(dist));
      })
      .catch(function (error) {
        setShow(true);
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleViewMore = (description) => {
    setModalDescription(description);
    setViewMore(true);
  };

  const price = data.reduce((total, food) => total + food.price, 0);
  const dis = (discount / 100) * price;
  let totalPrice = price - dis;

  return (
    <div>
      <div className="container m-auto mt-3 table-responsive table table-responsive-sm table-responsive-md table-responsive-lg ">
        <table className="table table-hover ">
          <thead className=" fs-7" style={{ color: "#E4A11B" }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
              <th scope="col">Instructions</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="text-white">
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>
                  <ButtonGroup
                    variant="text"
                    size="small"
                    onClick={() =>
                      dispatch({
                        type: "DECREMENT_QTY",
                        index: index,
                        unitPrice: food.price / food.qty,
                      })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                    }}
                  >
                    <Button style={{ color: "red" }}>-</Button>{" "}
                  </ButtonGroup>
                  {food.qty}
                  <ButtonGroup
                    variant="text"
                    size="small"
                    onClick={() =>
                      dispatch({
                        type: "INCREMENT_QTY",
                        index: index,
                        unitPrice: food.price / food.qty,
                      })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                    }}
                  >
                    <Button style={{ color: "green" }}>+</Button>
                  </ButtonGroup>
                </td>
                <td>{food.price}</td>
                <td>
                  {food. description && food.description.length > 20
                    ? `${food.description.slice(0, 20)}... `
                    : food.description}

                  {food.description.length > 20 && (
                    <span
                      style={{ color: "lightblue", cursor: "pointer" }}
                      onClick={() => handleViewMore(food.description)}
                    >
                      View more
                    </span>
                  )}
                </td>
                <td>
                  <button type="button" className="btn p-0 bg-danger">
                    <MdDelete
                      onClick={() => {
                        dispatch({ type: "REMOVE", index: index });
                      }}
                    />
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <h1 className="fs-2 text-white">Total Price: {totalPrice}/-</h1>
        </div>
        <div>
          <button
            className="btn mt-4 mb-4"
            onClick={handleCheckOut}
            style={{ backgroundColor: "#E4A11B", color: "#0F172B" }}
          >
            Check Out
          </button>
        </div>
      </div>

      {/* <form
        className="w-50 m-auto mt-2 border bg-dark border-success rounded mb-3"
        method="POST"
      >
        <div className="m-3">
          <label htmlFor="exampleInputEmail1" className="form-label text-white text-center">
            Have a Coupon code? Enter here
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={coupon.name}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="m-3 btn btn-success text-center text-dark fw-2"
          onClick={handleSubmit}
        >
          Redeem
        </button>
        {show ? (
          <div>
            <h6 className="text-danger text-center">Invalid Coupon code</h6>
          </div>
        ) : null}
      </form> */}

      {viewMore && (
        <ViewMoreModal onClose={() => setViewMore(false)}>
          <ViewMore initialDescription={modalDescription} />
        </ViewMoreModal>
      )}

{
      orderLoader && (
        <LoaderModal>
  <div
    className="d-flex vh-100 justify-content-center align-items-center"
    style={{
      height: '60vh', // Adjust modal height here
      width: '30vw', // Optional: Adjust width for consistency
      backgroundColor: '#0F172B',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px', // Optional: Add rounded corners
      padding: '20px',
      flexDirection: 'column', // Ensure column layout for flex container
    }}
  >
   <ThreeDots
  visible={true}
  height="80"
  width="80"
  color="#E4A11B"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
    <div className="d-flex justify-content-center align-items-center mt-3">
      <p className="text-warning fw-bold">Noting down your order...</p>
    </div>
  </div>
</LoaderModal>

      )
    }
   
    </div>
  );
}
