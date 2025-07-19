<?php

// src/Controller/RegisterController.php
namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher,
        UtilisateurRepository $userRepo

    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $nom = $data['nom'] ?? null;
        $prenom = $data['prenom'] ?? null;

        if (!$email || !$password || !$nom || !$prenom) {
            return new JsonResponse(['error' => 'Tous les champs sont requis (email, mot de passe, nom, prénom)'], 400);
        }

        // Vérifie si l’email est déjà utilisé
        if ($userRepo->findOneBy(['email' => $email])) {
            return new JsonResponse(['error' => 'Un compte avec cet email existe déjà.'], 409);
        }


        $user = new Utilisateur();
        $user->setEmail($email);
        $user->setNom($nom);
        $user->setPrenom($prenom);
        $user->setPassword($hasher->hashPassword($user, $password));

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['success' => 'Utilisateur créé'], 201);
    }
}

