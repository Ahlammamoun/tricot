<?php

namespace App\Controller;

use App\Entity\Information;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InformationController extends AbstractController
{
    #[Route('/api/informations', name: 'api_informations_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $informations = $em->getRepository(Information::class)->findAll();

        $data = array_map(function (Information $info) {
            return [
                'id' => $info->getId(),
                'titre' => $info->getTitre(),
                'text' => $info->getText(),
                'textDeux' => $info->getTextDeux() ?? '', 
                'textTrois' => $info->getTextTrois() ?? '',
            ];
        }, $informations);

        return $this->json($data);
    }

    #[Route('/api/informations/{id}', name: 'api_informations_show', methods: ['GET'])]
    public function show(Information $information = null): JsonResponse
    {
        if (!$information) {
            return $this->json(['error' => 'Information non trouvée'], 404);
        }

        return $this->json([
            'id' => $information->getId(),
            'titre' => $information->getTitre(),
            'text' => $information->getText(),
            'textDeux' => $information->getTextDeux() ?? '',
            'textTrois' => $information->getTextTrois() ?? '',
        ]);
    }

    #[Route('/api/informations', name: 'api_informations_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['titre']) || !isset($data['text'])) {
            return $this->json(['error' => 'Champs "titre" et "text" requis'], 400);
        }

        $information = new Information();
        $information->setTitre($data['titre']);
        $information->setText($data['text']);
        $information->setTextDeux($data['textDeux'] ?? '');
        $information->setTextTrois($data['textTrois'] ?? '');

        $em->persist($information);
        $em->flush();

        return $this->json([
            'message' => 'Information créée avec succès',
            'id' => $information->getId(),
        ], 201);
    }

    #[Route('/api/informations/{id}', name: 'api_informations_update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $em, Information $information = null): JsonResponse
    {
        if (!$information) {
            return $this->json(['error' => 'Information non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['titre'])) {
            $information->setTitre($data['titre']);
        }

        if (isset($data['text'])) {
            $information->setText($data['text']);
        }

        if (isset($data['textDeux'])) {
            $information->setTextDeux($data['textDeux']);
        }
        
        if (isset($data['textTrois'])) {
            $information->setTextTrois($data['textTrois']);
        }
        $em->flush();

        return $this->json(['message' => 'Information mise à jour']);
    }

    #[Route('/api/informations/{id}', name: 'api_informations_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $em, Information $information = null): JsonResponse
    {
        if (!$information) {
            return $this->json(['error' => 'Information non trouvée'], 404);
        }

        $em->remove($information);
        $em->flush();

        return $this->json(['message' => 'Information supprimée']);
    }
}
