import type { InquiryType, Service, Status } from "@/lib/constants";

/** Every stored record shares these fields. */
export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends BaseRecord {
  name: string;
  email: string;
  passwordHash: string;
}

export interface Inquiry extends BaseRecord {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  inquiryType: InquiryType;
  interestedService: Service;
  projectDetails: string;
  message: string;
  status: Status;
}

export interface DemoRequest extends BaseRecord {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  interestedService: Service;
  preferredDemoDate: string;
  message: string;
  status: Status;
}

export interface EventRegistration extends BaseRecord {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  eventName: string;
  message: string;
  status: Status;
}

export interface EventItem extends BaseRecord {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl: string;
}

/** Public-facing admin shape (never expose the password hash). */
export type SafeAdmin = Omit<Admin, "passwordHash">;
