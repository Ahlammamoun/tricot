<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/admin/categories')]
class CategoryAdminController extends AbstractController
{
    #[Route('', name: 'admin_categories_list', methods: ['GET'])]
    public function list(CategoryRepository $repo): JsonResponse
    {
        $categories = $repo->findAll();

        $data = array_map(function(Category $cat) {
            return [
                'id' => $cat->getId(),
                'name' => $cat->getName(),
                'slug' => $cat->getSlug(),
                'parent' => $cat->getParent() ? [
                    'id' => $cat->getParent()->getId(),
                    'name' => $cat->getParent()->getName(),
                ] : null,
            ];
        }, $categories);

        return $this->json($data);
    }

    #[Route('', name: 'admin_categories_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        CategoryRepository $repo,
        SluggerInterface $slugger
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || empty($data['name'])) {
            return $this->json(['error' => 'Invalid or missing name'], 400);
        }

        $category = new Category();
        $category->setName($data['name']);
        $category->setSlug($slugger->slug($data['name'])->lower());

        if (!empty($data['parentId'])) {
            $parent = $repo->find($data['parentId']);
            if ($parent) {
                $category->setParent($parent);
            }
        }

        $em->persist($category);
        $em->flush();

        return $this->json(['success' => true, 'id' => $category->getId()], 201);
    }

    #[Route('/{id}', name: 'admin_categories_show', methods: ['GET'])]
    public function show(int $id, CategoryRepository $repo): JsonResponse
    {
        $category = $repo->find($id);

        if (!$category) {
            return $this->json(['error' => 'Category not found'], 404);
        }

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'parent' => $category->getParent() ? [
                'id' => $category->getParent()->getId(),
                'name' => $category->getParent()->getName(),
            ] : null,
        ]);
    }

    #[Route('/{id}', name: 'admin_categories_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        CategoryRepository $repo,
        EntityManagerInterface $em,
        SluggerInterface $slugger
    ): JsonResponse {
        $category = $repo->find($id);

        if (!$category) {
            return $this->json(['error' => 'Category not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        if (!empty($data['name'])) {
            $category->setName($data['name']);
            $category->setSlug($slugger->slug($data['name'])->lower());
        }

        if (array_key_exists('parentId', $data)) {
            if ($data['parentId'] === null) {
                $category->setParent(null);
            } else {
                $parent = $repo->find($data['parentId']);
                if (!$parent) {
                    return $this->json(['error' => 'Parent category not found'], 400);
                }

                if ($parent->getId() === $category->getId()) {
                    return $this->json(['error' => 'Une catégorie ne peut pas être son propre parent'], 400);
                }

                if ($this->isDescendant($category, $parent)) {
                    return $this->json(['error' => 'Impossible de créer une boucle dans la hiérarchie'], 400);
                }

                $category->setParent($parent);
            }
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/{id}', name: 'admin_categories_delete', methods: ['DELETE'])]
    public function delete(int $id, CategoryRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $category = $repo->find($id);

        if (!$category) {
            return $this->json(['error' => 'Category not found'], 404);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(['success' => true]);
    }

    private function isDescendant(Category $parent, Category $child): bool
    {
        while ($child->getParent()) {
            if ($child->getParent()->getId() === $parent->getId()) {
                return true;
            }
            $child = $child->getParent();
        }
        return false;
    }
}
