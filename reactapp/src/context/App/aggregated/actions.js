import { get as _get } from 'lodash-es';
import { AGGREGATED_APP_DATA } from './types';

export async function storeAggregatedAppStatesAction(dispatch, data) {
  const { customer, countryList, checkoutAgreements, stateList } = data;
  const customerEmail = _get(customer, 'customer.email');

  return dispatch({
    type: AGGREGATED_APP_DATA,
    payload: {
      ...customer,
      stateList,
      countryList,
      checkoutAgreements,
      isLoggedIn: !!customerEmail,
    },
  });
}
