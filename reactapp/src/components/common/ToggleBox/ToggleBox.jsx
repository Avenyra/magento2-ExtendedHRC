import React from 'react';
import { bool, node } from 'prop-types';

import Header from '../Header';

function ToggleBox({ children, title, small, hrLine }) {
  return (
    <div>
      <Header small={small}>{title}</Header>
      {hrLine && <hr />}
      <div>{children}</div>
    </div>
  );
}

ToggleBox.propTypes = {
  small: bool,
  hrLine: bool,
  title: node.isRequired,
  children: node.isRequired,
};

ToggleBox.defaultProps = {
  small: false,
  hrLine: false,
};

export default ToggleBox;
