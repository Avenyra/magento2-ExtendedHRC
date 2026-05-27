import React, { useState } from 'react';
import { get as _get } from 'lodash-es';
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

import LoginFormManager from './components/LoginFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useLoginFormContext from './hooks/useLoginFormContext';
import TextInput from '../common/Form/TextInput';
import useFormValidateThenSubmit from '../../hook/useFormValidateThenSubmit';

function LoginInner() {
  const {
    fields,
    formId,
    editMode,
    formikData,
    submitHandler,
    handleKeyDown,
    loginFormValues,
    validationSchema,
    setFieldValue,
    setFormToEditMode,
  } = useLoginFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const emailVal = _get(loginFormValues, 'email', '');

  // Form submit handlers
  const handleLoginSubmit = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
    validationSchema,
  });

  const handleGuestSubmit = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
    validationSchema,
  });

  if (!editMode) {
    return (
      <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <EnvelopeIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {__('Customer Information')}
            </div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">
              {emailVal}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={setFormToEditMode}
          className="flex items-center space-x-1.5 text-xs font-bold text-[#1976d2] hover:text-[#1565c0] transition-colors uppercase tracking-wider border border-gray-200 px-3 py-1.5 rounded-md hover:bg-slate-50"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          <span>{__('Edit')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {__('Customer Information')}
        </h2>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        {/* Tabs */}
        <div className="flex bg-gray-50">
          <button
            type="button"
            onClick={async () => {
              setActiveTab('login');
              await setFieldValue(fields.customerWantsToSignIn, true);
            }}
            style={
              activeTab === 'login'
                ? {
                    borderBottom: '3px solid #1976d2',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    backgroundColor: '#ffffff',
                  }
                : {
                    borderBottom: '1px solid #e5e7eb',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                  }
            }
            className="w-1/2 py-3.5 text-center text-sm font-semibold transition-all duration-150 focus:outline-none"
          >
            {__('Login')}
          </button>
          <button
            type="button"
            onClick={async () => {
              setActiveTab('guest');
              await setFieldValue(fields.customerWantsToSignIn, false);
            }}
            style={
              activeTab === 'guest'
                ? {
                    borderBottom: '3px solid #1976d2',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    backgroundColor: '#ffffff',
                  }
                : {
                    borderBottom: '1px solid #e5e7eb',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                  }
            }
            className="w-1/2 py-3.5 text-center text-sm font-semibold transition-all duration-150 focus:outline-none"
          >
            {__('Continue as Guest')}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <div className="space-y-4">
              <TextInput
                required
                type="email"
                label={__('Email address')}
                name={fields.email}
                formikData={formikData}
                onKeyDown={handleKeyDown}
                placeholder={__('Enter your email')}
              />

              <div className="relative">
                <TextInput
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  label={__('Password')}
                  name={fields.password}
                  formikData={formikData}
                  onKeyDown={handleKeyDown}
                  placeholder={__('Enter your password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="/customer/account/forgotpassword/"
                  className="text-xs font-semibold text-[#1976d2] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {__('Forgot password?')}
                </a>
                <button
                  onClick={async () => {
                    await setFieldValue(fields.customerWantsToSignIn, true);
                    handleLoginSubmit();
                  }}
                  type="button"
                  style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
                  className="hover:opacity-90 font-semibold py-2 px-6 rounded-[4px] transition-colors text-sm shadow-sm"
                >
                  {__('Log in')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <TextInput
                required
                type="email"
                label={__('Email address')}
                name={fields.email}
                formikData={formikData}
                onKeyDown={handleKeyDown}
                placeholder={__('Enter your email')}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={async () => {
                    await setFieldValue(fields.customerWantsToSignIn, false);
                    handleGuestSubmit();
                  }}
                  type="button"
                  style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
                  className="hover:opacity-90 font-semibold py-2 px-6 rounded-[4px] transition-colors text-sm shadow-sm"
                >
                  {__('Continue')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LoginMemorized = React.memo(({ formikData }) => (
  <LoginFormManager formikData={formikData}>
    <LoginInner />
  </LoginFormManager>
));

LoginMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default LoginMemorized;
