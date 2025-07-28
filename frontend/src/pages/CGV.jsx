import React from 'react';

const CGV = () => {
  return (
    <>
      <style>{`
        .cgv-container {
          padding: 3rem 2rem;
          background-color: #FAFAFA;
          color: #000;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.02em;
          max-width: 900px;
          margin: 0 auto;
        }

        .cgv-container h1 {
          color: #000;
          text-align: center;
          margin-bottom: 2rem;
        }

        .cgv-container h2 {
          color: #FFC660;
          margin-top: 2.5rem;
        }

        .cgv-container p {
          line-height: 1.7;
          font-size: 1rem;
          margin: 1rem 0;
        }

        .cgv-container ul {
          list-style: disc;
          margin-left: 1.5rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="cgv-container">
        <h1>Conditions Générales de Vente</h1>

        <h2>1. Champ d'application</h2>
        <p>
          Les présentes Conditions Générales de Vente s’appliquent à toutes les commandes passées sur ce site. Toute commande implique l’acceptation pleine et entière des présentes CGV.
        </p>

        <h2>2. Prix</h2>
        <ul>
          <li>Les prix sont indiqués en euros TTC (toutes taxes comprises).</li>
          <li>L’éditeur se réserve le droit de modifier les prix à tout moment sans préavis.</li>
        </ul>

        <h2>3. Commande</h2>
        <ul>
          <li>Les commandes ne sont validées qu’après confirmation de paiement.</li>
          <li>L’éditeur se réserve le droit de refuser toute commande sans justification.</li>
        </ul>

        <h2>4. Paiement</h2>
        <p>
          Le paiement est exigible immédiatement à la commande. Les moyens de paiement acceptés sont affichés au moment de la validation.
        </p>

        <h2>5. Livraison</h2>
        <ul>
          <li>Les délais sont donnés à titre indicatif. Aucun remboursement ne sera accordé en cas de retard.</li>
          <li>Les frais de livraison sont affichés avant validation du panier.</li>
          <li>Le client est seul responsable de l’exactitude des informations de livraison.</li>
        </ul>

        <h2>6. Droit de rétractation</h2>
        <p>
          Conformément à la loi, le client dispose d’un délai de 14 jours pour exercer son droit de rétractation. Ce droit ne s’applique pas aux produits personnalisés ou périssables.
        </p>

        <h2>7. Retours</h2>
        <ul>
          <li>Les retours doivent être validés au préalable par l’éditeur.</li>
          <li>Les frais de retour sont à la charge du client.</li>
        </ul>

        <h2>8. Responsabilité</h2>
        <ul>
          <li>L’éditeur ne pourra être tenu responsable des dommages indirects liés à l’utilisation des produits.</li>
          <li>Les photographies des produits ne sont pas contractuelles.</li>
        </ul>

        <h2>9. Données personnelles</h2>
        <p>
          Les informations personnelles sont utilisées uniquement pour le traitement des commandes et ne sont jamais revendues.
        </p>

        <h2>10. Litiges</h2>
        <p>
          En cas de litige, une solution amiable sera recherchée. À défaut, compétence est attribuée aux tribunaux du ressort du siège social de l’éditeur.
        </p>
      </div>
    </>
  );
};

export default CGV;
