import React from 'react';
import { useFormikContext } from 'formik';
import { get as _get } from 'lodash-es';

import Checkbox from '../../common/Form/Checkbox';
import {
  isCartAddressValid,
  isValidCustomerAddressId,
  billingSameAsShippingField,
  CART_SHIPPING_ADDRESS,
} from '../../../utils/address';
import { __ } from '../../../i18n';
import { BILLING_ADDR_FORM, SHIPPING_ADDR_FORM } from '../../../config';
import { _toString } from '../../../utils';
import LocalStorage from '../../../utils/localStorage';
import useAddressWrapper from '../../address/hooks/useAddressWrapper';
import useShippingAddressAppContext from '../hooks/useShippingAddressAppContext';
import useShippingAddressCartContext from '../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../hooks/useShippingAddressFormikContext';

function BillingSameAsShippingCheckbox() {
  const {
    cartBillingAddress,
    cartShippingAddress,
    setCartBillingAddress,
    setCustomerAddressAsBillingAddress,
  } = useShippingAddressCartContext();

  const shippingFormContext = useShippingAddressFormikContext() || {};
  const globalFormik = useFormikContext() || {};

  const setFieldValue =
    shippingFormContext.setFieldValue || globalFormik.setFieldValue;
  const isBillingSame =
    shippingFormContext.isBillingSame !== undefined
      ? shippingFormContext.isBillingSame
      : !!_get(globalFormik.values, billingSameAsShippingField);

  const shippingValues =
    shippingFormContext.shippingValues ||
    _get(globalFormik.values, SHIPPING_ADDR_FORM);

  const selectedAddress =
    shippingFormContext.selectedAddress ||
    _toString(LocalStorage.getCustomerShippingAddressId()) ||
    CART_SHIPPING_ADDRESS;

  const isFormSectionValid =
    shippingFormContext.isFormSectionValid !== undefined
      ? shippingFormContext.isFormSectionValid
      : isCartAddressValid(cartShippingAddress);

  const { isLoggedIn, setPageLoader, setErrorMessage, setSuccessMessage } =
    useShippingAddressAppContext();
  const { setBillingSelected, setIsBillingCustomerAddress } =
    useAddressWrapper();

  const makeBillingSameAsShippingRequest = async () => {
    const billingIsSame = true;
    const isCustomerAddress = isValidCustomerAddressId(selectedAddress);
    const successMessage = __('Billing address made same as shipping address');

    try {
      if (!isLoggedIn || (isLoggedIn && !isCustomerAddress)) {
        setPageLoader(true);
        await setCartBillingAddress({ ...shippingValues });
        setFieldValue(BILLING_ADDR_FORM, {
          ...shippingValues,
          isSameAsShipping: billingIsSame,
        });
        setSuccessMessage(successMessage);
      } else if (isLoggedIn && isCustomerAddress) {
        setPageLoader(true);
        await setCustomerAddressAsBillingAddress(
          selectedAddress,
          billingIsSame
        );
        setSuccessMessage(successMessage);
      }

      setBillingSelected(selectedAddress);
      setIsBillingCustomerAddress(isCustomerAddress);

      LocalStorage.saveCustomerAddressInfo(
        selectedAddress,
        billingIsSame,
        false
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(__('Billing address update failed. Please try again.'));
    } finally {
      setPageLoader(false);
    }
  };

  const toggleBillingEqualsShippingState = async () => {
    const newSameAsShipping = !isBillingSame;
    setFieldValue(billingSameAsShippingField, newSameAsShipping);
    LocalStorage.saveBillingSameAsShipping(newSameAsShipping);

    if (newSameAsShipping && isFormSectionValid) {
      await makeBillingSameAsShippingRequest();
    }
  };

  if (
    !isCartAddressValid(cartShippingAddress) &&
    isCartAddressValid(cartBillingAddress)
  ) {
    return null;
  }

  return (
    <Checkbox
      isChecked={isBillingSame}
      name={billingSameAsShippingField}
      onChange={toggleBillingEqualsShippingState}
      label={__('Billing address is same as shipping address')}
    />
  );
}

export default BillingSameAsShippingCheckbox;
