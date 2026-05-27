import React, { useState } from 'react';

import CouponCodeForm from './components/CouponCodeForm';
import CouponCodeFormikManager from './components/CouponCodeFormikManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';

const CouponCodeMemorized = React.memo(({ formikData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CouponCodeFormikManager formikData={formikData}>
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2.5 text-sm font-semibold text-gray-800 focus:outline-none"
        >
          <span>{__('Apply Coupon')}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="py-2.5">
            <CouponCodeForm />
          </div>
        )}
      </div>
    </CouponCodeFormikManager>
  );
});

CouponCodeMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default CouponCodeMemorized;
