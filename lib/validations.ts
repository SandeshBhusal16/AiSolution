import { z } from "zod";
import {
  COUNTRIES,
  INQUIRY_TYPES,
  SERVICES,
  STATUSES,
  type InquiryType,
  type Service,
  type Status,
} from "@/lib/constants";

/**
 * lib/validations.ts
 * -----------------------------------------------------------------------------
 * Zod schemas shared by the client forms (React Hook Form) and the server-side
 * API routes, so the browser and the server validate against the exact same
 * rules.
 */

// z.enum needs a non-empty tuple; the `as const` arrays are readonly so we cast.
const serviceEnum = z.enum(SERVICES as unknown as [Service, ...Service[]], {
  errorMap: () => ({ message: "Please select an interested service" }),
});
const inquiryTypeEnum = z.enum(
  INQUIRY_TYPES as unknown as [InquiryType, ...InquiryType[]],
  { errorMap: () => ({ message: "Please select an inquiry type" }) },
);
const statusEnum = z.enum(STATUSES as unknown as [Status, ...Status[]], {
  errorMap: () => ({ message: "Please select a valid status" }),
});
const countryEnum = z.enum(COUNTRIES as unknown as [string, ...string[]], {
  errorMap: () => ({ message: "Please select a country" }),
});

// ---- Reusable field rules -------------------------------------------------

const fullName = z
  .string({ required_error: "Full name is required" })
  .trim()
  .min(2, "Full name is required");

const email = z
  .string({ required_error: "Email is required" })
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const phone = z
  .string({ required_error: "Phone number is required" })
  .trim()
  .min(7, "Enter a valid phone number")
  .regex(/^[+()\-\s\d]+$/, "Enter a valid phone number");

const companyName = z
  .string({ required_error: "Company name is required" })
  .trim()
  .min(2, "Company name is required");

const requiredMessage = z
  .string({ required_error: "Message is required" })
  .trim()
  .min(10, "Message must be at least 10 characters")
  .max(2000, "Message is too long");

const optionalMessage = z
  .string()
  .trim()
  .max(2000, "Message is too long")
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "");

/** Preferred demo date must be today or later. */
const futureDate = z
  .string({ required_error: "Preferred demo date is required" })
  .min(1, "Preferred demo date is required")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Enter a valid date",
  })
  .refine(
    (value) => {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    { message: "Preferred demo date cannot be in the past" },
  );

// ---- Public form schemas --------------------------------------------------

export const inquirySchema = z.object({
  fullName,
  email,
  phone,
  companyName,
  country: countryEnum,
  inquiryType: inquiryTypeEnum,
  interestedService: serviceEnum,
  projectDetails: z
    .string({ required_error: "Project details are required" })
    .trim()
    .min(5, "Please add a little more detail")
    .max(2000, "Project details are too long"),
  message: requiredMessage,
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const demoRequestSchema = z.object({
  fullName,
  email,
  phone,
  companyName,
  country: countryEnum,
  interestedService: serviceEnum,
  preferredDemoDate: futureDate,
  message: optionalMessage,
});
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

export const eventRegistrationSchema = z.object({
  fullName,
  email,
  phone,
  companyName,
  country: countryEnum,
  eventName: z
    .string({ required_error: "Please select an event" })
    .trim()
    .min(1, "Please select an event"),
  message: optionalMessage,
});
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// Text fields for an event (the image is validated separately as a file).
export const eventTextSchema = z.object({
  title: z
    .string({ required_error: "Event title is required" })
    .trim()
    .min(3, "Event title is required"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description is too long"),
  eventDate: z
    .string({ required_error: "Event date is required" })
    .min(1, "Event date is required")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Enter a valid date",
    }),
  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(2, "Location is required"),
});
export type EventTextInput = z.infer<typeof eventTextSchema>;

// ---- Admin schemas --------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const statusUpdateSchema = z.object({
  status: statusEnum,
});
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
