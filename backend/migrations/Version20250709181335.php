<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250709181335 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD12469DE2');
        $this->addSql('DROP INDEX IDX_D34A04AD12469DE2 ON product');
        $this->addSql('ALTER TABLE product ADD sub_category_id INT DEFAULT NULL, ADD sub_sub_category_id INT DEFAULT NULL, CHANGE category_id main_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADC6C55574 FOREIGN KEY (main_category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADF7BFE87C FOREIGN KEY (sub_category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADED049853 FOREIGN KEY (sub_sub_category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_D34A04ADC6C55574 ON product (main_category_id)');
        $this->addSql('CREATE INDEX IDX_D34A04ADF7BFE87C ON product (sub_category_id)');
        $this->addSql('CREATE INDEX IDX_D34A04ADED049853 ON product (sub_sub_category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04ADC6C55574');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04ADF7BFE87C');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04ADED049853');
        $this->addSql('DROP INDEX IDX_D34A04ADC6C55574 ON product');
        $this->addSql('DROP INDEX IDX_D34A04ADF7BFE87C ON product');
        $this->addSql('DROP INDEX IDX_D34A04ADED049853 ON product');
        $this->addSql('ALTER TABLE product ADD category_id INT DEFAULT NULL, DROP main_category_id, DROP sub_category_id, DROP sub_sub_category_id');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_D34A04AD12469DE2 ON product (category_id)');
    }
}
