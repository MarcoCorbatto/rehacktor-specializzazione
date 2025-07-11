import Alert from "../../components/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormSchema as ConfirmSchema } from "../../lib/validationForm";
import { getErrors, getFieldError } from "../../lib/validationForm";
import supabase from "../../supabase/supabase-client";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const { error, data } = ConfirmSchema.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      console.log(errors);
    } else {
      let { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
          },
        },
      });
      if (signUpError) {
        showAlert("error", "Signing up error 👎🏻!");
      } else {
        showAlert("success", "Signed up 👍🏻! Check your email.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }
    }
  };

  const onBlur = (property) => () => {
    const message = getFieldError(ConfirmSchema, property, formState[property]);
    setFormErrors((prev) => ({ ...prev, [property]: message }));
    setTouchedFields((prev) => ({ ...prev, [property]: true }));
  };

  const isInvalid = (property) => {
    if (formSubmitted || touchedFields[property]) {
      return !!formErrors[property];
    }
    return undefined;
  };

  const setField = (property, valueSelector) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: valueSelector ? valueSelector(e) : e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Create your account
          </h2>

          {/* ALERT */}
          {alert.message && (
            <div className="fixed top-4 right-4 z-50">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: "", message: "" })}
              />
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                className={`input input-bordered ${
                  isInvalid("email") ? "input-error" : ""
                }`}
                value={formState.email}
                onChange={setField("email")}
                onBlur={onBlur("email")}
                autoComplete="off"
                required
              />
              {formErrors.email && (
                <small className="text-error text-sm block mt-1">
                  {formErrors.email}
                </small>
              )}
            </div>

            {/* First Name */}
            <div className="form-control">
              <label htmlFor="firstName" className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                id="firstName"
                className={`input input-bordered ${
                  isInvalid("firstName") ? "input-error" : ""
                }`}
                value={formState.firstName}
                onChange={setField("firstName")}
                onBlur={onBlur("firstName")}
                autoComplete="off"
                required
              />
              {formErrors.firstName && (
                <small className="text-error text-sm block mt-1">
                  {formErrors.firstName}
                </small>
              )}
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label htmlFor="lastName" className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                id="lastName"
                className={`input input-bordered ${
                  isInvalid("lastName") ? "input-error" : ""
                }`}
                value={formState.lastName}
                onChange={setField("lastName")}
                onBlur={onBlur("lastName")}
                autoComplete="off"
                required
              />
              {formErrors.lastName && (
                <small className="text-error text-sm block mt-1">
                  {formErrors.lastName}
                </small>
              )}
            </div>

            {/* Username */}
            <div className="form-control">
              <label htmlFor="username" className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                id="username"
                className={`input input-bordered ${
                  isInvalid("username") ? "input-error" : ""
                }`}
                value={formState.username}
                onChange={setField("username")}
                onBlur={onBlur("username")}
                autoComplete="off"
                required
              />
              {formErrors.username && (
                <small className="text-error text-sm block mt-1">
                  {formErrors.username}
                </small>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                className={`input input-bordered ${
                  isInvalid("password") ? "input-error" : ""
                }`}
                value={formState.password}
                onChange={setField("password")}
                onBlur={onBlur("password")}
                autoComplete="off"
                required
              />
              {formErrors.password && (
                <small className="text-error text-sm block mt-1">
                  {formErrors.password}
                </small>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
