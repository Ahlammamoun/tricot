<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
#[Route('/api/produits', name: 'api_produits')]
public function produits(ProduitRepository $produitRepository): JsonResponse
{
    $produits = $produitRepository->findBy([], null, 15);
// dd($produits);
    return $this->json(array_map(fn($p) => [
        'id' => $p->getId(),
        'nom' => $p->getNom(),
        'prix' => $p->getPrix(),
        'image' => $p->getImage()
    ], $produits));
}
}