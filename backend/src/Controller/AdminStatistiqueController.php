<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use App\Repository\CommandeRepository;
use App\Repository\CommandeProduitRepository;
use App\Repository\UtilisateurRepository;
use App\Repository\AvisRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminStatistiqueController extends AbstractController
{
    #[Route('/api/admin/stats', name: 'admin_stats', methods: ['GET'])]
    public function index(
        ProduitRepository $produitRepo,
        CommandeRepository $commandeRepo,
        CommandeProduitRepository $commandeProduitRepo,
        UtilisateurRepository $userRepo,
        AvisRepository $avisRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $nbProduits = $produitRepo->count([]);
        $nbCommandes = $commandeRepo->count([]);
        $nbUtilisateurs = $userRepo->count([]);
        $nbAvis = $avisRepo->count([]);

        // Total des ventes
        $totalVentes = $commandeRepo->createQueryBuilder('c')
            ->select('SUM(c.total)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        // Produit le plus vendu (par quantité)
        $conn = $em->getConnection();
        $sql = "
            SELECT p.nom, SUM(cp.quantite) AS totalVendus
            FROM commande_produit cp
            JOIN produit p ON p.id = cp.produit_id
            GROUP BY cp.produit_id
            ORDER BY totalVendus DESC
            LIMIT 1
        ";
        $result = $conn->executeQuery($sql)->fetchAssociative();

        // Quantité totale vendue tous produits
        $quantiteTotaleVendue = $commandeProduitRepo->createQueryBuilder('cp')
            ->select('SUM(cp.quantite)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        // Stock total
        $stockTotal = $produitRepo->createQueryBuilder('p')
            ->select('SUM(p.stock)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        // Utilisateurs connectés récemment (30 jours)
        $recentUsers = $userRepo->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.lastLogin >= :date')
            ->setParameter('date', new \DateTimeImmutable('-30 days'))
            ->getQuery()
            ->getSingleScalarResult();

        return new JsonResponse([
            'produits' => $nbProduits,
            'commandes' => $nbCommandes,
            'utilisateurs' => $nbUtilisateurs,
            'utilisateursRecents' => (int)$recentUsers,
            'avis' => $nbAvis,
            'totalVentes' => (float) $totalVentes,
            'produitPlusVendu' => $result['nom'] ?? null,
            'quantitePlusVendue' => (int) ($result['totalVendus'] ?? 0),
            'quantiteTotaleVendue' => (int) $quantiteTotaleVendue,
            'stockTotal' => (int) $stockTotal,
        ]);
    }
}
