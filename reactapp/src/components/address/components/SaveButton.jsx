import React from 'react';
import { bool, func, shape } from 'prop-types';

import Button from '../../common/Button';
import { __ } from '../../../i18n';

function SaveButton({ actions, isFormValid }) {
  return (
    <Button
      variant="primary"
      disable={!isFormValid}
      click={actions.saveAddress}
      className="!w-32 !py-2.5 !rounded-[4px] !h-11 !text-sm !font-semibold !flex !items-center !justify-center"
    >
      {__('Save')}
    </Button>
  );
}

SaveButton.propTypes = {
  isFormValid: bool,
  actions: shape({
    saveAddress: func,
  }),
};

SaveButton.defaultProps = {
  isFormValid: false,
  actions: {
    saveAddress: () => {},
  },
};

export default SaveButton;
