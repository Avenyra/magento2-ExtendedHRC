import React from 'react';
import { get as _get } from 'lodash-es';
import { useFormikContext } from 'formik';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import {
  LOGIN_FORM,
  SHIPPING_METHOD,
  BILLING_ADDR_FORM,
  SHIPPING_ADDR_FORM,
  PAYMENT_METHOD_FORM,
  CHECKOUT_AGREEMENTS_FORM,
} from '../../../config';
import {
  hasLoginErrors,
  hasPaymentMethodErrors,
  hasBillingAddressErrors,
  hasShippingMethodErrors,
  hasShippingAddressErrors,
  hasTermsAndConditionsAgreed,
} from '../utility';
import { __ } from '../../../i18n';
import usePlaceOrder from '../hooks/usePlaceOrder';
import usePlaceOrderAppContext from '../hooks/usePlaceOrderAppContext';
import usePlaceOrderCartContext from '../hooks/usePlaceOrderCartContext';
import useCheckoutFormContext from '../../../hook/useCheckoutFormContext';
import { focusOnFormErrorElement, scrollToElement } from '../../../utils/form';

const customerWantsToSignInField = `${LOGIN_FORM}.customerWantsToSignIn`;

function PlaceOrder() {
  const formikData = useFormikContext();
  const validateThenPlaceOrder = usePlaceOrder();
  const { isVirtualCart } = usePlaceOrderCartContext();
  const { executeBeforePlaceOrderActions } = useCheckoutFormContext();
  const { setMessage, setErrorMessage, setPageLoader, isLoggedIn } =
    usePlaceOrderAppContext();
  const { values, errors, dirty, setFieldTouched } = formikData;
  const focusActions = { setFieldTouched };

  const handlePerformPlaceOrder = async () => {
    setMessage(false);

    if (!dirty) {
      return;
    }

    if (!isLoggedIn && hasLoginErrors(errors)) {
      const customerWantsToSignIn = _get(values, customerWantsToSignInField);
      setErrorMessage(
        __(
          customerWantsToSignIn
            ? 'Please provide your login details.'
            : 'Please provide your email address.'
        )
      );
      focusOnFormErrorElement(LOGIN_FORM, errors, focusActions);
      return;
    }

    if (hasShippingAddressErrors(errors)) {
      setErrorMessage(__('Please provide your shipping address information.'));
      focusOnFormErrorElement(SHIPPING_ADDR_FORM, errors, focusActions);
      return;
    }

    if (hasBillingAddressErrors(errors, values, isVirtualCart)) {
      setErrorMessage(__('Please provide your billing address information.'));
      focusOnFormErrorElement(BILLING_ADDR_FORM, errors, focusActions);
      return;
    }

    if (hasShippingMethodErrors(errors)) {
      setErrorMessage(__('Please select your shipping method.'));
      scrollToElement(SHIPPING_METHOD);
      return;
    }

    if (hasPaymentMethodErrors(errors)) {
      setErrorMessage(__('Please select your payment method.'));
      scrollToElement(PAYMENT_METHOD_FORM);
      return;
    }

    if (hasTermsAndConditionsAgreed(errors)) {
      setErrorMessage(__('Please agree with the terms & conditions'));
      scrollToElement(CHECKOUT_AGREEMENTS_FORM);
      return;
    }

    try {
      setPageLoader(true);
      await executeBeforePlaceOrderActions(formikData);
      await validateThenPlaceOrder(values);
      setPageLoader(false);
    } catch (error) {
      console.error(error);
      setPageLoader(false);
    }
  };

  return (
    <div className="w-full py-4">
      <button
        onClick={handlePerformPlaceOrder}
        type="button"
        disabled={!dirty}
        className="w-full bg-[#ee5f1a] hover:bg-[#d85218] disabled:bg-[#e6e6e6] disabled:text-[#999999] disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-[4px] transition-all duration-150 text-base flex items-center justify-center space-x-2"
      >
        <LockClosedIcon className="w-5 h-5 text-white opacity-90" />
        <span>{__('Pay now')}</span>
      </button>
    </div>
  );
}

export default PlaceOrder;
