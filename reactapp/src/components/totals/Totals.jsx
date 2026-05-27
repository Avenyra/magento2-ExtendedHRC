import React from 'react';

import { __ } from '../../i18n';
import useTotalsCartContext from './hooks/useTotalsCartContext';

function Totals() {
  const {
    discounts,
    grandTotal,
    hasSubTotal,
    subTotalIncl,
    appliedTaxes,
    hasDiscounts,
    hasAppliedTaxes,
    hasShippingRate,
    shippingMethodRate,
    appliedCoupon,
  } = useTotalsCartContext();

  return (
    <div className="space-y-6">
      {/* Totals Card */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm space-y-3.5">
        {hasSubTotal && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">
              {__('Cart Subtotal')}
            </span>
            <span className="text-gray-800 font-semibold">{subTotalIncl}</span>
          </div>
        )}

        {hasShippingRate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{__('Shipping')}</span>
            <span className="text-gray-800 font-semibold">
              {shippingMethodRate}
            </span>
          </div>
        )}

        {hasAppliedTaxes &&
          appliedTaxes.map((appliedTax) => (
            <div
              key={appliedTax.label}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-600 font-medium">
                {__('Tax')} ({appliedTax.label})
              </span>
              <span className="text-gray-800 font-semibold">
                {appliedTax.price}
              </span>
            </div>
          ))}

        {hasDiscounts &&
          discounts.map((discount) => {
            const label = appliedCoupon
              ? `${__('Discount')} (${appliedCoupon})`
              : __('Discount');
            return (
              <div
                key={discount.label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-red-600 font-semibold">
                  {discount.price}
                </span>
              </div>
            );
          })}

        <div className="border-t border-gray-200 my-4" />

        <div className="flex justify-between items-center pt-1.5">
          <span className="text-xl font-bold text-gray-900">
            {__('Order Total')}
          </span>
          <span className="text-2xl font-extrabold text-gray-900">
            {grandTotal || '0'}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 mt-6 text-center divide-x divide-gray-200">
        {/* SSL Badge */}
        <div className="flex flex-col items-center justify-center px-1">
          <div className="relative w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-2 bg-white">
            <div className="absolute inset-0.5 rounded-full border border-dashed border-gray-200" />
            <svg
              className="w-5 h-5 text-slate-500 relative z-10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700 leading-tight block">
            {__('Secure Checkout')}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            {__('256-bit SSL')}
          </span>
        </div>

        {/* Privacy Badge */}
        <div className="flex flex-col items-center justify-center px-1">
          <div className="relative w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-2 bg-white">
            <div className="absolute inset-0.5 rounded-full border border-dashed border-gray-200" />
            <svg
              className="w-5 h-5 text-slate-500 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700 leading-tight block">
            {__('Privacy Protected')}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            {__('Your data is safe')}
          </span>
        </div>

        {/* Satisfaction Badge */}
        <div className="flex flex-col items-center justify-center px-1">
          <div className="relative w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-2 bg-white">
            <div className="absolute inset-0.5 rounded-full border border-dashed border-gray-200" />
            <svg
              className="w-5 h-5 text-slate-500 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 21l-.813-5.096L3 15l5.188-.813L9 9l.813 5.187L15 15l-5.188.813zm7.533-9.071L17 9l-.346-2.167L15 6.5l1.654-.333L17 4l.346 2.167 1.654.333-1.654.333z"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700 leading-tight block">
            {__('Satisfaction')}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            {__('Guaranteed')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Totals;
