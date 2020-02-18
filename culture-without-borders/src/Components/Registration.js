import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStatefulFields } from "../Hooks/useStatefulFields";
import { useAuthSumbit } from "../Hooks/useAuthSubmit";
import countries from "../iso3.json";

export default function Registration() {
  const [values, handleChange] = useStatefulFields();
  const [error, handleSubmit] = useAuthSumbit("/register", values);
  // const [countryCode, setCountryCode] = useState("AFG");
  // values.countryCode = "AFG";
  console.log(values);
  return (
    <div className="regular-form">
      <h1>Sign Up</h1>
      {error && <div className="error">Ops! An error happened. Try again!</div>}
      <input
        type="text"
        name="first"
        placeholder="first name"
        autoComplete="off"
        onChange={e => handleChange(e)}
      />
      <input
        type="text"
        name="last"
        placeholder="last name"
        autoComplete="off"
        onChange={e => handleChange(e)}
      />
      <select
        value={values.countryCode}
        name="countryCode"
        onChange={e => {
          // setCountryCode(e.target.value);
          handleChange(e);
        }}
      >
        <option key="choose" name="countryCode"></option>
        {countries.map(country => (
          <option
            key={country.name}
            name="countryCode"
            value={country["alpha-3"]}
          >
            {country.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="email"
        placeholder="email address"
        autoComplete="off"
        onChange={e => handleChange(e)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        autoComplete="off"
        onChange={e => handleChange(e)}
      />
      <input
        type="password"
        name="confirm"
        placeholder="confirm the password"
        autoComplete="off"
        onChange={e => handleChange(e)}
      />
      <button onClick={() => handleSubmit()}>register</button>
      <Link to="/login" id="login">
        Already signed up?<br></br> Click here to Log In
      </Link>
    </div>
  );
}
