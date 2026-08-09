import { z } from "zod";

import { ageFromDateOfBirth, MINIMUM_PROFILE_AGE } from "@/types/account";

export const AuthUiCopy = {
  firstNameRequired: "Please enter your first name.",
  lastNameRequired: "Please enter your last name.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address (e.g. you@school.com).",
  passwordRequiredSignUp: "Please create a password.",
  passwordRequiredSignIn: "Please enter your password.",
  passwordMismatch: "Passwords don't match. Please check and try again.",
  passwordTooShort: "Your password must be at least 8 characters.",
  passwordNeedsNumber: "Add at least one number.",
  passwordNeedsUpper: "Add at least one uppercase letter.",
  ageConfirmationRequired:
    "Please confirm you are at least 16 years old, or enter your date of birth.",
  ageTooYoung: "User age must be greater than 16 years.",
} as const;

export function passwordStrengthIssues(password: string): string | null {
  if (password.length < 8) return AuthUiCopy.passwordTooShort;
  if (!/[A-Z]/.test(password)) return AuthUiCopy.passwordNeedsUpper;
  if (!/\d/.test(password)) return AuthUiCopy.passwordNeedsNumber;
  return null;
}

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, AuthUiCopy.emailRequired)
    .email(AuthUiCopy.emailInvalid),
  password: z.string().min(1, AuthUiCopy.passwordRequiredSignIn),
});

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, AuthUiCopy.firstNameRequired),
    lastName: z.string().trim().min(1, AuthUiCopy.lastNameRequired),
    email: z
      .string()
      .min(1, AuthUiCopy.emailRequired)
      .email(AuthUiCopy.emailInvalid),
    password: z.string().min(1, AuthUiCopy.passwordRequiredSignUp),
    confirmPassword: z.string().min(1, AuthUiCopy.passwordRequiredSignUp),
    schoolName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    ageConfirmed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const strength = passwordStrengthIssues(data.password);
    if (strength) {
      ctx.addIssue({ code: "custom", message: strength, path: ["password"] });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: AuthUiCopy.passwordMismatch,
        path: ["confirmPassword"],
      });
    }
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      if (Number.isNaN(dob.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid date of birth.",
          path: ["dateOfBirth"],
        });
      } else if (ageFromDateOfBirth(dob) < MINIMUM_PROFILE_AGE) {
        ctx.addIssue({
          code: "custom",
          message: AuthUiCopy.ageTooYoung,
          path: ["dateOfBirth"],
        });
      }
    } else if (!data.ageConfirmed) {
      ctx.addIssue({
        code: "custom",
        message: AuthUiCopy.ageConfirmationRequired,
        path: ["ageConfirmed"],
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, AuthUiCopy.emailRequired)
    .email(AuthUiCopy.emailInvalid),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(1, AuthUiCopy.passwordRequiredSignUp),
    confirmPassword: z.string().min(1, AuthUiCopy.passwordRequiredSignUp),
  })
  .superRefine((data, ctx) => {
    const strength = passwordStrengthIssues(data.password);
    if (strength) {
      ctx.addIssue({ code: "custom", message: strength, path: ["password"] });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: AuthUiCopy.passwordMismatch,
        path: ["confirmPassword"],
      });
    }
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
