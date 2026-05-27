import React from 'react';
import { bool, func, node, oneOf, string } from 'prop-types';

function Button({ children, click, variant, disable, size, className }) {
  return (
    <button
      className={`btn btn-${variant || 'primary'} btn-size-${size || 'md'} ${
        disable ? 'opacity-50 pointer-events-none' : ''
      } ${className || ''}`}
      type="button"
      onClick={click}
      disabled={disable}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  click: func,
  size: string,
  disable: bool,
  children: node.isRequired,
  className: string,
  variant: oneOf(['success', 'warning', 'primary', 'secondary', 'danger']),
};

Button.defaultProps = {
  size: 'md',
  variant: '',
  disable: false,
  className: '',
  click: () => {},
};

export default Button;
