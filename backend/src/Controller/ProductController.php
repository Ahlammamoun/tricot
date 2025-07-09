<?php
// src/Controller/ProductController.php
namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_products', methods: ['GET'])]
    public function index(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAll();

        $data = array_map(function ($product) {
            $imagePaths = [];
            foreach ($product->getImages() as $image) {
                $imagePaths[] = $image->getPath();
            }

            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'slug' => $product->getSlug(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'images' => $imagePaths,
                'category' => $product->getCategory()?->getName(),
            ];
        }, $products);

        return $this->json($data);
    }

    #[Route('/api/products/{slug}', name: 'api_product_show', methods: ['GET'])]
    public function show(ProductRepository $repo, string $slug): JsonResponse
    {
        $product = $repo->findOneBy(['slug' => $slug]);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], 404);
        }

        $imagePaths = [];
        foreach ($product->getImages() as $image) {
            $imagePaths[] = $image->getPath();
        }

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'images' => $imagePaths,
            'category' => $product->getCategory()?->getName(),
        ];

        return $this->json($data);
    }


    #[Route('/api/category/{name}', name: 'api_products_by_category', methods: ['GET'])]
    public function byCategory(ProductRepository $productRepository, string $name): JsonResponse
    {
        $products = $productRepository->findByCategoryName($name);

        $data = array_map(function ($product) {
            $imagePaths = [];
            foreach ($product->getImages() as $image) {
                $imagePaths[] = $image->getPath();
            }

            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'slug' => $product->getSlug(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'images' => $imagePaths,
                'category' => $product->getCategory()?->getName(),
            ];
        }, $products);

        return $this->json($data);
    }




}
