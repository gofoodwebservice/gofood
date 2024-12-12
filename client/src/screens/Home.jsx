import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { ThreeCircles, Radio } from "react-loader-spinner";
import HeroHeader from "./HeroHeader";
import "./Home.css";
import AboutUs from "./AboutUs";
import { Dropdown } from "semantic-ui-react";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Home() {
  // const { id } = useParams();
  // const navigate = useNavigate();
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("Full Menu");
  const [menuFlag, setMenuFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCategoryError, setIsCategoryError] = useState(false);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState([]); // Track expanded category
  const location = useLocation();
  const categoryRefs = useRef({}); // To store refs for each category

  // const {  } = location.state || {};

  const loadFoodItems = async () => {
    setIsLoading(true);
    setIsError(false);
    // try {
    //   let response = await fetch("https://gofood-server-zeta.vercel.app/api/foodData", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   response = await response.json();
    //   setFoodItem(response[0]);
    //   setFoodCat(response[1]);
    // } catch (error) {
    //   console.error("Error loading food items:", error);
    // }

    try {
      let response = await fetch(
        "https://gofood-server-zeta.vercel.app/api/menulist",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        response = await response.json();
        setFoodItem(response.orderData);
        console.log(response.orderData);
      } else if (response.status === 400 || response.status === 404) {
        setIsLoading(false);
        setIsError(true);
        loadFoodItems();
      }
      //   setFoodCat(response[1]);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const loadCategories = async () => {
    setIsLoading(true);
    setIsCategoryError(false);
    try {
      const response = await fetch(
        "https://gofood-server-zeta.vercel.app/api/categories",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      data.sort((a, b) => a.Sequence - b.Sequence);

      if (response.status === 200) {
        setIsLoading(false);
      } else if (response.status === 400 || response.status === 404) {
        setIsLoading(false);
        setIsCategoryError(true);
        loadCategories();
      }
      console.log(data);
      setFoodCat(data); // Assume the response is an array of category objects
    } catch (error) {
      setIsError(true);
      console.error("Error loading categories:", error);
    }
  };

  const categoryOptions = [
    { key: "Full Menu", text: "Full Menu", value: "Full Menu" },
    ...foodCat.map((category) => ({
      key: category._id,
      text: category.CategoryName,
      value: category.CategoryName,
    })),
  ];

  // const handleClose = () => {
  //   setShow(false);
  //   localStorage.setItem("email", "Guest");
  // }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    // Logic to handle email submission goes here
    localStorage.setItem("email", email);
    setError("");
    setShow(false);
  };

  function generateRandomString(length) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  const handleAsGuest = () => {
    const random = "Guest" + generateRandomString(10);
    localStorage.setItem("email", random);
    console.log(random);
    setError("");
    setShow(false);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName) // Collapse if already expanded
        : [...prev, categoryName] // Expand if not already expanded
    );
    if (categoryRefs.current[categoryName]) {
      setTimeout(() => {
        categoryRefs.current[categoryName].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Delay to ensure the DOM updates
    }
  };

  useEffect(() => {
    console.log(menuFlag, location);
    loadFoodItems();
    loadCategories();
    if (!localStorage.getItem("email")) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 5000);
      console.log(timer);
    }
    console.log(localStorage.getItem("table"));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuFlag(location.state?.menuFlag || false);
  }, [location.state]);

  useEffect(() => {
    if (menuFlag) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [menuFlag]);

  return (
    <div className="bg-dark" style={{ overflow: "hidden" }}>
      <div className="nav-hero">
        <div>
          <Navbar />
        </div>
        {!menuFlag ? (
          <div>
            <HeroHeader menuFlag={menuFlag} setMenuFlag={setMenuFlag} />
            <AboutUs menuFlag={menuFlag} setMenuFlag={setMenuFlag} />
          </div>
        ) : (
          <div>
            {/* Carousel Section */}
            <div>
              <div>
                <div
                  id="carouselExampleFade"
                  className="carousel slide carousel-fade"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner" id="carousel">
                    <div className="carousel-caption" style={{ zIndex: "9" }}>
                      <div className="d-flex justify-content-center">
                        <Dropdown
                          className=" custom-dropdown text-warning dropdown-menu"
                          placeholder={search}
                          fluid
                          upward
                          search
                          selection
                          options={categoryOptions}
                          onChange={(e, { value }) => setSearch(value)}
                          style={{
                            zIndex: "1050",
                            position: "relative",
                            backgroundColor: "#0F172B",
                            color: "#E4A11B",
                          }}
                        />
                      </div>
                    </div>
                    <div className="carousel-item active">
                      <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="d-block w-100"
                        style={{
                          objectFit: "cover",
                          filter: "brightness(30%)",
                        }}
                        alt="1"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1899&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D"
                        className="d-block w-100"
                        style={{
                          objectFit: "cover",
                          filter: "brightness(30%)",
                        }}
                        alt="2"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src="https://images.unsplash.com/photo-1575496118038-3689d62e5235?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="d-block w-100"
                        style={{
                          objectFit: "cover",
                          filter: "brightness(30%)",
                        }}
                        alt="3"
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleFade"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleFade"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div className="container">
              {foodCat.length > 0 ? (
                foodCat.map((data) => (
                  <div className="row mb-1" key={data._id} ref={(el) => (categoryRefs.current[data.CategoryName] = el)}>
                    {/* Category Header */}
                    <div
                      className="fs-3 m-3 text-white d-flex justify-content-between align-items-center"
                      onClick={() => toggleCategory(data.CategoryName)}
                      style={{ cursor: "pointer" }}
                    >
                      {data.CategoryName}
                      {expandedCategories.includes(data.CategoryName) ? (
                        <FaChevronUp className="me-4" />
                      ) : (
                        <FaChevronDown className="me-4" />
                      )}
                    </div>
                    <hr
                      id="hr-success"
                      style={{
                        height: "4px",
                        backgroundImage:
                          "-webkit-linear-gradient(left, rgb(0, 255, 137), rgb(0, 0, 0))",
                      }}
                    />
                    {/* Show items only if the category is expanded */}
                    <div
                      className={`menu-items ${
                        expandedCategories.includes(data.CategoryName) ? "open" : ""
                      }`}
                      data-category={data.CategoryName}
                    >
                      <div className="row">
                        {foodItem
                          .filter((items) => items.CategoryName === data.CategoryName)
                          .map((filterItems) => (
                            <div
                              key={filterItems._id}
                              className="col-sm-12 col-md-6 col-lg-4 mb-5 mt-5 text-center"
                            >
                              <Card
                                foodName={filterItems.name}
                                item={filterItems}
                                ImgSrc={filterItems.img}
                                price={filterItems.price}
                                CategoryName={data.CategoryName}
                                description={filterItems.description}
                                id={filterItems._id}
                                isStockAvailable={filterItems.isStockAvailable}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))
                
              ) : isLoading ? (
                <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                  <div className="mt-5">
                    <ThreeCircles
                      visible={true}
                      height="100"
                      width="100"
                      color="#E4A11B"
                      ariaLabel="three-circles-loading"
                    />
                  </div>
                  <div className="mt-3 text-center text-warning fw-bold mb-3">
                    Please hold on. Loading your menu...
                  </div>
                </div>
              ) : !isError ? (
                <div className="text-warning fw-bold text-center mt-5 m-auto">
                  Could not load the Menu. Please refresh...
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                  <div className="mt-5">
                    <Radio
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="radio-loading"
                      color="#E4A11B"
                    />
                  </div>
                  <div className="mt-3 text-center text-warning">
                    Lost the connection with the server. Trying to reconnect. If
                    it is taking longer than usual, please refresh. If the
                    problem persists, call our staff.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <Modal
        show={show}
        backdrop="static"
        onHide={() => setError("Please select an option to proceed.")}
        scrollable
      >
        <Modal.Header style={{ backgroundColor: "#0F172B" }} closeButton>
          <Modal.Title className="text-warning fw-bold">
            Enter mail address to Receive Receipt
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#0F172B",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
          className="text-warning"
        >
          Please provide your email address to have the receipt delivered
          straight to your inbox.
          <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="mt-3 text-warning"
              style={{ backgroundColor: "#0F172B" }}
            >
              Submit
            </Button>
          </Form>
          <h5 className="text-center text-warning fw-bold">OR</h5>
          <hr />
          <h6 className="text-center mt-3">
            I don&apos;t want order receipt in my inbox.
          </h6>
          <Button
            className="mt-3 text-warning d-block mx-auto mt-2"
            style={{ backgroundColor: "#0F172B" }}
            onClick={handleAsGuest}
          >
            Continue as Guest
          </Button>
          {error && (
            <p className="text-center text-danger fw-bold mt-3">{error}</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
