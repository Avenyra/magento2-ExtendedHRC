import React, { useEffect, useState, useCallback } from 'react';
import { get as _get } from 'lodash-es';

import { _emptyFunc } from '../../../utils';
import useAppContext from '../../../hook/useAppContext';

function Message() {
  const { message, setMessage } = useAppContext();
  const [visible, setVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const msg = _get(message, 'message');
  const msgType = _get(message, 'type');

  const handleDismiss = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setMessage(false);
      setVisible(false);
      setIsFading(false);
    }, 300); // Wait for transition animation
  }, [setMessage]);

  useEffect(() => {
    if (message) {
      setVisible(true);
      setIsFading(false);
    } else {
      setVisible(false);
    }
  }, [message]);

  // auto-disappear message after some time.
  useEffect(() => {
    if (!message) {
      return _emptyFunc();
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, msgType, handleDismiss]);

  if (!visible || !msg) {
    return null;
  }

  const isError = msgType === 'error';

  return (
    <div
      className={`fixed top-6 right-6 z-50 w-full max-w-sm bg-white rounded-lg border-l-4 shadow-2xl p-4 flex items-start space-x-3 transform transition-all duration-300 ease-in-out ${
        isError ? 'border-red-600' : 'border-green-600'
      } ${
        isFading
          ? 'opacity-0 -translate-y-8 scale-95 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {isError ? (
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-grow min-w-0 pr-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {isError ? 'Error' : 'Success'}
        </p>
        <p className="text-sm font-semibold text-gray-800 break-words leading-snug">
          {msg}
        </p>
      </div>

      {/* Close Button */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Message;
