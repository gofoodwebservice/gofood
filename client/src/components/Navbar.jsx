import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { BsCart2 } from "react-icons/bs";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";
import "./Navbar.css";
import logo from "../img/image.png";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NavLink } from "react-router-dom";

export default function NavbarComponent() {
  const navigate = useNavigate();
  const [cartView, setCartView] = useState(false);
  const [expanded, setExpanded] = useState(false); // State to manage navbar expansion
  const data = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);

  const handleLogout = () => {
    navigate("/login");
    sessionStorage.removeItem("userEmail");
  };

  const handleLinkClick = () => {
    setExpanded(false); // Collapse navbar when any link is clicked
  };

  const loadCart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartView(true);
    setExpanded(false); // Collapse navbar when the cart is clicked
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar-dark");
      const collapsed = document.querySelector(".collapsed");
      if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
        collapsed.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
        collapsed.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="sticky-top navbar-dark"
      expanded={expanded} // Control the expanded state
      onToggle={(isOpen) => setExpanded(isOpen)} // Sync state with toggle button
    >
      <Container className="collapsed">
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick} className="fs-1 fst-italic">
          <div className="d-flex align-items-center">
            <img src={logo} alt="GoFood Logo" className="navbar-logo me-3" />
            <span className="text-warning">GoFood</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleLinkClick}
              state={{ menuFlag: false }}
              className="nav-link fs-5"
            >
              Home
            </Nav.Link>
            {sessionStorage.getItem("hasVisited") && (
              <Nav.Link
                as={Link}
                to="/"
                onClick={handleLinkClick}
                state={{ menuFlag: true }}
                className="nav-link fs-5"
              >
                Menu
              </Nav.Link>
            )}

            {localStorage.getItem("email") && (
              <Nav.Link
                as={Link}
                to="/myOrder"
                onClick={handleLinkClick}
                className="nav-link fs-5"
              >
                My Orders
              </Nav.Link>
            )}

            {localStorage.getItem("email") &&
              localStorage.getItem("email") !== "Guest" && (
                <Nav.Link
                  as={Link}
                  to="/history"
                  onClick={handleLinkClick}
                  className="nav-link fs-5"
                >
                  My Order History
                </Nav.Link>
              )}
          </Nav>

          {localStorage.getItem("email") && (
            <div className="d-flex">
              <div
                className="btn bg-warning text-dark d-flex"
                onClick={loadCart}
              >
                <div
                  className="me-2 text-dark"
                  style={{ fontWeight: "bold", textDecoration: "none" }}
                >
                  My Cart
                </div>
                <Badge
                  className="bg-success d-flex"
                  style={{ marginTop: "0.2rem" }}
                >
                  <BsCart2 className="mx-1" />
                  <div className="text-dark">{data.length}</div>
                </Badge>
              </div>
              {cartView && (
                <Modal onClose={() => setCartView(false)}>
                  <Cart
                    onClose={() => setCartView(false)}
                    orderConfirmation={() => setOrderSuccess(true)}
                    orderErrorFn={() => setOrderError(true)}
                  />
                </Modal>
              )}
              <Snackbar
                open={orderSuccess}
                autoHideDuration={6000}
                onClose={() => setOrderSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setOrderSuccess(false)}
                  severity="success"
                >
                  <p>
                    Your order is successfully noted. Hold on tight while we
                    prepare it for you.
                  </p>
                </Alert>
              </Snackbar>

              <Snackbar
                open={orderError}
                autoHideDuration={6000}
                onClose={() => setOrderError(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setOrderError(false)}
                  severity="error"
                >
                  <p>
                    Some Error occurred while noting your order. Please try
                    again. If problem persists, please contact your nearest
                    staff.
                  </p>
                </Alert>
              </Snackbar>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
