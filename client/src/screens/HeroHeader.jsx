import React from 'react';
import heroImage from '../img/hero.png'; // Adjust the import path based on your project structure
import './HeroHeader.css'

const HeroHeader = ({menuFlag, setMenuFlag}) => {

  const handleGoToMenu = () => {
    setMenuFlag(true);
    sessionStorage.setItem("hasVisited", true);
}
  return (
    <div className="container-xxl py-5 hero-header">
      <div className="container my-5 py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-3 text-white animated slideInLeft">
              Enjoy Your
              <br />
              Delicious Meal
            </h1>
            <p className="text-white animated slideInLeft mb-4 pb-2">
            Indulge in the finest flavors and savor every bite! We bring you a delightful dining experience with dishes crafted to perfection. Whether you’re here for a quick snack or a hearty feast, our menu is designed to satisfy every craving.

Come, sit back, and relish a memorable meal with us!            </p>
            <button className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft bg-warning" onClick={handleGoToMenu}>
              Go to menu
            </button>
          </div>
          <div className="col-lg-6 text-center text-lg-end overflow-hidden">
            <img className="img-fluid" src={heroImage} alt="Delicious Meal" style={{animation: "imgRotate 50s linear infinite"}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
