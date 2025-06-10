import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const passwordError =
  "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero.";

export const FormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3),
  password: z.string().min(8).regex(passwordRegex, passwordError),
});

export const ConfirmSchema = FormSchema.refine((data) => data);

export const FormSchemaLogin = z.object({
  email: z.string().email({ message: "Email non valida" }),
  password: z
    .string()
    .min(8, { message: "Minimo 8 caratteri" })
    .regex(passwordRegex, { message: passwordError }),
});

export function getFieldError(schema, property, value) {
  const { error } = schema.shape[property].safeParse(value);
  return error
    ? error.issues.map((issue) => issue.message).join(", ")
    : undefined;
}

export const getErrors = (error) =>
  error.issues.reduce((all, issue) => {
    const path = issue.path.join("");
    const message = all[path] ? all[path] + ", " : "";
    all[path] = message + issue.message;
    return all;
  }, {});
