import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Card from "./AdminCard";
import axios from "axios";
import { Oval, ThreeCircles } from "react-loader-spinner";
import HeroHeader from "../screens/HeroHeader";
import "../screens/Home.css";
import { Dropdown } from "semantic-ui-react";
import AdminLogin from './AdminLogin'


export default function ListItems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [search, setSearch] = useState("Full Menu");
  const [menuFlag, setMenuFlag] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadFoodItems = async () => {
    // try {
    //   let response = await fetch("http://localhost:8000/api/foodData", {
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
      let response = await fetch("http://localhost:8000/api/menulist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      console.log(response.orderData);
      setFoodItem(response.orderData);
      //   setFoodCat(response[1]);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
      setFoodCat(data); // Assume the response is an array of category objects
    } catch (error) {
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

  useEffect(() => {
    console.log(localStorage.getItem("admin"));
    if (localStorage.getItem("admin") === null) {
      setAdminLogin(true);
    }
    loadFoodItems();
    loadCategories();
  }, []);

  useEffect(() => {
    if (menuFlag) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [menuFlag]);

  return (
    <div className="bg-dark">
      <div
        className="nav-hero"
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div className="" style={{ zIndex: "9", flex: "1" }}>
          <Dropdown
            className="custom-dropdown text-warning dropdown-menu"
            placeholder={search}
            fluid
            // downward
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
        <div>
          <div className="container">
            {foodCat.length > 0 ? (
              foodCat
                .filter((category) => {
                  // Show all categories if "All" is selected, or filter based on the selected category
                  return (
                    search === "Full Menu" || category.CategoryName === search
                  );
                })
                .map((data) => (
                  <div className="row mb-1" key={data._id}>
                    <div className="fs-3 m-3 text-white">
                      {data.CategoryName}
                    </div>
                    <hr
                      id="hr-success"
                      style={{
                        height: "4px",
                        backgroundImage:
                          "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))",
                      }}
                    />
                    {foodItem.length > 0 ? (
                      foodItem
                        .filter((items) => {
                          if (search === "Full Menu") {
                            return items.CategoryName === data.CategoryName;
                          } else {
                            return (
                              items.CategoryName === data.CategoryName &&
                              items.CategoryName.toLowerCase().includes(
                                search.toLowerCase()
                              )
                            );
                          }
                        })
                        .map((filterItems) => (
                          <div
                            key={filterItems._id}
                            className="col-12 col-md-6 col-lg-4 mb-5 text-center"
                          >
                            <Card
                              foodName={filterItems.name}
                              item={filterItems}
                              //   options={filterItems.options[0]}
                              ImgSrc={filterItems.img}
                              price={filterItems.price}
                              CategoryName={data.CategoryName}
                              description={filterItems.description}
                              id={filterItems._id}
                              loadFoodItems={loadFoodItems}
                              isStockAvailable={filterItems.isStockAvailable}
                            />
                          </div>
                        ))
                    ) : (
                      <div className="text-white"> No Such Data </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                <div className="mt-5">
                  <ThreeCircles
                    visible={true}
                    height="100"
                    width="100"
                    color="#E4A11B"
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
                <div className="mt-3 text-center text-warning fw-bold mb-3">
                  Please hold on. Loading your menu...
                </div>
              </div>
            )}
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ marginTop: "20px", gap: "10px" }}
            >
              <Link
                to="/admin"
                className="btn w-25 justify-content-center"
                style={{
                  fontWeight: "bold",
                  border: "1px solid black",
                  borderRadius: "6px",
                  backgroundColor: "#E4A11B",
                  color: "#0F172B",
                }}
              >
                Add an Item
              </Link>

              <Link
                to="/adminorder"
                className="btn w-25 justify-content-center"
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
      {adminLogin && <AdminLogin />}
    </div>
  );
}
