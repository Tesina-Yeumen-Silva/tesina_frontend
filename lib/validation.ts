import { ZodType, ZodError } from "zod";

export class ValidationError extends Error {
  public errors: Record<string, string>;

  constructor(zodError: ZodError) {
    super("Validation Error");
    this.name = "ValidationError";
    this.errors = {};

    for (const issue of zodError.issues) {
      const path = issue.path.join(".");
      this.errors[path] = issue.message;
    }
  }
}

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}
