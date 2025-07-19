<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminCategorieController extends AbstractController
{

    #[Route('/api/categories', name: 'api_categories', methods: ['GET'])]
    public function categories(CategorieRepository $categorieRepository): JsonResponse
    {
        $categories = $categorieRepository->findAll();

        $data = array_map(function ($cat) {
            return [
                'id' => $cat->getId(),
                'nom' => $cat->getNom(),
                'slug' => $cat->getSlug(),
                'parent' => $cat->getParent()
                    ? [
                        'id' => $cat->getParent()->getId(),
                        'nom' => $cat->getParent()->getNom(),
                    ]
                    : null,
            ];
        }, $categories);

        return $this->json($data);
    }


    // src/Controller/AdminCategorieController.php

    #[Route('/api/admin/categories/create', name: 'admin_categories_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, CategorieRepository $catRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['nom']) || empty($data['nom'])) {
            return $this->json(['error' => 'Nom obligatoire'], 400);
        }

        $categorie = new Categorie();
        $categorie->setNom($data['nom']);

        // gestion du slug simple (ajuste selon ton besoin)
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['nom'])));
        $categorie->setSlug($slug);

        // Si un parentId est fourni
        if (!empty($data['parentId'])) {
            $parent = $catRepo->find($data['parentId']);
            if ($parent) {
                $categorie->setParent($parent);
            }
        }

        $em->persist($categorie);
        $em->flush();

        return $this->json(['success' => true, 'id' => $categorie->getId()]);
    }


    #[Route('/api/admin/categories/{id}', name: 'admin_categories_update', methods: ['PUT'])]
    public function update(int $id, Request $request, CategorieRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $categorie = $repo->find($id);
        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $categorie->setNom($data['nom'] ?? $categorie->getNom());
        $categorie->setSlug(strtolower(trim(preg_replace('/[^a-z0-9]+/', '-', $categorie->getNom()))));

        // 🛠 GESTION DU PARENT (ajout / suppression du parent)
        if (array_key_exists('parentId', $data)) {
            $newParent = !empty($data['parentId']) ? $repo->find($data['parentId']) : null;
            $categorie->setParent($newParent);
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/admin/categories/{id}', name: 'admin_categories_delete', methods: ['DELETE'])]
    public function delete(int $id, CategorieRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $categorie = $repo->find($id);
        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }

        if (count($categorie->getProduits()) > 0) {
            return $this->json(['error' => 'Impossible de supprimer cette catégorie car des produits y sont associés.'], 400);
        }

        $em->remove($categorie);
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/admin/categories/{id}', name: 'admin_categories_show', methods: ['GET'])]
    public function show(int $id, CategorieRepository $repo): JsonResponse
    {
        $c = $repo->find($id);
        if (!$c) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }

        return $this->json([
            'id' => $c->getId(),
            'nom' => $c->getNom(),
        ]);
    }



    #[Route('/api/admin/categories', name: 'admin_categories', methods: ['GET'])]
    public function all(CategorieRepository $categorieRepository): JsonResponse
    {
        $categories = $categorieRepository->findAll();

        $data = array_map(function ($cat) {
            return [
                'id' => $cat->getId(),
                'nom' => $cat->getNom(),
                'slug' => $cat->getSlug(),
                'parent' => $cat->getParent()
                    ? ['id' => $cat->getParent()->getId(), 'nom' => $cat->getParent()->getNom()]
                    : null,
                'sousCategories' => $cat->getSousCategories()->map(fn($sub) => [
                    'id' => $sub->getId(),
                    'nom' => $sub->getNom()
                ])->toArray()
            ];
        }, $categories);

        return $this->json($data);
    }


}
