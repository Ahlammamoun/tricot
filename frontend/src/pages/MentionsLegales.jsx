import React from 'react';

const MentionsLegales = () => {
  return (
    <>
      <style>{`
        .mentions-container {
          padding: 3rem 2rem;
          background-color: #FAFAFA;
          color: #000;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.02em;
          max-width: 900px;
          margin: 0 auto;
        }

        .mentions-container h1 {
          color: #000;
          text-align: center;
          margin-bottom: 2rem;
        }

        .mentions-container h2 {
          color: #FFC660;
          margin-top: 2.5rem;
        }

        .mentions-container p {
          line-height: 1.7;
          font-size: 1rem;
          margin: 1rem 0;
        }

        .mentions-container ul {
          list-style: disc;
          margin-left: 1.5rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="mentions-container">
        <h1>Mentions Légales</h1>

        <h2>Informations légales</h2>
        <p>
          Ce site est édité par <strong>[Nom de l'entreprise]</strong>.<br />
          Contact : contact@votresite.fr<br />
          Numéro SIRET : 000 000 000 00000
        </p>

        <h2>Conditions de commande</h2>
        <ul>
          <li>Toute commande est ferme et définitive dès validation du paiement.</li>
          <li>L’éditeur se réserve le droit de refuser ou d’annuler toute commande sans justification.</li>
          <li>Les produits proposés sont disponibles dans la limite des stocks disponibles.</li>
        </ul>

        <h2>Délais et livraisons</h2>
        <ul>
          <li>Les délais de traitement sont indicatifs et non garantis.</li>
          <li>Aucune indemnisation ne pourra être exigée en cas de retard de livraison.</li>
          <li>L’éditeur décline toute responsabilité en cas de perte, vol ou dommage causé par le transporteur.</li>
        </ul>

        <h2>Absence de garantie</h2>
        <p>
          Tous les produits sont vendus « tels quels », sans garantie explicite ou implicite, y compris sur la durabilité,
          l’usage prévu, ou l’absence de défaut. L’utilisateur est seul responsable de l’utilisation des produits.
        </p>

        <h2>Limitation de responsabilité</h2>
        <ul>
          <li>L’éditeur ne saurait être tenu responsable des dommages directs ou indirects liés à l’accès ou à l’utilisation du site.</li>
          <li>Aucune responsabilité ne sera engagée en cas d’inaccessibilité temporaire ou de dysfonctionnement technique.</li>
        </ul>

        <h2>Propriété intellectuelle</h2>
        <p>
          Tous les contenus du site (images, textes, logos, vidéos, code…) sont protégés par le droit d’auteur et
          restent la propriété exclusive de l’éditeur. Toute reproduction, totale ou partielle, est strictement interdite.
        </p>

        <h2>Utilisation interdite</h2>
        <ul>
          <li>Extraction automatisée de données</li>
          <li>Utilisation commerciale non autorisée des contenus</li>
          <li>Reproduction de design, structure ou code sans autorisation</li>
        </ul>

        <h2>Hébergeur</h2>
        <p>
          OVH – 2 rue Kellermann, 59100 Roubaix – France
        </p>
      </div>
    </>
  );
};

export default MentionsLegales;
