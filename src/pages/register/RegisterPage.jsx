import { useState } from "react";
import { useNavigate } from "react-router";
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
      if (error) {
        alert("Signing up error 👎🏻!");
      } else {
        alert("Signed up 👍🏻!");
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
    <div className="container">
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={setField("email")}
          onBlur={onBlur("email")}
          aria-invalid={isInvalid("email")}
          required
        />
        {formErrors.email && <small>{formErrors.email}</small>}

        <label htmlFor="firstName">First Name :</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formState.firstName}
          onChange={setField("firstName")}
          onBlur={onBlur("firstName")}
          aria-invalid={isInvalid("firstName")}
          required
        />
        {formErrors.firstName && <small>{formErrors.firstName}</small>}

        <label htmlFor="lastName">Last Name :</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formState.lastName}
          onChange={setField("lastName")}
          onBlur={onBlur("lastName")}
          aria-invalid={isInvalid("lastName")}
          required
        />
        {formErrors.lastName && <small>{formErrors.lastName}</small>}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formState.username}
          onChange={setField("username")}
          onBlur={onBlur("username")}
          aria-invalid={isInvalid("username")}
          required
        />
        {formErrors.username && <small>{formErrors.username}</small>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formState.password}
          onChange={setField("password")}
          onBlur={onBlur("password")}
          aria-invalid={isInvalid("password")}
          required
        />
        {formErrors.password && <small>{formErrors.password}</small>}

        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
