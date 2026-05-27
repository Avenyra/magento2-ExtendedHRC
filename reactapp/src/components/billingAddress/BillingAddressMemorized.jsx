import React from 'react';

import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import BillingAddressForm from './components/BillingAddressForm';
import BillingAddressView from './components/BillingAddressView';
import BillingAddressFormikProvider from './components/BillingAddressFormikProvider';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useBillingAddressCartContext from './hooks/useBillingAddressCartContext';
import BillingSameAsShippingCheckbox from '../shippingAddress/components/BillingSameAsShippingCheckbox';

const BillingAddressMemorized = React.memo(({ formikData }) => {
  const { isBillingSame } = formikData;
  const { isVirtualCart } = useBillingAddressCartContext();

  return (
    <BillingAddressFormikProvider formikData={formikData}>
      <Card>
        <ToggleBox title={__('Billing Address')} show>
          <div className="py-2 border-b border-gray-100 pb-3">
            <BillingSameAsShippingCheckbox />
          </div>
          {(!isBillingSame || isVirtualCart) && (
            <div className="mt-4">
              <BillingAddressForm />
              <BillingAddressView />
            </div>
          )}
        </ToggleBox>
      </Card>
    </BillingAddressFormikProvider>
  );
});

BillingAddressMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default BillingAddressMemorized;
