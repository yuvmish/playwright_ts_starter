import { z } from "zod";

export const User = z.object({
  id: z.number(),
  email: z.email(),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  avatar: z.url(),
});

export const PaginatedUsers = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(User),

  support: z.object({
    url: z.url(),
    text: z.string(),
  }),
});

export const CreatedUser = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string(), // reqres returns string id
  createdAt: z.iso.datetime(), // ISO timestamp
});
