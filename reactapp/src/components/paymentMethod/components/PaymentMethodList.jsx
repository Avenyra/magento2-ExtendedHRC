import React, { useState } from 'react';
import { object } from 'prop-types';
import {
  LockClosedIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import { __ } from '../../../i18n';
import { classNames, _objToArray } from '../../../utils';
import usePaymentMethodCartContext from '../hooks/usePaymentMethodCartContext';
import usePaymentMethodFormContext from '../hooks/usePaymentMethodFormContext';

function PaymentMethodList({ methodRenderers }) {
  const { fields, submitHandler, formikData } = usePaymentMethodFormContext();
  const {
    methodList: rawMethodList,
    isVirtualCart,
    doCartContainShippingAddress,
  } = usePaymentMethodCartContext();
  const { paymentValues, setFieldValue, setFieldTouched } = formikData;
  const paymentAvailable = isVirtualCart || doCartContainShippingAddress;

  const [selectedMethodCode, setSelectedMethodCode] = useState(
    paymentValues?.code || ''
  );
  const [ccNumber, setCcNumber] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');

  const handlePaymentMethodSelection = async (methodSelected) => {
    if (!methodSelected) return;

    setSelectedMethodCode(methodSelected);
    await setFieldValue(fields.code, methodSelected);
    setFieldTouched(fields.code, true);

    if (
      !methodRenderers[methodSelected] &&
      methodSelected !== 'credit_card_mock'
    ) {
      await submitHandler(methodSelected);
    }
  };

  // Convert raw method list to array and inject a mock Credit Card option if not already present
  const methods = _objToArray(rawMethodList);
  const hasCreditCard = methods.some(
    (m) =>
      m.code === 'credit_card' ||
      m.code.includes('cc') ||
      m.code.includes('card')
  );

  if (!hasCreditCard && paymentAvailable) {
    // Inject custom credit card mock
    methods.unshift({
      code: 'credit_card_mock',
      title: __('Credit Card'),
    });
  }

  return (
    <div
      title={
        !paymentAvailable ? __('Please provide a shipping address first.') : ''
      }
      className={classNames(
        !paymentAvailable ? 'cursor-not-allowed opacity-40' : '',
        'py-2 mt-3'
      )}
    >
      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = selectedMethodCode === method.code;
          const MethodRenderer = methodRenderers[method.code];

          return (
            <div
              key={method.code}
              className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-[#1976d2] bg-[#f8fbff] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Radio selection header */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    paymentAvailable &&
                    (e.key === 'Enter' || e.key === ' ')
                  ) {
                    handlePaymentMethodSelection(method.code);
                  }
                }}
                onClick={() =>
                  paymentAvailable && handlePaymentMethodSelection(method.code)
                }
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.code}
                    disabled={!paymentAvailable}
                    checked={isSelected}
                    onChange={() => handlePaymentMethodSelection(method.code)}
                    className="h-4 w-4 text-[#1976d2] border-gray-300 focus:ring-[#1976d2] cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-800">
                    {method.title}
                  </span>
                </div>

                {/* Credit card icons if it is the credit card option */}
                {(method.code === 'credit_card_mock' ||
                  method.code.includes('cc') ||
                  method.code.includes('card')) && (
                  <div className="flex items-center space-x-1">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/349/349221.png"
                      alt="Visa"
                      className="h-5 w-auto"
                    />
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/349/349228.png"
                      alt="Mastercard"
                      className="h-5 w-auto"
                    />
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/349/349230.png"
                      alt="Amex"
                      className="h-5 w-auto"
                    />
                  </div>
                )}
              </div>

              {/* Collapsible content (e.g. credit card form) */}
              {isSelected &&
                (method.code === 'credit_card_mock' ||
                  method.code.includes('cc') ||
                  method.code.includes('card')) && (
                  <div className="px-4 pb-5 pt-1 border-t border-gray-100 bg-white space-y-4 animate-fade-in">
                    <div className="relative">
                      <label
                        htmlFor="ccNumber"
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                      >
                        {__('Card Number')}
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          id="ccNumber"
                          type="text"
                          value={ccNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const groups = val.match(/.{1,4}/g);
                            setCcNumber(groups ? groups.join(' ') : val);
                          }}
                          maxLength="19"
                          placeholder="4111 2222 3333 4444"
                          className="block w-full rounded-md border-gray-300 pr-10 text-sm focus:border-[#1976d2] focus:ring-[#1976d2]"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <LockClosedIcon
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="ccName"
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                      >
                        {__('Name on Card')}
                      </label>
                      <input
                        id="ccName"
                        type="text"
                        value={ccName}
                        onChange={(e) => setCcName(e.target.value)}
                        placeholder="Veronica Costello"
                        className="block w-full rounded-md border-gray-300 text-sm focus:border-[#1976d2] focus:ring-[#1976d2]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="ccExpiry"
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                        >
                          {__('Expiration Date')}
                        </label>
                        <input
                          id="ccExpiry"
                          type="text"
                          value={ccExpiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 2) {
                              setCcExpiry(val);
                            } else {
                              setCcExpiry(
                                `${val.slice(0, 2)}/${val.slice(2, 4)}`
                              );
                            }
                          }}
                          maxLength="5"
                          placeholder="MM / YY"
                          className="block w-full rounded-md border-gray-300 text-sm focus:border-[#1976d2] focus:ring-[#1976d2]"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="ccCvv"
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                        >
                          {__('Security Code (CVV)')}
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            id="ccCvv"
                            type="password"
                            value={ccCvv}
                            onChange={(e) => setCcCvv(e.target.value)}
                            maxLength="4"
                            placeholder="123"
                            className="block w-full rounded-md border-gray-300 pr-10 text-sm focus:border-[#1976d2] focus:ring-[#1976d2]"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <QuestionMarkCircleIcon
                              className="h-4 w-4 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Standard renderer container if applicable */}
              {isSelected && MethodRenderer && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-white">
                  <MethodRenderer
                    method={method}
                    selected={paymentValues}
                    actions={{ change: handlePaymentMethodSelection }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

PaymentMethodList.propTypes = {
  methodRenderers: object,
};

PaymentMethodList.defaultProps = {
  methodRenderers: {},
};

export default PaymentMethodList;
