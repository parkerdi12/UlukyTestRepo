import { test, expect } from "@playwright/test";

// Page Object для формы платежа
import { PaymentFormPage } from "./payment-form.po";
import { AUTH_DATA, APP_URL, TEST_AMOUNTS, CURRENCIES } from "../../../test-data";

test.describe("Валидация формы платежа", () => {
  let paymentForm: PaymentFormPage;

  test.beforeEach(async ({ page }) => {
    paymentForm = new PaymentFormPage(page);

    // Предусловие: авторизация пользователя
    await paymentForm.login(AUTH_DATA.email, AUTH_DATA.password);
  });

  test("Минимальная сумма платежа", async ({ page }) => {
    // Переход на страницу создания платежа с нужными параметрами
    await page.goto(`${APP_URL.baseUrl}${APP_URL.paymentForm}`);

    // Выбор валюты CNY и ввод значения 1000
    await paymentForm.selectCurrency(CURRENCIES.CNY);
    await paymentForm.enterAmountToReceive(TEST_AMOUNTS.minimumInvalid);

    // Ожидание перерасчета
    await page.waitForTimeout(1000);

    // Проверка отображения сообщения об ошибке
    await expect(paymentForm.getErrorMessage()).toBeVisible();

    // Проверка, что кнопка "Продолжить" неактивна
    await expect(paymentForm.getContinueButton()).toBeDisabled();
  });

  test("Расчет финальной суммы", async ({ page }) => {
    // Переход на страницу создания платежа с нужными параметрами
    await page.goto(`${APP_URL.baseUrl}${APP_URL.paymentForm}`);

    // Выбор валюты CNY и ввод значения, при котором валидация проходит
    await paymentForm.selectCurrency(CURRENCIES.CNY);
    await paymentForm.enterAmountToReceive(TEST_AMOUNTS.valid);

    // Ожидание обновления формы
    await page.waitForTimeout(1000);

    // Проверка отсутствия ошибки валидации
    await expect(paymentForm.getErrorMessage()).not.toBeVisible();

    // Проверка отображения полей расчета
    await expect(paymentForm.getExchangeRateField()).toBeVisible();
    await expect(paymentForm.getCommissionField()).toBeVisible();
    await expect(paymentForm.getTotalAmountField()).toBeVisible();

    // Сравнение значений с network-ответом
    const commissionValue = await paymentForm.getCommissionValue();
    const totalAmountValue = await paymentForm.getTotalAmountValue();

    // Проверка, что значения не пустые
    expect(commissionValue).not.toBeNull();
    expect(totalAmountValue).not.toBeNull();
  });
});
