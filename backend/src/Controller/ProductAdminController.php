<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductImage;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductAdminController extends AbstractController
{
    #[Route('/api/admin/products', name: 'admin_products_list', methods: ['GET'])]
    public function list(ProductRepository $repo): JsonResponse
    {
        $products = $repo->findAll();

        $data = array_map(function (Product $p) {
            return [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'slug' => $p->getSlug(),
                'description' => $p->getDescription(),
                'price' => $p->getPrice(),
                'stock' => $p->getStock(),
                'createdAt' => $p->getCreatedAt()?->format('Y-m-d H:i:s'),
                'mainCategory' => $p->getMainCategory() ? [
                    'id' => $p->getMainCategory()->getId(),
                    'name' => $p->getMainCategory()->getName()
                ] : null,
                'subCategory' => $p->getSubCategory() ? [
                    'id' => $p->getSubCategory()->getId(),
                    'name' => $p->getSubCategory()->getName()
                ] : null,
                'subSubCategory' => $p->getSubSubCategory() ? [
                    'id' => $p->getSubSubCategory()->getId(),
                    'name' => $p->getSubSubCategory()->getName()
                ] : null,
                'images' => array_map(fn(ProductImage $img) => $img->getPath(), $p->getImages()->toArray()),
            ];
        }, $products);

        return $this->json($data);
    }

    #[Route('/api/admin/products', name: 'admin_products_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, CategoryRepository $catRepo): JsonResponse
    {
        $product = new Product();
        $product->setName($request->request->get('name', ''));
        $product->setSlug($request->request->get('slug', ''));
        $product->setDescription($request->request->get('description', ''));
        $product->setPrice(floatval($request->request->get('price', 0)));
        $product->setStock(intval($request->request->get('stock', 0)));
        $product->setCreatedAt(new \DateTimeImmutable());

        $mainId = $request->request->get('mainCategoryId');
        $subId = $request->request->get('subCategoryId');
        $subSubId = $request->request->get('subSubCategoryId');

        if ($mainId) $product->setMainCategory($catRepo->find($mainId));
        if ($subId) $product->setSubCategory($catRepo->find($subId));
        if ($subSubId) $product->setSubSubCategory($catRepo->find($subSubId));

        $images = $request->files->get('images');
        if ($images) {
            foreach ($images as $uploadedFile) {
                $filename = uniqid() . '.' . $uploadedFile->guessExtension();
                $uploadedFile->move($this->getParameter('uploads_directory'), $filename);

                $image = new ProductImage();
                $image->setPath($filename);
                $product->addImage($image);
                $em->persist($image);
            }
        }

        $em->persist($product);
        $em->flush();

        return $this->json(['success' => true, 'id' => $product->getId()], 201);
    }

    #[Route('/api/admin/products/{id}', name: 'admin_products_update', methods: ['POST'])]
    public function update(
        int $id,
        Request $request,
        ProductRepository $repo,
        CategoryRepository $catRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $product = $repo->find($id);
        if (!$product) return $this->json(['error' => 'Product not found'], 404);
        if ($request->request->get('_method') !== 'PUT') return $this->json(['error' => 'Invalid method'], 405);

        $product->setName($request->request->get('name', $product->getName()));
        $product->setSlug($request->request->get('slug', $product->getSlug()));
        $product->setDescription($request->request->get('description', $product->getDescription()));
        $product->setPrice(floatval($request->request->get('price', $product->getPrice())));
        $product->setStock(intval($request->request->get('stock', $product->getStock())));

        $mainId = $request->request->get('mainCategoryId');
        $subId = $request->request->get('subCategoryId');
        $subSubId = $request->request->get('subSubCategoryId');

        $product->setMainCategory($mainId ? $catRepo->find($mainId) : null);
        $product->setSubCategory($subId ? $catRepo->find($subId) : null);
        $product->setSubSubCategory($subSubId ? $catRepo->find($subSubId) : null);

        $images = $request->files->get('images');
        if ($images && count($images) > 0) {
            foreach ($product->getImages() as $image) {
                $product->removeImage($image);
                $em->remove($image);
            }

            foreach ($images as $uploadedFile) {
                $filename = uniqid() . '.' . $uploadedFile->guessExtension();
                $uploadedFile->move($this->getParameter('uploads_directory'), $filename);
                $image = new ProductImage();
                $image->setPath($filename);
                $product->addImage($image);
                $em->persist($image);
            }
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/admin/products/{id}', name: 'admin_products_delete', methods: ['DELETE'])]
    public function delete(int $id, ProductRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $product = $repo->find($id);
        if (!$product) return $this->json(['error' => 'Product not found'], 404);

        $em->remove($product);
        $em->flush();

        return $this->json(['success' => true]);
    }
}
