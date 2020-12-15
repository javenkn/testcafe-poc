import { RequestLogger, Selector } from 'testcafe';

const shippingInfo = {
  firstName: 'rose',
  lastName: 'young',
  address1: '15350 sw koll pkwy',
  address2: '2nd floor test apt',
  city: 'Beaverton',
  postalCode: '97006',
  state: 'Oregon',
  email: 'test@test.com',
  phoneNumber: '1234567890',
};

const logger = RequestLogger(
  { url: /checkout_previews/ },
  {
    logRequestBody: true,
    logRequestHeaders: true,
    logResponseHeaders: true,
    logResponseBody: true,
    stringifyResponseBody: true,
  }
);

fixture`Validate the nike.com checkout`
  .page`https://www.nike.com/t/elite-crew-basketball-socks-3F6p8z/DB5472-010`.requestHooks(logger);

test('Add to bag and navigate to Checkout page', async (t) => {
  const sizeElement = Selector('input[name="skuAndSize"]:not(disabled) + label');
  await t.expect(sizeElement.exists).ok();
  await t.hover(sizeElement).click(sizeElement);
  // add to bag
  await t.click(Selector('.add-to-cart-btn'));
  // navigate to checkout
  await t.click(Selector('button[data-test="qa-cart-checkout"]'));
  // check that order summary exists
  await t.expect(Selector('div[data-attr="cart-total"]').exists).ok();
  // fill out shipping
  const firstName = Selector('#firstName');
  const lastName = Selector('#lastName');
  const addressSuggestionOptOut = Selector('#addressSuggestionOptOut');
  const addressBtn = Selector('button[aria-controls="address2"]');
  const address1 = Selector('#address1');
  const address2 = Selector('#address2');
  const city = Selector('#city');
  const state = Selector('#state');
  const postalCode = Selector('#postalCode');
  const email = Selector('#email');
  const phoneNumber = Selector('#phoneNumber');
  const btnSave = Selector('.saveAddressBtn');
  const continuePaymentBtn = Selector('.continuePaymentBtn');

  await t.expect(firstName.exists).ok().click(firstName).typeText(firstName, shippingInfo.firstName, { paste: true });
  await t.expect(lastName.exists).ok().click(lastName).typeText(lastName, shippingInfo.lastName, { paste: true });
  await t.click(addressSuggestionOptOut).click(addressBtn);
  await t.expect(address1.exists).ok().click(address1).typeText(address1, shippingInfo.address1, { paste: true });
  await t.expect(address2.exists).ok().click(address2).typeText(address2, shippingInfo.address2, { paste: true });
  await t.expect(city.exists).ok().click(city).typeText(city, shippingInfo.city, { paste: true });
  await t.expect(state.exists).ok().click(state).click(state.find('option').withText(shippingInfo.state));
  await t
    .expect(postalCode.exists)
    .ok()
    .click(postalCode)
    .typeText(postalCode, shippingInfo.postalCode, { paste: true });
  await t.expect(email.exists).ok().click(email).typeText(email, shippingInfo.email, { paste: true });
  await t
    .expect(phoneNumber.exists)
    .ok()
    .click(phoneNumber)
    .typeText(phoneNumber, shippingInfo.phoneNumber, { paste: true });

  // save and continue
  await t.expect(btnSave.exists).ok().click(btnSave);
  await t.wait(5000);
  await t.expect(continuePaymentBtn.exists).ok().click(continuePaymentBtn);
}).after(async (t) => console.log(logger.requests));
