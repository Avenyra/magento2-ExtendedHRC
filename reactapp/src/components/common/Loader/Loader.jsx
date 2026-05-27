import React from 'react';
import { __ } from '../../../i18n';

// 1. Contact / Login Skeleton
export function ContactSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-100 rounded w-full border border-gray-200" />
      </div>
    </div>
  );
}

// 2. Shipping/Billing Address Skeleton
export function AddressSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-lg p-4 space-y-3 bg-slate-50"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-1.5 pl-6">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Shipping/Payment Methods Skeleton
export function MethodsSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm animate-pulse space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-slate-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Place Order / Pay Button Skeleton
export function ButtonSkeleton() {
  return (
    <div className="w-full py-4 animate-pulse">
      <div className="w-full h-14 bg-gray-200 rounded-[4px]" />
    </div>
  );
}

// 5. Cart Items Skeleton
export function CartItemsSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm animate-pulse space-y-4">
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
          >
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-12" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Totals Skeleton
export function TotalsSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm animate-pulse space-y-4">
      <div className="space-y-3 pb-3 border-b border-gray-100">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/5" />
          <div className="h-4 bg-gray-200 rounded w-8" />
        </div>
      </div>
      <div className="flex justify-between pt-1">
        <div className="h-5 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

// 7. Full Page Spinner (kept for fallback / dynamic updates)
function Loader() {
  return (
    <div className="z-20 flex-col items-center justify-center backdrop">
      <div
        className="w-12 h-12 mb-4 border-4 border-t-4 border-white rounded-full animate-spin"
        style={{ borderTopColor: '#3498db' }}
      />
      <h2 className="text-xl font-semibold text-center text-white">
        {__('Loading...')}
      </h2>
    </div>
  );
}

export default Loader;
