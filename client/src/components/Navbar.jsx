import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { BsCart2 } from "react-icons/bs";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";
import "./Navbar.css"; // Assuming this is where the CSS is located
import logo from "../img/image.png";
import { NavLink } from "react-router-dom";

export default function NavbarComponent() {
  const navigate = useNavigate();
  const [cartView, setCartView] = useState(false);
  const data = useCart();

  const handleLogout = () => {
    navigate("/login");
    sessionStorage.removeItem("userEmail");
  };

  const loadCart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartView(true);
  };

  const userName = sessionStorage.getItem("userName");

  // Handle scroll event to toggle "scrolled" class
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar-dark");
      const collapsed = document.querySelector(".collapsed");
      if (window.scrollY > 30) {
        // Adjust scrollY value if needed
        navbar.classList.add("scrolled");
        collapsed.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
        collapsed.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      className="sticky-top navbar-dark"
    >
      <Container className="collapsed">
        <Navbar.Brand as={Link} to="/" className="fs-1 fst-italic">
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
              state={{ menuFlag: false }}
              className="nav-link fs-5"
            >
              Home
            </Nav.Link>
            {sessionStorage.getItem("hasVisited") && (
              <Nav.Link
                as={Link}
                to="/"
                state={{ menuFlag: true }}
                className="nav-link fs-5"
              >
                Menu
              </Nav.Link>
            )}

            {localStorage.getItem("email") && (
              <Nav.Link as={Link} to="/myOrder" className="nav-link fs-5">
                My Orders
              </Nav.Link>
            )}

            {localStorage.getItem("email") &&
              localStorage.getItem("email") !== "Guest" && (
                <Nav.Link as={Link} to="/history" className="nav-link fs-5">
                  My Order History
                </Nav.Link>
              )}
          </Nav>

          {localStorage.getItem("email") && (
            // <div>
            //   <Link className="btn bg-white text-success mx-1" style={{fontWeight:"bold"}} to="/login">Login</Link>
            //   <Link className="btn bg-white text-success mx-1" style={{fontWeight:"bold"}} to="/createuser">Signup</Link>
            // </div>

            <div className="d-flex">
              <div
                className="btn bg-warning text-dark d-flex"
                onClick={loadCart}
              >
                <div className="me-2" style={{ fontWeight: "bold" }}>
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
                  <Cart />
                </Modal>
              )}
              {/* <div className="btn bg-white text-danger mx-2" style={{fontWeight:"bold"}} onClick={handleLogout}>Logout</div> */}
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
