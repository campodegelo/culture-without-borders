import React from "react";
import { Link } from "react-router-dom";
import { useStatefulFields } from "../Hooks/useStatefulFields";
import { useAuthSumbit } from "../Hooks/useAuthSubmit";

export default function Login() {
  const [values, handleChange] = useStatefulFields();
  const [error, handleSubmit] = useAuthSumbit("/login", values);

  return (
    <div className="regular-form">
      <h1>Login</h1>
      {error && <div className="error">Ops! An error happened. Try again!</div>}
      <input
        type="text"
        name="email"
        placeholder="email"
        onChange={e => handleChange(e)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={e => handleChange(e)}
      />
      <button onClick={() => handleSubmit()}>login</button>
      {/* <Link to="/reset/start">
        Forgot your password? <br></br>Click here to reset it.
      </Link>
      <br></br> */}
      <Link to="/register">Not registered yet? Sign up now</Link>
    </div>
  );
}
