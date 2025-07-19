<?php

namespace App\Controller;

use App\Entity\Commande;
use App\Repository\CommandeRepository;
use App\Service\StripeCheckoutService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    #[Route('/api/checkout/{id}', name: 'checkout')]
    public function checkout(
        int $id,
        CommandeRepository $orderRepository,
        StripeCheckoutService $stripeService,
        EntityManagerInterface $em
    ): RedirectResponse {
        $order = $orderRepository->find($id);

        if (!$order) {
            throw $this->createNotFoundException('Commande introuvable');
        }

        $session = $stripeService->createCheckoutSession($order);
        $order->setStripeSessionId($session->id);
        $em->flush();
        // dd($session->url);
        return $this->redirect($session->url);
    }


    #[Route('/api/order/by-session/{sessionId}', name: 'order_by_session', methods: ['GET'])]
    public function getOrderBySession(
        string $sessionId,
        CommandeRepository $orderRepository
    ): JsonResponse {
        $order = $orderRepository->findOneBy(['stripeSessionId' => $sessionId]);

        if (!$order) {
            return $this->json(['error' => 'Commande introuvable'], 404);
        }

        $items = [];

        foreach ($order->getCommandeProduits() as $item) {
            $product = $item->getProduit();
            $items[] = [
                'product' => $product ? $product->getNom() : 'Produit supprimé',
                'quantity' => $item->getQuantite(),
                'price' => $item->getPrixUnitaire(),
            ];
        }

        return $this->json([
            'id' => $order->getId(),
            'status' => $order->getStatus(),
            'total' => $order->getTotal(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
            'items' => $items,
        ]);
    }



}
