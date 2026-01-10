import { z } from 'zod';
import { MessageSchema, ProfileSchema } from 'packages-shared-types';

export async function validateData<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues.map(i => i.message).join(', ')}`);
  }
  return result.data;
}