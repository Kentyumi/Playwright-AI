import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {

  private readonly checkoutButton = this.page.getByTestId('checkout');
  private readonly successMessage = this.page.getByTestId('order-success');

  async completeCheckout() {
    await this.checkoutButton.click();
    await this.verifyOrderSuccess();
  }

  private async verifyOrderSuccess() {
    await this.successMessage.waitFor();
  }
}
