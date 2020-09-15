import React, { Component } from "react";
import { useForm } from "react-hook-form";

import "./css/SignUp.css";

function SignUpForm() {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });
  const onSubmit = (data) => console.log(data);

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
