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

export type signupPayload = Omit<
  z.infer<typeof signupFormValidator>,
  "phone_code"
>;

//ONBOARDING

export const basicProfileFormValidator = z.object({
  bvn: z
    .string()
    .min(11, "Your BVN should contain at least 11 digits")
    .max(11, "Your BVN should not contain more than 11 digits"),
  city: z.string().min(1, "Enter city"),
  state: z.string().min(1, "Enter state"),
  zip_code: z.string().min(1, "Enter zip code"),
  tax_number: z.string().min(1, "Enter tax number"),
  business_legal_name: z.string().min(1, "Enter legal name of business"),
  business_trading_name: z.string().min(1, "Enter trading name of business"),
  country_of_registration: z.string().min(1, "Select country of registration"),
  primary_business_activity: z
    .string()
    .min(1, "Enter primary business activity"),
  business_registration_date: z.union([z.null(), z.date(), z.string()]),
  business_registration_number: z
    .string()
    .min(1, "Enter business registration number"),
});

export const addRecipientFormValidator = z.object({
  currency: z.string(),
  bank: z.string(),
  account_number: z
    .string()
    .min(10, "Enter valid account number")
    .max(10, "Enter valid account number"),
  account_name: z.string(),
  user: z.number(),
});

export const fundManualAccount = z.object({
  target_account: z.string().min(1, { message: "Select target account" }),
  amount: z.number().gte(1, { message: "Enter valid amount" }),
  sender_name: z.string().min(1, { message: "Enter account name" }),
  sender_narration: z.string().min(1, { message: "Enter narration" }),
  category: z.string(),
});
