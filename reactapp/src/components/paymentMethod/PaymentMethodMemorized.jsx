import React from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';

import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import PaymentMethodList from './components/PaymentMethodList';
import NoPaymentMethodInfoBox from './components/NoPaymentMethodInfoBox';
import PaymentMethodFormManager from './components/PaymentMethodFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import customRenderers from '../../paymentMethods/customRenderers';
import usePaymentMethodCartContext from './hooks/usePaymentMethodCartContext';

const PaymentMethodMemorized = React.memo(({ formikData }) => {
  const { isPaymentAvailable, doCartContainShippingAddress, isVirtualCart } =
    usePaymentMethodCartContext();

  const isAddressValid = isVirtualCart || doCartContainShippingAddress;

  let content = <NoPaymentMethodInfoBox />;

  if (!isAddressValid) {
    content = (
      <div className="py-8 px-4 flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-200 rounded-lg mt-3">
        <CreditCardIcon className="w-8 h-8 text-gray-400 mb-2 stroke-[1.5]" />
        <p className="text-sm font-medium text-gray-500 max-w-sm">
          {__(
            'Please enter your shipping address to view available payment methods.'
          )}
        </p>
      </div>
    );
  } else if (isPaymentAvailable) {
    content = <PaymentMethodList methodRenderers={customRenderers} />;
  }

  return (
    <PaymentMethodFormManager formikData={formikData}>
      <Card classes={isAddressValid && isPaymentAvailable ? '' : 'opacity-75'}>
        <ToggleBox show title={__('Payment Methods')}>
          {content}
        </ToggleBox>
      </Card>
    </PaymentMethodFormManager>
  );
});

PaymentMethodMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default PaymentMethodMemorized;
