<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UploadController extends AbstractController
{
    #[Route('/api/upload', name: 'upload_image', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get('image');

        if (!$file) {
            return new JsonResponse(['error' => 'No file provided'], 400);
        }

        $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
        $filename = uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($uploadsDir, $filename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Upload failed'], 500);
        }

        return new JsonResponse([
            'message' => 'Upload successful',
            'filename' => $filename,
            'url' => '/uploads/' . $filename
        ]);
    }
}
