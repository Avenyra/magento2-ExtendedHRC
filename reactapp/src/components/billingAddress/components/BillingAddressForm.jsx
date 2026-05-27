import React from 'react';

import { SaveButton } from '../../address';
import TextInput from '../../common/Form/TextInput';
import SelectInput from '../../common/Form/SelectInput';
import CancelButton from './billingAddressForm/CancelButton';
import SaveInBookCheckbox from '../../address/components/SaveInBookCheckbox';
import { __ } from '../../../i18n';
import { _keys } from '../../../utils';
import LocalStorage from '../../../utils/localStorage';
import { isValidCustomerAddressId } from '../../../utils/address';
import useCountryState from '../../address/hooks/useCountryState';
import useAddressWrapper from '../../address/hooks/useAddressWrapper';
import useBillingAddressAppContext from '../hooks/useBillingAddressAppContext';
import useFormValidateThenSubmit from '../../../hook/useFormValidateThenSubmit';
import useBillingAddressFormikContext from '../hooks/useBillingAddressFormikContext';

function BillingAddressForm() {
  const {
    fields,
    formId,
    viewMode,
    formikData,
    submitHandler,
    handleKeyDown,
    billingValues,
    isBillingSame,
    setFieldValue,
    setIsNewAddress,
    selectedAddress,
    setFieldTouched,
    validationSchema,
    setSelectedAddress,
  } = useBillingAddressFormikContext();
  const { isLoggedIn } = useBillingAddressAppContext();
  const { reCalculateMostRecentAddressOptions } = useAddressWrapper();
  const formSubmitHandler = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
    validationSchema,
  });
  const { countryOptions, stateOptions, hasStateOptions } = useCountryState({
    fields,
    formikData,
  });
  const { selectedCountry, isBillingAddressTouched } = formikData;

  const saveAddressAction = async () => {
    let newAddressId = selectedAddress;

    // Updating mostRecentAddressList in prior to form submit; Because values
    // there would be used in the submit action if the address is from
    // mostRecentAddressList.
    if (isLoggedIn) {
      if (isValidCustomerAddressId(selectedAddress)) {
        // This means a customer address been edited and now changed and submitted.
        // So treat this as a new address;
        const recentAddressList = LocalStorage.getMostRecentlyUsedAddressList();
        newAddressId = `new_address_${_keys(recentAddressList).length + 1}`;
        LocalStorage.addAddressToMostRecentlyUsedList(
          billingValues,
          newAddressId
        );
      } else {
        LocalStorage.updateMostRecentlyAddedAddress(
          newAddressId,
          billingValues
        );
      }
    }

    await formSubmitHandler(newAddressId);

    if (!isLoggedIn) {
      return;
    }

    setIsNewAddress(false);
    setSelectedAddress(newAddressId);
    LocalStorage.saveCustomerAddressInfo(newAddressId, isBillingSame, false);
    reCalculateMostRecentAddressOptions();
  };

  const handleCountryChange = (event) => {
    const newValue = event.target.value;
    setFieldTouched(fields.country, newValue);
    setFieldValue(fields.country, newValue);
    // when country is changed, then always reset region field.
    setFieldValue(fields.region, '');
  };

  if (viewMode) {
    return null;
  }

  return (
    <>
      <div className="py-2 space-y-4">
        <TextInput
          required
          name={fields.company}
          formikData={formikData}
          label={__('Company')}
          onKeyDown={handleKeyDown}
          placeholder={__('Company')}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            required
            name={fields.firstname}
            formikData={formikData}
            label={__('First name')}
            onKeyDown={handleKeyDown}
            placeholder={__('First name')}
          />
          <TextInput
            required
            name={fields.lastname}
            label={__('Last name')}
            formikData={formikData}
            onKeyDown={handleKeyDown}
            placeholder={__('Last name')}
          />
        </div>

        <TextInput
          required
          label={__('Street Address')}
          formikData={formikData}
          onKeyDown={handleKeyDown}
          placeholder={__('Street address line 1')}
          name={`${fields.street}[0]`}
        />

        <TextInput
          label={__('Apartment, suite, etc. (optional)')}
          formikData={formikData}
          onKeyDown={handleKeyDown}
          placeholder={__('Apartment, suite, etc. (optional)')}
          name={`${fields.street}[1]`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={!selectedCountry || !hasStateOptions ? 'col-span-2' : ''}
          >
            <SelectInput
              required
              label={__('Country')}
              name={fields.country}
              formikData={formikData}
              options={countryOptions}
              onChange={handleCountryChange}
            />
          </div>
          <SelectInput
            required
            label={__('State')}
            name={fields.region}
            options={stateOptions}
            formikData={formikData}
            isHidden={!selectedCountry || !hasStateOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            required
            placeholder="12345"
            name={fields.zipcode}
            formikData={formikData}
            label={__('Postal Code')}
            onKeyDown={handleKeyDown}
          />
          <TextInput
            required
            label={__('City')}
            name={fields.city}
            formikData={formikData}
            placeholder={__('City')}
            onKeyDown={handleKeyDown}
          />
        </div>

        <TextInput
          required
          label={__('Phone')}
          name={fields.phone}
          formikData={formikData}
          onKeyDown={handleKeyDown}
          placeholder={__('+32 000 000 000')}
        />
        {isLoggedIn && (
          <SaveInBookCheckbox fields={fields} formikData={formikData} />
        )}
      </div>

      <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
        <CancelButton />
        <SaveButton
          isFormValid={isBillingAddressTouched}
          actions={{ saveAddress: saveAddressAction }}
        />
      </div>
    </>
  );
}

export default BillingAddressForm;
