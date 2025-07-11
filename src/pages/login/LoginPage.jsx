import Alert from "../../components/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase/supabase-client";
import {
  FormSchemaLogin,
  getErrors,
  getFieldError,
} from "../../lib/validationForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({ type: "", message: ""});

   const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const { error, data } = FormSchemaLogin.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
    } else {
      console.log(data);
      let { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

       if (error) {
        showAlert("error", "Signing in error 👎!");
      } else {
        showAlert("success", "Signed In 👍!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }
    }
  };

  const onBlur = (property) => {
    const message = getFieldError(
      FormSchemaLogin,
      property,
      formState[property]
    );
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
          <h2 className="text-2xl font-bold text-center mb-4">Welcome back</h2>

           {/* ALERT */}
          {alert.message && (
            <div className="fixed top-4 right-4 z-50">
              <Alert type={alert.type} message={alert.message} />
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
                onBlur={() => onBlur("email")}
                autoComplete="off"
                required
              />
              {formErrors.email && (
                <small className="text-error text-sm mt-1">
                  {formErrors.email}
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
                onBlur={() => onBlur("password")}
                autoComplete="off"
                required
              />
              {formErrors.password && (
                <small className="text-error text-sm mt-1">
                  {formErrors.password}
                </small>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
