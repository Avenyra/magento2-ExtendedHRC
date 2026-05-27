import React from 'react';

import CartItem from './CartItem';
import { __ } from '../../../i18n';
import useItemsFormContext from '../hooks/useItemsFormContext';

function CartItemList() {
  const { cartItems } = useItemsFormContext();

  return (
    <div className="py-2">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th
              className="py-2 text-xs font-semibold text-gray-500 w-[55%]"
              aria-label={__('Product')}
            />
            <th className="py-2 text-xs font-semibold text-gray-800 text-right pr-4 w-[15%]">
              {__('Price')}
            </th>
            <th className="py-2 text-xs font-semibold text-gray-800 text-center px-4 w-[15%]">
              {__('Qty')}
            </th>
            <th className="py-2 text-xs font-semibold text-gray-800 text-right pl-4 w-[15%]">
              {__('Subtotal')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cartItems.map((cartItem) => (
            <CartItem item={cartItem} key={cartItem.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartItemList;
