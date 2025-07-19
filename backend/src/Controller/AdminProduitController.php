<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Entity\ProductImage;
use App\Repository\ProduitRepository;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;


class AdminProduitController extends AbstractController
{
    #[Route('/api/admin/produits', name: 'admin_produits_list', methods: ['GET'])]
    public function index(ProduitRepository $repo): JsonResponse
    {
        $produits = $repo->findAll();

        return $this->json(array_map(fn($p) => [
            'id' => $p->getId(),
            'nom' => $p->getNom(),
            'prix' => $p->getPrix(),
            'image' => $p->getImage(),
            'images' => array_map(fn($img) => [
                'id' => $img->getId(),
                'path' => $img->getPath(),
            ], $p->getImages()->toArray()),

            'description' => $p->getDescription(),
            'categorie' => $p->getCategorie()
                ? [
                    'id' => $p->getCategorie()->getId(),
                    'nom' => $p->getCategorie()->getNom(),
                    'parent' => $p->getCategorie()->getParent()
                        ? [
                            'id' => $p->getCategorie()->getParent()->getId(),
                            'nom' => $p->getCategorie()->getParent()->getNom(),
                        ]
                        : null,
                ]
                : null,

        ], $produits));
    }

    #[Route('/api/admin/produits/create', name: 'admin_produits_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, CategorieRepository $catRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Requête invalide'], 400);
        }

        $produit = new Produit();
        $produit->setNom($data['nom'] ?? '');
        $produit->setPrix($data['prix'] ?? 0);
        $produit->setImage($data['image'] ?? '');
        $produit->setDescription($data['description'] ?? '');

        if (!empty($data['categorieId'])) {
            $categorie = $catRepo->find($data['categorieId']);
            if ($categorie) {
                $produit->setCategorie($categorie);
            }
        }

        $em->persist($produit);
        $em->flush();

        return $this->json(['success' => true, 'id' => $produit->getId()]);
    }

    #[Route('/api/admin/produits/{id}', name: 'admin_produits_update', methods: ['PUT'])]
    public function update(int $id, Request $request, ProduitRepository $repo, CategorieRepository $catRepo, EntityManagerInterface $em): JsonResponse
    {
        $produit = $repo->find($id);
        if (!$produit) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Requête invalide'], 400);
        }

        $produit->setNom($data['nom'] ?? $produit->getNom());
        $produit->setPrix($data['prix'] ?? $produit->getPrix());
        $produit->setImage($data['image'] ?? $produit->getImage());
        $produit->setDescription($data['description'] ?? $produit->getDescription());

        if (!empty($data['categorieId'])) {
            $categorie = $catRepo->find($data['categorieId']);
            if ($categorie) {
                $produit->setCategorie($categorie);
            }
        }
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imgPath) {
                $imageEntity = new \App\Entity\ProductImage();
                $imageEntity->setPath($imgPath);
                $imageEntity->setProduit($produit);
                $em->persist($imageEntity);
            }
        }


        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/admin/produits/{id}', name: 'admin_produits_delete', methods: ['DELETE'])]
    public function delete(int $id, ProduitRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $produit = $repo->find($id);
        if (!$produit) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        $em->remove($produit);
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/admin/produits/{id}', name: 'admin_produits_show', methods: ['GET'])]
    public function show(int $id, ProduitRepository $repo): JsonResponse
    {
        $p = $repo->find($id);
        if (!$p) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        return $this->json([
            'id' => $p->getId(),
            'nom' => $p->getNom(),
            'prix' => $p->getPrix(),
            'image' => $p->getImage(),
            'description' => $p->getDescription(),
            'categorie' => $p->getCategorie()
                ? [
                    'id' => $p->getCategorie()->getId(),
                    'nom' => $p->getCategorie()->getNom(),
                ]
                : null,
        ]);
    }



    #[Route('/api/admin/produits/{id}/images', name: 'admin_produits_upload_images', methods: ['POST'])]
    public function uploadImages(
        int $id,
        Request $request,
        ProduitRepository $repo,
        EntityManagerInterface $em
    ): JsonResponse {
        $produit = $repo->find($id);
        if (!$produit) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        $files = $request->files->all('images');

        if (empty($files)) {
            return $this->json(['error' => 'Aucune image reçue'], 400);
        }

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        $added = [];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile)
                continue;

            $ext = $file->guessExtension() ?: 'jpg';
            $filename = uniqid() . '.' . $ext;
            $file->move($uploadDir, $filename);

            $image = new ProductImage();
            $image->setPath('/uploads/' . $filename);
            $image->setProduit($produit);

            $em->persist($image);
            $added[] = $image->getPath();
        }

        $em->flush();

        return $this->json(['added' => $added]);
    }

    #[Route('/api/admin/product-images/{id}', name: 'admin_product_image_delete', methods: ['DELETE'])]
    public function deleteImage(int $id, EntityManagerInterface $em): JsonResponse
    {
        $image = $em->getRepository(ProductImage::class)->find($id);

        if (!$image) {
            return $this->json(['error' => 'Image non trouvée'], 404);
        }

        // Supprimer le fichier du disque si nécessaire
        $path = $this->getParameter('kernel.project_dir') . '/public' . $image->getPath();
        if (file_exists($path)) {
            unlink($path);
        }

        $em->remove($image);
        $em->flush();

        return $this->json(['success' => true]);
    }
}
