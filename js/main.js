/* ==========================================================
   1. Réglages
   ========================================================== */

// Durée d'un trajet entre deux wagons, en secondes
const DUREE_TRANSITION = 1.2;
// Durée utilisée si l'utilisateur a demandé moins d'animations
const DUREE_TRANSITION_REDUITE = 0.3;
// Courbe d'accélération commune : démarrage et freinage en douceur
const EASING_TRANSITION = "power2.inOut";

// Parallaxe : part du déplacement du train reprise par chaque plan, en sens inverse,
// comme si le regard suivait légèrement le train. Plus le plan est proche, plus il bouge.
const FACTEUR_PARALLAXE_VILLE = 0.03;
const FACTEUR_PARALLAXE_VOIE = 0.08;
const FACTEUR_PARALLAXE_QUAI = 0.15;

// Distance minimale (en pixels) avant qu'Observer considère un geste
const TOLERANCE_OBSERVER = 10;


/* ==========================================================
   2. Sélection des éléments du DOM
   ========================================================== */

const train = document.querySelector(".train");
const wagons = document.querySelectorAll(".wagon");
const ville = document.querySelector(".decor__ville");
const voie = document.querySelector(".decor__voie");
const quai = document.querySelector(".quai");
const indicateurNumero = document.querySelector(".indicateur__numero");
const indicateurNom = document.querySelector(".indicateur__nom");


/* ==========================================================
   3. État
   ========================================================== */

// Index du wagon arrêté devant l'utilisateur (0 = premier wagon)
let wagonActuel = 0;
// Verrou : vrai tant que le train roule, pour ignorer les autres actions
let enAnimation = false;
// Préférence système "réduire les animations"
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ==========================================================
   4. Fonctions
   ========================================================== */

// Calcule la position x du train pour centrer le wagon demandé à l'écran.
// index : numéro du wagon (0 = premier wagon)
function calculerPositionTrain(index) {
  const wagon = wagons[index];
  const centreEcran = window.innerWidth / 2;
  const centreWagon = wagon.offsetLeft + wagon.offsetWidth / 2;
  return centreEcran - centreWagon;
}

// Renvoie les positions x de chaque plan pour une position donnée du train.
// xTrain : position x du train
function calculerPositionsPlans(xTrain) {
  return {
    ville: -xTrain * FACTEUR_PARALLAXE_VILLE,
    voie: -xTrain * FACTEUR_PARALLAXE_VOIE,
    quai: -xTrain * FACTEUR_PARALLAXE_QUAI,
  };
}

// Écrit un nombre sur deux chiffres (1 devient "01").
function formaterNumero(nombre) {
  return String(nombre).padStart(2, "0");
}

// Met à jour le numéro et le nom de l'époque affichés dans l'indicateur.
function mettreAJourIndicateur() {
  const titre = wagons[wagonActuel].querySelector(".wagon__titre");
  indicateurNumero.textContent = `${formaterNumero(wagonActuel + 1)} / ${formaterNumero(wagons.length)}`;
  indicateurNom.textContent = titre.textContent;
}

// Place le train et les plans sans animation (au chargement et au redimensionnement).
function placerSansAnimation() {
  // Arrête un éventuel trajet en cours, sinon il finirait à une position périmée
  gsap.killTweensOf([train, ville, voie, quai, indicateurNom]);
  enAnimation = false;

  const xTrain = calculerPositionTrain(wagonActuel);
  const plans = calculerPositionsPlans(xTrain);

  gsap.set(train, { x: xTrain });
  gsap.set(ville, { x: plans.ville });
  gsap.set(voie, { x: plans.voie });
  gsap.set(quai, { x: plans.quai });
  gsap.set(indicateurNom, { opacity: 1 });
  mettreAJourIndicateur();
}

// Déplace le train pour placer le wagon demandé devant l'utilisateur.
// index : numéro du wagon (0 = premier wagon)
function allerAuWagon(index) {
  // Verrou : on ignore toute action pendant un trajet
  if (enAnimation) {
    return;
  }
  // Pas de wagon avant le premier ni après le dernier
  if (index < 0 || index >= wagons.length) {
    return;
  }

  enAnimation = true;
  wagonActuel = index;

  const duree = mouvementReduit ? DUREE_TRANSITION_REDUITE : DUREE_TRANSITION;
  const xTrain = calculerPositionTrain(index);
  const plans = calculerPositionsPlans(xTrain);

  // Tous les plans partent ensemble (position 0 de la timeline) avec la même courbe
  const trajet = gsap.timeline({
    defaults: { duration: duree, ease: EASING_TRANSITION },
    onComplete: () => {
      enAnimation = false;
    },
  });

  trajet
    .to(train, { x: xTrain }, 0)
    .to(ville, { x: plans.ville }, 0)
    .to(voie, { x: plans.voie }, 0)
    .to(quai, { x: plans.quai }, 0)
    // L'indicateur s'efface, change de texte à mi-parcours, puis réapparaît
    .to(indicateurNom, { opacity: 0, duration: duree * 0.25 }, 0)
    .call(mettreAJourIndicateur, null, duree * 0.5)
    .to(indicateurNom, { opacity: 1, duration: duree * 0.25 }, duree * 0.75);
}

// Passe au wagon suivant (époque suivante).
function wagonSuivant() {
  allerAuWagon(wagonActuel + 1);
}

// Revient au wagon précédent (époque précédente).
function wagonPrecedent() {
  allerAuWagon(wagonActuel - 1);
}


/* ==========================================================
   5. Écouteurs
   ========================================================== */

gsap.registerPlugin(Observer);

// Molette et tactile.
// wheelSpeed: -1 inverse la molette pour qu'elle se comporte comme le doigt :
// molette vers le bas et swipe vers le haut déclenchent tous les deux onUp (wagon suivant).
Observer.create({
  target: window,
  type: "wheel,touch",
  wheelSpeed: -1,
  tolerance: TOLERANCE_OBSERVER,
  preventDefault: true,
  onUp: wagonSuivant,
  onDown: wagonPrecedent,
});

// Clavier : flèches droite et bas pour avancer, gauche et haut pour reculer
document.addEventListener("keydown", (evenement) => {
  // Une touche maintenue enfoncée ne doit pas enchaîner les wagons
  if (evenement.repeat) {
    return;
  }

  if (evenement.key === "ArrowRight" || evenement.key === "ArrowDown") {
    evenement.preventDefault();
    wagonSuivant();
  } else if (evenement.key === "ArrowLeft" || evenement.key === "ArrowUp") {
    evenement.preventDefault();
    wagonPrecedent();
  }
});

// Recentre le wagon courant si la taille de la fenêtre change
window.addEventListener("resize", placerSansAnimation);


/* ==========================================================
   6. Initialisation
   ========================================================== */

placerSansAnimation();
