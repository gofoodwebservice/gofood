import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EmailModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000); // Show modal after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const handleClose = () => setShow(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle email submission goes here
    alert("Thank you for subscribing!");
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header  style={{backgroundColor: "#0F172B"}} closeButton>
          <Modal.Title className="text-warning">Stay Updated!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: "#0F172B"}} className="text-warning">
          <p>Subscribe to our newsletter and never miss an update.</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3 text-warning" style={{backgroundColor: "#0F172B"}}>
              Subscribe
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmailModal;
