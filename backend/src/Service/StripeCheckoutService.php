<?php

namespace App\Service;

use App\Entity\Commande;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeCheckoutService
{
    public function __construct(private string $stripeSecretKey)
    {
        Stripe::setApiKey($this->stripeSecretKey);
    }

    public function createCheckoutSession(Commande $order): Session
    {
        $lineItems = [];

        foreach ($order->getCommandeProduits() as $item) {
            $product = $item->getProduit();

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $product->getNom(),
                    ],
                    'unit_amount' => (int) ($item->getPrixUnitaire() * 100),
                ],
                'quantity' => $item->getQuantite(),
            ];
        }

        if ($order->getShippingCost() > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Frais de livraison',
                    ],
                    'unit_amount' => (int) ($order->getShippingCost() * 100),
                ],
                'quantity' => 1,
            ];
        }
        
        return Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => 'http://localhost/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost/payment/cancel',

        ]);
    }
}
