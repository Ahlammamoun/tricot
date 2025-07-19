<?php

namespace App\Controller;

use App\Entity\Commande;
use App\Repository\CommandeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AdminCommandeController extends AbstractController
{
    #[Route('/api/admin/commandes', name: 'admin_commandes_list', methods: ['GET'])]
    public function index(CommandeRepository $repo): JsonResponse
    {
        $commandes = $repo->findAll();

        $data = array_map(function (Commande $commande) {
            return [
                'id' => $commande->getId(),
                'status' => $commande->getStatus(),
                'createdAt' => $commande->getCreatedAt()?->format('Y-m-d H:i:s'),
                'total' => $commande->getTotal(),
                'shippingAddress' => $commande->getShippingAddress(),
                'shippingCost' => $commande->getShippingCost(),
                'stripeSessionId' => $commande->getStripeSessionId(),
                'utilisateur' => $commande->getUtilisateur()
                    ? [
                        'id' => $commande->getUtilisateur()->getId(),
                        'email' => $commande->getUtilisateur()->getEmail(),
                    ] : null,
                'commandeProduits' => array_map(function ($cp) {
                    return [
                        'id' => $cp->getId(),
                        'quantite' => $cp->getQuantite(),
                        'prixUnitaire' => $cp->getPrixUnitaire(),
                        'produit' => $cp->getProduit()
                            ? [
                                'id' => $cp->getProduit()->getId(),
                                'nom' => $cp->getProduit()->getNom(),
                            ] : null,
                    ];
                }, $commande->getCommandeProduits()->toArray())
            ];
        }, $commandes);

        return $this->json($data);
    }

    #[Route('/api/admin/commandes/{id}', name: 'admin_commandes_show', methods: ['GET'])]
    public function show(int $id, CommandeRepository $repo): JsonResponse
    {
        $commande = $repo->find($id);
        if (!$commande) {
            return $this->json(['error' => 'Commande non trouvée'], 404);
        }

        return $this->json([
            'id' => $commande->getId(),
            'status' => $commande->getStatus(),
            'createdAt' => $commande->getCreatedAt()?->format('Y-m-d H:i:s'),
            'total' => $commande->getTotal(),
            'shippingAddress' => $commande->getShippingAddress(),
            'shippingCost' => $commande->getShippingCost(),
            'stripeSessionId' => $commande->getStripeSessionId(),
            'utilisateur' => $commande->getUtilisateur()
                ? [
                    'id' => $commande->getUtilisateur()->getId(),
                    'email' => $commande->getUtilisateur()->getEmail(),
                ] : null,
            'commandeProduits' => array_map(function ($cp) {
                return [
                    'id' => $cp->getId(),
                    'quantite' => $cp->getQuantite(),
                    'prixUnitaire' => $cp->getPrixUnitaire(),
                    'produit' => $cp->getProduit()
                        ? [
                            'id' => $cp->getProduit()->getId(),
                            'nom' => $cp->getProduit()->getNom(),
                        ] : null,
                ];
            }, $commande->getCommandeProduits()->toArray())
        ]);
    }

    #[Route('/api/admin/commandes/{id}', name: 'admin_commandes_update', methods: ['PUT'])]
    public function update(int $id, Request $request, CommandeRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $commande = $repo->find($id);
        if (!$commande) {
            return $this->json(['error' => 'Commande non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['status'])) {
            return $this->json(['error' => 'Données invalides ou manquantes'], 400);
        }

        $commande->setStatus($data['status']);
        $em->flush();

        return $this->json(['success' => true, 'message' => 'Commande mise à jour']);
    }

    #[Route('/api/admin/commandes/{id}', name: 'admin_commandes_delete', methods: ['DELETE'])]
    public function delete(int $id, CommandeRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $commande = $repo->find($id);
        if (!$commande) {
            return $this->json(['error' => 'Commande non trouvée'], 404);
        }

        $em->remove($commande);
        $em->flush();

        return $this->json(['success' => true, 'message' => 'Commande supprimée']);
    }
}
