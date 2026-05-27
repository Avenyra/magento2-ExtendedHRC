import React, { useEffect, useState } from 'react';

import Login from '../login';
import Totals from '../totals';
import CartItemsForm from '../items';
import PlaceOrder from '../placeOrder';
import CouponCode from '../couponCode';
import Message from '../common/Message';
import PageLoader, {
  ContactSkeleton,
  AddressSkeleton,
  MethodsSkeleton,
  ButtonSkeleton,
  CartItemsSkeleton,
  TotalsSkeleton,
} from '../common/Loader';
import { AddressWrapper } from '../address';
import PaymentMethod from '../paymentMethod';
import BillingAddress from '../billingAddress';
import ShippingAddress from '../shippingAddress';
import ShippingMethodsForm from '../shippingMethod';
import CheckoutAgreements from '../checkoutAgreements';

import { config } from '../../config';
import { aggregatedQueryRequest } from '../../api';
import LocalStorage from '../../utils/localStorage';
import { __ } from '../../i18n';
import RootElement from '../../utils/rootElement';
import useCheckoutFormContext from '../../hook/useCheckoutFormContext';
import useCheckoutFormAppContext from './hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from './hooks/useCheckoutFormCartContext';

function CheckoutForm() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { logo_src: logoSrc, logo_alt: logoAlt } =
    RootElement.getCheckoutConfig() || {};
  const [isRequestSent, setIsRequestSent] = useState(false);
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { orderId, isVirtualCart, storeAggregatedCartStates } =
    useCheckoutFormCartContext();
  const { pageLoader, appDispatch, storeAggregatedAppStates, isLoggedIn } =
    useCheckoutFormAppContext();

  /**
   * Collect App, Cart data when the page loads.
   */
  useEffect(() => {
    if (isRequestSent) {
      return;
    }

    if (!LocalStorage.getCartId()) {
      LocalStorage.saveCartId(config.cartId);
    }

    (async () => {
      try {
        setIsRequestSent(true);
        const data = await aggregatedQueryRequest(appDispatch);
        storeAggregatedCartStates(data);
        storeAggregatedAppStates(data);
        storeAggregatedFormStates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialLoading(false);
      }
    })();
  }, [
    appDispatch,
    isRequestSent,
    storeAggregatedAppStates,
    storeAggregatedCartStates,
    storeAggregatedFormStates,
  ]);

  if (orderId && config.isDevelopmentMode) {
    return (
      <div className="flex flex-col items-center justify-center mx-10 my-10">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex flex-col items-center justify-center mt-4 space-y-3">
          <div>Your order is placed.</div>
          <div>{`Order Number: #${orderId}`}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Message />
      <div className="w-full bg-white border-b border-gray-200 py-6 flex justify-center">
        <a href={config.baseUrl || '/'}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt || 'store logo'}
              className="max-h-12 object-contain cursor-pointer"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-950 tracking-tight flex items-center cursor-pointer">
              Logo
            </span>
          )}
        </a>
      </div>

      <div className="min-h-screen w-full bg-white flex justify-center">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-white">
          {/* Left Column: Contact, Shipping, Payment, etc. */}
          <div className="w-full lg:w-[58%] bg-white py-8 px-4 sm:px-6 md:px-8 lg:pr-12 flex justify-end">
            <div className="w-full max-w-xl space-y-6">
              {isInitialLoading ? (
                <>
                  {!isLoggedIn && <ContactSkeleton />}
                  <AddressSkeleton title={__('Shipping Address')} />
                  <AddressSkeleton title={__('Billing Address')} />
                  <MethodsSkeleton title={__('Shipping Methods')} />
                  <MethodsSkeleton title={__('Payment Methods')} />
                  <ButtonSkeleton />
                </>
              ) : (
                <>
                  {!isLoggedIn && <Login />}

                  <AddressWrapper>
                    {!isVirtualCart && <ShippingAddress />}
                    <BillingAddress />
                    {!isVirtualCart && <ShippingMethodsForm />}
                    <PaymentMethod />
                  </AddressWrapper>

                  <PlaceOrder />
                </>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (Items, Totals) */}
          <div className="w-full lg:w-[42%] bg-[#f9fafb] border-t lg:border-t-0 lg:border-l border-gray-200 py-8 px-4 sm:px-6 md:px-8 lg:pl-12">
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {__('Order Summary')}
              </h2>
              {isInitialLoading ? (
                <>
                  <CartItemsSkeleton />
                  <TotalsSkeleton />
                </>
              ) : (
                <>
                  <CartItemsForm />
                  <CouponCode />
                  <Totals />
                  <CheckoutAgreements />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {pageLoader && <PageLoader />}
    </>
  );
}

export default CheckoutForm;
