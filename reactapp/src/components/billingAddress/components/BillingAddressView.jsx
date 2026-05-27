import React, { useState } from 'react';
import {
  PencilIcon,
  PlusIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  isCartAddressValid,
  formatAddressListToCardData,
  prepareFormAddressFromCartAddress,
} from '../../../utils/address';
import { CART_BILLING_ADDRESS } from '../utility';
import { __ } from '../../../i18n';
import useBillingAddressAppContext from '../hooks/useBillingAddressAppContext';
import useBillingAddressCartContext from '../hooks/useBillingAddressCartContext';
import useBillingAddressFormikContext from '../hooks/useBillingAddressFormikContext';

function BillingAddressView() {
  const {
    editMode,
    selectedAddress,
    setIsNewAddress,
    setBackupAddress,
    setFormToEditMode,
    setSelectedAddress,
    setCustomerAddressSelected,
    resetBillingAddressFormFields,
    setBillingAddressFormFields,
    submitHandler,
  } = useBillingAddressFormikContext();

  const { cartBillingAddress } = useBillingAddressCartContext();
  const { isLoggedIn, customerAddressList, stateList } =
    useBillingAddressAppContext();

  const [showAllAddresses, setShowAllAddresses] = useState(false);

  // If in edit mode, don't show the view panel
  if (editMode) {
    return null;
  }

  // Click handlers
  const handleAddNewAddress = () => {
    setIsNewAddress(true);
    setBackupAddress({ ...cartBillingAddress, id: selectedAddress });
    setSelectedAddress(CART_BILLING_ADDRESS);
    setCustomerAddressSelected(false);
    resetBillingAddressFormFields();
    setFormToEditMode();
  };

  const handleEditAddress = (addressId) => {
    const customerAddress = customerAddressList[addressId];
    const addressToBackup = customerAddress || cartBillingAddress;

    setBackupAddress({ ...addressToBackup });
    setBillingAddressFormFields(
      prepareFormAddressFromCartAddress({ ...addressToBackup })
    );
    setSelectedAddress(addressId);
    setFormToEditMode();
  };

  const handleSelectAddress = async (addressId) => {
    const customerAddress = customerAddressList[addressId];
    if (!customerAddress) return;

    setSelectedAddress(addressId);
    setCustomerAddressSelected(true);
    setBillingAddressFormFields(
      prepareFormAddressFromCartAddress({ ...customerAddress })
    );

    // Save billing address
    await submitHandler(addressId);
  };

  // --- Guest View ---
  if (!isLoggedIn) {
    const isCartValid = isCartAddressValid(cartBillingAddress);
    if (!isCartValid) return null;

    const formattedAddress = formatAddressListToCardData(
      [{ id: selectedAddress, ...cartBillingAddress }],
      stateList
    )[0];

    return (
      <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md mt-4 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <MapPinIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {__('Billing Address')}
            </div>
            <div className="text-sm font-semibold text-gray-800 mt-1">
              {formattedAddress.address.slice(0, -1).join(', ')}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {formattedAddress.address.slice(-1)[0]}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleEditAddress(selectedAddress)}
          className="flex items-center space-x-1.5 text-xs font-bold text-[#1976d2] hover:text-[#1565c0] transition-colors uppercase tracking-wider border border-gray-200 px-3 py-1.5 rounded-md hover:bg-slate-50"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          <span>{__('Edit')}</span>
        </button>
      </div>
    );
  }

  // --- Logged-In Customer View ---
  const addresses = Object.values(customerAddressList || {});
  const displayAddresses = showAllAddresses ? addresses : addresses.slice(0, 2);

  return (
    <div className="mt-4 space-y-4 animate-fade-in">
      {addresses.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-500">
          {__('No saved addresses found. Please add a new billing address.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayAddresses.map((addr) => {
            const idStr = String(addr.id);
            const isSelected = selectedAddress === idStr;
            const isDefault = addr.isDefaultBilling;
            const fullName = `${addr.firstname} ${addr.lastname}`;

            return (
              <div
                key={addr.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectAddress(idStr);
                  }
                }}
                onClick={() => handleSelectAddress(idStr)}
                className={`border rounded-lg p-4 cursor-pointer relative transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1976d2] bg-[#f8fbff] shadow-sm ring-1 ring-[#1976d2]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="billing_address_select"
                        value={idStr}
                        checked={isSelected}
                        onChange={() => handleSelectAddress(idStr)}
                        className="h-4 w-4 text-[#1976d2] border-gray-300 focus:ring-[#1976d2] cursor-pointer"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        {fullName}
                      </span>
                      {isDefault && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                          {__('Default')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(idStr);
                      }}
                      className="text-gray-400 hover:text-[#1976d2] transition-colors p-1"
                      title={__('Edit Address')}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 pl-6">
                    {addr.company && <div>{addr.company}</div>}
                    <div>{addr.street.join(', ')}</div>
                    <div>{`${addr.city}, ${addr.region || ''} ${
                      addr.zipcode
                    }`}</div>
                    <div>{addr.country}</div>
                    {addr.phone && (
                      <div className="text-gray-400 mt-1">
                        {__('Phone: %1', addr.phone)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer controls: Add New and Show All */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleAddNewAddress}
          className="flex items-center space-x-1.5 text-sm font-bold text-[#1976d2] hover:text-[#1565c0] transition-colors uppercase tracking-wider"
        >
          <PlusIcon className="w-4 h-4 stroke-[3]" />
          <span>{__('Add new address')}</span>
        </button>

        {addresses.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllAddresses(!showAllAddresses)}
            className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-md px-3 py-1.5 bg-white shadow-sm hover:bg-gray-50"
          >
            <UsersIcon className="w-4 h-4" />
            <span>
              {showAllAddresses
                ? __('Show less addresses')
                : __('Show all addresses')}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default BillingAddressView;
