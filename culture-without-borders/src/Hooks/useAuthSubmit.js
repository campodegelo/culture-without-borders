import { useState } from "react";
import axios from "../axios";

export function useAuthSumbit(url, values) {
  const [error, setError] = useState();

  const handleSubmit = () => {
    axios
      .post(url, values)
      .then(({ data }) => {
        if (!data.success) {
          setError(true);
        } else {
          window.location.replace("/");
        }
      })
      .catch(err => {
        console.log("error in submit: ", err);
        setError(true);
      });
  };

  return [error, handleSubmit];
}
