<?php

namespace App\Controller;

use App\Entity\Commande;
use App\Entity\Avis;
use App\Entity\CommandeProduit;
use App\Repository\CommandeRepository;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class OrderFromCartController extends AbstractController
{
    #[Route('/api/order-from-cart', name: 'order_from_cart', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function orderFromCart(
        Request $request,
        ProduitRepository $productRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || !isset($data['products']) || !is_array($data['products'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $productsData = $data['products'];
        $shippingAddress = $data['shippingAddress'] ?? null;

        $order = new Commande();
        $order->setUtilisateur($this->getUser());
        $order->setCreatedAt(new \DateTime());
        $order->setStatus('created');

        if ($shippingAddress) {
            $order->setShippingAddress($shippingAddress);
        }

        $total = 0;

        foreach ($productsData as $item) {
            if (!isset($item['id'], $item['quantity'])) {
                continue;
            }

            $product = $productRepository->find($item['id']);
            if (!$product) {
                continue;
            }

            $quantity = max(1, (int) $item['quantity']);
            $price = $product->getPrix();

            $orderItem = new CommandeProduit();
            $orderItem->setCommande($order);
            $orderItem->setProduit($product);
            $orderItem->setQuantite($quantity);
            $orderItem->setPrixUnitaire($price);

            $order->addCommandeProduit($orderItem); // ✅ lier dans l'autre sens
            $em->persist($orderItem);

            $total += $price * $quantity;
        }

        if ($total === 0) {
            return new JsonResponse(['error' => 'Panier vide ou produits invalides'], 400);
        }

        $shippingCost = $total >= 50 ? 0 : 1;

        $order->setShippingCost($shippingCost);
        $order->setTotal($total + $shippingCost);

        $em->persist($order);
        $em->flush();

        return new JsonResponse(['orderId' => $order->getId()]);
    }

    #[Route('/api/my-orders', name: 'my_orders', methods: ['GET'])]
    public function myOrders(CommandeRepository $orderRepository, Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non autorisé'], 401);
        }

        $orders = $orderRepository->findWithProduitsByUser($user);

        $response = [];
        foreach ($orders as $order) {
            $items = [];
            foreach ($order->getCommandeProduits() as $item) {
                // dd($item->getProduit()); 
                $product = $item->getProduit();
                $items[] = [
                    'productId' => $product->getId(),
                    'product' => $product->getNom(),
                    'quantity' => $item->getQuantite(),
                    'price' => $item->getPrixUnitaire(),
                    'image' => $product->getImage(),
                ];
            }

            $response[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
                'total' => (float) $order->getTotal(),
                'shippingCost' => (float) $order->getShippingCost(),
                'products' => $items,
                'image' => $items[0]['image'] ?? null,
                'adress' => $order->getShippingAddress(),
                'status' => $order->getStatus(),
            ];
        }
        // dd($response);
        return new JsonResponse($response);
    }


#[Route('/api/avis', name: 'post_avis', methods: ['POST'])]
#[IsGranted('ROLE_USER')]
public function postAvis(
    Request $request,
    EntityManagerInterface $em,
    ProduitRepository $produitRepo
): JsonResponse {
    $data = json_decode($request->getContent(), true);
    $user = $this->getUser();

    $produitId = $data['produit_id'] ?? null;
    $commentaire = trim($data['commentaire'] ?? '');
    $note = (int) ($data['note'] ?? 0);

    if (!$produitId || $note < 1 || $note > 5 || $commentaire === '') {
        return new JsonResponse(['error' => 'Données invalides'], 400);
    }

    $produit = $produitRepo->find($produitId);
    if (!$produit) {
        return new JsonResponse(['error' => 'Produit introuvable'], 404);
    }

    // 🔒 Vérifie si un avis existe déjà pour ce couple utilisateur/produit
    $existing = $em->getRepository(\App\Entity\Avis::class)->findOneBy([
        'utilisateur' => $user,
        'produit' => $produit,
    ]);

    if ($existing) {
        return new JsonResponse(['error' => 'Vous avez déjà laissé un avis pour ce produit.'], 409);
    }

    $avis = new \App\Entity\Avis();
    $avis->setProduit($produit);
    $avis->setUtilisateur($user);
    $avis->setCommentaire($commentaire);
    $avis->setNote($note);
    $avis->setCreatedAt(new \DateTimeImmutable());

    $em->persist($avis);
    $em->flush();

    return new JsonResponse(['success' => true], 201);
}

}
