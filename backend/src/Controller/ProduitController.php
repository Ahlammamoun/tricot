<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use App\Repository\AvisRepository;
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


#[Route('/api/avis/produit/{id}', name: 'avis_par_produit', methods: ['GET'])]
public function avisParProduit(int $id, AvisRepository $avisRepo): JsonResponse {
    $avis = $avisRepo->findBy(['produit' => $id], ['createdAt' => 'DESC']);

    $data = array_map(fn($a) => [
        'note' => $a->getNote(),
        'commentaire' => $a->getCommentaire(),
        'auteur' => $a->getUtilisateur()->getPrenom(),
        'date' => $a->getCreatedAt()->format('Y-m-d'),
    ], $avis);

    return new JsonResponse($data);
}

#[Route('/api/avis', name: 'all_avis', methods: ['GET'])]
public function allAvis(AvisRepository $avisRepo): JsonResponse {
    $avis = $avisRepo->findBy([], ['createdAt' => 'DESC'], 5);

    $data = array_map(fn($a) => [
        'note' => $a->getNote(),
        'commentaire' => $a->getCommentaire(),
        'auteur' => $a->getUtilisateur()?->getPrenom(),
        'date' => $a->getCreatedAt()?->format('Y-m-d'),
        'produit' => [
            'id' => $a->getProduit()?->getId(),
            'nom' => $a->getProduit()?->getNom(),
            'image' => $a->getProduit()?->getImage(),
        ]
    ], $avis);

    return new JsonResponse($data);
}




}