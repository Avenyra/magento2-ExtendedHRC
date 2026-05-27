import useAppContext from '../../../hook/useAppContext';

export default function usePlaceOrderAppContext() {
  const {
    isLoggedIn,
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
  } = useAppContext();

  return {
    isLoggedIn,
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
  };
}
