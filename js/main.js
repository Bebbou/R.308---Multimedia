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

// Temps pour que chaque couche du paysage défile d'une largeur complète, en secondes.
// Plus la couche est lointaine, plus elle est lente : c'est ce qui donne la profondeur.
const DUREES_PAYSAGE = { loin: 120, milieu: 60, proche: 30 };
// Intervalle aléatoire entre deux secousses du train (joint de rail), en secondes
const SECOUSSE_MIN = 6;
const SECOUSSE_MAX = 9;
// Intervalle aléatoire entre deux scintillements de la lumière, en secondes
const SCINTILLEMENT_MIN = 15;
const SCINTILLEMENT_MAX = 30;

// Distance minimale (en pixels) avant qu'Observer considère un geste
const TOLERANCE_OBSERVER = 10;

// Pensées : espace entre le haut de la tête et la pointe de la bulle, en pixels source
const ECART_BULLE = 3;
// Au-delà de cette distance (en pixels écran), un appui est un glissé et pas un clic ou un tap
const DISTANCE_MAX_TAP = 10;
// Part de la scène, à gauche et à droite, où la bulle se décale pour ne pas sortir de l'écran
const ZONE_BORD = 0.2;

// Ouverture de la porte du fond sur la toile 320 x 180 (voir DOCUMENTATION.md, Perspective).
// Un clic ou un tap dans cette zone ouvre la porte.
const ZONE_PORTE = { gauche: 144, droite: 176, haut: 72, bas: 142 };


/* ==========================================================
   2. Sélection des éléments du DOM
   ========================================================== */

const scene = document.querySelector(".scene");
const wagons = document.querySelectorAll(".wagon");
const paysage = document.querySelector(".paysage");
const lumiere = document.querySelector(".lumiere");
const fondu = document.querySelector(".fondu");
const indicateurNumero = document.querySelector(".indicateur__numero");
const indicateurNom = document.querySelector(".indicateur__nom");
const boutonArriere = document.querySelector(".bouton-arriere");
const bulle = document.querySelector(".pensee");
const bulleTexte = document.querySelector(".pensee__texte");
const cadrePorte = document.querySelector(".cadre-porte");
const etiquettePorte = document.querySelector(".etiquette-porte");


/* ==========================================================
   3. État
   ========================================================== */

// Index du wagon dans lequel se trouve l'utilisateur (0 = premier wagon)
let wagonActuel = 0;
// Verrou : vrai pendant une transition, pour ignorer les autres actions
let enAnimation = false;
// Préférence système "réduire les animations"
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pour chaque image de personnage : ses pixels visibles et le point d'ancrage de sa bulle
const donneesPersonnages = new Map();
// Personnage dont la pensée est affichée (null si aucune)
let personnageAffiche = null;
// Vrai quand la souris est sur la porte du fond
let porteSurvolee = false;
// Position du pointeur au début d'un appui, pour distinguer clic (ou tap) et glissé
let debutAppui = null;


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
  masquerPensee();
  survolerPorte(false);
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


// Lit les pixels d'une image de personnage : quels pixels sont visibles,
// et où se trouve le haut de sa tête (ancrage de la bulle).
// image : élément img.wagon__personnage
async function analyserPersonnage(image) {
  await image.decode();

  // On dessine l'image en taille réelle (320 x 180) dans un canvas invisible
  const toile = document.createElement("canvas");
  toile.width = TOILE_LARGEUR;
  toile.height = TOILE_HAUTEUR;
  const contexte = toile.getContext("2d");
  contexte.drawImage(image, 0, 0, TOILE_LARGEUR, TOILE_HAUTEUR);
  const pixels = contexte.getImageData(0, 0, TOILE_LARGEUR, TOILE_HAUTEUR).data;

  // Un pixel est visible si son canal alpha (4e valeur) n'est pas nul
  const visibles = new Uint8Array(TOILE_LARGEUR * TOILE_HAUTEUR);
  let haut = TOILE_HAUTEUR;
  let gaucheTete = TOILE_LARGEUR;
  let droiteTete = 0;

  for (let y = 0; y < TOILE_HAUTEUR; y++) {
    for (let x = 0; x < TOILE_LARGEUR; x++) {
      if (pixels[(y * TOILE_LARGEUR + x) * 4 + 3] === 0) {
        continue;
      }
      visibles[y * TOILE_LARGEUR + x] = 1;
      // La première ligne rencontrée est le haut de la tête
      if (y < haut) {
        haut = y;
      }
      if (y === haut) {
        gaucheTete = Math.min(gaucheTete, x);
        droiteTete = Math.max(droiteTete, x);
      }
    }
  }

  donneesPersonnages.set(image, {
    visibles,
    ancre: { x: (gaucheTete + droiteTete) / 2, y: haut },
  });
}

