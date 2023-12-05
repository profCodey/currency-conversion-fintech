import { z } from "zod";
export const signupFormValidator = z
  .object({
    first_name: z.string().min(1, { message: "Enter first name" }),
    last_name: z.string().min(1, { message: "Enter last name" }),
    email: z.string().email("Enter valid email"),
    phone_number: z.string().min(5, "Enter valid phone number"),
    phone_code: z.string().min(1, "Enter phone code"),
    client_type: z.string(),
    password: z.string().min(8, "Enter password with at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Enter password with at least 8 characters"),
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

export const invidualProfileFormValidator = z.object({
  bvn: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "BVN must be 11 digits",
  }),
  city: z.string().min(1, "Enter city"),
  state: z.string().min(1, "Enter state"),
  country_of_residence: z.string().min(1, "Select country of registration"),
  // zip_code: z.string().min(1, "Enter zip code"),
});



export const businessProfileFormValidator = z.object({
  bvn: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "BVN must be 11 digits",
  }),
  city: z.string().min(1, "Enter city"),
  state: z.string().min(1, "Enter state"),
  zip_code: z.string().min(1, "Enter zip code"),
  tax_number: z.string().optional(),
  // business_legal_name: z.string().optional(),
  business_legal_name: z.string().min(1, "Enter legal name of business"),
  business_trading_name: z.string().optional(),
  country_of_registration: z.string().min(1, "Select country of registration").optional(),
  business_code: z
    .string()
    .max(10, "Business code cannot be more than 10 characters").optional(),
  primary_business_activity: z
    .string()
    .min(1, "Enter primary business activity").optional(),
  business_registration_date: z.union([z.null(), z.date(), z.string()]).optional(),
  business_registration_number: z
    .string()
    .min(1, "Enter business registration number").optional(),
});
export const basicProfileFormValidator = z.object({
  bvn: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "BVN must be 11 digits",
  }),
  city: z.string().min(1, "Enter city"),
  state: z.string().min(1, "Enter state"),
  zip_code: z.string().min(1, "Enter zip code"),
  tax_number: z.string().optional(),
  business_legal_name: z.string().min(1, "Enter legal name of business"),
  business_trading_name: z.string().min(1, "Enter trading name of business"),
  country_of_registration: z.string().min(1, "Select country of registration"),
  business_code: z
    .string()
    .max(10, "Business code cannot be more than 10 characters"),
  primary_business_activity: z
    .string()
    .min(1, "Enter primary business activity"),
  business_registration_date: z.union([z.null(), z.date(), z.string()]),
  business_registration_number: z
    .string()
    .min(1, "Enter business registration number"),
});

export const accountDetailFormValidator = z.object({
  account_number: z.string()
  .refine((value) => /^\d{10}$/.test(value), {
    message: "Account Number must be 10 digits",}),
    // account_name: z.string().min(1),
  bank_name:z.string(),
  bank:z.string(),
})
export const addRecipientFormValidator = z.object({
  currency: z.string(),
  bank: z.string(),
  account_number: z.string()
  .refine((value) => /^\d{10}$/.test(value), {
    message: "Account Number must be 10 digits",}),
  account_name: z.string(),
  user: z.number(),
  category: z.string(),
  sort_code: z.string(),
  bic: z.string(),
  iban: z.string(),
  recipient_address: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  fx_bank_name: z.string(),
});

export const fundManualAccount = z.object({
  target_account: z.string().min(1, { message: "Select target account" }),
  amount: z.number().gte(1, { message: "Enter valid amount" }),
  sender_name: z.string().min(1, { message: "Enter account name" }),
  sender_narration: z.string().min(1, { message: "Enter narration" }),
  category: z.string(),
});
