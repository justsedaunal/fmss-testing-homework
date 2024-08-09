// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Login Tests', () => {
  test('Successful login', async ({ page }) => {
    // Giriş sayfasına git
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Kullanıcı adı ve şifre gir
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');

    // Giriş yap butonuna tıkla
    await page.click('button[type="submit"]');

    // Başarılı giriş sonrası sayfada bulunan bir öğeyi kontrol et
    const dashboardElement = await page.locator('h6').textContent();
    expect(dashboardElement).toContain('Dashboard');
  });

  test('Unsuccessful login', async ({ page }) => {
    // Giriş sayfasına git
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Yanlış kullanıcı adı ve şifre gir
    await page.fill('input[name="username"]', 'wrongUser');
    await page.fill('input[name="password"]', 'wrongPassword');

    // Giriş yap butonuna tıkla
    await page.click('button[type="submit"]');

    // Hata mesajını kontrol et
    const errorMessage = await page.locator('div.oxd-alert-content--error').textContent();
    expect(errorMessage).toContain('Invalid credentials');
  });
});
