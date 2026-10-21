/* ==========================================================
   1. Réglages
   ========================================================== */

// Taille de la toile pixel art, en pixels source
const TOILE_LARGEUR = 320;
const TOILE_HAUTEUR = 180;

// Durées des transitions, en secondes
const DUREE_PORTE = 0.7;
const DUREE_FONDU = 0.4;
// Coefficient appliqué aux durées si l'utilisateur demande moins d'animations
const COEF_MOUVEMENT_REDUIT = 0.4;

// Largeur d'un battant de porte, en pixels source (il glisse de cette distance)
const LARGEUR_BATTANT = 16;

// Temps pour que le paysage défile d'une largeur complète, en secondes
const DUREE_PAYSAGE = 8;
// Intervalle entre deux secousses du train (passage sur un joint de rail)
const INTERVALLE_SECOUSSE = 2.4;

// Distance minimale (en pixels) avant qu'Observer considère un geste
const TOLERANCE_OBSERVER = 10;


/* ==========================================================
   2. Sélection des éléments du DOM
   ========================================================== */

const scene = document.querySelector(".scene");
const wagons = document.querySelectorAll(".wagon");
const bandeGauche = document.querySelector(".paysage__cote--gauche .paysage__bande");
const bandeDroite = document.querySelector(".paysage__cote--droite .paysage__bande");
const lumiere = document.querySelector(".lumiere");
const fondu = document.querySelector(".fondu");
const indicateurNumero = document.querySelector(".indicateur__numero");
const indicateurNom = document.querySelector(".indicateur__nom");
const boutonArriere = document.querySelector(".bouton-arriere");


/* ==========================================================
   3. État
   ========================================================== */

// Index du wagon dans lequel se trouve l'utilisateur (0 = premier wagon)
let wagonActuel = 0;
// Verrou : vrai pendant une transition, pour ignorer les autres actions
let enAnimation = false;
// Préférence système "réduire les animations"
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ==========================================================
   4. Fonctions
   ========================================================== */

// Renvoie une durée, raccourcie si l'utilisateur préfère moins d'animations.
// duree : durée normale en secondes
function adapterDuree(duree) {
  return mouvementReduit ? duree * COEF_MOUVEMENT_REDUIT : duree;
}

// Écrit un nombre sur deux chiffres (1 devient "01").
function formaterNumero(nombre) {
  return String(nombre).padStart(2, "0");
}

// Renvoie les deux battants de porte d'un wagon.
// wagon : élément section.wagon
function trouverPortes(wagon) {
  return {
    gauche: wagon.querySelector(".wagon__porte--gauche"),
    droite: wagon.querySelector(".wagon__porte--droite"),
  };
}

// Met à jour l'indicateur et l'état du bouton Arrière.
function mettreAJourInterface() {
  indicateurNumero.textContent = `${formaterNumero(wagonActuel + 1)} / ${formaterNumero(wagons.length)}`;
  indicateurNom.textContent = wagons[wagonActuel].dataset.titre;
  boutonArriere.disabled = wagonActuel === 0;
}

// Affiche uniquement le wagon demandé et referme ses portes.
// index : numéro du wagon (0 = premier wagon)
function afficherWagon(index) {
  wagons.forEach((wagon, i) => {
    gsap.set(wagon, { autoAlpha: i === index ? 1 : 0 });
  });
  const portes = trouverPortes(wagons[index]);
  gsap.set([portes.gauche, portes.droite], { xPercent: 0 });
  wagonActuel = index;
  mettreAJourInterface();
}

// Ajoute à une timeline le fondu au noir, le changement de wagon, puis le retour à l'image.
// trajet : timeline GSAP
// index : wagon à afficher pendant le noir
function ajouterFondu(trajet, index) {
  const duree = adapterDuree(DUREE_FONDU);
  trajet
    .to(fondu, { opacity: 1, duration: duree, ease: "steps(4)" })
    .call(afficherWagon, [index])
    .to(fondu, { opacity: 0, duration: duree, ease: "steps(4)" });
}

// Crée une timeline qui libère le verrou à la fin.
function creerTrajet() {
  enAnimation = true;
  return gsap.timeline({
    onComplete: () => {
      enAnimation = false;
    },
  });
}

