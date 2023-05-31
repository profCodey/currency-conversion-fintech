import { z } from "zod";
export const signupFormValidator = z
  .object({
    first_name: z.string().min(1, { message: "Enter first name" }),
    last_name: z.string().min(1, { message: "Enter last name" }),
    email: z.string().email("Enter valid email"),
    phone_number: z.string().min(5, "Enter valid phone number"),
    phone_code: z.string().min(1, "Enter phone code"),
    password: z.string().min(5, "Enter password with at least 5 characters"),
    confirm_password: z
      .string()
      .min(5, "Enter password with at least 5 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const loginFormValidator = z.object({
  email: z.string().email("Enter valid email"),
  password: z
    .string()
    .min(5, { message: "Enter password with 5 characters at least" }),
});
