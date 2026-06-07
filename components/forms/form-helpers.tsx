"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Inline validation message shown beneath a field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm font-medium text-destructive">{message}</p>
  );
}

/** Success / error banner shown above a form after submission. */
export function FormAlert({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border p-3 text-sm",
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

/** Presentational wrapper around the shadcn Select for use with RHF Controller. */
export function SelectField({
  id,
  value,
  onValueChange,
  onBlur,
  placeholder,
  options,
  invalid,
}: {
  id?: string;
  value?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  options: readonly string[];
  invalid?: boolean;
}) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        onBlur={onBlur}
        aria-invalid={invalid}
        className={cn(invalid && "border-destructive focus:ring-destructive")}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No options available
          </div>
        ) : (
          options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

/** Tiny fetch helper returning a normalised result for the forms. */
export async function postJson(
  url: string,
  body: unknown,
): Promise<{
  ok: boolean;
  status: number;
  data: {
    success?: boolean;
    message?: string;
    errors?: Record<string, string>;
    data?: unknown;
  };
}> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { message: "Network error — please check your connection." },
    };
  }
}