// Analyse tous les personnages de tous les wagons.
// Ne fonctionne qu'avec Live Server : ouvert en double-cliquant sur index.html,
// le navigateur interdit de lire les pixels des images.
async function preparerPersonnages() {
  const images = document.querySelectorAll(".wagon__personnage");
  try {
    await Promise.all([...images].map(analyserPersonnage));
  } catch (erreur) {
    console.warn("Pensées désactivées : ouvrez le site avec Live Server.", erreur);
  }
}

// Convertit une position à l'écran en pixel de la toile 320 x 180.
// Renvoie null si le point est hors de la scène.
// evenement : événement de pointeur (souris ou doigt)
function convertirEnPixel(evenement) {
  const cadre = scene.getBoundingClientRect();
  const x = Math.floor(((evenement.clientX - cadre.left) / cadre.width) * TOILE_LARGEUR);
  const y = Math.floor(((evenement.clientY - cadre.top) / cadre.height) * TOILE_HAUTEUR);
  if (x < 0 || y < 0 || x >= TOILE_LARGEUR || y >= TOILE_HAUTEUR) {
    return null;
  }
  return { x, y };
}

// Renvoie le personnage du wagon courant situé sous le pointeur, ou null.
// Les personnages sont testés du plus proche au plus éloigné (ordre inverse du HTML).
// evenement : événement de pointeur
function trouverPersonnage(evenement) {
  const pixel = convertirEnPixel(evenement);
  if (!pixel) {
    return null;
  }
  const images = [...wagons[wagonActuel].querySelectorAll(".wagon__personnage")].reverse();
  const personnage = images.find((image) => {
    const donnees = donneesPersonnages.get(image);
    return donnees && donnees.visibles[pixel.y * TOILE_LARGEUR + pixel.x] === 1;
  });
  return personnage || null;
}

// Affiche la pensée d'un personnage dans la bulle, au-dessus de sa tête.
// image : élément img.wagon__personnage
function afficherPensee(image) {
  if (image === personnageAffiche) {
    return;
  }
  // Le contour passe de l'ancien personnage au nouveau
  if (personnageAffiche) {
    personnageAffiche.classList.remove("wagon__personnage--survole");
  }
  image.classList.add("wagon__personnage--survole");
  personnageAffiche = image;

  const { ancre } = donneesPersonnages.get(image);
  const positionX = ancre.x / TOILE_LARGEUR;
  const presBordGauche = positionX < ZONE_BORD;
  const presBordDroit = positionX > 1 - ZONE_BORD;
  bulleTexte.textContent = image.dataset.pensee;

  // Près d'un bord, la bulle s'aligne sur la tête au lieu d'être centrée
  bulle.classList.toggle("pensee--gauche", presBordGauche);
  bulle.classList.toggle("pensee--droite", presBordDroit);
  let decalage = -50;
  if (presBordGauche) {
    decalage = -10;
  } else if (presBordDroit) {
    decalage = -90;
  }

  gsap.set(bulle, {
    left: `${positionX * 100}%`,
    top: `${((ancre.y - ECART_BULLE) / TOILE_HAUTEUR) * 100}%`,
    xPercent: decalage,
    yPercent: -100,
    transformOrigin: "50% 100%",
  });
  // Apparition en trois paliers, pour rester dans l'esprit pixel
  gsap.killTweensOf(bulle);
  gsap.fromTo(bulle, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "steps(3)" });
}

// Cache la bulle de pensée et retire le contour du personnage.
function masquerPensee() {
  scene.classList.remove("scene--survol");
  if (!personnageAffiche) {
    return;
  }
  personnageAffiche.classList.remove("wagon__personnage--survole");
  personnageAffiche = null;
  gsap.killTweensOf(bulle);
  gsap.to(bulle, { autoAlpha: 0, duration: 0.1, ease: "steps(2)" });
}

// Indique si le pointeur se trouve sur la porte du fond.
// evenement : événement de pointeur
function estSurPorte(evenement) {
  const pixel = convertirEnPixel(evenement);
  return pixel !== null
    && pixel.x >= ZONE_PORTE.gauche && pixel.x < ZONE_PORTE.droite
    && pixel.y >= ZONE_PORTE.haut && pixel.y < ZONE_PORTE.bas;
}

// Met en valeur la porte du fond (ou retire la mise en valeur) :
// cadre lumineux, battants éclaircis et étiquette "Wagon suivant" ou "Fin du train".
// actif : vrai pour afficher, faux pour retirer
function survolerPorte(actif) {
  if (actif === porteSurvolee) {
    return;
  }
  porteSurvolee = actif;

  const portes = trouverPortes(wagons[wagonActuel]);
  portes.gauche.classList.toggle("wagon__porte--survolee", actif);
  portes.droite.classList.toggle("wagon__porte--survolee", actif);

  if (actif) {
    const dernierWagon = wagonActuel === wagons.length - 1;
    etiquettePorte.textContent = dernierWagon ? "Fin du train" : "Wagon suivant";
    etiquettePorte.classList.toggle("etiquette-porte--fermee", dernierWagon);
  }
  gsap.killTweensOf([cadrePorte, etiquettePorte]);
  gsap.to([cadrePorte, etiquettePorte], { autoAlpha: actif ? 1 : 0, duration: 0.12, ease: "steps(2)" });
}

