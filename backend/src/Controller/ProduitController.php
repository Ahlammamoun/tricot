<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;


class ProduitController extends AbstractController
{

#[Route('/api/produits/{id}', name: 'api_produit_show', methods: ['GET'])]
public function show(int $id, ProduitRepository $produitRepository): JsonResponse
{
    $produit = $produitRepository->find($id);

    if (!$produit) {
        return $this->json(['error' => 'Produit non trouvé'], 404);
    }

    return $this->json([
        'id' => $produit->getId(),
        'nom' => $produit->getNom(),
        'prix' => $produit->getPrix(),
        'image' => $produit->getImage(),
        'images' => array_map(fn($img) => $img->getPath(), $produit->getImages()->toArray()), 
        'description' => $produit->getDescription(),
        'categorie' => $produit->getCategorie()?->getNom()
    ]);
}

}