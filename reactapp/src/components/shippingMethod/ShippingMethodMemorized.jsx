import React, { useContext } from 'react';
import { get as _get } from 'lodash-es';

import ShippingMethodList from './components/ShippingMethodList';
import NoShippingMethodInfoBox from './components/NoShippingMethodInfoBox';
import ShippingMethodFormManager from './components/ShippingMethodFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useShippingMethodCartContext from './hooks/useShippingMethodCartContext';
import customRenderers from '../../shippingMethods/customRenderers';
import CartContext from '../../context/Cart/CartContext';
import { isCartAddressValid } from '../../utils/address';

const ShippingMethodMemorized = React.memo(({ formikData }) => {
  const { methodsAvailable } = useShippingMethodCartContext();
  const [cartData] = useContext(CartContext);
  const cartShippingAddress = _get(cartData, 'cart.shipping_address', {});
  const isAddressValid = isCartAddressValid(cartShippingAddress);

  return (
    <ShippingMethodFormManager formikData={formikData}>
      <div
        className={`space-y-3 ${
          isAddressValid && methodsAvailable ? '' : 'opacity-75'
        }`}
      >
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          {__('Shipping Method')}
        </h2>

        {isAddressValid ? (
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm px-6 py-2">
            <NoShippingMethodInfoBox />
            <ShippingMethodList methodRenderers={customRenderers} />
          </div>
        ) : (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-200 rounded-lg mt-3">
            <svg
              className="w-8 h-8 text-gray-400 mb-2 stroke-[1.5]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.228-3.602a5.625 5.625 0 00-5.495-5.278h-.577c-.504 0-.96.223-1.272.583L15 9.75M8.25 18.75h7.5"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500 max-w-sm">
              {__(
                'Please enter your shipping address to view available shipping methods.'
              )}
            </p>
          </div>
        )}
      </div>
    </ShippingMethodFormManager>
  );
});

ShippingMethodMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default ShippingMethodMemorized;
