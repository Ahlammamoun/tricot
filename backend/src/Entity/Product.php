<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column]
    private ?int $stock = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne]
    private ?Category $mainCategory = null;

    #[ORM\ManyToOne]
    private ?Category $subCategory = null;

    #[ORM\ManyToOne]
    private ?Category $subSubCategory = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: ProductImage::class, cascade: ['persist', 'remove'])]
    private Collection $images;

    #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'product')]
    private Collection $orderItems;

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->orderItems = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getName(): ?string { return $this->name; }

    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getSlug(): ?string { return $this->slug; }

    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }

    public function getDescription(): ?string { return $this->description; }

    public function setDescription(string $description): static { $this->description = $description; return $this; }

    public function getPrice(): ?float { return $this->price; }

    public function setPrice(float $price): static { $this->price = $price; return $this; }

    public function getStock(): ?int { return $this->stock; }

    public function setStock(int $stock): static { $this->stock = $stock; return $this; }

    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static { $this->createdAt = $createdAt; return $this; }

    public function getMainCategory(): ?Category { return $this->mainCategory; }

    public function setMainCategory(?Category $mainCategory): static { $this->mainCategory = $mainCategory; return $this; }

    public function getSubCategory(): ?Category { return $this->subCategory; }

    public function setSubCategory(?Category $subCategory): static { $this->subCategory = $subCategory; return $this; }

    public function getSubSubCategory(): ?Category { return $this->subSubCategory; }

    public function setSubSubCategory(?Category $subSubCategory): static { $this->subSubCategory = $subSubCategory; return $this; }

    /**
     * @return Collection<int, ProductImage>
     */
    public function getImages(): Collection { return $this->images; }

    public function addImage(ProductImage $image): static {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setProduct($this);
        }
        return $this;
    }

    public function removeImage(ProductImage $image): static {
        if ($this->images->removeElement($image)) {
            if ($image->getProduct() === $this) {
                $image->setProduct(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, OrderItem>
     */
    public function getOrderItems(): Collection { return $this->orderItems; }

    public function addOrderItem(OrderItem $orderItem): static {
        if (!$this->orderItems->contains($orderItem)) {
            $this->orderItems[] = $orderItem;
            $orderItem->setProduct($this);
        }
        return $this;
    }

    public function removeOrderItem(OrderItem $orderItem): static {
        if ($this->orderItems->removeElement($orderItem)) {
            if ($orderItem->getProduct() === $this) {
                $orderItem->setProduct(null);
            }
        }
        return $this;
    }
}
