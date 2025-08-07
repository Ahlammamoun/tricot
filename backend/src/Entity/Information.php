<?php

namespace App\Entity;

use App\Repository\InformationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InformationRepository::class)]
class Information
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $textDeux = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $textTrois = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getTextDeux(): ?string
    {
        return $this->textDeux;
    }

    public function setTextDeux(string $textDeux): static
    {
        $this->textDeux = $textDeux;

        return $this;
    }

    public function getTextTrois(): ?string
    {
        return $this->textTrois;
    }

    public function setTextTrois(string $textTrois): static
    {
        $this->textTrois = $textTrois;

        return $this;
    }
}
