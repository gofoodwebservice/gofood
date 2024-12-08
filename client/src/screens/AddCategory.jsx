import { useState, React, useEffect } from 'react';

const AddCategory = ({ onCategorySubmit, initialCategory }) => {
    const [desp, setDesp] = useState({ name: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDesp((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };

    useEffect(() => {
        setDesp({ name: initialCategory });
    }, [initialCategory]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onCategorySubmit(desp.name); // Pass the description to the parent component
    };

    return (
      <div>
        <form className="w-90 m-auto mt-2 mb-3" method="POST" style={{backgroundColor: "#0F172B"}}>
          <div className="m-3">
            <label htmlFor="exampleInputEmail1" className="form-label text-white text-center">
              Add the Category:
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={desp.name}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="m-3 btn btn-warning text-center fw-2"
            style={{color: "#0F172B"}}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    );
};

export default AddCategory;
