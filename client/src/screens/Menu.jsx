import React from 'react'
import { useState } from 'react';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import {Oval} from 'react-loader-spinner'

const Menu = () => {
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [search, setSearch] = useState('')
    const [menuFlag, setMenuFlag] = useState(false);
  return (
    <div>
        <div><Navbar/></div>
                <div> 
                    <div id="carouselExampleFade" className="carousel slide carousel-fade " data-bs-ride="carousel">
    
                    <div className="carousel-inner " id='carousel'>
                        <div className=" carousel-caption  " style={{ zIndex: "9" }}>
                            <div className=" d-flex justify-content-center">  {/* justify-content-center, copy this <form> from navbar for search box */}
                                {/* <input className="form-control me-2 w-75 bg-white text-dark" type="search" placeholder="Search in here..." aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} /> */}
                                <select 
      className="form-select  text-white" 
      onChange={(e) => setSearch(e.target.value)}
      >
      <option value="">Select an option</option>
    
      <optgroup label="Category 1">
        <option value="Option 1.1">Option 1.1</option>
        <option value="Option 1.2">Option 1.2</option>
      </optgroup>
    
      <optgroup label="Category 2">
        <option value="Option 2.1">Option 2.1</option>
        <option value="Option 2.2">Option 2.2</option>
      </optgroup>
    
      <optgroup label="Category 3">
        <option value="Option 3.1">Option 3.1</option>
        <option value="Option 3.2">Option 3.2</option>
      </optgroup>
    </select>
    
                            </div>
                        </div>
                        <div className="carousel-item active" >
                            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100  " style={{ filter: "brightness(30%)" }} alt="1" />
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="2" />
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1575496118038-3689d62e5235?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="3" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div></div>
            <div className='container'>
            {
                foodCat.length > 0
                ? foodCat.map((data) => {
                    return (
                        // justify-content-center
                        <div className='row mb-3'>
                                  <div key={data._id}  className='fs-3 m-3 text-white'>
                                      {data.CategoryName}
                                  </div>
                                  <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                                  {foodItem.length > 0 ? foodItem.filter(
                                      (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase())))
                                      .map(filterItems => {
                                          return (
                                              <div key={filterItems._id} className='col-12 col-md-6 col-lg-4 text-center'>
                                                  <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img} price={filterItems.price} ></Card>
                                              </div>
                                          )
                                        }) : <div className='text-white'> No Such Data </div>}
                              </div>
                          )
                        })
                        :   <div className="d-flex flex-column justify-content-center align-items-center vh-50">
                  <div className="mt-5">
                    <Oval
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      />
                  </div>
                  <div className="mt-3 text-center">Please hold on. Loading your menu... {seconds} seconds </div>
                </div>}
          </div> 
          <div>
            <Footer/>
          </div>
          </div>
  )
}

export default Menu
