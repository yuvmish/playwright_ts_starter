import { test, expect } from "@playwright/test";
import { PaginatedUsers, CreatedUser } from "./schemas/users";
import * as dotenv from "dotenv";
dotenv.config();

test.use({
  baseURL: "https://reqres.in/api",
  extraHTTPHeaders: { "x-api-key": process.env.REQRES_API_KEY || "" },
});

test.describe("Users API (reqres.in)", () => {
  test.skip("GET /users?page=2 → 200 + schema OK", async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/users`, { params: { page: 2 } });
    expect(res.ok()).toBeTruthy();
    console.log("Status:", res.status());
    console.log("Headers:", res.headers());
    if (!res.ok()) console.log("BODY:", await res.text());
    expect(res.status()).toBe(200);

    const parsed = PaginatedUsers.parse(await res.json());
    expect(parsed.data.length).toBeGreaterThan(0);

    // quick contract spot checks for every user
    for (const u of parsed.data) {
      expect(u.id).toBeGreaterThan(0);
      expect(/\.(png|jpg)$/i.test(u.avatar)).toBeTruthy();
    }
  });

  test.skip("POST /users → 201 + schema OK", async ({ request, baseURL }) => {
    const payload = { name: "Dana QA", job: "tester" };
    const res = await request.post(`${baseURL}/users`, { data: payload });
    expect(res.status()).toBe(201);

    const created = CreatedUser.parse(await res.json());
    expect(created.name).toBe(payload.name);
    expect(created.job).toBe(payload.job);
    expect(new Date(created.createdAt).toString()).not.toBe("Invalid Date");
  });

  test("validate zod schema and  GET /users/23 (non-existent) → 404", async ({
    request,
    baseURL,
  }) => {
    await expect(CreatedUser.parseAsync({})).rejects.toThrow();

    const res = await request.get(`${baseURL}/users/23`);
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBe(404);
    const text = await res.text();
    expect(text === "" || text === "{}").toBeTruthy();
  });

  test("Create user and try to GET it → 404", async ({ request, baseURL }) => {
    const payload = { name: "Eve QA", job: "tester" };
    const createRes = await request.post(`${baseURL}/users`, { data: payload });
    expect(createRes.status()).toBe(201);

    const created = CreatedUser.parse(await createRes.json());

    const getRes = await request.get(`${baseURL}/users/${created.id}`);
    expect(getRes.ok()).toBeFalsy();
    expect(getRes.status()).toBe(404);
  });
});
