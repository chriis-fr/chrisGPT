import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../contexts/UserAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/home");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="p-4 box border-2 border-red-900 gap-4 flex flex-col items-center bg-transparent rounded-xl w-screen align-center">
        <h2 className="mb-3 text-3xl text-blue-900 font-bold">Login to ChrisGPT</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="border-none bg-indigo-900 rounded-lg p-8">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="border rounded-lg italic pl-2"
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              className="border rounded-lg italic pl-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="flex d-grid font-bold gap-2 m-2 p-2 text-center m-4 border-orange rounded-2xl hover:bg-gray-500">
            <Button variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
        <hr />
        <div>
          <GoogleButton
            className="g-btn"
            type="dark"
            onClick={handleGoogleSignIn}
          />
        </div>
        </div>
      </div>
      <div className="box flex mt-3 font-bold italic w-screen text-blue-900  justify-center">
        Don't have an account? <span className="text-orange-500 underline"> <Link to="/signup"> &nbsp;Sign Up</Link> </span>
      </div>
      <div className="bg-transparent w-screen rounded-lg mt-2 flex">
        <div className="text-teal-900">
          <div className="text-6xl ml-4 pb-12 font-extrabold tracking-wider font-serif mt-2 ">ChrisGPT</div>
          <div className="italic mt-10 ml-4 text-lg">Get instant answers, find creative inspiration, learn something new. Powered by Gemini.</div>
        </div>
        
      </div>
    </>
  );
};

export default Login;