import React from 'react';

import Button from '../../../common/Button';
import {
  isCartAddressValid,
  isValidCustomerAddressId,
} from '../../../../utils/address';
import { __ } from '../../../../i18n';
import { _toString } from '../../../../utils';
import LocalStorage from '../../../../utils/localStorage';
import useShippingAddressCartContext from '../../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../../hooks/useShippingAddressFormikContext';

function CancelButton() {
  const {
    backupAddress,
    setFormToViewMode,
    setSelectedAddress,
    setCustomerAddressSelected,
    setShippingAddressFormFields,
  } = useShippingAddressFormikContext();
  const { cartShippingAddress } = useShippingAddressCartContext();

  const clickHandler = () => {
    setShippingAddressFormFields({ ...backupAddress });
    setFormToViewMode();
    setCustomerAddressSelected(
      isValidCustomerAddressId(LocalStorage.getCustomerShippingAddressId())
    );

    if (backupAddress.id) {
      setSelectedAddress(_toString(backupAddress.id));
    }
  };

  if (!isCartAddressValid(cartShippingAddress)) {
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
