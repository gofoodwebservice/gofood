import React from 'react';
import { Link } from 'react-router-dom'
import img1 from '../img/about-1.jpg'
import img2 from '../img/about-2.jpg'
import img3 from '../img/about-3.jpg'
import img4 from '../img/about-4.jpg'
import './style.css'

const AboutUsSection = ({menuFlag, setMenuFlag}) => {



    const handleGoToMenu = () => {
        setMenuFlag(true);
        sessionStorage.setItem("hasVisited", true);
    }

  return (
    <div className="container-xxl py-5 text-dark" style={{backgroundColor:"#F1F8FF"}}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6 text-start">
                <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={img1} alt="About Us 1" />
              </div>
              <div className="col-6 text-start">
                <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={img2} style={{ marginTop: '25%' }} alt="About Us 2" />
              </div>
              <div className="col-6 text-end">
                <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={img3} alt="About Us 3" />
              </div>
              <div className="col-6 text-end">
                <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={img4} alt="About Us 4" />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
            <h1 className="mb-4 fw-bold">
              Welcome to <i className="fa fa-utensils text-primary"></i><span style={{color: " #FEA116"}}>
                GoFood
                </span>
            </h1>
            <p className="mb-4">
            At GoFood, we believe that great food brings people together. Our mission is to deliver exceptional dining experiences by offering a diverse menu crafted with fresh, high-quality ingredients.
            </p>
            <p className="mb-4">
            We are exclusively dedicated to creating a warm and welcoming atmosphere for our dine-in guests. Whether it’s a casual outing or a special occasion, our restaurant is the perfect place to enjoy delicious meals and create lasting memories.            </p>
            <div className="row g-4 mb-4 fw-bold">
              <div className="col-sm-6">
                <div className="d-flex align-items-center border-start border-warning px-3 borderWidth">
                  <h1 className="flex-shrink-0 display-5 text-warning mb-0 fw-bold">15</h1>
                  <div className="ps-4">
                    <p className="mb-0">Years of</p>
                    <h6 className="text-uppercase mb-0">Experience</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center border-start border-5 border-warning px-3 borderWidth">
                  <h1 className="flex-shrink-0 display-5 text-warning mb-0 fw-bold ">50</h1>
                  <div className="ps-4">
                    <p className="mb-0">Popular</p>
                    <h6 className="text-uppercase mb-0">Master Chefs</h6>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-primary bg-warning py-3 px-5 mt-2" onClick={handleGoToMenu}>
              Go to menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
