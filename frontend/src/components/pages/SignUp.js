import React, { Component } from "react";
import { useForm } from "react-hook-form";

import "./css/SignUp.css";

function SignUpForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label for="username">Username</label>
        <input type="text" name="username" ref={register} />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="text" name="email" ref={register} />
      </div>
      <div>
        <label for="rakutenId">Rakuten ID</label>
        <input type="text" name="rakutenId" ref={register} />
      </div>
      <div>
        <label for="zoomId">Zoom ID</label>
        <input type="text" name="zoomId" ref={register} />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" ref={register} />
      </div>
      <div>
        <label for="confirmPassword">Confirm password</label>
        <input type="password" name="confirmPassword" ref={register} />
      </div>
      <input type="submit" />
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
