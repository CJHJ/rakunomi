import React, { Component, useState } from "react";
import { useForm } from "react-hook-form";

import AuthService from "../../services/auth.service";
import history from "../../history";

import "./css/SignIn.css";

const SignInForm = (props) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onBlur",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    handleLogin(data);
  };

  const handleLogin = (data) => {
    setMessage("");
    setLoading(true);

    AuthService.login(data.username, data.password).then(
      () => {
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

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

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
      <div>
        {loading && <span className="spinner-border spinner-border-sm"></span>}
        <input
          type="submit"
          value="Login"
          disabled={formState.isSubmitting || loading}
        />
      </div>
      <div>
        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
      </div>
    </form>
  );
};

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <SignInForm history={this.props.history} />
      </div>
    );
  }
}
