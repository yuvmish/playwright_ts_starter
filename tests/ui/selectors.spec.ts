import { test, expect } from "@playwright/test";

test.describe("TodoMVC selectors demo", () => {
  test("add, toggle, and edit todos", async ({ page }) => {
    await page.goto("/todomvc");

    // Prefer role/placeholder locators
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("buy milk");
    await input.press("Enter");
    await input.fill("walk dog");
    await input.press("Enter");

    // Stable query for list items
    const items = page
      .getByRole("list")
      .filter({ has: page.getByRole("checkbox") })
      .getByRole("listitem");
    await expect(items).toHaveCount(2);

    // Target a specific row with filter()
    const milk = items.filter({ hasText: "buy milk" });
    await milk.getByRole("checkbox").check();
    await expect(milk).toHaveClass(/completed/);
    await expect(items.filter({ has: page.locator("input:checked") })).toHaveCount(1);

    // Edit the second item via dblclick → inline editor
    const second = items.nth(1);
    await second.dblclick();
    const editor = second.locator(".edit");
    await editor.fill("walk dog (evening)");
    await editor.press("Enter");
    await expect(items.filter({ hasText: "walk dog (evening)" })).toHaveCount(1);

    await milk.hover();
    await milk.locator(".destroy").click();
    await expect(items).toHaveCount(1);
  });
});
