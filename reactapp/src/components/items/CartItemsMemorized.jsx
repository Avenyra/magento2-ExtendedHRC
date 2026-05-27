import React from 'react';

import CartItemList from './components/CartItemList';
import NoItemsInfoBox from './components/NoItemsInfoBox';
import CartItemsFormManager from './components/CartItemsFormManager';
import { formikDataShape } from '../../utils/propTypes';
import useItemsCartContext from './hooks/useItemsCartContext';

const CartItemsMemorized = React.memo(({ formikData }) => {
  const { cartItemsAvailable } = useItemsCartContext();

  return (
    <CartItemsFormManager formikData={formikData}>
      <div className={cartItemsAvailable ? '' : 'opacity-75'}>
        {cartItemsAvailable ? <CartItemList /> : <NoItemsInfoBox />}
      </div>
    </CartItemsFormManager>
  );
});

CartItemsMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default CartItemsMemorized;