// Ouvre la porte du fond puis passe au wagon suivant.
// Au dernier wagon, la porte est verrouillée et tremble.
function wagonSuivant() {
  if (enAnimation) {
    return;
  }

  const portes = trouverPortes(wagons[wagonActuel]);

  if (wagonActuel >= wagons.length - 1) {
    porteVerrouillee(portes);
    return;
  }

  // Déplacement d'un battant, en pourcentage de la largeur du calque
  const ouverture = (LARGEUR_BATTANT / TOILE_LARGEUR) * 100;
  const trajet = creerTrajet();

  // Les battants glissent pixel par pixel dans la paroi
  trajet
    .to(portes.gauche, { xPercent: -ouverture, duration: adapterDuree(DUREE_PORTE), ease: `steps(${LARGEUR_BATTANT})` }, 0)
    .to(portes.droite, { xPercent: ouverture, duration: adapterDuree(DUREE_PORTE), ease: `steps(${LARGEUR_BATTANT})` }, 0);
  ajouterFondu(trajet, wagonActuel + 1);
}

// Revient au wagon précédent par un simple fondu au noir.
function wagonPrecedent() {
  if (enAnimation || wagonActuel === 0) {
    return;
  }
  const trajet = creerTrajet();
  ajouterFondu(trajet, wagonActuel - 1);
}

// Fait trembler la porte fermée, de 1 pixel source à gauche et à droite.
// portes : battants renvoyés par trouverPortes()
function porteVerrouillee(portes) {
  const unPixel = (1 / TOILE_LARGEUR) * 100;
  const trajet = creerTrajet();
  trajet
    .to([portes.gauche, portes.droite], { xPercent: -unPixel, duration: 0.05, ease: "steps(1)" })
    .to([portes.gauche, portes.droite], { xPercent: unPixel, duration: 0.05, ease: "steps(1)", repeat: 3, yoyo: true })
    .to([portes.gauche, portes.droite], { xPercent: 0, duration: 0.05, ease: "steps(1)" });
}


/* ==========================================================
   5. Ambiance
   ========================================================== */

// Fait défiler le paysage en boucle : vers la gauche à gauche, vers la droite à droite,
// comme vu depuis un train qui avance vers la porte du fond.
function lancerPaysage() {
  const pas = `steps(${TOILE_LARGEUR})`;
  gsap.fromTo(bandeGauche, { xPercent: 0 }, { xPercent: -50, duration: DUREE_PAYSAGE, ease: pas, repeat: -1 });
  gsap.fromTo(bandeDroite, { xPercent: 0 }, { xPercent: 50, duration: DUREE_PAYSAGE, ease: pas, repeat: -1 });
}

// Secousse régulière de la scène, d'un pixel source vers le bas puis retour.
function lancerSecousses() {
  const unPixel = (1 / TOILE_HAUTEUR) * 100;
  gsap.timeline({ repeat: -1, repeatDelay: INTERVALLE_SECOUSSE })
    .to(scene, { yPercent: unPixel, duration: 0.08, ease: "steps(1)" })
    .to(scene, { yPercent: 0, duration: 0.08, ease: "steps(1)" });
}

// Scintillement bref et irrégulier de la lumière, puis on reprogramme le suivant.
function scintiller() {
  gsap.timeline({ onComplete: scintiller, delay: gsap.utils.random(3, 7) })
    .to(lumiere, { opacity: 0.4, duration: 0.06, ease: "steps(1)" })
    .to(lumiere, { opacity: 1, duration: 0.06, ease: "steps(1)" })
    .to(lumiere, { opacity: 0.6, duration: 0.05, ease: "steps(1)" })
    .to(lumiere, { opacity: 1, duration: 0.1, ease: "steps(1)" });
}


/* ==========================================================
   6. Écouteurs
   ========================================================== */

gsap.registerPlugin(Observer);

// Molette et tactile.
// wheelSpeed: -1 inverse la molette pour qu'elle se comporte comme le doigt :
// molette vers le bas et swipe vers le haut déclenchent tous les deux onUp.
// Pour l'instant, le retour se fait uniquement avec le bouton Arrière.
Observer.create({
  target: window,
  type: "wheel,touch",
  wheelSpeed: -1,
  tolerance: TOLERANCE_OBSERVER,
  preventDefault: true,
  onUp: wagonSuivant,
});

// Clavier : flèches droite et bas pour avancer
document.addEventListener("keydown", (evenement) => {
  // Une touche maintenue enfoncée ne doit pas enchaîner les wagons
  if (evenement.repeat) {
    return;
  }
  if (evenement.key === "ArrowRight" || evenement.key === "ArrowDown") {
    evenement.preventDefault();
    wagonSuivant();
  }
});

// Bouton de retour au wagon précédent
boutonArriere.addEventListener("click", wagonPrecedent);


/* ==========================================================
   7. Initialisation
   ========================================================== */

afficherWagon(0);
lancerPaysage();

if (!mouvementReduit) {
  lancerSecousses();
  scintiller();
}
