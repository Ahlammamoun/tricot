<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UtilisateurController extends AbstractController
{
    #[Route('/api/utilisateurs', name: 'api_utilisateur_index', methods: ['GET'])]
    public function index(UtilisateurRepository $repo): JsonResponse
    {
        $utilisateurs = $repo->findAll();

        $data = array_map(fn($u) => [
            'id' => $u->getId(),
            'email' => $u->getEmail(),
            'roles' => $u->getRoles(),
        ], $utilisateurs);

        return $this->json($data);
    }

    #[Route('/api/utilisateurs', name: 'api_utilisateur_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Email et mot de passe requis'], 400);
        }

        $utilisateur = new Utilisateur();
        $utilisateur->setEmail($data['email']);
        $utilisateur->setNom($data['nom']);
        $utilisateur->setPrenom($data['prenom']);
        $utilisateur->setRoles($data['roles'] ?? ['ROLE_USER']);
        $utilisateur->setPassword(
            $hasher->hashPassword($utilisateur, $data['password'])
        );




        $em->persist($utilisateur);
        $em->flush();

        return $this->json(['message' => 'Utilisateur créé'], 201);
    }

    #[Route('/api/utilisateurs/{id}', name: 'api_utilisateur_show', methods: ['GET'])]
    public function show(Utilisateur $utilisateur): JsonResponse
    {
        return $this->json([
            'id' => $utilisateur->getId(),
            'email' => $utilisateur->getEmail(),
            'roles' => $utilisateur->getRoles(),
        ]);
    }

    #[Route('/api/utilisateurs/{id}', name: 'api_utilisateur_update', methods: ['PUT', 'PATCH'])]
    public function update(
        Utilisateur $utilisateur,
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $utilisateur->setEmail($data['email']);
        }

        if (isset($data['roles'])) {
            $utilisateur->setRoles($data['roles']);
        }

        if (!empty($data['password'])) {
            $utilisateur->setPassword(
                $hasher->hashPassword($utilisateur, $data['password'])
            );
        }

        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour']);
    }

    #[Route('/api/utilisateurs/{id}', name: 'api_utilisateur_delete', methods: ['DELETE'])]
    public function delete(Utilisateur $utilisateur, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($utilisateur);
        $em->flush();

        return $this->json(['message' => 'Utilisateur supprimé']);
    }
}
