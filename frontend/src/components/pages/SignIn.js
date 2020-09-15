import React, { Component } from "react";
import { useForm } from "react-hook-form";

import "./css/SignIn.css";

function SignInForm() {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });
  const onSubmit = (data) => console.log(data);

  return (
    <form id="signin-form" onSubmit={handleSubmit(onSubmit)}>
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
        <input type="checkbox" />
        <label for="rememberMe">Remember me?</label>
      </div>
      <input type="submit" value="Login" disabled={formState.isSubmitting} />
    </form>
  );
}

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <SignInForm />
      </div>
    );
  }
}
