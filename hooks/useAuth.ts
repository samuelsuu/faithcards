import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/** Email/password sign-in. */
export function useSignIn() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email.trim(),
        password: input.password,
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

/** Register a new account. Sends a verification email if confirm-email is on. */
export function useSignUp() {
  return useMutation({
    mutationFn: async (input: {
      email: string;
      password: string;
      fullName?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: input.fullName ? { full_name: input.fullName } : undefined,
        },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

/** Send a password-reset email. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw new Error(error.message);
    },
  });
}

/** Re-send the signup confirmation email. */
export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (error) throw new Error(error.message);
    },
  });
}
