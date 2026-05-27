import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { get as _get } from 'lodash-es';
import {
  useCouponCodeAppContext,
  useCouponCodeFormContext,
  useCouponCodeCartContext,
} from '../hooks';
import { __ } from '../../../i18n';

function CouponCodeForm() {
  const [codeChecked, setCodeChecked] = useState('');
  const [showSuccessInline, setShowSuccessInline] = useState(false);
  const { fields, formikData, setFieldError, setFieldTouched, setFieldValue } =
    useCouponCodeFormContext();
  const { setPageLoader, setSuccessMessage, setErrorMessage } =
    useCouponCodeAppContext();
  const { appliedCoupon, applyCouponCode, removeCouponCode } =
    useCouponCodeCartContext();
  const couponCode = formikData?.formSectionValues?.couponCode;

  const handleApplyCoupon = async (code) => {
    try {
      setPageLoader(true);

      const result = await applyCouponCode(code);

      if (result?.appliedCoupon) {
        setFieldValue(fields.appliedCode, result?.appliedCoupon);
      }

      setCodeChecked(code);
      setSuccessMessage(
        __('Coupon code: %1 is applied successfully.', couponCode)
      );
      setShowSuccessInline(true);
    } catch (error) {
      console.error(error);
      setCodeChecked(code);
      setErrorMessage(
        error?.message || __('Coupon code: %1 is invalid.', couponCode)
      );
    } finally {
      setPageLoader(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setPageLoader(true);
      await removeCouponCode();
      setFieldValue(fields.couponCode, '');
      setFieldValue(fields.appliedCode, '');
      setCodeChecked('');
      setSuccessMessage(
        __('Coupon code: %1 is removed successfully.', couponCode)
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message);
    } finally {
      setPageLoader(false);
    }
  };

  const submitHandler = async () => {
    if (!couponCode) {
      await setFieldTouched(fields.couponCode);
      await setFieldError(fields.couponCode, __('Required'));
      return;
    }

    await handleApplyCoupon(couponCode);
  };

  useEffect(() => {
    if (appliedCoupon) {
      setCodeChecked(appliedCoupon);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    if (showSuccessInline) {
      const timer = setTimeout(() => {
        setShowSuccessInline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showSuccessInline]);

  const relativeFieldName = 'couponCode';
  const hasFieldError = !!_get(
    formikData?.formSectionErrors,
    relativeFieldName
  );
  const hasFieldTouched = !!_get(
    formikData?.formSectionTouched,
    relativeFieldName
  );
  const hasError = hasFieldError && hasFieldTouched;
  const value =
    _get(formikData?.formSectionValues, relativeFieldName, '') || '';

  return (
    <div className="py-1">
      <div className="flex gap-3 items-center">
        <div className="flex-grow">
          <Field
            name={fields.couponCode}
            id={fields.couponCode}
            value={appliedCoupon || value}
            type="text"
            disabled={!!appliedCoupon}
            placeholder={__('Enter your discount code')}
            onChange={(event) => {
              const newValue = event.target.value;
              setFieldTouched(fields.couponCode, newValue);
              setFieldValue(fields.couponCode, newValue);
            }}
            className={`form-input w-full ${
              hasError ? 'border-dashed border-red-500' : ''
            }`}
          />
        </div>
        <div className="flex-shrink-0">
          {appliedCoupon ? (
            <button
              onClick={handleRemoveCoupon}
              type="button"
              className="px-6 h-[46px] flex items-center justify-center border border-transparent text-sm font-semibold rounded-[4px] text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
            >
              {__('Remove')}
            </button>
          ) : (
            <button
              onClick={submitHandler}
              type="button"
              disabled={!value || value === codeChecked}
              className="px-6 h-[46px] flex items-center justify-center border border-transparent text-sm font-semibold rounded-[4px] text-white bg-[#535c68] hover:bg-[#434b55] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {__('Apply')}
            </button>
          )}
        </div>
      </div>

      {hasError && (
        <div className="feedback text-sm text-red-500 mt-1">
          <ErrorMessage name={fields.couponCode} />
        </div>
      )}

      {showSuccessInline && appliedCoupon && (
        <div className="flex justify-between items-center mt-3 text-sm">
          <div className="flex items-center space-x-1.5 text-green-600 font-medium">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <span>{__('Coupon "%1" applied', appliedCoupon)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponCodeForm;
