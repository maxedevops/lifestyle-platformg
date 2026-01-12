import { z } from 'zod';

export const MessageSchema = z.object({
  recipientId: z.string().uuid(),
  encryptedPayload: z.string().min(1),
  signature: z.string()
});

export const ProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  publicKey: z.string(),
  bio: z.string().max(160).optional()
});

export type Message = z.infer<typeof MessageSchema>;
export type Profile = z.infer<typeof ProfileSchema>;