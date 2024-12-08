import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function MyOrder() {
    const navigate = useNavigate();
    const [orderData, setorderData] = useState({})

    const fetchMyOrder = async () => {
        console.log(localStorage.getItem('email'))
        try{

            await fetch("http://localhost:8000/api/myOrderDatahistory", {
                // credentials: 'include',
                // Origin:"http://localhost:3000/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email')
                })
            }).then(async (res) => {
                let response = await res.json()
                console.log(response)
                console.log(response.order_data)
               setorderData(response)
            })
        }
        catch(e){
            console.log(e);
        }



    }
    
    const orderNow = () => {
        navigate("/");
    }

    useEffect(() => {
        fetchMyOrder();
        console.log(orderData)
    }, []);

    return (
        <div className="nav-hero app-container">
        <div className=''>
          <Navbar />
        </div>
      
        <div className="container-fluid">
          <div className="row">
            {orderData && orderData.orderData && orderData.orderData.order_data.length > 0 ? (
              orderData.orderData.order_data
                .slice(0)
                .reverse()
                .map((orders, index) => (
                    <div key={index} className="col-12">
                        {console.log(orders)}
                    {orders[0]?.Order_date && (
                      <div className="m-auto mt-4 text-warning" style={{backgroundColor:"#0F172B"}}>
                        <h5 className="text-center py-2">{orders[0].Order_date}</h5>
                        <hr />
                      </div>
                    )}
                    <div className="row d-flex justify-content-center flex-wrap">
  {orders.slice(1).map((item, itemIndex) => (
    <div
      key={`${index}-${itemIndex}`}
      className="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
    >
      <div
        className="card mt-3 text-warning"
        style={{ width: "16rem", maxHeight: "360px", backgroundColor: "#0F172B" }}
      >
        <img
          src={item.img}
          className="card-img-top"
          alt={item.name || "Product Image"}
          style={{ height: "120px", objectFit: "fill" }}
        />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <div
            className="container w-100 p-0"
            style={{ height: "38px" }}
          >
            <span className="m-1">Qty: {item.qty}</span>
            <span className="m-1">Price: {item.size}</span>
            <div className="d-inline ms-2 h-100 w-20 fs-5">
              ₹{item.price}/-
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

                  </div>
                ))
            ) : (
              <div className="mt-5 mb-5 text-center fs-3 text-white">
                <h1>Nothing ordered yet.</h1>
                <button
                  className="btn bg-success mt-5 mx-1 fs-5"
                  onClick={orderNow}
                >
                  Order Now
                </button>
              </div>
            )}
          </div>
        </div>
      
        <div>
          <Footer className="mt-5" />
        </div>
      </div>
      
    )
}