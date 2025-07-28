<?php

namespace App\Controller;

use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function apiContact(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['nom']) || empty($data['email']) || empty($data['message'])) {
            return new JsonResponse(['error' => 'Champs requis manquants.'], 400);
        }

        $contact = new Contact();
        $contact->setNom($data['nom']);
        $contact->setEmail($data['email']);
        $contact->setSujet($data['sujet'] ?? '');
        $contact->setMessage($data['message']);
        $contact->setCreatedAt(new \DateTime());

        $em->persist($contact);
        $em->flush();

        return new JsonResponse(['success' => 'Message reçu. Merci pour votre retour !'], 201);
    }
}
