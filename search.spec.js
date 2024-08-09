const { test, expect } = require("@playwright/test");

test.describe("System Users Search Tests", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Navigating to login page");
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    console.log("Filling in username");
    await page.fill('input[name="username"]', "Admin");

    console.log("Filling in password");
    await page.fill('input[name="password"]', "admin123");

    console.log("Clicking login button");
    await page.click('button[type="submit"]');

    console.log("Waiting for dashboard to load");
    await page.waitForSelector(".oxd-topbar-header"); // waiting for the table header

    console.log("Navigating to system users page");

    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers"
    );
    await page.waitForURL(
      "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers"
    );

    console.log("Successfully navigated to system users page");

    await page.waitForSelector(".oxd-table-filter");
    console.log("System users table appeared");
    console.log(".oxd-table-filter is now visible");
  });

  test("Search with valid username", async ({ page }) => {
    console.log("Waiting for search input to appear");
    await page.waitForSelector("div[data-v-957b4417] input.oxd-input");

    console.log("Filling search input with 'Admin'");
    await page.fill("div[data-v-957b4417] input.oxd-input", "Admin");

    console.log("Clicking search button");
    await page.click('button[type="submit"]');

    console.log("Waiting for results to appear");
    await page.waitForSelector(".oxd-table-cell");

    console.log("Counting results");
    const results = await page.locator(".oxd-table-cell").count();
    expect(results).toBeGreaterThan(0);
  });

  test("Search with invalid username", async ({ page }) => {
    await page.waitForSelector("div[data-v-957b4417] input.oxd-input");

    await page.fill("div[data-v-957b4417] input.oxd-input", "InvalidUser");
    await page.click('button[type="submit"]');
    await page.waitForSelector(".orangehrm-bottom-container"); // Change this to the actual selector for the no results message
    const noResultsMessage = await page
      .locator(".orangehrm-bottom-container")
      .count();
    expect(noResultsMessage).toBe(1);
  });

  test("Search with empty username", async ({ page }) => {
    await page.fill("div[data-v-957b4417] input.oxd-input", " ");
    await page.click('button[type="submit"]');
    await page.waitForSelector(".oxd-table-cell"); // wait for the results to appear
    const results = await page.locator(".oxd-table-cell").count();
    expect(results).toBeGreaterThan(0);
  });

  test("Search by user role", async ({ page }) => {
    await page.waitForSelector(".oxd-select-wrapper");
    await page.click(".oxd-select-wrapper");
    await page.waitForSelector(".oxd-select-text-input", "Admin");
    await page.click('button[type="submit"]');
    await page.waitForSelector(".oxd-table-cell", { timeout: 10000 }); // wait for the results to appear
    const results = await page.locator(".oxd-table-cell").count();
    expect(results).toBeGreaterThan(0);
  });

  test("Search by status", async ({ page }) => {
    await page.click(".oxd-select-wrapper");
    await page.waitForSelector(".oxd-select-text-input", "Enabled");
    await page.click('button[type="submit"]');
    await page.waitForSelector(".oxd-table-cell", { timeout: 10000 }); // wait for the results to appear
    const results = await page.locator(".oxd-table-cell").count();
    expect(results).toBeGreaterThan(0);
  });

  test("Search by combined Username and User Role", async ({ page }) => {
    await page.waitForSelector("div[data-v-957b4417] input.oxd-input");

    await page.fill("div[data-v-957b4417] input.oxd-input", "Admin");
    await page.waitForSelector(".oxd-select-text-input", "Admin");
    await page.click('button[type="submit"]');
    const username = await page.textContent(".oxd-table-cell:nth-child(2)");
    const userRole = await page.textContent(".oxd-table-cell:nth-child(3)");
    expect(username).toBe("Admin");
    expect(userRole).toBe("Admin");
  });
});
/** testleri birer birer çalıştırın :) */
