import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email");
export const passwordSchema = z
  .string()
  .min(6, "At least 6 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Tell us your name"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({ email: emailSchema });
export type ForgotValues = z.infer<typeof forgotSchema>;

export const nameSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
});
export type NameValues = z.infer<typeof nameSchema>;

export const reflectionSchema = z.object({
  note: z.string().min(1, "Write something first").max(2000),
});
export type ReflectionValues = z.infer<typeof reflectionSchema>;
