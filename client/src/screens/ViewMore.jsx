import React from 'react'

const ViewMore = ({initialDescription}) => {
  console.log(initialDescription);

  return (
    <div className="w-80 m-auto mt-2 text-warning" style={{backgroundColor: "#0F172B"}}>
  <div className="m-3">
    
    <div className="text-warning fw-bold">
     {
      initialDescription === "" ? <p className='text-center'>No description given</p> :

      <p className=''>{initialDescription}</p>
     } 
    </div>
  </div>
  {/* <button
            type="submit"
            className="m-3 btn btn-success text-center text-dark fw-2"
            onClick={handleEdit}
          >
            Edit
          </button>
           */}

</div>

  )
}

export default ViewMore
