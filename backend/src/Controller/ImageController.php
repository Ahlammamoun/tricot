<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class ImageController extends AbstractController
{
    #[Route('/api/upload', name: 'api_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        try {
            $file = $request->files->get('file');

            if (!$file) {
                return $this->json(['error' => 'Aucun fichier reçu'], 400);
            }

            $ext = $file->guessExtension() ?: 'bin';
            $filename = uniqid() . '.' . $ext;

            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0775, true);
            }

            $file->move($uploadDir, $filename);

            return $this->json([
                'url' => '/uploads/' . $filename,
            ]);
        } catch (\Throwable $e) {
            // En DEV, on retourne le message complet pour debug
            return new JsonResponse([
                'error' => 'Erreur interne',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // optionnel
            ], 500);
        }
    }
}

