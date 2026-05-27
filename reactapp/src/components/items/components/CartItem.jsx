import React from 'react';
import { shape, string } from 'prop-types';

function CartItem({ item }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-3 w-[55%]">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-[8px] overflow-hidden bg-white p-1 flex items-center justify-center">
            <img
              className="max-w-full max-h-full object-contain"
              alt={item.productSku}
              src={item.productSmallImgUrl}
            />
          </div>
          <div className="flex-grow min-w-0">
            <div className="text-sm font-semibold text-gray-800 break-words leading-tight">
              {item.productName}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              SKU: {item.productSku}
            </div>
            {item.isConfigurable && (
              <ul className="text-xs text-gray-400 mt-1 space-y-0.5">
                {item.selectedConfigOptions.map((configOption) => (
                  <li key={configOption.optionId}>{configOption.label}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 text-sm text-gray-700 text-right pr-4 align-middle w-[15%]">
        {item.price}
      </td>
      <td className="py-3 text-sm text-gray-700 text-center px-4 align-middle w-[15%]">
        {item.quantity}
      </td>
      <td className="py-3 text-sm text-gray-800 text-right pl-4 align-middle font-semibold w-[15%]">
        {item.rowTotal}
      </td>
    </tr>
  );
}

CartItem.propTypes = {
  item: shape({
    id: string,
  }).isRequired,
};

export default CartItem;
