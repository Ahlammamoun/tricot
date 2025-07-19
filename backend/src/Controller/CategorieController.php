<?php

namespace App\Controller;

use App\Repository\CategorieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;


class CategorieController extends AbstractController
{
    #[Route('/api/categories', name: 'api_categories', methods: ['GET'])]
    public function categories(CategorieRepository $categorieRepository): JsonResponse
    {
        $categories = $categorieRepository->findAll();

        $parents = [];

        foreach ($categories as $cat) {
            if (!$cat->getParent()) {
                $sousCategories = array_filter(
                    $categories,
                    fn($c) =>
                    $c->getParent() && $c->getParent()->getId() === $cat->getId()
                );

                $parents[] = [
                    'id' => $cat->getId(),
                    'nom' => $cat->getNom(),
                    'slug' => $cat->getSlug(),
                    'sousCategories' => array_values(array_map(fn($sous) => [
                        'id' => $sous->getId(),
                        'nom' => $sous->getNom(),
                        'slug' => $sous->getSlug(),
                    ], $sousCategories)),
                ];
            }
        }

        return $this->json($parents);
    }



    #[Route('/api/categorie/{id}/produits', name: 'api_categorie_produits', methods: ['GET'])]
    public function produitsParCategorie(int $id, CategorieRepository $categorieRepository, EntityManagerInterface $em): JsonResponse
    {
        $categorie = $categorieRepository->find($id);

        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }

        // Cherche tous les produits ayant cette catégorie OU une sous-catégorie
        $produits = $em->createQuery('
        SELECT p FROM App\Entity\Produit p
        JOIN p.categorie c
        WHERE c = :categorie OR c.parent = :categorie
    ')
            ->setParameter('categorie', $categorie)
            ->getResult();

        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'nom' => $p->getNom(),
            'prix' => $p->getPrix(),
            'image' => $p->getImage(),
        ], $produits);

        return $this->json($data);
    }

    #[Route('/api/categorie/{id}/produits-filtrés', name: 'api_categorie_produits_filtrés', methods: ['GET'])]
    public function produitsFiltrésParSousCategorie(
        int $id,
        Request $request,
        CategorieRepository $categorieRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $categorie = $categorieRepository->find($id);
        if (!$categorie) {
            return new JsonResponse(['error' => 'Catégorie non trouvée'], 404);
        }

        $sousCategorieId = $request->query->get('sousCategorie');

        $qb = $em->createQueryBuilder()
            ->select('p')
            ->from('App\Entity\Produit', 'p')
            ->join('p.categorie', 'c');

        if ($sousCategorieId) {
            $qb->where('c.id = :sousCatId')
                ->setParameter('sousCatId', $sousCategorieId);
        } else {
            // Tous les produits liés à la catégorie principale ou à ses sous-catégories
            $qb->where('c = :cat OR c.parent = :cat')
                ->setParameter('cat', $categorie);
        }

        $produits = $qb->getQuery()->getResult();

        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'nom' => $p->getNom(),
            'prix' => $p->getPrix(),
            'image' => $p->getImage(),
        ], $produits);

        return new JsonResponse($data);
    }




}
