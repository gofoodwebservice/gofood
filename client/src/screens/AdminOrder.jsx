import React, { useState, useEffect, useRef } from "react";
import "./AdminOrder.css";
import OutdoorGrillSharpIcon from "@mui/icons-material/OutdoorGrillSharp";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { MagnifyingGlass, Radio } from "react-loader-spinner";
import Modal from "../Modal-1";
import LoaderModal from "../LoaderModal";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import AdminLogin from '../Admin/AdminLogin';


function AdminOrderTable() {
  const [orderData, setOrderData] = useState([]);
  const [newOrderPopup, setNewOrderPopup] = useState(false);
  const prevOrderCount = useRef();
  const [deleteRequestPopup, setDeleteRequestPopup] = useState(false); // New state for delete request notification
  const prevDeleteRequestCount = useRef(); // New ref to track delete requests
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [deleteOrderModal, setDeleteOrderModal] = useState(false);
  const [deletionEmail, setDeletionEmail] = useState("");
  const [deleteSnack, setDeleteSnack] = useState(false);
  const [deleteSnackError, setDeleteSnackError] = useState(false);
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [rejectConfirmation, setRejectConfirmation] = useState(false);
  const [acceptError, setAcceptError] = useState(false);
  const [rejectError, setRejectError] = useState(false);
  const [closeOrderModal, setCloseOrderModal] = useState(false);
  const [closeOrderSuccess, setCloseOrderSuccess] = useState(false);
  const [closeOrderModalError, setCloseOrderModalError] = useState(false);
  const [closeOrderEmail, setCloseOrderEmail] = useState("");
  const [orderLoader, setOrderLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);

  const loadFoodItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/AdminOrderData");
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
        setOrderData(data.orderData);
        const count = data.orderData.reduce(
          (total, order) => total + order.order_data.length,
          0
        );

        if (count > prevOrderCount.current) {
          setNewOrderPopup(true);
          setTimeout(() => setNewOrderPopup(false), 15000);
        }
        const deleteRequestCount = data.orderData.reduce((total, order) => {
          return (
            total +
            order.order_data.reduce((itemTotal, itemGroup) => {
              return (
                itemTotal +
                itemGroup.reduce((sum, item) => {
                  return sum + (item.isRequested ? 1 : 0);
                }, 0)
              );
            }, 0)
          );
        }, 0);

        console.log(deleteRequestCount, prevDeleteRequestCount.current);
        if (deleteRequestCount > prevDeleteRequestCount.current) {
          setDeleteRequestPopup(true);
          setTimeout(() => setDeleteRequestPopup(false), 15000);
        }

        prevOrderCount.current = count;
        prevDeleteRequestCount.current = deleteRequestCount; // Update the delete request count reference
      }
    } catch (error) {
      setIsLoading(false);
      setErrorLoading(true);
      console.error("Error fetching order data:", error);
    }
  };

  // Call loadFoodItems every 5 seconds
  useEffect(() => {
    if(localStorage.getItem('admin') === null){

      setAdminLogin(true);
    }
    loadFoodItems(); // Initial call to load data immediately
    const intervalId = setInterval(loadFoodItems, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Delete order by email function
  const handleDelete = async () => {
    setDeleteLoader(true);
    // const email = deletionEmail;
    try {
      const response = await fetch(`https://gofood-server-zeta.vercel.app/api/deleteOrder`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: deletionEmail }),
      });

      if (response.ok) {
        setDeleteLoader(false);
        setOrderData((prevData) =>
          prevData.filter((order) => order.email !== deletionEmail)
        );
        setDeleteSnack(true);
      } else {
        console.error("Failed to delete order:", response.statusText);
        setDeleteSnackError(true);
        setDeleteLoader(false);
      }
    } catch (error) {
      setDeleteSnackError(true);
      setDeleteLoader(false);
      console.error("Error deleting order:", error);
    }
    setDeleteOrderModal(false);
  };

  const handleNoted = async (email, innerIndex, outerIndex) => {
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/noted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, innerIndex, outerIndex }),
      });

      if (response.ok) {
        console.log("Order noted successfully");
        loadFoodItems();
      } else {
        console.error("Failed to note the order:", response.statusText);
      }
    } catch (error) {
      console.error("Error noting order:", error);
    }
  };

  const handleDelivered = async (email, innerIndex, outerIndex) => {
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/delivered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, innerIndex, outerIndex }),
      });

      if (response.ok) {
        console.log("Order Delivered successfully");
        loadFoodItems();
      } else {
        console.error(
          "Failed to note the delivery of order:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error noting the delivery of order:", error);
    }
  };

  const handleDeleteRequest = async (email, outerIndex, innerIndex, flag) => {
    console.log(outerIndex, innerIndex);
    try {
      const response = await fetch("https://gofood-server-zeta.vercel.app/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, innerIndex, outerIndex, flag }),
      });

      if (response.ok) {
        console.log("Order Delivered successfully");
        loadFoodItems();
        if (flag) {
          setAcceptConfirmation(true);
          setRejectConfirmation(false);
        } else {
          setAcceptConfirmation(false);
          setRejectConfirmation(true);
        }
      } else {
        if (flag) {
          setAcceptError(true);
          setRejectError(false);
        } else {
          setAcceptError(false);
          setRejectError(true);
        }
        console.error(
          "Failed to note the delivery of order:",
          response.statusText
        );
      }
    } catch (error) {
      if (flag) {
        setAcceptError(true);
        setRejectError(false);
      } else {
        setAcceptError(false);
        setRejectError(true);
      }
      console.error("Error accepting the cancellation of order:", error);
    }
  };

  const handleBillApproval = async () => {
    setOrderLoader(true);
    // const email = deletionEmail;
    try {
      const response = await fetch(`https://gofood-server-zeta.vercel.app/api/approvebill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: closeOrderEmail }),
      });

      if (response.ok) {
        setCloseOrderSuccess(true);
        setOrderLoader(false);
        // console.log("Order Delivered successfully");
        loadFoodItems();
      } else {
        setCloseOrderModalError(true);
        setOrderLoader(false);
        console.error(
          "Failed to note the delivery of order:",
          response.statusText
        );
      }
    } catch (error) {
      setCloseOrderModalError(false);
      setOrderLoader(false);
      console.error("Error noting the delivery of order:", error);
    }
    setCloseOrderModal(false);
  };

  const handleDeleteOrderModal = (email) => {
    setDeleteOrderModal(true);
    setDeletionEmail(email);
    window.scrollTo({ top: "60%", behavior: "smooth" });
  };

  const handleCloseOrder = (email) => {
    setCloseOrderModal(true);
    setCloseOrderEmail(email);
    window.scrollTo({ top: "60%", behavior: "smooth" });
  };

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

  const handleClose = () => {
    setDeleteOrderModal(false);
  };

  const handleCloseOrderModal = () => {
    setCloseOrderModal(false);
  };

  const handleCloseDeleteSnackBar = () => {
    setDeleteSnack(false);
    // setDeleteOrderModal(false);
  };

  const handleCloseDeleteSnackBarError = () => {
    setDeleteSnackError(false);
  };

  const handleCloseAcceptConfirmationSnackBar = () =>
    setAcceptConfirmation(false);

  const handleCloseAcceptErrorSnackBar = () => setAcceptError(false);

  const handleCloseRejectConfirmationSnackBar = () =>
    setRejectConfirmation(false);

  const handleCloseRejectErrorSnackBar = () => setRejectError(false);

  const handleCloseOrderSuccess = () => setCloseOrderSuccess(false);

  const handleCloseOrderError = () => setCloseOrderModalError(false);
 
  return (
    <div className="nav-hero app-container" 
    style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div className="content" style={{ flex: "1" }}>
        
      <div className="container-fluid m-auto  table-responsive table table-responsive-sm table-responsive-md table-responsive-lg">
        <h2 className="mb-3 mt-3" style={{ textAlign: "center" }}>
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

        {/* Delete Request Snackbar */}
        <Snackbar
          open={deleteRequestPopup}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setDeleteRequestPopup(false)}
            severity="warning"
            variant="filled"
            sx={{ width: "100%", textAlign: "center" }}
          >
            New Delete Request Received!
          </Alert>
        </Snackbar>

        <table
          className="table"
          border="1"
          style={{ width: "100%", textAlign: "center" }}
        >
          <thead className=" text-warning fs-7">
            <tr>
              <th>Email</th>
              <th>Order Time</th>
              <th>Food Name</th>
              <th>Food Option (Size)</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Description</th>
              <th>Noted Status</th>
              <th>Delivery Status</th>
              <th>Cancellation Request</th>
            </tr>
          </thead>
          <tbody>
            {orderData.length > 0 ? (
              orderData.map((order, orderIndex) => {
                const totalPrice = calculateTotalPrice(order.order_data); // Calculate total price
                return (
                  <React.Fragment key={orderIndex}>
                    {order.order_data.map((orderItems, orderItemIndex) => {
                      const firstItem = orderItems[0]; // Use the first item for row
                      return (
                        <React.Fragment key={orderItemIndex}>
                          <tr>
                            {orderItemIndex === 0 && (
                              <td
                                rowSpan={order.order_data.reduce(
                                  (total, items) => total + items.length,
                                  0
                                )}
                              >
                                <div>
                                  <h6>Table No: {order.table ? order.table : ""}</h6> 
                                  <br/>
                                  {order.email}
                                  {/* {order.askedForBill} */}
                                  <br />
                                  <DeleteRoundedIcon
                                    className="bg-danger mb-4"
                                    onClick={() =>
                                      handleDeleteOrderModal(order.email)
                                    }
                                    style={{
                                      marginTop: "1rem",
                                      cursor: "pointer",
                                    }}
                                    // disabled = {order.askedForBill}
                                  >
                                    Delete
                                  </DeleteRoundedIcon>
                                  <br />
                                  <button
                                    className="btn btn-danger fw-bold"
                                    style={
                                      !order.askedForBill
                                        ? {
                                            cursor: "not-allowed",
                                            opacity: 0.5,
                                          }
                                        : {}
                                    }
                                    onClick={() =>
                                      handleCloseOrder(order.email)
                                    }
                                  >
                                    Close the order
                                  </button>
                                </div>
                              </td>
                            )}
                            <td>{firstItem.Order_time}</td> {/* Order date */}
                            <td>{firstItem.name}</td>
                            <td>{firstItem.size}</td>
                            <td>{firstItem.qty}</td>
                            <td>{firstItem.price}</td>
                            <td>{firstItem.description}</td>
                          </tr>
                          {orderItems.slice(1).map((item, idx) => (
                            <tr
                              key={`${orderIndex}-${orderItemIndex}-${idx}`}
                              className="hoverRow text-dark"
                              style={{
                                ...(item.isDeleted
                                  ? {
                                      cursor: "not-allowed",
                                      opacity: 0.5,
                                      backgroundColor: "red",
                                    }
                                  : {
                                      backgroundColor: !item.isNoted
                                        ? "#87CEEB"
                                        : !item.isDelivered
                                        ? "#DAA520"
                                        : "#3CB371",
                                    }),
                              }}
                            >
                              <td></td>
                              <td>{item.name}</td>
                              <td>{item.size}</td>
                              <td>{item.qty}</td>
                              <td>{item.price}</td>
                              <td>{item.description}</td>
                              <td>
                                {!item.isNoted ? (
                                  <EditNoteRoundedIcon
                                    onClick={
                                      !item.isDeleted
                                        ? () =>
                                            handleNoted(
                                              order.email,
                                              orderItemIndex,
                                              idx
                                            )
                                        : undefined
                                    }
                                    style={
                                      !item.isDeleted
                                        ? { cursor: "pointer" }
                                        : undefined
                                    }
                                  ></EditNoteRoundedIcon>
                                ) : (
                                  <DoneRoundedIcon></DoneRoundedIcon>
                                )}
                              </td>
                              <td>
                                {!item.isDelivered ? (
                                  item.isNoted ? (
                                    <OutdoorGrillSharpIcon
                                      onClick={
                                        !item.isDeleted
                                          ? () =>
                                              handleDelivered(
                                                order.email,
                                                orderItemIndex,
                                                idx
                                              )
                                          : undefined
                                      }
                                      style={
                                        !item.isDeleted
                                          ? { cursor: "pointer" }
                                          : undefined
                                      }
                                    >
                                      Delivered
                                    </OutdoorGrillSharpIcon>
                                  ) : (
                                    <OutdoorGrillSharpIcon
                                      style={{
                                        cursor: "not-allowed",
                                        opacity: 0.5,
                                      }}
                                      title="You must note the order first"
                                    >
                                      Delivered
                                    </OutdoorGrillSharpIcon>
                                  )
                                ) : (
                                  <DoneAllRoundedIcon />
                                )}
                              </td>

                              {item.isRequested && (
                                <td
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#28282B",
                                  }}
                                >
                                  <DoneOutlineRoundedIcon
                                    style={{
                                      backgroundColor: "green",
                                      marginRight: "1rem",
                                      marginLeft: "1rem",
                                    }}
                                    onClick={() =>
                                      handleDeleteRequest(
                                        order.email,
                                        orderItemIndex,
                                        idx,
                                        true
                                      )
                                    }
                                  />
                                  <CloseRoundedIcon
                                    style={{
                                      backgroundColor: "red",
                                      marginRight: "1rem",
                                      marginLeft: "1rem",
                                    }}
                                    onClick={() =>
                                      handleDeleteRequest(
                                        order.email,
                                        orderItemIndex,
                                        idx,
                                        false
                                      )
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                    {/* Row for total price */}
                    <tr style={{ background: "#F5F5F5" }} className="text-dark">
                      <td
                        colSpan="5"
                        style={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Total Price:
                      </td>
                      <td
                        colSpan="5"
                        style={{ fontWeight: "bold", textAlign: "left" }}
                      >
                        {totalPrice.toFixed(2)} {/* Display total price */}
                      </td>
                    </tr>
                    {orderIndex < orderData.length - 1 && (
                      <tr>
                        <td colSpan="8" style={{ padding: "10px 0" }}>
                          <hr style={{ margin: "10px 0" }} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : !isLoading ? (
              !errorLoading ? (
                <tr>
                  <td
                    className="fw-bold text-warning"
                    colSpan="10"
                    style={{ textAlign: "center" }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="10">
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
                        please call the administrator.
                      </div>
                    </div>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="10">
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
                      Please hold on. Searching for orders...
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
      <div className="text-center mb-5">
            <Link className="btn btn-warning text-dark fw-bold mt-4" to="/admin">
              {" "}
              Add an Item
            </Link>
                
                  
            <Link className="btn btn-warning text-dark fw-bold mt-4 ms-2" to = "/list"
            
              >
              {" "}
              view all Items
            </Link>
        
          </div>
      {deleteOrderModal && (
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
            <p>Are you sure you want to delete all orders for this table?</p>
            <div>
              <button
                className="btn btn-danger mx-2 mt-2"
                onClick={handleDelete}
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

      {closeOrderModal && (
        <Modal onClose={handleCloseOrderModal}>
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
            <h2>Confirm Order Closure</h2>
            <p>Are you sure you want to close the order for this table?</p>
            <div>
              <button
                className="btn btn-danger mx-2 mt-2"
                onClick={handleBillApproval}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary mx-2 mt-2"
                onClick={handleCloseOrderModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Snackbar
        open={deleteSnack}
        autoHideDuration={6000}
        onClose={handleCloseDeleteSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseDeleteSnackBar} severity="success">
          All the orders for email {deletionEmail} deleted successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteSnackError}
        autoHideDuration={6000}
        onClose={handleCloseDeleteSnackBarError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseDeleteSnackBarError} severity="error">
          Error deleting the orders. Please try again. If problem persists,
          please contact the administrator.
        </Alert>
      </Snackbar>

      <Snackbar
        open={acceptConfirmation}
        autoHideDuration={6000}
        onClose={handleCloseAcceptConfirmationSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAcceptConfirmationSnackBar}
          severity="success"
        >
          Deletion requested accepted successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={rejectConfirmation}
        autoHideDuration={6000}
        onClose={handleCloseRejectConfirmationSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseRejectConfirmationSnackBar}
          severity="success"
        >
          Deletion request rejected successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={acceptError}
        autoHideDuration={6000}
        onClose={handleCloseAcceptErrorSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAcceptErrorSnackBar} severity="error">
          Error accepting the request. Please try again. If problem persists,
          please contact the administrator.
        </Alert>
      </Snackbar>

      <Snackbar
        open={rejectError}
        autoHideDuration={6000}
        onClose={handleCloseRejectErrorSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseRejectErrorSnackBar} severity="error">
          Error rejecting the request. Please try again. If problem persists,
          please contact the administrator.
        </Alert>
      </Snackbar>

      <Snackbar
        open={closeOrderSuccess}
        autoHideDuration={6000}
        onClose={handleCloseOrderSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseOrderSuccess}
          severity="success"
        >
          Order Closed successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={closeOrderModalError}
        autoHideDuration={6000}
        onClose={handleCloseOrderError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseOrderError} severity="error">
          Error in closing the order. Please try again. If problem persists,
          please contact the administrator.
        </Alert>
      </Snackbar>

      {orderLoader && (
        <LoaderModal>
          <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
              height: "60vh", // Adjust modal height here
              width: "30vw", // Optional: Adjust width for consistency
              backgroundColor: "#0F172B",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px", // Optional: Add rounded corners
              padding: "20px",
              flexDirection: "column", // Ensure column layout for flex container
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
              <p className="text-warning fw-bold">Closing the order...</p>
            </div>
          </div>
        </LoaderModal>
      )}

      {deleteLoader && (
        <LoaderModal>
          <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
              height: "60vh", // Adjust modal height here
              width: "30vw", // Optional: Adjust width for consistency
              backgroundColor: "#0F172B",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px", // Optional: Add rounded corners
              padding: "20px",
              flexDirection: "column", // Ensure column layout for flex container
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
              <p className="text-warning fw-bold">Deleting the order...</p>
            </div>
          </div>
        </LoaderModal>
      )}
       {
      adminLogin && 
      <AdminLogin/>
      }
    </div>
  );
}

export default AdminOrderTable;
