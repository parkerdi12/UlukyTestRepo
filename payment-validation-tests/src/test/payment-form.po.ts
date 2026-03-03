import { Page, Locator } from "@playwright/test";

export class PaymentFormPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string) {
    // Переход на страницу авторизации
    await this.page.goto("https://app.stage.p.ab-payments.ru/auth");

    // Заполнение формы авторизации
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);

    // Нажатие кнопки входа
    await this.page.click('button[type="submit"]');

    // Ожидание завершения авторизации
    await this.page.waitForLoadState("networkidle");
  }

  async selectCurrency(currency: string) {
    // Открытие селектора валюты
    await this.page.click('[data-testid="currency-selector"]');

    // Выбор нужной валюты
    await this.page.click(`[data-testid="currency-option-${currency}"]`);
  }

  async enterAmountToReceive(amount: string) {
    // Ввод суммы в поле "Сумма к получению"
    await this.page.fill('[data-testid="amount-to-receive-input"]', amount);
  }

  getExchangeRateField(): Locator {
    return this.page.locator('[data-testid="exchange-rate"]');
  }

  getCommissionField(): Locator {
    return this.page.locator('[data-testid="commission"]');
  }

  getTotalAmountField(): Locator {
    return this.page.locator('[data-testid="total-amount"]');
  }

  getContinueButton(): Locator {
    return this.page.locator('[data-testid="continue-button"]');
  }

  getErrorMessage(): Locator {
    return this.page.locator('[data-testid="payment-error-message"]');
  }

  async getExchangeRateValue(): Promise<string | null> {
    return await this.getExchangeRateField().textContent();
  }

  async getCommissionValue(): Promise<string | null> {
    return await this.getCommissionField().textContent();
  }

  async getTotalAmountValue(): Promise<string | null> {
    return await this.getTotalAmountField().textContent();
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.getContinueButton().isEnabled();
  }
}
