<?php
declare(strict_types=1);

namespace Avenyra\ExtendedHRC\Plugin;

use Magento\Customer\CustomerData\Customer;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Integration\Model\Oauth\TokenFactory;

class CustomerDataPlugin
{
    /**
     * @param CustomerSession $customerSession
     * @param TokenFactory $tokenFactory
     */
    public function __construct(
        private readonly CustomerSession $customerSession,
        private readonly TokenFactory $tokenFactory
    ) {}

    /**
     * Inject signin_token into customer section data to prevent it from being wiped out by customer-data.js.
     *
     * @param Customer $subject
     * @param array $result
     * @return array
     */
    public function afterGetSectionData(Customer $subject, array $result): array
    {
        if ($this->customerSession->isLoggedIn()) {
            $customerId = (int)$this->customerSession->getCustomerId();
            if ($customerId) {
                try {
                    $token = $this->tokenFactory->create()
                        ->createCustomerToken($customerId)
                        ->getToken();
                    $result['signin_token'] = $token;
                } catch (\Exception $e) {
                    // Fail silently to avoid breaking private content load
                }
            }
        }
        return $result;
    }
}
