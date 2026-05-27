import React from 'react';

import Button from '../../../common/Button';
import { __ } from '../../../../i18n';
import { _toString } from '../../../../utils';
import LocalStorage from '../../../../utils/localStorage';
import { isCartAddressValid } from '../../../../utils/address';
import useBillingAddressCartContext from '../../hooks/useBillingAddressCartContext';
import useBillingAddressFormikContext from '../../hooks/useBillingAddressFormikContext';

function CancelButton() {
  const { cartBillingAddress } = useBillingAddressCartContext();
  const {
    backupAddress,
    setFormToViewMode,
    setSelectedAddress,
    setCustomerAddressSelected,
    setBillingAddressFormFields,
  } = useBillingAddressFormikContext();

  const clickHandler = () => {
    setBillingAddressFormFields({
      ...backupAddress,
      isSameAsShipping: LocalStorage.getBillingSameAsShippingInfo(),
    });
    setFormToViewMode();
    setCustomerAddressSelected(!!LocalStorage.getCustomerBillingAddressId());

    if (backupAddress.id) {
      setSelectedAddress(_toString(backupAddress.id));
    }
  };

  if (!isCartAddressValid(cartBillingAddress)) {
    return null;
  }

  return (
    <Button
      click={clickHandler}
      variant="secondary"
      className="!w-32 !py-2.5 !rounded-[4px] !h-11 !text-sm !font-semibold !flex !items-center !justify-center !border !border-gray-300 !text-gray-700 !bg-white hover:!bg-gray-50 hover:!border-gray-400 hover:!text-gray-800 transition-colors duration-150"
    >
      {__('Cancel')}
    </Button>
  );
}

export default CancelButton;
