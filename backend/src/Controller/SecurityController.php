<?php
// src/Controller/SecurityController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class SecurityController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): Response
    {
        // Ce point ne sera jamais atteint car la sécurité intercepte cette route.
        return new JsonResponse(['error' => 'Cette route est gérée automatiquement'], 401);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): void
    {
        // Ce point aussi peut être géré automatiquement.
        throw new \Exception('Cette méthode peut être vide si vous utilisez JWT');
    }
}
