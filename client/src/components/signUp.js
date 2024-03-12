import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../contexts/UserAuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 box border gap-4 flex flex-col items-center bg-gray-400 rounded-xl w-screen align-center">
        <h2 className="mb-3 text-3xl text-blue-900 font-bold">Let's Sign You Up!</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="border-none bg-indigo-900 rounded-lg">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="m-4 " controlId="formBasicEmail">
            <Form.Control
              className="border rounded-lg italic pl-2"
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="m-4" controlId="formBasicPassword">
            <Form.Control
              className="border rounded-lg italic pl-2 "
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          

          <div className="flex d-grid font-bold text-xl gap-2 p-2 text-center m-4 border-orange rounded-2xl hover:bg-gray-500">
            <Button variant="primary" type="Submit" className="flex italic">
              Sign Up...
            </Button>
          </div>
        </Form>
      </div>
      </div>
      <div className=" box flex mt-3 font-bold italic w-screen text-blue-900  justify-center">
        Already have an account? <span className="text-orange-500 underline"> <Link to="/"> &nbsp;Log In</Link> </span>
      </div>
      <div>
        additional Interface features to be added here
      </div>
    </>
  );
};

export default Signup;