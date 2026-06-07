"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FieldError } from "@/components/forms/form-helpers";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/constants";
import { eventTextSchema, type EventTextInput } from "@/lib/validations";
import type { EventItem } from "@/lib/types";

function validateImage(file: File | null): string | null {
  if (!file) return "Event image is required";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Only image files are allowed (${ALLOWED_IMAGE_EXTENSIONS.join(", ")})`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 5 MB or smaller";
  }
  return null;
}

export function EventForm({
  onCreated,
}: {
  onCreated?: (event: EventItem) => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventTextInput>({
    resolver: zodResolver(eventTextSchema),
    defaultValues: { title: "", description: "", eventDate: "", location: "" },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    const error = validateImage(selected);
    setFileError(error);
    if (selected && !error) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreview(null);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: EventTextInput) {
    const imageError = validateImage(file);
    if (imageError) {
      setFileError(imageError);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("eventDate", values.eventDate);
      formData.append("location", values.location);
      formData.append("image", file as File);

      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast({
          variant: "success",
          title: "Event created",
          description: "The event is now live on the public Events page.",
        });
        reset();
        clearFile();
        onCreated?.(data.data as EventItem);
      } else {
        toast({
          variant: "destructive",
          title: "Could not create event",
          description:
            data.errors?.image ??
            data.message ??
            "Please review the form and try again.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="event-title">Event title *</Label>
        <Input
          id="event-title"
          placeholder="AI for Business Summit 2026"
          className="mt-1.5"
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="event-date">Event date *</Label>
          <Input
            id="event-date"
            type="date"
            className="mt-1.5"
            {...register("eventDate")}
          />
          <FieldError message={errors.eventDate?.message} />
        </div>
        <div>
          <Label htmlFor="event-location">Location *</Label>
          <Input
            id="event-location"
            placeholder="Sunderland, UK"
            className="mt-1.5"
            {...register("location")}
          />
          <FieldError message={errors.location?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="event-description">Description *</Label>
        <Textarea
          id="event-description"
          placeholder="What is this event about and who should attend?"
          className="mt-1.5 min-h-[120px]"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <Label htmlFor="event-image">Event image *</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload from your PC. Allowed: JPG, JPEG, PNG, WEBP — max 5 MB.
        </p>

        {preview ? (
          <div className="relative mt-2 overflow-hidden rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected event preview"
              className="h-48 w-full object-cover"
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute right-2 top-2 rounded-full bg-navy-900/70 p-1.5 text-white transition hover:bg-navy-900"
              aria-label="Remove selected image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="event-image"
            className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground transition hover:border-primary hover:bg-accent/60"
          >
            <ImagePlus className="h-6 w-6 text-primary" />
            <span>Click to choose an image</span>
          </label>
        )}

        <input
          ref={fileInputRef}
          id="event-image"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          className="sr-only"
        />
        <FieldError message={fileError ?? undefined} />
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Creating event…
          </>
        ) : (
          <>
            <Plus /> Create event
          </>
        )}
      </Button>
    </form>
  );
}
