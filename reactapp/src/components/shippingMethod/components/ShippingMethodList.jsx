import React from 'react';
import { object } from 'prop-types';

import RadioInput from '../../common/Form/RadioInput';
import { _objToArray } from '../../../utils';
import { SHIPPING_METHOD } from '../../../config';
import useShippingMethodFormContext from '../hooks/useShippingMethodFormContext';
import useShippingMethodCartContext from '../hooks/useShippingMethodCartContext';

function ShippingMethodList({ methodRenderers }) {
  const {
    fields,
    submitHandler,
    setFieldValue,
    selectedMethod,
    setFieldTouched,
  } = useShippingMethodFormContext();
  const { methodsAvailable, methodList } = useShippingMethodCartContext();
  const { carrierCode: methodCarrierCode, methodCode: methodMethodCode } =
    selectedMethod || {};
  const selectedMethodId = `${methodCarrierCode}__${methodMethodCode}`;

  const handleShippingMethodSelection = async (event) => {
    const methodSelected = methodList[event.target.value];
    const { carrierCode, methodCode, id: methodId } = methodSelected;

    if (methodId === selectedMethodId) {
      return;
    }

    setFieldValue(SHIPPING_METHOD, { carrierCode, methodCode });
    setFieldTouched(fields.carrierCode, true);
    setFieldTouched(fields.methodCode, true);
    await submitHandler({ carrierCode, methodCode });
  };

  if (!methodsAvailable) {
    return null;
  }

  return (
    <div>
      <ul>
        {_objToArray(methodList).map((method) => {
          const { id: methodId, carrierTitle, methodTitle, price } = method;
          const MethodRenderer = methodRenderers[methodId];

          return (
            <li
              key={methodId}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0"
            >
              {MethodRenderer ? (
                <MethodRenderer
                  method={method}
                  selected={selectedMethod}
                  actions={{ change: handleShippingMethodSelection }}
                />
              ) : (
                <>
                  <div className="flex items-center flex-grow -mt-2">
                    <RadioInput
                      value={methodId}
                      label={`${carrierTitle} (${methodTitle})`}
                      name="shippingMethod"
                      checked={selectedMethodId === methodId}
                      onChange={handleShippingMethodSelection}
                    />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {price}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

ShippingMethodList.propTypes = {
  methodRenderers: object,
};

ShippingMethodList.defaultProps = {
  methodRenderers: {},
};

export default ShippingMethodList;
