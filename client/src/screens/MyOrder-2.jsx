import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatchCart, useCart } from "../components/ContextReducer";
import "./AdminOrder.css";
// import OutdoorGrillSharpIcon from "@mui/icons-material/OutdoorGrillSharp";
// import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
// import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
// import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
// import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
// import ButtonGroup from "@mui/material/ButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../Modal-1";
import Cart from "../screens/Cart";
import CartModal from "../Modal";
import ViewMoreModal from "../ViewMoreModal";
import ViewMore from "./ViewMore";
import "./HeroHeader.css";
import { MagnifyingGlass, Radio } from "react-loader-spinner";
import { Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";

function OrderTable() {
  let data = useCart();
  const dispatch = useDispatchCart();
  const [orderData, setOrderData] = useState([]);
  const [newOrderPopup, setNewOrderPopup] = useState(false);
  const [showModal, setShowModal] = useState(false); // For delete confirmation modal
  const [outerIndex, setOuterIndex] = useState(null); // To track which order is being deleted
  const [innerIndex, setInnerindex] = useState(null);
  const prevOrderCount = useRef();
  const [open, setOpen] = useState(false);
  const [delivered, setDelivered] = useState();
  const [messageModal, setMessageModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [cartView, setCartView] = useState(false);
  const [viewDescription, setViewMore] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const email = localStorage.getItem("email");
  const [showBillModal, setShowBillModal] = useState(false);
  const [openBillSnackbar, setOpenBillSnackbar] = useState(false);
  const [messageModalError, setMessageModalError] = useState(false);
  const [billConfirmation, setBillConfirmation] = useState(false);
  const [billError, setBillError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const invoiceRef = useRef();
  // const [receiptDownload, setRecieptDownload] = useState(false);

  const loadFoodItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://gofood-server-zeta.vercel.app/api/AdminOrderData"
      );
      const data = await response.json();

      if (response.status === 200) {
        setIsLoading(false);
        setErrorLoading(false);
      }
      if (response.status === 404 || response.status === 400) {
        setIsLoading(false);
        setErrorLoading(true);
      }

      if (data.orderData && data.orderData.length > 0) {
        const filteredOrder = data.orderData.filter(
          (order) => order.email === localStorage.getItem("email")
        );

        console.log(localStorage.getItem("email"));
        // console.log(filteredOrder[0].billApproved);
        setOrderData(filteredOrder);
        const count = data.orderData.reduce(
          (total, order) => total + order.order_data.length,
          0
        );

        if (count > prevOrderCount.current) {
          // setNewOrderPopup(true);
          // setTimeout(() => setNewOrderPopup(false), 15000);
        }

        prevOrderCount.current = count;
      }
    } catch (error) {
      setIsLoading(false);
      setErrorLoading(true);
      console.error("Error fetching order data:", error);
    }
  };

  // Call loadFoodItems every 5 seconds
  useEffect(() => {
    loadFoodItems(); // Initial call to load data immediately
    const intervalId = setInterval(loadFoodItems, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Calculate total price for each order
  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, items) => {
      // Filter out deleted items and calculate the sum of valid items
      const validItemsSum = items
        .filter((item) => !item.isDeleted) // Filter out deleted items
        .reduce((sum, item) => {
          const price = parseFloat(item.price);
          return sum + (isNaN(price) ? 0 : price);
        }, 0);

      return total + validItemsSum;
    }, 0);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://gofood-server-zeta.vercel.app/api/requestDeleteOrder`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, innerIndex, outerIndex }),
        }
      );

      if (response.ok) {
        // const updatedOrderData = orderData.filter(order => order._id !== orderId);
        const updatedOrderData = await response.json(); // Parse the JSON response
        const filteredOrder = updatedOrderData.orderData.filter(
          (order) => order.email === sessionStorage.getItem("userEmail")
        );
        setOrderData(filteredOrder);
        setMessageModal(true);
      } else {
        console.error("Failed to delete the order");
        setMessageModalError(true);
      }
    } catch (error) {
      setMessageModalError(true);
      console.error("Error deleting order:", error);
    }
    setShowModal(false); // Close the modal after deletion
  };

  const requestDelete = (index, idx) => {
    setOuterIndex(index);
    setInnerindex(idx);
    setShowModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowModal(false);

  const handleCloseSnackBar = () => {
    setOpen(false);
  };

  const handleOpenSnackbar = (bool) => {
    setOpen(true);
    {
      bool ? setDelivered(true) : setDelivered(false);
    }
  };

  const handleCloseMessageSnackBar = () => {
    setMessageModal(false);
  };

  // Handle Reorder action
  const handleReorder = async (description) => {
    console.log("Description passed to reorder:", description);
    setCartModal(true);

    // Check if the item exists in the data array with matching id and size
    let reorderedItem = data.find(
      (it) => it.id === description.id && it.size === description.size
    );

    if (reorderedItem) {
      console.log("Updating existing item:", reorderedItem);

      try {
        console.log("try block");
        await dispatch({
          type: "UPDATE",
          id: description.id,
          price: description.price,
          qty: description.qty,
          description: description.description,
        });
        console.log("try block end");
      } catch (error) {
        console.error("Error during dispatch UPDATE:", error);
      }
    } else {
      console.log("Adding new item to cart:", description);

      try {
        await dispatch({
          type: "ADD",
          id: description.id,
          name: description.name,
          price: description.price,
          qty: description.qty,
          size: description.size,
          description: description.description,
        });
      } catch (error) {
        console.error("Error during dispatch ADD:", error);
      }
    }
  };

  const handleCartModalClose = () => {
    setCartModal(false);
  };

  const loadCart = () => {
    setCartView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartModal(false);
  };

  const handleViewMore = (description) => {
    setModalDescription(description);
    setViewMore(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskForBill = () => {
    setShowBillModal(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseBillModal = () => setShowBillModal(false);

  const confirmBill = async () => {
    try {
      const response = await fetch(
        "https://gofood-server-zeta.vercel.app/api/askforbill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.status === 200) {
        setBillConfirmation(true);
      } else if (response.status === 404) {
        setBillError(true);
      }
    } catch (error) {
      setBillError(true);
      console.log(error.meessage);
    }
    setShowBillModal(false);
  };

  const handleCloseBillSnackBar = () => {
    setOpenBillSnackbar(false);
  };

  const handleCloseMessageErrorSnackBar = () => setMessageModalError(false);

  const handleCloseBillConfirmation = () => setBillConfirmation(false);

  const handleCloseBillError = () => setBillError(false);

  const generateBillHtml = (orders) => {
    let itemRows = "";
    let totalCost = 0;
    const salesTax = 10;
    let seq = 0;

    // Generate table rows dynamically
    console.log(orders);
    orders.forEach((orderGroup) => {
      orderGroup.slice(1).forEach((item) => {
        const itemTotal = item.price;
        totalCost += itemTotal;
        seq = seq + 1;
        itemRows += `
                <tr>
                    <td style="padding:10px;">${seq}.</td>
                    <td style="padding:10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-size:14px;">
                        ${item.name} (${item.qty})
                    </td>
                    <td style="padding:10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-size:14px;">
                        ${itemTotal / item.qty} * ${item.qty}
                    </td>
                    <td style="padding:10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-size:14px;text-align:right;">
                        $${itemTotal.toFixed(2)}
                    </td>
                    <td style="padding:10px;"></td>
                </tr>
            `;
      });
    });

    totalCost += salesTax;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Lato', Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f1f1f1;
                text-align: center;
                color: #000000
            }
            .email-container {
                max-width: 640px;
                margin: auto;
                background: #ffffff;
                border: 1px solid #dddddd;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #383e56;
                color: white;
                padding: 20px;
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                margin: 20px;
                text-align: left;
            }
            .table-container {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .table-container th, .table-container td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            .table-container th {
                background-color: #f9f9f9;
                text-align: left;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">Thanks for Your Order!</div>
            <div class="content">
                <p>Order Confirmation # 4543656</p>
                <table class="table-container">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Net Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                        <tr>
                            <td colspan="3" align="right">Taxes</td>
                            <td>$${salesTax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" align="right" style="font-weight:bold;">TOTAL</td>
                            <td style="font-weight:bold;">$${totalCost.toFixed(
                              2
                            )}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="footer">If you have any questions, please contact us.</div>
        </div>
    </body>
    </html>
    `;
  };

  const handleDownload = () => {
    const filteredData = orderData[0].order_data.map((subArray) =>
      subArray.filter((item) => !item.isDeleted)
    );
    const invoiceHtml = generateBillHtml(filteredData);

    const element = document.createElement("div");
    element.innerHTML = invoiceHtml;
    document.body.appendChild(element); // Add to the DOM temporarily

    // Use html2pdf.js to generate the PDF
    const options = {
      margin: 1,
      filename: "invoice.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .finally(() => {
        document.body.removeChild(element); // Clean up after generating the PDF
      });
  };

  return (
    <div
      className="nav-hero app-container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div>
        <Navbar />
      </div>
      <div className="content" style={{ flex: "1" }}>
        <div className="container-fluid table-responsive table table-responsive-sm table-responsive-md table-responsive-lg table-responsive-xs table-sm">
          <h2 className="mb-3 order-table text-warning" style={{ textAlign: "center" }}>
            Order Table
          </h2>

          <Snackbar
            open={newOrderPopup}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setNewOrderPopup(false)}
              severity="info"
              variant="filled"
              sx={{ width: "100%", textAlign: "center" }}
            >
              New Order Arrived!
            </Alert>
          </Snackbar>

          <table
            className="table"
            border="1"
            style={{ width: "100%", textAlign: "center" }}
          >
            <thead className=" text-warning fs-7">
              <tr>
                {/* <th>Order Time</th> */}
                {/* <th>Food Name</th>
              <th>Food Option (Size)</th>
              <th>Quantity</th> */}
                <th>Order Details</th>
                <th>Price</th>
                {/* <th>Description</th> */}
                <th>Order Status</th>
                <th>Cancellation Request</th>
              </tr>
            </thead>
            <tbody className="text-warning">
              {orderData.length > 0 ? (
                orderData.map((order, orderIndex) => {
                  const totalPrice = calculateTotalPrice(order.order_data);
                  return (
                    <React.Fragment key={orderIndex}>
                      {order.order_data.map((orderItems, orderItemIndex) => {
                        const firstItem = orderItems[0]; // Use the first item for the row
                        return (
                          <React.Fragment key={orderItemIndex}>
                            {/* First Row for the First Item */}
                            <tr>
                              <td>
                                {firstItem.qty} {firstItem.name}
                              </td>
                              <td>{firstItem.price}</td>
                            </tr>

                            {/* Remaining Items in the Order */}
                            {orderItems.slice(1).map((item, idx) => (
                              <tr
                                key={`${orderIndex}-${orderItemIndex}-${idx}`}
                                style={
                                  !item.isRequested && !item.isDeleted
                                    ? {}
                                    : { cursor: "not-allowed", opacity: 0.5 }
                                }
                              >
                                <td>
                                  <p>
                                    {item.qty} {item.name}
                                  </p>
                                  <a
                                    onClick={() =>
                                      handleViewMore(item.description)
                                    }
                                    style={{
                                      color: "#3498db",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                  >
                                    View Instructions
                                  </a>
                                </td>
                                <td>{item.price}</td>
                                <td>
                                  {item.isDeleted ? (
                                    <div>
                                      <p
                                        style={{
                                          backgroundColor: "red",
                                          color: "white",
                                          padding: "5px",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        Order Cancelled
                                      </p>
                                      <a
                                        onClick={() => handleReorder(item)}
                                        style={{
                                          color: "#3498db",
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Reorder?
                                      </a>
                                    </div>
                                  ) : item.isRequested ? (
                                    <p
                                      style={{
                                        backgroundColor: "#FF6F61",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Cancellation Request Sent
                                    </p>
                                  ) : !item.isNoted ? (
                                    <p
                                      style={{
                                        backgroundColor: "#3498db",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Order Placed
                                    </p>
                                  ) : !item.isDelivered ? (
                                    <p
                                      style={{
                                        backgroundColor: "#f39c12",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Order Being Prepared
                                    </p>
                                  ) : (
                                    <p
                                      style={{
                                        backgroundColor: "#2ecc71",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      Order Delivered
                                    </p>
                                  )}
                                </td>
                                <td>
                                  {!item.isDelivered &&
                                  !item.isRequested &&
                                  !item.isDeleted ? (
                                    <button
                                      className="btn bg-danger text-white"
                                      onClick={() =>
                                        requestDelete(orderItemIndex, idx)
                                      }
                                    >
                                      <DeleteRoundedIcon />
                                    </button>
                                  ) : (
                                    <button
                                      className="btn bg-danger text-white"
                                      style={{
                                        cursor: "not-allowed",
                                        opacity: 0.5,
                                      }}
                                      onClick={() =>
                                        handleOpenSnackbar(item.isDelivered)
                                      }
                                    >
                                      <DeleteRoundedIcon />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                      {/* Row for Total Price */}
                      <tr
                        style={{ backgroundColor: "#F5F5F5" }}
                        className="text-dark"
                      >
                        <td
                          colSpan="1"
                          style={{ fontWeight: "bold", textAlign: "right" }}
                        >
                          Total Price:
                        </td>
                        <td
                          colSpan="1"
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {totalPrice.toFixed(2)}
                        </td>
                        <td
                          colSpan="2"
                          style={{ fontWeight: "bold", textAlign: "center" }}
                          className="me-5"
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span>Done for now?</span>
                            <button
                              className="btn btn-warning fw-bold"
                              onClick={() => {
                                if (!order.askedForBill) {
                                  handleAskForBill();
                                } else {
                                  setOpenBillSnackbar(true);
                                }
                              }}
                              style={
                                order.askedForBill
                                  ? {
                                      cursor: "not-allowed",
                                      opacity: "0.6",
                                    }
                                  : {}
                              }
                            >
                              Ask for bill
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : !isLoading ? (
                !errorLoading ? (
                  <tr>
                    <td
                      className="fw-bold text-warning"
                      colSpan="5"
                      style={{ textAlign: "center" }}
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                        <div className="mt-5">
                          <Radio
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="radio-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            color="#E4A11B"
                          />
                        </div>
                        <div className="mt-3 text-center text-warning">
                          Lost the connection with the server. Trying to
                          reconnect. If it is taking longer than usual please
                          consider refreshing. If the problem still persists
                          please call our staff.
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                      <div className="mt-5">
                        <MagnifyingGlass
                          visible={true}
                          height="80"
                          width="80"
                          ariaLabel="magnifying-glass-loading"
                          wrapperStyle={{}}
                          wrapperClass="magnifying-glass-wrapper"
                          glassColor="#c0efff"
                          color="#E4A11B"
                        />
                      </div>
                      <div className="mt-3 text-center text-warning">
                        Please hold on. Searching your orders...
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-center">
            <Link
              className="btn btn-warning text-dark fw-bold mt-4"
              to="/"
              state={{ menuFlag: true }}
            >
              {" "}
              {orderData.length === 0 ?
              "Order Now" : "Order More"
            }
            </Link>
            {orderData.length > 0 && (
              <Button
                className="btn btn-warning text-dark fw-bold mt-4 ms-2"
                onClick={
                  orderData.length > 0 &&
                  orderData[0].billApproved &&
                  handleDownload
                }
                style={
                  orderData.length > 0 && !orderData[0].billApproved
                    ? {
                        cursor: "not-allowed",
                        opacity: "0.6",
                      }
                    : {}
                }
              >
                {" "}
                Download Receipt
              </Button>
            )}
          </div>
          {}
        </div>
        {showModal && (
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
              <h2>Confirm Deletion Request</h2>
              <p>
                Are you sure you want to request the deletion of this order?
              </p>
              <div>
                <button
                  className="btn btn-danger mx-2 mt-2"
                  onClick={confirmDelete}
                >
                  Yes, Request
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
        {showBillModal && (
          <Modal onClose={handleCloseBillModal}>
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
              <h2>Confirm Checkout</h2>
              <p>Are you sure you want to close this order and checkout?</p>
              <div>
                <button
                  className="btn btn-danger mx-2 mt-2"
                  onClick={confirmBill}
                >
                  Yes, Checkout
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

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackBar} severity="error">
            {delivered ? (
              <p>Cannot process the request. Item is already Delivered.</p>
            ) : (
              <p>Request already sent. Please wait...</p>
            )}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openBillSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseBillSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseBillSnackBar} severity="warning">
            <p>Bill Request already sent. Please wait....</p>
          </Alert>
        </Snackbar>

        <Snackbar
          open={messageModal}
          autoHideDuration={6000}
          onClose={handleCloseMessageSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseMessageSnackBar} severity="success">
            Request sent. If accepted, the order status will change to
            &apos;Order Cancelled&apos;.
          </Alert>
        </Snackbar>

        <Snackbar
          open={messageModalError}
          autoHideDuration={8000}
          onClose={handleCloseMessageErrorSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseMessageErrorSnackBar} severity="error">
            Error requesting your request. Please try again. If the problem
            persists contact our staff.
          </Alert>
        </Snackbar>

        <Snackbar
          open={cartModal}
          autoHideDuration={6000}
          onClose={handleCartModalClose}
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
            Your order is successfully added to the cart.
            <div style={{ marginTop: "10px" }}>
              <button
                className="mt-4 fs-5"
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
          <CartModal onClose={() => setCartView(false)}>
            <Cart onClose={() => setCartView(false)} />
          </CartModal>
        )}
        {viewDescription && (
          <ViewMoreModal onClose={() => setViewMore(false)}>
            <ViewMore initialDescription={modalDescription} />
          </ViewMoreModal>
        )}
      </div>
      <div className="" style={{ flexShrink: "0" }}>
        <Footer />
      </div>
      <Snackbar
        open={billConfirmation}
        autoHideDuration={6000}
        onClose={handleCloseBillConfirmation}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseBillConfirmation} severity="success">
          Bill Request sent successfully. Be there while we generate and get the
          bill to you.
        </Alert>
      </Snackbar>

      <Snackbar
        open={billError}
        autoHideDuration={8000}
        onClose={handleCloseBillError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseBillError} severity="error">
          Error requesting your request. Please try again. If the problem
          persists contact our staff.
        </Alert>
      </Snackbar>

      <div ref={invoiceRef} style={{ backgroundColor: "#f1f1f1" }}></div>
    </div>
  );
}

export default OrderTable;
