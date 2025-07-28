<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class AdminContactController extends AbstractController
{
    #[Route('/api/admin/contact', name: 'admin_contact_index', methods: ['GET'])]
    public function index(ContactRepository $contactRepository): JsonResponse
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $contacts = $contactRepository->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(fn(Contact $contact) => [
            'id' => $contact->getId(),
            'nom' => $contact->getNom(),
            'email' => $contact->getEmail(),
            'sujet' => $contact->getSujet(),
            'message' => $contact->getMessage(),
            'createdAt' => $contact->getCreatedAt()->format('Y-m-d H:i:s'),
        ], $contacts);

        return $this->json($data);
    }

    #[Route('/api/admin/contact/{id}', name: 'admin_contact_show', methods: ['GET'])]
    public function show(Contact $contact): JsonResponse
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->json([
            'id' => $contact->getId(),
            'nom' => $contact->getNom(),
            'email' => $contact->getEmail(),
            'sujet' => $contact->getSujet(),
            'message' => $contact->getMessage(),
            'createdAt' => $contact->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/admin/contact/{id}', name: 'admin_contact_delete', methods: ['DELETE'])]
    public function delete(Contact $contact, EntityManagerInterface $em): JsonResponse
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $em->remove($contact);
        $em->flush();

        return $this->json(['success' => 'Message supprimé.']);
    }
}
