import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import {
  Instagram,
  Twitter,
  Facebook,
  YouTube,
  LinkedIn,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <div
      className="container-fluid text-light footer pt-5 wow fadeIn"
      data-wow-delay="0.1s"
      style={{ backgroundColor: "#0F172B", overflowY: "auto" }}
    >
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4" style={{fontSize: "2rem"}}>
              Company
            </h4>
            <div className="d-flex " style={{ fontSize: "1rem" }}>
              <ArrowForwardIosSharpIcon
                fontSize="inherit"
                style={{
                  fontSize: "0.75rem",
                  marginRight: "0.2rem",
                  marginTop: "0.4rem",
                }}
              />
              <Link
                className="btn btn-link p-0"
                to="/"
                state={{"menuFlag":false}}
                style={{ fontSize: "inherit", textDecoration: "none" }}
              >
                About Us
              </Link>
            </div>
{/* 
            <div className="d-flex " style={{ fontSize: "1rem" }}>
              <ArrowForwardIosSharpIcon
                fontSize="inherit"
                style={{
                  fontSize: "0.75rem",
                  marginRight: "0.2rem",
                  marginTop: "0.4rem",
                }}
              />
              <Link
                className="btn btn-link p-0"
                to="/about"
                style={{ fontSize: "inherit", textDecoration: "none" }}
              >
                Contact Us
              </Link>
            </div> */}

            <div className="d-flex " style={{ fontSize: "1rem" }}>
              <ArrowForwardIosSharpIcon
                fontSize="inherit"
                style={{
                  fontSize: "0.75rem",
                  marginRight: "0.2rem",
                  marginTop: "0.4rem",
                }}
              />
              <Link
                className="btn btn-link p-0"
                to="/"
                state={{"menuFlag": true}}
                style={{ fontSize: "inherit", textDecoration: "none" }}
              >
                Menu
              </Link>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4" style={{fontSize: "2rem"}}>
              Contact
            </h4>
            <div className="d-flex">
              <LocationOnIcon
                fontSize="medium"
                style={{ marginTop: "0.1rem" }}
              />
              <p className="mb-2 ms-2" style={{ fontWeight: "bold" }}>
                123 Street, New York, USA
              </p>
            </div>
            <div className="d-flex">
              <LocalPhoneIcon
                fontSize="medium"
                style={{ marginTop: "0.1rem" }}
              />
              <p className="mb-2 ms-2" style={{ fontWeight: "bold" }}>
                +012 345 67890
              </p>
            </div>
            <div className="d-flex">
              <EmailIcon fontSize="medium" style={{ marginTop: "0.1rem" }} />
              <p className="mb-2 ms-2" style={{ fontWeight: "bold" }}>
                info@example.com
              </p>
            </div>
            <div className="d-flex pt-2">
              <a
                className="btn btn-outline-light btn-social"
                href="https://instagram.com"
              >
                <Instagram />
              </a>
              <a
                className="btn btn-outline-light btn-social"
                href="https://twitter.com"
              >
                <Twitter />
              </a>
              <a
                className="btn btn-outline-light btn-social"
                href="https://facebook.com"
              >
                <Facebook />
              </a>
              <a
                className="btn btn-outline-light btn-social"
                href="https://youtube.com"
              >
                <YouTube />
              </a>
              <a
                className="btn btn-outline-light btn-social"
                href="https://linkedin.com"
              >
                <LinkedIn />
              </a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4" style={{fontSize: "2rem"}}>
              Opening
            </h4>
            <h6 className="text-light fw-bold" style={{ fontWeight: "bold" }}>
              Monday - Saturday
            </h6>
            <p style={{ fontWeight: "bold" }}>09AM - 09PM</p>
            <h5 className="text-light fw-bold" style={{ fontWeight: "bold" }}>
              Sunday
            </h5>
            <p style={{ fontWeight: "bold" }}>10AM - 08PM</p>
          </div>

          {/* <div className="col-lg-3 col-md-6">
            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Newsletter</h4>
            <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
              <input className="form-control border-primary w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
              <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
            </div>
          </div> */}
        </div>
      </div>

      <div className="container text-center">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy;{" "}
              <Link
                className="border-bottom"
                to="/"
                style={{ textDecoration: "none" }}
              >
                GoFood
              </Link>
              , All Rights Reserved.
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}
