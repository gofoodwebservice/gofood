import { useState, React, useEffect } from "react";

const AddCategory = ({ onCategorySubmit, initialCategory, initialSequence }) => {
  const [desp, setDesp] = useState({ name: "", sequence: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    setDesp({ name: initialCategory, sequence: initialSequence });
  }, [initialCategory, initialSequence]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCategorySubmit(desp); // Pass the entire object to the parent component
  };

  return (
    <div>
      <form className="w-90 m-auto mt-2 mb-3" method="POST" style={{ backgroundColor: "#0F172B" }}>
        <div className="m-3">
          <label htmlFor="categoryName" className="form-label text-white text-center">
            Add the Category:
          </label>
          <input
            type="text"
            id="categoryName"
            className="form-control"
            name="name"
            value={desp.name}
            onChange={handleChange}
          />
        </div>
        <div className="m-3">
          <label htmlFor="categorySequence" className="form-label text-white text-center">
            Enter Sequence:
          </label>
          <input
            type="number"
            id="categorySequence"
            className="form-control"
            name="sequence"
            value={desp.sequence}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="m-3 btn btn-warning text-center fw-2"
          style={{ color: "#0F172B" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
