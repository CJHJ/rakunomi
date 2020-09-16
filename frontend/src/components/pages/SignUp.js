import React, { Component, useState } from "react";
import { useForm } from "react-hook-form";

import AuthService from "../../services/auth.service";
import history from "../../history";

import "./css/SignUp.css";

function SignUpForm() {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => handleSignup(data);

  const handleSignup = (data) => {
    setMessage("");

    AuthService.signup(
      data.username,
      data.email,
      data.password,
      data.rakutenId,
      data.zoomId
    ).then(
      (response) => {
        setMessage(response.msg);
        setSuccessful(true);

        history.push("/Home");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label for="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.username && "red" }}
        />
      </div>
      <div>
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.email && "red" }}
        />
      </div>
      <div>
        <label for="rakutenId">Rakuten ID</label>
        <input
          type="text"
          name="rakutenId"
          placeholder="Rakuten ID"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.rakutenId && "red" }}
        />
      </div>
      <div>
        <label for="zoomId">Zoom ID</label>
        <input
          type="text"
          name="zoomId"
          placeholder="Zoom ID"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.zoomId && "red" }}
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.password && "red" }}
        />
      </div>
      <div>
        <label for="confirmPassword">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          ref={register({
            required: true,
            minLength: 4,
            maxLength: 20,
          })}
          style={{ borderColor: errors.confirmPassword && "red" }}
        />
      </div>
      <input type="submit" disabled={formState.isSubmitting} />
      {message && (
        <div className="form-group">
          <div
            className={
              successful ? "alert alert-success" : "alert alert-danger"
            }
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </form>
  );
}

export default class SignUp extends Component {
  render() {
    return (
      <div className="main-subcontent">
        <h1>Sign Up</h1>
        <SignUpForm />
      </div>
    );
  }
}
