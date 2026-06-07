"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Ticket } from "lucide-react";
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
import { COUNTRIES } from "@/lib/constants";
import {
  eventRegistrationSchema,
  type EventRegistrationInput,
} from "@/lib/validations";

export function EventRegistrationForm({
  events,
  defaultEventName = "",
}: {
  events: string[];
  defaultEventName?: string;
}) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      country: "" as EventRegistrationInput["country"],
      eventName: defaultEventName,
      message: "",
    },
  });

  async function onSubmit(values: EventRegistrationInput) {
    setSubmitted(false);
    const { ok, data } = await postJson("/api/event-registrations", values);

    if (ok && data.success) {
      setSubmitted(true);
      reset();
      toast({
        variant: "success",
        title: "You're registered!",
        description: "We've saved your spot — see you at the event.",
      });
      return;
    }

    if (data.errors) {
      for (const [field, message] of Object.entries(data.errors)) {
        setError(field as keyof EventRegistrationInput, { message });
      }
    }
    toast({
      variant: "destructive",
      title: "Could not register",
      description: data.message ?? "Please review the form and try again.",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitted && (
        <FormAlert
          type="success"
          message="Thank you! Your event registration has been submitted successfully."
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="reg-fullName">Full name *</Label>
          <Input
            id="reg-fullName"
            placeholder="Jane Doe"
            className="mt-1.5"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div>
          <Label htmlFor="reg-email">Email address *</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="jane@company.com"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="reg-phone">Phone number *</Label>
          <Input
            id="reg-phone"
            placeholder="+44 7000 000000"
            className="mt-1.5"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="reg-companyName">Company name *</Label>
          <Input
            id="reg-companyName"
            placeholder="Acme Ltd"
            className="mt-1.5"
            {...register("companyName")}
          />
          <FieldError message={errors.companyName?.message} />
        </div>

        <div>
          <Label htmlFor="reg-country">Country *</Label>
          <div className="mt-1.5">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <SelectField
                  id="reg-country"
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
          <Label htmlFor="reg-eventName">Selected event *</Label>
          <div className="mt-1.5">
            <Controller
              control={control}
              name="eventName"
              render={({ field }) => (
                <SelectField
                  id="reg-eventName"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Choose an event"
                  options={events}
                  invalid={!!errors.eventName}
                />
              )}
            />
          </div>
          <FieldError message={errors.eventName?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="reg-message">Message</Label>
        <Textarea
          id="reg-message"
          placeholder="Anything you'd like us to know? (optional)"
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
        disabled={isSubmitting || events.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Registering…
          </>
        ) : (
          <>
            <Ticket /> Register for event
          </>
        )}
      </Button>
    </form>
  );
}
