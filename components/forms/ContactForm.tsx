"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  FieldError,
  FormAlert,
  SelectField,
  postJson,
} from "@/components/forms/form-helpers";
import { COUNTRIES, INQUIRY_TYPES, SERVICES } from "@/lib/constants";
import { inquirySchema, type InquiryInput } from "@/lib/validations";

export function ContactForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      country: "" as InquiryInput["country"],
      inquiryType: "" as InquiryInput["inquiryType"],
      interestedService: "" as InquiryInput["interestedService"],
      projectDetails: "",
      message: "",
    },
  });

  async function onSubmit(values: InquiryInput) {
    setSubmitted(false);
    const { ok, data } = await postJson("/api/inquiries", values);

    if (ok && data.success) {
      setSubmitted(true);
      reset();
      toast({
        variant: "success",
        title: "Inquiry sent",
        description: "Thanks for reaching out — we'll be in touch shortly.",
      });
      return;
    }

    if (data.errors) {
      for (const [field, message] of Object.entries(data.errors)) {
        setError(field as keyof InquiryInput, { message });
      }
    }
    toast({
      variant: "destructive",
      title: "Could not send inquiry",
      description: data.message ?? "Please review the form and try again.",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitted && (
        <FormAlert
          type="success"
          message="Thank you! Your inquiry has been submitted successfully."
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name *</Label>
          <Input
            id="fullName"
            placeholder="Jane Doe"
            className="mt-1.5"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div>
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@company.com"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            placeholder="+44 7000 000000"
            className="mt-1.5"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="companyName">Company name *</Label>
          <Input
            id="companyName"
            placeholder="Acme Ltd"
            className="mt-1.5"
            {...register("companyName")}
          />
          <FieldError message={errors.companyName?.message} />
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <div className="mt-1.5">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <SelectField
                  id="country"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select your country"
                  options={COUNTRIES}
                  invalid={!!errors.country}
                />
              )}
            />
          </div>
          <FieldError message={errors.country?.message} />
        </div>

        <div>
          <Label htmlFor="inquiryType">Inquiry type *</Label>
          <div className="mt-1.5">
            <Controller
              control={control}
              name="inquiryType"
              render={({ field }) => (
                <SelectField
                  id="inquiryType"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select inquiry type"
                  options={INQUIRY_TYPES}
                  invalid={!!errors.inquiryType}
                />
              )}
            />
          </div>
          <FieldError message={errors.inquiryType?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="interestedService">Interested service *</Label>
          <div className="mt-1.5">
            <Controller
              control={control}
              name="interestedService"
              render={({ field }) => (
                <SelectField
                  id="interestedService"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select a service"
                  options={SERVICES}
                  invalid={!!errors.interestedService}
                />
              )}
            />
          </div>
          <FieldError message={errors.interestedService?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="projectDetails">Job / project details *</Label>
        <Textarea
          id="projectDetails"
          placeholder="Briefly describe your project, team size or the problem you want to solve."
          className="mt-1.5"
          {...register("projectDetails")}
        />
        <FieldError message={errors.projectDetails?.message} />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="How can the AI-Solution team help you?"
          className="mt-1.5"
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send /> Send inquiry
          </>
        )}
      </Button>
    </form>
  );
}
