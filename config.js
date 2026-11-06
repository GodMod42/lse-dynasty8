/* ===================== CONFIGURATION DU SITE =====================
   Tout ce qui se modifie côté site est ici. */

const SITE = {
  pageTitle: "Dynasty 8 Real Estate | LSE · Trouvez votre propriété à Los Santos",
  heroTop: "Trouvez une maison de rêve",
  heroGreen: "ou du moins abordable.",
  subtitle: "Le leader de l’immobilier résidentiel et commercial à Los Santos et Blaine County.",
  footerLine: "We’ll find you a home to dream of (or at least afford).",
  footerCopy: "© 2026 Dynasty 8 Real Estate · Los Santos Extended. Tous droits réservés."
};

const CONFIG = {
  defaultBudget: 1500000,
  /* Dossier des images. Pour réutiliser celles de l'ancien site en attendant de les copier :
     "https://dynasty-lgp.pages.dev/assets/properties/" */
  imgBase: "/assets/properties/"
};

/* Une propriété = un bloc. cat : residence | garage | entrepot | bureau
   image : nom du fichier dans imgBase (ou une URL complète). */
const PROPERTIES = [
  {cat:"garage", name:"Garage 2 Places", price:100000, capacity:"2 Véhicules", image:"garage_2_places.png",
   desc:"Petit garage de quartier, idéal pour garer vos premiers véhicules à l’abri des intempéries et des regards indiscrets.",
   features:["Places pour 2 véhicules","Abri couvert","Accès sécurisé"]},
  {cat:"garage", name:"Garage 6 Places", price:250000, capacity:"6 Véhicules", image:"garage_6_places.png",
   desc:"Un garage de taille moyenne offrant un excellent compromis. Parfait pour les amateurs de tuning et les petites collections.",
   features:["Places pour 6 véhicules","Espace atelier","Accès sécurisé"]},
  {cat:"garage", name:"Garage 10 Places", price:350000, capacity:"10 Véhicules", image:"garage_10_places.png",
   desc:"Grand garage haut de gamme avec sol en résine blanche et éclairage LED moderne. La référence pour tout collectionneur exigeant.",
   features:["Places pour 10 véhicules","Sol en résine blanche","Éclairage LED"]},
  {cat:"residence", name:"Chambre", price:100000, capacity:"1 personne", image:"chambre.png",
   desc:"Une petite chambre individuelle modeste mais fonctionnelle. L’essentiel pour démarrer votre nouvelle vie à Los Santos.",
   features:["Couchage individuel","Rangement","Accès indépendant"]},
  {cat:"residence", name:"Appartement", price:150000, capacity:"1-2 personnes", image:"appartement.png",
   desc:"Appartement citadin standard offrant un séjour confortable au cœur de la métropole. Cuisine équipée et salle de bain privative.",
   features:["Séjour","Cuisine équipée","Salle de bain privative"]},
  {cat:"residence", name:"Appartement Bordélique", price:200000, capacity:"1-2 personnes", image:"appartement_bordelique.png",
   desc:"Un appartement spacieux mais quelque peu négligé. Parfait pour les artistes, les hackers ou toute personne ayant besoin de place et de discrétion.",
   features:["Grand volume","Poste de travail","Discrétion"]}
  /* Ajoute les autres propriétés (villas, entrepôts, bureaux & QG...) sur le même modèle. */
];
