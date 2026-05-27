<?php
declare(strict_types=1);

namespace Avenyra\ExtendedHRC\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Theme\Block\Html\Header\Logo;

class AddLogoToCheckoutConfig implements ObserverInterface
{
    /**
     * @var Logo
     */
    private $logo;

    /**
     * @param Logo $logo
     */
    public function __construct(Logo $logo)
    {
        $this->logo = $logo;
    }

    /**
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer): void
    {
        $transport = $observer->getTransport();
        $outputData = $transport->getOutput();

        // Inject dynamic logo configuration from active Magento theme/backend config
        $outputData['logo_src'] = $this->logo->getLogoSrc();
        $outputData['logo_alt'] = $this->logo->getLogoAlt();

        $transport->setOutput($outputData);
    }
}