// Souris : la pensée suit le survol des personnages,
// et le curseur devient une main sur un personnage ou sur la porte.
// evenement : événement pointermove
function gererSurvol(evenement) {
  if (evenement.pointerType !== "mouse" || enAnimation) {
    return;
  }
  const personnage = trouverPersonnage(evenement);
  if (personnage) {
    afficherPensee(personnage);
  } else {
    masquerPensee();
  }
  // Un personnage devant la porte a la priorité sur elle
  const surPorte = personnage === null && estSurPorte(evenement);
  survolerPorte(surPorte);
  scene.classList.toggle("scene--survol", personnage !== null || surPorte);
}

// Clic (souris) ou tap (doigt) dans la scène :
// sur un personnage, affiche sa pensée ; sur la porte, passe au wagon suivant ;
// ailleurs, cache la pensée. Un glissé est ignoré (le swipe sert déjà à changer de wagon).
// evenement : événement pointerup
function gererAppui(evenement) {
  if (enAnimation || !debutAppui) {
    return;
  }
  const distance = Math.hypot(evenement.clientX - debutAppui.x, evenement.clientY - debutAppui.y);
  debutAppui = null;
  if (distance > DISTANCE_MAX_TAP) {
    return;
  }
  const personnage = trouverPersonnage(evenement);
  if (personnage) {
    afficherPensee(personnage);
  } else if (estSurPorte(evenement)) {
    wagonSuivant();
  } else {
    masquerPensee();
  }
}


/* ==========================================================
   5. Ambiance
   ========================================================== */

// Fait défiler le paysage en boucle vers le spectateur, le long de chaque paroi,
// comme vu depuis un train qui avance vers la porte du fond.
// Chaque couche a sa propre vitesse (voir DUREES_PAYSAGE).
function lancerPaysage() {
  const pas = `steps(${TOILE_LARGEUR})`;
  Object.entries(DUREES_PAYSAGE).forEach(([couche, duree]) => {
    const gauche = document.querySelector(`.paysage__cote--gauche .paysage__bande--${couche}`);
    const droite = document.querySelector(`.paysage__cote--droite .paysage__bande--${couche}`);
    // La bande contient trois paysages : un décalage d'un tiers la ramène à l'identique
    gsap.fromTo(gauche, { xPercent: 0 }, { xPercent: -100 / 3, duration: duree, ease: pas, repeat: -1 });
    gsap.fromTo(droite, { xPercent: 0 }, { xPercent: 100 / 3, duration: duree, ease: pas, repeat: -1 });
  });
}

// Secousse du décor, d'un pixel source vers le bas puis retour, à intervalle irrégulier.
// Seuls le paysage et les wagons bougent : la bulle de pensée et l'interface restent immobiles.
function secouer() {
  const unPixel = (1 / TOILE_HAUTEUR) * 100;
  const decor = [paysage, ...wagons];
  gsap.timeline({ onComplete: secouer, delay: gsap.utils.random(SECOUSSE_MIN, SECOUSSE_MAX) })
    .to(decor, { yPercent: unPixel, duration: 0.08, ease: "steps(1)" })
    .to(decor, { yPercent: 0, duration: 0.08, ease: "steps(1)" });
}

// Scintillement bref et irrégulier de la lumière, puis on reprogramme le suivant.
function scintiller() {
  gsap.timeline({ onComplete: scintiller, delay: gsap.utils.random(SCINTILLEMENT_MIN, SCINTILLEMENT_MAX) })
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

// Pensées et porte : survol à la souris, clic ou tap
scene.addEventListener("pointermove", gererSurvol);
// Au doigt, le navigateur envoie aussi pointerleave à chaque fin de toucher : on l'ignore
scene.addEventListener("pointerleave", (evenement) => {
  if (evenement.pointerType === "mouse") {
    masquerPensee();
    survolerPorte(false);
  }
});
scene.addEventListener("pointerdown", (evenement) => {
  // Seul le bouton principal de la souris compte (pas le clic droit)
  if (evenement.button === 0) {
    debutAppui = { x: evenement.clientX, y: evenement.clientY };
  }
});
scene.addEventListener("pointerup", gererAppui);


/* ==========================================================
   7. Initialisation
   ========================================================== */

afficherWagon(0);
lancerPaysage();
preparerPersonnages();

if (!mouvementReduit) {
  secouer();
  scintiller();
}
