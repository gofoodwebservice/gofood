import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoaderModal from "../LoaderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email submission, 2: OTP form, 3: Reset Password
  const [emailOtp, setEmailOtp] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [resetPasswordLoader, setResetPasswordLoader] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoader(true);
    const data = { email, password };

    axios
      .post("http://localhost:8000/api/loginadmin", data)
      .then((res) => {
        console.log("Login successful:", res.data);
        localStorage.setItem("admin", email);
        setShowModal(false);
        setError("");
        setSuccess(true);
      })
      .catch((error) => {
        if (error.response) {
          setError(
            error.response.status === 500
              ? "Server error. Please try again later."
              : "Invalid credentials. Please check your email and password."
          );
        } else if (error.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An error occurred. Please try again.");
        }
      })
      .finally(() => setLoader(false));
  };

  // Handle Forgot Password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setOtpLoader(true);
    let timeoutId; // Declare timeoutId to store the timeout identifier

    const timeout = () => {
      timeoutId = setTimeout(() => {
        setResendOtp(true);
      }, 10000);
    };

    // To clear the timeout, call clearTimeout(timeoutId)
    clearTimeout(timeoutId); // This should be called after you want to cancel the timeout

    axios
      .post("http://localhost:8000/api/request-otp", { email })
      .then((res) => {
        setError("");
        setEmailOtp(res.data.otp); // Store OTP for verification
        setStep(2); // Move to OTP form
        setOtpSentSuccess(true);
        timeout();
      })
      .catch(() => setError("Failed to send OTP. Please try again."))
      .finally(() => setOtpLoader(false));
  };

  const handleResendPassword = () => {
    // e.preventDefault();
    setOtpLoader(true);
    let timeoutId; // Declare timeoutId to store the timeout identifier

    const timeout = () => {
      timeoutId = setTimeout(() => {
        setResendOtp(true);
      }, 10000);
    };

    // To clear the timeout, call clearTimeout(timeoutId)
    clearTimeout(timeoutId); // This should be called after you want to cancel the timeout

    axios
      .post("http://localhost:8000/api/request-otp", { email })
      .then((res) => {
        setError("");
        setEmailOtp(res.data.otp); // Store OTP for verification
        setStep(2); // Move to OTP form
        setOtpSentSuccess(true);
        timeout();
      })
      .catch(() => setError("Failed to send OTP. Please try again."))
      .finally(() => setOtpLoader(false));
  };

  // Handle OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp == emailOtp) {
      setError("");
      setOtpSuccess(true);
      setStep(3); // Move to Reset Password form
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Handle Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:8000/api/reset-password", {
        email,
        newPassword,
      })
      .then(() => {
        setError("");
        setSuccess(true);
        setForgotPassword(false); // Close Forgot Password flow
        setStep(1); // Reset to Login form
        setOtpSuccess(false);
        setResetPasswordSuccess(true);
      })
      .catch(() => setError("Failed to reset password. Please try again."));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div>
      <Modal
        show={showModal}
        backdrop="static"
        onHide={() => setError("Login to access this page")}
        centered
      >
        <Modal.Header style={{ backgroundColor: "#0F172B" }} closeButton>
          <Modal.Title className="text-warning fw-bold">
            {forgotPassword ? "Forgot Password" : "Login"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#0F172B",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
          className="text-warning"
        >
          {forgotPassword ? (
            <>
              {step === 1 && (
                <Form onSubmit={handleForgotPassword}>
                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 text-warning"
                    style={{ backgroundColor: "#0F172B" }}
                    size="lg"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="link"
                    className="mt-3 text-warning"
                    style={{ textDecoration: "none" }}
                    onClick={() => setForgotPassword(false)}
                  >
                    Back
                  </Button>
                </Form>
              )}
              {step === 2 && (
                <Form onSubmit={handleVerifyOtp}>
                  <Form.Group controlId="otp" className="mb-4">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 text-warning"
                    style={{ backgroundColor: "#0F172B" }}
                    size="lg"
                  >
                    Verify OTP
                  </Button>
                  <Button
                    className="w-100 text-warning mt-4"
                    style={{ backgroundColor: "#0F172B" }}
                    disabled={!resendOtp}
                    onClick={() => handleResendPassword()}
                    size="lg"
                  >
                    Resend OTP
                  </Button>
                  <Button
                    variant="link"
                    className="mt-3 text-warning"
                    style={{ textDecoration: "none" }}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </Form>
              )}
              {step === 3 && (
                <Form onSubmit={handleResetPassword}>
                  <Form.Group controlId="newPassword" className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <div className="input-group-append">
                      <Button
                        variant="link"
                        className="text-warning"
                        onClick={toggleNewPasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                        />
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="input-group-append">
                      <Button
                        variant="link"
                        className="text-warning"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </Button>
                    </div>
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 text-warning"
                    style={{ backgroundColor: "#0F172B" }}
                    size="lg"
                  >
                    Reset Password
                  </Button>
                </Form>
              )}
            </>
          ) : (
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="email" className="mb-4">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <Button
                    variant="link"
                    className="text-warning"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </Button>
                </div>
              </Form.Group>
              <div className="d-flex justify-content-between mb-4">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me"
                  className="text-warning"
                />
                <button
                  type="button"
                  className="btn btn-link text-warning p-0"
                  style={{ textDecoration: "none" }}
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                className="w-100 text-warning"
                style={{ backgroundColor: "#0F172B" }}
                size="lg"
              >
                Login
              </Button>
            </Form>
          )}
          {error && (
            <p className="text-center text-danger fw-bold mt-3">{error}</p>
          )}
        </Modal.Body>
      </Modal>
      {loader && (
        <LoaderModal>
          <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
              height: "60vh",
              width: "30vw",
              backgroundColor: "#0F172B",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px",
              padding: "20px",
              flexDirection: "column",
            }}
          >
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#E4A11B"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="d-flex justify-content-center align-items-center mt-3">
              <p className="text-warning fw-bold">Checking...</p>
            </div>
          </div>
        </LoaderModal>
      )}

      {otpLoader && (
        <LoaderModal>
          <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
              height: "60vh",
              width: "30vw",
              backgroundColor: "#0F172B",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px",
              padding: "20px",
              flexDirection: "column",
            }}
          >
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#E4A11B"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="d-flex justify-content-center align-items-center mt-3">
              <p className="text-warning fw-bold">Sending the OTP...</p>
            </div>
          </div>
        </LoaderModal>
      )}

      {resetPasswordLoader && (
        <LoaderModal>
          <div
            className="d-flex vh-100 justify-content-center align-items-center"
            style={{
              height: "60vh",
              width: "30vw",
              backgroundColor: "#0F172B",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "8px",
              padding: "20px",
              flexDirection: "column",
            }}
          >
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#E4A11B"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="d-flex justify-content-center align-items-center mt-3">
              <p className="text-warning fw-bold">Updating your Password...</p>
            </div>
          </div>
        </LoaderModal>
      )}

      <Snackbar
        open={otpSuccess}
        autoHideDuration={6000}
        onClose={() => setOtpSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOtpSuccess(false)} severity="success">
          OTP Verified Successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={resetPasswordSuccess}
        autoHideDuration={6000}
        onClose={() => setResetPasswordSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setResetPasswordSuccess(false)}
          severity="success"
        >
          Password changed Successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={otpSentSuccess}
        autoHideDuration={6000}
        onClose={() => setOtpSentSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOtpSentSuccess(false)} severity="success">
          OTP sent to your mail id successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
