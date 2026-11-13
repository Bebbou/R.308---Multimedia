/* ==========================================================
   1. Réglages
   ========================================================== */

// Taille de la toile pixel art, en pixels source
const TOILE_LARGEUR = 640;
const TOILE_HAUTEUR = 360;

// Durées des transitions, en secondes
const DUREE_PORTE = 0.7;
const DUREE_FONDU = 0.4;
// Coefficient appliqué aux durées si l'utilisateur demande moins d'animations
const COEF_MOUVEMENT_REDUIT = 0.4;

// Largeur d'un battant de porte, en pixels source (il glisse de cette distance)
const LARGEUR_BATTANT = 32;

// Temps pour que chaque couche du paysage défile d'une largeur complète, en secondes.
// Plus la couche est lointaine, plus elle est lente : c'est ce qui donne la profondeur.
const DUREES_PAYSAGE = { loin: 120, milieu: 60, proche: 30 };
// Intervalle aléatoire entre deux secousses du train (joint de rail), en secondes
const SECOUSSE_MIN = 6;
const SECOUSSE_MAX = 9;
// Intervalle aléatoire entre deux scintillements de la lumière, en secondes
const SCINTILLEMENT_MIN = 15;
const SCINTILLEMENT_MAX = 30;

// Zoom vers la porte pendant son ouverture, puis léger recul à l'arrivée dans le wagon suivant
const ZOOM_PORTE = 1.25;
const ZOOM_ARRIVEE = 1.06;
const DUREE_ARRIVEE = 0.6;
// Temps pendant lequel le carton titre reste affiché, en secondes
const DUREE_CARTON = 1.5;
// Pensées : délai entre deux lettres qui s'écrivent, en secondes
const VITESSE_ECRITURE = 0.025;
// Respiration des voyageurs : intervalle aléatoire, en secondes
const RESPIRATION_MIN = 2.5;
const RESPIRATION_MAX = 5;
// Marill suspendu : angle du balancement (degrés), durée d'une demi-oscillation (secondes)
// et point d'accroche au plafond sur la toile 640 x 360, en pourcentage
// Vie des voyageurs : manières de bouger (une par voyageur), intervalle entre deux gestes (secondes)
const MANIERES = ["respirer", "dodeliner", "somnoler", "guetter"];
const GESTE_MIN = 3;
const GESTE_MAX = 8;
// Personnalités : intervalle entre deux scènes jouées par un voyageur, en secondes
const PERSONNALITE_MIN = 5;
const PERSONNALITE_MAX = 11;
const BALANCEMENT_ANGLE = 3;
const BALANCEMENT_DUREE = 1.4;
const ACCROCHE_MARILL = "50% 6.7%";
// Fumée de la locomotive : temps pour qu'une bouffée passe du fond du paysage
// jusqu'aux fenêtres les plus proches, en secondes, et agrandissement atteint à la fin
const DUREE_FUMEE = 9;
const ECHELLE_FUMEE = 3;
// Lampes à gaz : opacité des halos (entre ces deux valeurs) et délai entre deux variations
const LUEUR_MIN = 0.32;
const LUEUR_MAX = 0.5;
const LUEUR_DELAI_MIN = 0.08;
const LUEUR_DELAI_MAX = 0.35;
// Sans action pendant ce temps (en secondes), la porte clignote pour montrer où aller
const DELAI_ATTENTE = 8;

// Sons (Howler) : volumes de 0 à 1, et temps de fondu entre deux ambiances, en secondes.
// L'ambiance de chaque wagon est donnée dans le HTML (data-son sur la section).
const VOLUME_AMBIANCE = 0.5;
const VOLUME_EFFETS = 0.6;
const DUREE_FONDU_SON = 1.2;
// Bruitages communs à tous les wagons
const SONS_EFFETS = {
  porte: "assets/sons/porte.wav",
  porteVerrouillee: "assets/sons/porte-verrouillee.wav",
  bulle: "assets/sons/bulle.wav",
};

// Distance minimale (en pixels) avant qu'Observer considère un geste
const TOLERANCE_OBSERVER = 10;

// Pensées : espace entre le haut de la tête et la pointe de la bulle, en pixels source
const ECART_BULLE = 8;
// Amplitude des secousses (train et porte verrouillée), en pixels source
const PAS_SECOUSSE = 2;
// Au-delà de cette distance (en pixels écran), un appui est un glissé et pas un clic ou un tap
const DISTANCE_MAX_TAP = 10;
// Part de la scène, à gauche et à droite, où la bulle se décale pour ne pas sortir de l'écran
const ZONE_BORD = 0.2;

// Ouverture de la porte du fond sur la toile 640 x 360 (voir DOCUMENTATION.md, Perspective).
// Un clic ou un tap dans cette zone ouvre la porte.
const ZONE_PORTE = { gauche: 288, droite: 352, haut: 144, bas: 284 };


/* ==========================================================
   2. Sélection des éléments du DOM
   ========================================================== */

const scene = document.querySelector(".scene");
const wagons = document.querySelectorAll(".wagon");
const decor = document.querySelector(".decor");
const lumiere = document.querySelector(".lumiere");
const fondu = document.querySelector(".fondu");
const indicateurNumero = document.querySelector(".indicateur__numero");
const indicateurNom = document.querySelector(".indicateur__nom");
const boutonArriere = document.querySelector(".bouton-arriere");
const boutonAvant = document.querySelector(".bouton-avant");
const boutonSon = document.querySelector(".bouton-son");
const bulle = document.querySelector(".pensee");
const bulleTexte = document.querySelector(".pensee__texte");
const cadrePorte = document.querySelector(".cadre-porte");
const etiquettePorte = document.querySelector(".etiquette-porte");
const bulleNom = document.querySelector(".pensee__nom");
const indicateur = document.querySelector(".indicateur");
const indicateurTrain = document.querySelector(".indicateur__train");
const carton = document.querySelector(".carton");
const cartonNumero = document.querySelector(".carton__numero");
const cartonTitre = document.querySelector(".carton__titre");
const accueil = document.querySelector(".accueil");
const boutonAccueil = document.querySelector(".accueil__bouton");
const inviteAccueil = document.querySelector(".accueil__invite");


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
// Vrai tant que l'écran d'accueil est affiché
let accueilOuvert = true;
// Animations en cours, gardées pour pouvoir les arrêter
let ecriture = null;
let apparitionCarton = null;
let clignotementInvite = null;
let minuterieAttente = null;
let appelPorte = null;

// Sons : une ambiance en boucle par wagon (null si le wagon n'en a pas), et les bruitages
const ambiances = [];
const effets = {};
// Ambiance en train de jouer (null si aucune)
let ambianceActuelle = null;
// Vrai quand l'utilisateur a coupé le son
let sonCoupe = false;


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

// Dessine le petit train de l'indicateur : un wagon par section.wagon.
function creerTrain() {
  wagons.forEach(() => {
    const petitWagon = document.createElement("span");
    petitWagon.className = "indicateur__wagon";
    indicateurTrain.append(petitWagon);
  });
}

// Met à jour l'indicateur (petit train et texte) et l'état des boutons Arrière et Suivant.
function mettreAJourInterface() {
  [...indicateurTrain.children].forEach((petitWagon, i) => {
    petitWagon.classList.toggle("indicateur__wagon--passe", i < wagonActuel);
    petitWagon.classList.toggle("indicateur__wagon--actuel", i === wagonActuel);
  });
  indicateurNumero.textContent = `${formaterNumero(wagonActuel + 1)} / ${formaterNumero(wagons.length)}`;
  indicateurNom.textContent = wagons[wagonActuel].dataset.titre;
  boutonArriere.disabled = wagonActuel === 0;
  boutonAvant.disabled = wagonActuel === wagons.length - 1;
}

// Affiche uniquement le wagon demandé et referme ses portes.
// index : numéro du wagon (0 = premier wagon)
function afficherWagon(index) {
  wagons.forEach((wagon, i) => {
    gsap.set(wagon, { autoAlpha: i === index ? 1 : 0 });
  });
  const portes = trouverPortes(wagons[index]);
  gsap.set([portes.gauche, portes.droite], { xPercent: 0 });
  // Lumière du wagon (voir .scene[data-ambiance] dans style.css)
  scene.dataset.ambiance = wagons[index].dataset.ambiance || "";
  // Annule le zoom du trajet précédent
  gsap.set(decor, { scale: 1 });
  // Le son ne démarre qu'après l'écran d'accueil (le navigateur bloque le son avant un geste)
  if (!accueilOuvert) {
    changerAmbiance(index);
  }
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
  // On entre dans le wagon : la vue recule légèrement pendant que le noir se dissipe
  if (!mouvementReduit) {
    trajet.fromTo(
      decor,
      { scale: ZOOM_ARRIVEE },
      { scale: 1, duration: DUREE_ARRIVEE, ease: "power2.out", immediateRender: false },
      "<",
    );
  }
  trajet.call(afficherCarton, [index]);
}

// Affiche le carton titre du wagon ("Wagon 02" et son titre), puis le cache.
// index : numéro du wagon (0 = premier wagon)
function afficherCarton(index) {
  masquerCarton();
  cartonNumero.textContent = `Wagon ${formaterNumero(index + 1)}`;
  cartonTitre.textContent = wagons[index].dataset.titre;
  apparitionCarton = gsap.timeline()
    .fromTo(carton, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "steps(3)" })
    .to(carton, { autoAlpha: 0, duration: 0.2, ease: "steps(3)" }, `+=${DUREE_CARTON}`);
}

// Cache tout de suite le carton titre.
function masquerCarton() {
  if (apparitionCarton) {
    apparitionCarton.kill();
  }
  gsap.set(carton, { autoAlpha: 0 });
}

// Crée une timeline qui libère le verrou à la fin.
function creerTrajet() {
  enAnimation = true;
  masquerEmotes();
  masquerObjets();
  masquerPensee();
  survolerPorte(false);
  masquerCarton();
  relancerAttente();
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
  jouerEffet("porte");

  // Les battants glissent pixel par pixel dans la paroi
  trajet
    .to(portes.gauche, { xPercent: -ouverture, duration: adapterDuree(DUREE_PORTE), ease: `steps(${LARGEUR_BATTANT})` }, 0)
    .to(portes.droite, { xPercent: ouverture, duration: adapterDuree(DUREE_PORTE), ease: `steps(${LARGEUR_BATTANT})` }, 0);
  // Pendant ce temps, on s'approche de la porte jusqu'à ce que le noir tombe
  if (!mouvementReduit) {
    trajet.to(
      decor,
      { scale: ZOOM_PORTE, duration: DUREE_PORTE + DUREE_FONDU, ease: "power1.in" },
      0,
    );
  }
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

// Fait trembler la porte fermée, de PAS_SECOUSSE pixels source à gauche et à droite.
// portes : battants renvoyés par trouverPortes()
function porteVerrouillee(portes) {
  const unPixel = (PAS_SECOUSSE / TOILE_LARGEUR) * 100;
  const trajet = creerTrajet();
  jouerEffet("porteVerrouillee");
  trajet
    .to([portes.gauche, portes.droite], { xPercent: -unPixel, duration: 0.05, ease: "steps(1)" })
    .to([portes.gauche, portes.droite], { xPercent: unPixel, duration: 0.05, ease: "steps(1)", repeat: 3, yoyo: true })
    .to([portes.gauche, portes.droite], { xPercent: 0, duration: 0.05, ease: "steps(1)" });
}


// Calques de décor placés après ce personnage dans son wagon (bancs de devant, par exemple) :
// ils sont dessinés par-dessus lui et cachent une partie de son corps.
// Les calques d'ambiance (lueurs, fumée) sont transparents à l'oeil et ne comptent pas.
// image : élément img.wagon__personnage
function calquesDevant(image) {
  const calques = [...image.closest(".wagon").querySelectorAll(".wagon__calque")];
  return calques
    .slice(calques.indexOf(image) + 1)
    .filter((calque) => !calque.matches(".wagon__personnage, .wagon__lueur, .wagon__fumee"));
}

// Lit les pixels d'une image de personnage : quels pixels sont visibles,
// et où se trouve le haut de sa tête (ancrage de la bulle).
// Le personnage est dessiné en entier : les pixels cachés par un calque de décor posé
// devant lui (un banc) sont retirés, pour que seul ce qu'on voit de lui réagisse au survol.
// image : élément img.wagon__personnage
async function analyserPersonnage(image) {
  const devant = calquesDevant(image);
  await Promise.all([image, ...devant].map((calque) => calque.decode()));

  // On dessine l'image en taille réelle (640 x 360) dans un canvas invisible
  const toile = document.createElement("canvas");
  toile.width = TOILE_LARGEUR;
  toile.height = TOILE_HAUTEUR;
  const contexte = toile.getContext("2d");
  contexte.drawImage(image, 0, 0, TOILE_LARGEUR, TOILE_HAUTEUR);
  // "destination-out" efface du personnage tout ce que les calques de devant recouvrent
  contexte.globalCompositeOperation = "destination-out";
  devant.forEach((calque) => contexte.drawImage(calque, 0, 0, TOILE_LARGEUR, TOILE_HAUTEUR));
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

// Convertit une position à l'écran en pixel de la toile 640 x 360.
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
  // Les autres voyageurs du wagon passent en retrait (voir .wagon--lecture dans style.css)
  image.closest(".wagon").classList.add("wagon--lecture");
  personnageAffiche = image;
  jouerEffet("bulle");

  const { ancre } = donneesPersonnages.get(image);
  const positionX = ancre.x / TOILE_LARGEUR;
  const presBordGauche = positionX < ZONE_BORD;
  const presBordDroit = positionX > 1 - ZONE_BORD;
  bulleNom.textContent = image.dataset.nom;
  // Un voyageur qui « parle » en code (data-langage, ex. Erine en PHP) a une bulle de code
  bulle.classList.toggle("pensee--code", Boolean(image.dataset.langage));
  ecrirePensee(image.dataset.pensee);

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

// Écrit la pensée lettre par lettre, comme une machine à écrire.
// Toutes les lettres sont placées dès le départ (invisibles) : la bulle a tout de suite
// sa taille finale et ne grandit pas pendant l'écriture.
// texte : pensée du personnage
function ecrirePensee(texte) {
  if (ecriture) {
    ecriture.kill();
  }
  const lettres = [...texte].map((caractere) => {
    const lettre = document.createElement("span");
    lettre.textContent = caractere;
    return lettre;
  });
  bulleTexte.replaceChildren(...lettres);
  if (mouvementReduit) {
    return;
  }
  ecriture = gsap.fromTo(
    lettres,
    { opacity: 0 },
    { opacity: 1, duration: 0.01, stagger: VITESSE_ECRITURE, delay: 0.15 },
  );
}

// Cache la bulle de pensée et retire le contour du personnage.
function masquerPensee() {
  scene.classList.remove("scene--survol-personnage");
  if (!personnageAffiche) {
    return;
  }
  personnageAffiche.classList.remove("wagon__personnage--survole");
  personnageAffiche.closest(".wagon").classList.remove("wagon--lecture");
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

// Fait clignoter doucement le cadre de la porte, pour montrer où aller.
// Rien au dernier wagon : la porte y est verrouillée.
function appelerPorte() {
  if (enAnimation || accueilOuvert || porteSurvolee || wagonActuel === wagons.length - 1) {
    return;
  }
  appelPorte = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    .to(cadrePorte, { autoAlpha: 0.8, duration: 0.3, ease: "steps(2)" })
    .to(cadrePorte, { autoAlpha: 0, duration: 0.3, ease: "steps(2)" });
}

// Arrête le clignotement de la porte et relance le compte à rebours d'inactivité.
function relancerAttente() {
  if (minuterieAttente) {
    minuterieAttente.kill();
  }
  if (appelPorte) {
    appelPorte.kill();
    appelPorte = null;
    if (!porteSurvolee) {
      gsap.set(cadrePorte, { autoAlpha: 0 });
    }
  }
  minuterieAttente = gsap.delayedCall(DELAI_ATTENTE, appelerPorte);
}

// Souris : la pensée suit le survol des personnages,
// et le curseur devient une main sur un personnage ou sur la porte.
// evenement : événement pointermove
function gererSurvol(evenement) {
  if (evenement.pointerType !== "mouse" || enAnimation || accueilOuvert) {
    return;
  }
  relancerAttente();
  const personnage = trouverPersonnage(evenement);
  if (personnage) {
    afficherPensee(personnage);
  } else {
    masquerPensee();
  }
  // Un personnage devant la porte a la priorité sur elle
  const surPorte = personnage === null && estSurPorte(evenement);
  survolerPorte(surPorte);
  scene.classList.toggle("scene--survol-personnage", personnage !== null);
  scene.classList.toggle("scene--survol-porte", surPorte);
}

// Clic (souris) ou tap (doigt) dans la scène :
// sur un personnage, affiche sa pensée ; sur la porte, passe au wagon suivant ;
// ailleurs, cache la pensée. Un glissé est ignoré (le swipe sert déjà à changer de wagon).
// evenement : événement pointerup
function gererAppui(evenement) {
  if (enAnimation || accueilOuvert || !debutAppui) {
    return;
  }
  relancerAttente();
  const distance = Math.hypot(evenement.clientX - debutAppui.x, evenement.clientY - debutAppui.y);
  debutAppui = null;
  if (distance > DISTANCE_MAX_TAP) {
    return;
  }
  const personnage = trouverPersonnage(evenement);
  if (personnage) {
    afficherPensee(personnage);
    // Le son propre au personnage (le "CUUUT" de Blanco) ne part qu'au clic ou au tap, pas au survol
    jouerSonPensee(personnage);
  } else if (estSurPorte(evenement)) {
    wagonSuivant();
  } else {
    masquerPensee();
  }
}

// Ferme l'écran d'accueil et fait apparaître l'interface et le titre du premier wagon.
function fermerAccueil() {
  if (!accueilOuvert) {
    return;
  }
  accueilOuvert = false;
  clignotementInvite.kill();
  gsap.to(accueil, { autoAlpha: 0, duration: adapterDuree(0.4), ease: "steps(4)" });
  gsap.to([indicateur, boutonArriere, boutonAvant, boutonSon], { autoAlpha: 1, duration: adapterDuree(0.4), ease: "steps(4)" });
  // Premier geste de l'utilisateur : le navigateur autorise enfin le son
  changerAmbiance(wagonActuel);
  afficherCarton(wagonActuel);
  relancerAttente();
}

// Prépare l'écran d'accueil : interface cachée, invitation qui clignote, bouton prêt au clavier.
function ouvrirAccueil() {
  gsap.set([indicateur, boutonArriere, boutonAvant, boutonSon], { autoAlpha: 0 });
  clignotementInvite = gsap.to(inviteAccueil, { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });
  boutonAccueil.focus();
}


// Crée les sons avec Howler : l'ambiance de chaque wagon (data-son, jouée en boucle)
// et les bruitages communs (SONS_EFFETS). Rien ne joue encore.
function preparerSons() {
  wagons.forEach((wagon) => {
    const fichier = wagon.dataset.son;
    ambiances.push(fichier ? new Howl({ src: [fichier], loop: true, volume: 0 }) : null);
  });
  Object.entries(SONS_EFFETS).forEach(([nom, fichier]) => {
    effets[nom] = new Howl({ src: [fichier], volume: VOLUME_EFFETS });
  });
}

// Passe en fondu de l'ambiance du wagon quitté à celle du wagon demandé.
// L'ancienne est mise en pause à la fin de son fondu, sauf si on y est revenu entre-temps.
// index : numéro du wagon (0 = premier wagon)
function changerAmbiance(index) {
  const nouvelle = ambiances[index];
  const ancienne = ambianceActuelle;
  if (nouvelle === ancienne) {
    return;
  }
  const duree = DUREE_FONDU_SON * 1000;
  if (ancienne) {
    ancienne.fade(ancienne.volume(), 0, duree);
    ancienne.once("fade", () => {
      if (ancienne !== ambianceActuelle) {
        ancienne.pause();
      }
    });
  }
  if (nouvelle) {
    if (!nouvelle.playing()) {
      nouvelle.play();
    }
    nouvelle.fade(nouvelle.volume(), VOLUME_AMBIANCE, duree);
  }
  ambianceActuelle = nouvelle;
}

// Joue un bruitage une fois.
// nom : clé de SONS_EFFETS ("porte", "porteVerrouillee" ou "bulle")
function jouerEffet(nom) {
  effets[nom].play();
}

// Sons propres à certains personnages (data-son-pensee sur l'image) : déjà chargés, un par fichier
const sonsPensees = new Map();
// Son de pensée en cours, pour l'arrêter si on change de personnage
let sonPenseeActuel = null;

// Joue le son d'un personnage quand on clique dessus (par exemple le "CUUUT" de Blanco).
// Rien ne se passe si le personnage n'a pas de data-son-pensee.
// image : élément img.wagon__personnage
function jouerSonPensee(image) {
  arreterSonPensee();
  const fichier = image.dataset.sonPensee;
  if (!fichier) {
    return;
  }
  if (!sonsPensees.has(fichier)) {
    sonsPensees.set(fichier, new Howl({ src: [fichier], volume: VOLUME_EFFETS }));
  }
  sonPenseeActuel = sonsPensees.get(fichier);
  sonPenseeActuel.play();
}

// Coupe le son de pensée en cours.
function arreterSonPensee() {
  if (sonPenseeActuel) {
    sonPenseeActuel.stop();
    sonPenseeActuel = null;
  }
}

// Coupe ou remet tout le son (bouton Son et touche M).
function basculerSon() {
  sonCoupe = !sonCoupe;
  Howler.mute(sonCoupe);
  boutonSon.textContent = sonCoupe ? "Son : non" : "Son : oui";
  boutonSon.setAttribute("aria-pressed", String(!sonCoupe));
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
    // On fait glisser l'image de fond de la bande, pas la bande elle-même :
    // une bande déplacée (transform) devient un calque à part pour la carte graphique,
    // et les trois couches posées sur le même plan 3D se mettent alors à clignoter.
    // La bande contient trois paysages : 50 % de background-position décale d'un paysage,
    // ce qui la ramène à l'identique.
    gsap.fromTo(gauche, { backgroundPositionX: "0%" }, { backgroundPositionX: "-50%", duration: duree, ease: pas, repeat: -1 });
    gsap.fromTo(droite, { backgroundPositionX: "0%" }, { backgroundPositionX: "50%", duration: duree, ease: pas, repeat: -1 });
  });
}

// Secousse du décor, de PAS_SECOUSSE pixels source vers le bas puis retour, à intervalle irrégulier.
// Seuls le paysage et les wagons bougent : la bulle de pensée et l'interface restent immobiles.
function secouer() {
  const unPixel = (PAS_SECOUSSE / TOILE_HAUTEUR) * 100;
  gsap.timeline({ onComplete: secouer, delay: gsap.utils.random(SECOUSSE_MIN, SECOUSSE_MAX) })
    .to(decor, { yPercent: unPixel, duration: 0.08, ease: "steps(1)" })
    .to(decor, { yPercent: 0, duration: 0.08, ease: "steps(1)" });
}

// Scintillement bref et irrégulier de la lumière, puis on reprogramme le suivant.
// Les LED d'un train d'aujourd'hui ne scintillent pas : rien dans un wagon data-ambiance="led".
function scintiller() {
  const delai = gsap.utils.random(SCINTILLEMENT_MIN, SCINTILLEMENT_MAX);
  if (scene.dataset.ambiance === "led") {
    gsap.delayedCall(delai, scintiller);
    return;
  }
  gsap.timeline({ onComplete: scintiller, delay: delai })
    .to(lumiere, { opacity: 0.4, duration: 0.06, ease: "steps(1)" })
    .to(lumiere, { opacity: 1, duration: 0.06, ease: "steps(1)" })
    .to(lumiere, { opacity: 0.6, duration: 0.05, ease: "steps(1)" })
    .to(lumiere, { opacity: 1, duration: 0.1, ease: "steps(1)" });
}

// Respiration d'un voyageur : il se soulève d'un pixel source un court instant,
// à intervalle irrégulier (chaque voyageur a son propre rythme).
// image : élément img.wagon__personnage
function respirer(image) {
  const unPixel = (1 / TOILE_HAUTEUR) * 100;
  gsap.timeline({ onComplete: respirer, onCompleteParams: [image], delay: gsap.utils.random(RESPIRATION_MIN, RESPIRATION_MAX) })
    .to(image, { yPercent: -unPixel, duration: 0.01 })
    .to(image, { yPercent: 0, duration: 0.01 }, "+=0.6");
}


// Donne à chaque voyageur sa propre manière de bouger, pour que le wagon vive.
// La manière se choisit avec data-animation dans le HTML (respirer, dodeliner, somnoler, guetter),
// sinon elle est répartie à tour de rôle.
// image : élément img.wagon__personnage
// index : rang du voyageur dans la page
function animerPersonnage(image, index) {
  if (image.dataset.personnalite === "livreur") {
    lancerEmbrouille(image, document.querySelector('.wagon__personnage[data-personnalite="dame"]'));
    return;
  }
  if (image.dataset.personnalite === "dame") {
    return;
  }
  if (PERSONNALITES[image.dataset.personnalite]) {
    jouerPersonnalite(image, image.dataset.personnalite);
    return;
  }
  const maniere = MANIERES.includes(image.dataset.animation)
    ? image.dataset.animation
    : MANIERES[index % MANIERES.length];
  if (maniere === "respirer") {
    respirer(image);
  } else {
    gesteDe(image, maniere);
  }
}

// Joue un geste, puis programme le suivant à un intervalle irrégulier.
// Tous les mouvements se font par paliers d'un ou deux pixels source.
// image : élément img.wagon__personnage
// maniere : "dodeliner" (balance d'un côté), "somnoler" (la tête tombe puis se redresse)
// ou "guetter" (se penche à gauche puis à droite, comme pour regarder dehors)
function gesteDe(image, maniere) {
  const deuxX = (2 / TOILE_LARGEUR) * 100;
  const deuxY = (2 / TOILE_HAUTEUR) * 100;
  const geste = gsap.timeline({
    delay: gsap.utils.random(GESTE_MIN, GESTE_MAX),
    onComplete: gesteDe,
    onCompleteParams: [image, maniere],
  });
  if (maniere === "dodeliner") {
    geste
      .to(image, { xPercent: deuxX, duration: 0.01 })
      .to(image, { xPercent: 0, duration: 0.01 }, "+=0.9")
      .to(image, { xPercent: -deuxX, duration: 0.01 }, "+=1.2")
      .to(image, { xPercent: 0, duration: 0.01 }, "+=0.9");
  } else if (maniere === "somnoler") {
    geste
      .to(image, { yPercent: deuxY, duration: 1.2, ease: "steps(2)" })
      .to(image, { yPercent: 0, duration: 0.01 }, "+=1.5");
  } else {
    geste
      .to(image, { xPercent: -deuxX, duration: 0.01 })
      .to(image, { xPercent: deuxX, duration: 0.01 }, "+=1")
      .to(image, { xPercent: 0, duration: 0.01 }, "+=1");
  }
}

// Scènes de personnalité : chaque voyageur a un petit jeu d'acteur qui lui est propre,
// choisi avec data-personnalite dans le HTML. "emote" est l'icône qui apparaît au-dessus de sa tête
// (assets/images/emotes/<nom>.png). "jouer" ajoute le mouvement à la timeline,
// avec deux pixels source = 2 / 640 de la largeur, 2 / 360 de la hauteur.
// Sprite de départ de Joaquim (ses autres poses ont le même nom, avec joachim-<pose> à la place de personnage-02)
const SPRITE_JOACHIM = "assets/images/wagon-01/personnage-02.png";
const DEUX_X = (2 / TOILE_LARGEUR) * 100;
const DEUX_Y = (2 / TOILE_HAUTEUR) * 100;
const PERSONNALITES = {
  // Joaquim joue sur sa DS et rage : il serre les dents, se lève, brandit sa console puis la jette
  // par terre dans l'allée (elle y reste un moment), et se rassoit les bras ballants.
  // Ses poses sont dans assets/images/wagon-01/joachim-<pose>.png (voir joachim-planche.png).
  rager: {
    emote: "colere",
    dureeEmote: 0.9,
    jouer: (t, img) => {
      const pose = (nom) => () => {
        img.src = nom === "jouer" ? SPRITE_JOACHIM : SPRITE_JOACHIM.replace("personnage-02", `joachim-${nom}`);
      };
      const tenue = trouverObjet("ds-tenue");
      const sol = trouverObjet("ds-sol");
      const enPourcent = (x, y) => ({ left: `${(x / TOILE_LARGEUR) * 100}%`, top: `${(y / TOILE_HAUTEUR) * 100}%` });
      const LEVER = (16 / TOILE_HAUTEUR) * 100;
      // Console brandie au-dessus de sa tête (position dans la toile, une fois debout) et point d'impact
      const haut = { x: 451, y: 199 - 16 };
      const impact = { x: 330, y: 330 };

      // 1. Il serre la console et tremble de rage
      t.call(pose("rage"), null, 0);
      for (let i = 0; i < 6; i++) {
        t.to(img, { xPercent: i % 2 ? DEUX_X : -DEUX_X, duration: 0.01 }, `+=${i === 0 ? 0 : 0.07}`);
      }
      t.to(img, { xPercent: 0, duration: 0.01 }, "+=0.07");
      // 2. Il se lève d'un bond, bras tendus, la console au-dessus de la tête
      t.call(pose("haut"), null, "+=0.15")
        .to(img, { yPercent: -LEVER, duration: 0.2, ease: "steps(3)" }, "<");
      // 3. Il la lâche : les bras retombent, elle file vers le sol de l'allée
      t.call(() => {
        pose("lance")();
        gsap.set(tenue, { ...enPourcent(haut.x, haut.y), autoAlpha: 1 });
      }, null, "+=0.4")
        .to(tenue, { left: `${(impact.x / TOILE_LARGEUR) * 100}%`, duration: 0.5, ease: "steps(10)" }, ">")
        .to(tenue, { top: `${(impact.y / TOILE_HAUTEUR) * 100}%`, duration: 0.5, ease: "steps(10)" }, "<");
      // 4. Elle s'écrase : un rebond, puis elle reste au sol
      t.call(() => {
        gsap.set(tenue, { autoAlpha: 0 });
        gsap.set(sol, { ...enPourcent(impact.x, impact.y - 6), autoAlpha: 1 });
      }, null, ">")
        .to(sol, { top: `${(impact.y / TOILE_HAUTEUR) * 100}%`, duration: 0.01 }, "+=0.1");
      // 5. Il se rassoit, essoufflé, les bras ballants
      t.call(pose("vide"), null, "+=0.3")
        .to(img, { yPercent: 0, duration: 0.2, ease: "steps(3)" }, "<");
      // 6. La console clignote puis disparaît : il la reprend en main
      t.to(sol, { autoAlpha: 0, duration: 0.01 }, "+=3")
        .to(sol, { autoAlpha: 1, duration: 0.01 }, "+=0.15")
        .to(sol, { autoAlpha: 0, duration: 0.01 }, "+=0.15")
        .call(pose("jouer"), null, ">");
    },
    // Rétablit la pose de départ, même si la scène a été interrompue
    fin: (img) => {
      img.src = SPRITE_JOACHIM;
    },
  },
  // Erine tape du code : petits coups rapides, icône </>
  coder: {
    emote: "code",
    jouer: (t, img) => {
      for (let i = 0; i < 6; i++) {
        t.to(img, { yPercent: -DEUX_Y / 2, duration: 0.01 }, "+=0.1").to(img, { yPercent: 0, duration: 0.01 }, "+=0.1");
      }
    },
  },
  // Inas cherche son billet : elle se tortille à gauche et à droite
  fouiller: {
    emote: "question",
    jouer: (t, img) => {
      for (let i = 0; i < 3; i++) {
        t.to(img, { xPercent: -DEUX_X, duration: 0.01 }, "+=0.15").to(img, { xPercent: DEUX_X, duration: 0.01 }, "+=0.15");
      }
      t.to(img, { xPercent: 0, duration: 0.01 }, "+=0.15");
    },
  },
  // Raphaël pense à son chien : il s'affaisse, une larme
  soupirer: {
    emote: "larme",
    jouer: (t, img) => {
      t.to(img, { yPercent: DEUX_Y, duration: 0.8, ease: "steps(2)" }).to(img, { yPercent: 0, duration: 0.01 }, "+=1.6");
    },
  },
  // Max s'endort : la tête tombe, zzz
  somnoler: {
    emote: "zzz",
    jouer: (t, img) => {
      t.to(img, { yPercent: DEUX_Y, duration: 1.2, ease: "steps(2)" }).to(img, { yPercent: 0, duration: 0.01 }, "+=1.8");
    },
  },
  // Lino est scandalisé par le prix des chips : il sursaute
  indigner: {
    emote: "exclam",
    jouer: (t, img) => {
      t.to(img, { yPercent: -DEUX_Y, duration: 0.01 }).to(img, { yPercent: 0, duration: 0.01 }, "+=0.15")
        .to(img, { yPercent: -DEUX_Y, duration: 0.01 }, "+=0.2").to(img, { yPercent: 0, duration: 0.01 }, "+=0.15");
    },
  },
  // Kévin écoute son voisin : il se penche pour regarder derrière
  espionner: {
    emote: "question",
    jouer: (t, img) => {
      t.to(img, { xPercent: DEUX_X, duration: 0.01 }).to(img, { xPercent: 0, duration: 0.01 }, "+=1.6");
    },
  },
  // Julien trépigne d'impatience : petits sauts, sans icône
  trepigner: {
    emote: null,
    jouer: (t, img) => {
      for (let i = 0; i < 5; i++) {
        t.to(img, { yPercent: -DEUX_Y, duration: 0.01 }, "+=0.12").to(img, { yPercent: 0, duration: 0.01 }, "+=0.12");
      }
    },
  },
};

// Objets posés dans la scène (la console de Joaquim...), un par nom
const objets = new Map();

// Renvoie l'objet d'un nom (la crée au premier appel), centré sur le point donné par left et top.
// nom : nom du fichier dans assets/images/objets (sans .png)
function trouverObjet(nom) {
  if (!objets.has(nom)) {
    const objet = document.createElement("img");
    objet.className = "objet";
    objet.alt = "";
    objet.src = `assets/images/objets/${nom}.png`;
    objet.addEventListener("load", () => {
      objet.style.width = `${(objet.naturalWidth / TOILE_LARGEUR) * 100}%`;
    });
    scene.append(objet);
    gsap.set(objet, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
    objets.set(nom, objet);
  }
  return objets.get(nom);
}

// Icônes d'émotion déjà créées : pour chaque voyageur, une par nom d'icône
const emotes = new Map();

// Renvoie l'icône d'émotion d'un voyageur (la crée au premier appel).
// image : élément img.wagon__personnage
// nom : nom du fichier dans assets/images/emotes (sans .png)
function trouverEmote(image, nom) {
  if (!emotes.has(image)) {
    emotes.set(image, new Map());
  }
  const parNom = emotes.get(image);
  if (!parNom.has(nom)) {
    const emote = document.createElement("img");
    emote.className = "emote";
    emote.alt = "";
    emote.src = `assets/images/emotes/${nom}.png`;
    emote.addEventListener("load", () => {
      emote.style.width = `${(emote.naturalWidth / TOILE_LARGEUR) * 100}%`;
    });
    scene.append(emote);
    gsap.set(emote, { autoAlpha: 0 });
    parNom.set(nom, emote);
  }
  return parNom.get(nom);
}

// Pose l'icône au-dessus de la tête d'un voyageur (sans l'afficher) et la renvoie.
// image : élément img.wagon__personnage
// nom : nom de l'icône
function placerEmote(image, nom) {
  const { ancre } = donneesPersonnages.get(image);
  const emote = trouverEmote(image, nom);
  gsap.set(emote, {
    left: `${(ancre.x / TOILE_LARGEUR) * 100}%`,
    top: `${((ancre.y - 2) / TOILE_HAUTEUR) * 100}%`,
    xPercent: -50,
    yPercent: -100,
  });
  return emote;
}

// Cache toutes les icônes d'émotion.
function masquerEmotes() {
  emotes.forEach((parNom) => parNom.forEach((emote) => gsap.set(emote, { autoAlpha: 0 })));
}

// Cache tous les objets posés (changement de wagon).
function masquerObjets() {
  objets.forEach((objet) => gsap.set(objet, { autoAlpha: 0 }));
}

// Programme la prochaine scène d'un voyageur, la joue si le moment s'y prête, puis recommence.
// La scène n'a lieu que dans le wagon affiché, hors transition, accueil ou pensée ouverte.
// image : élément img.wagon__personnage
// personnalite : clé de PERSONNALITES
function jouerPersonnalite(image, personnalite) {
  const [mini, maxi] = PERSONNALITES[personnalite].intervalle || [PERSONNALITE_MIN, PERSONNALITE_MAX];
  gsap.delayedCall(gsap.utils.random(mini, maxi), () => {
    const donnees = donneesPersonnages.get(image);
    const libre = wagons[wagonActuel].contains(image) && !enAnimation && !accueilOuvert && personnageAffiche !== image;
    if (!libre || !donnees) {
      jouerPersonnalite(image, personnalite);
      return;
    }
    const { emote: nomEmote, jouer, dureeEmote, fin } = PERSONNALITES[personnalite];
    const trajet = gsap.timeline({
      onComplete: () => {
        if (nomEmote) {
          gsap.set(trouverEmote(image, nomEmote), { autoAlpha: 0 });
        }
        if (fin) {
          fin(image);
        }
        jouerPersonnalite(image, personnalite);
      },
    });
    if (nomEmote) {
      const emote = placerEmote(image, nomEmote);
      trajet.to(emote, { autoAlpha: 1, duration: 0.1, ease: "steps(2)" }, 0);
      // Certaines scènes sont plus longues que l'émotion : elle disparaît avant la fin
      if (dureeEmote) {
        trajet.to(emote, { autoAlpha: 0, duration: 0.1, ease: "steps(2)" }, dureeEmote);
      }
    }
    jouer(trajet, image, donnees);
  });
}

// Charge à l'avance les poses de Joaquim et ses consoles, pour que la scène ne saccade pas.
function precharger() {
  ["rage", "haut", "lance", "vide"].forEach((pose) => {
    new Image().src = SPRITE_JOACHIM.replace("personnage-02", `joachim-${pose}`);
  });
  ["ds-tenue", "ds-sol"].forEach(trouverObjet);
}

// Embrouille entre le livreur et la dame : une petite scène à deux, rejouée de temps en temps.
// La dame attaque, le livreur recule puis riposte, ils se retrouvent front contre front
// (étincelle entre eux), elle le bouscule, puis chacun reprend sa place.
// livreur, dame : éléments img.wagon__personnage
function lancerEmbrouille(livreur, dame) {
  const px = (n) => (n / TOILE_LARGEUR) * 100;
  const py = (n) => (n / TOILE_HAUTEUR) * 100;
  gsap.delayedCall(gsap.utils.random(7, 12), () => {
    const libre = wagons[wagonActuel].contains(livreur) && !enAnimation && !accueilOuvert
      && personnageAffiche !== livreur && personnageAffiche !== dame
      && donneesPersonnages.has(livreur) && donneesPersonnages.has(dame);
    if (!libre) {
      lancerEmbrouille(livreur, dame);
      return;
    }
    const criDame = placerEmote(dame, "exclam");
    const rageLivreur = placerEmote(livreur, "colere");
    const etincelle = trouverObjet("eclair");
    const ancreL = donneesPersonnages.get(livreur).ancre;
    const ancreD = donneesPersonnages.get(dame).ancre;
    // L'étincelle jaillit entre leurs deux visages
    gsap.set(etincelle, {
      left: `${(((ancreL.x + ancreD.x) / 2 + 4) / TOILE_LARGEUR) * 100}%`,
      top: `${((Math.max(ancreL.y, ancreD.y) + 14) / TOILE_HAUTEUR) * 100}%`,
    });
    const t = gsap.timeline({
      onComplete: () => {
        gsap.set([criDame, rageLivreur, etincelle], { autoAlpha: 0 });
        gsap.set([livreur, dame], { xPercent: 0, yPercent: 0 });
        lancerEmbrouille(livreur, dame);
      },
    });
    // 1. La dame attaque : elle se penche trois fois vers lui, le livreur recule d'un pas
    t.to(criDame, { autoAlpha: 1, duration: 0.01 });
    for (let i = 0; i < 3; i++) {
      t.to(dame, { xPercent: -px(2), duration: 0.01 }, "+=0.12").to(dame, { xPercent: 0, duration: 0.01 }, "+=0.14");
    }
    t.to(livreur, { xPercent: -px(2), duration: 0.01 }, "<")
      .to(criDame, { autoAlpha: 0, duration: 0.01 }, "+=0.25");
    // 2. Le livreur riposte : il avance par saccades, les boîtes tressautent
    t.to(rageLivreur, { autoAlpha: 1, duration: 0.01 });
    for (let i = 0; i < 3; i++) {
      t.to(livreur, { xPercent: px(2), yPercent: -py(2), duration: 0.01 }, "+=0.12")
        .to(livreur, { xPercent: 0, yPercent: 0, duration: 0.01 }, "+=0.14");
    }
    // 3. Front contre front : ils se rapprochent, tremblent, l'étincelle clignote entre eux
    t.to(livreur, { xPercent: px(3), duration: 0.01 }, "+=0.2")
      .to(dame, { xPercent: -px(2), duration: 0.01 }, "<")
      .to(criDame, { autoAlpha: 1, duration: 0.01 }, "<");
    for (let i = 0; i < 6; i++) {
      t.to(livreur, { xPercent: px(i % 2 ? 3 : 4), duration: 0.01 }, "+=0.07")
        .to(dame, { xPercent: -px(i % 2 ? 3 : 2), duration: 0.01 }, "<")
        .to(etincelle, { autoAlpha: i % 2 ? 0 : 1, duration: 0.01 }, "<");
    }
    // 4. Elle le bouscule : le livreur recule en trébuchant, la dame avance, puis tout retombe
    t.to(etincelle, { autoAlpha: 0, duration: 0.01 }, "+=0.05")
      .to(dame, { xPercent: -px(5), duration: 0.01 }, "<")
      .to(livreur, { xPercent: -px(6), yPercent: -py(3), duration: 0.01 }, "<")
      .to(livreur, { yPercent: 0, duration: 0.01 }, "+=0.15")
      .to(criDame, { autoAlpha: 0, duration: 0.01 }, "+=0.5")
      .to(dame, { xPercent: -px(2), duration: 0.01 }, "+=0.3")
      .to(livreur, { xPercent: -px(2), duration: 0.01 }, "<")
      .to(rageLivreur, { autoAlpha: 0, duration: 0.01 }, "+=0.2")
      .to([livreur, dame], { xPercent: 0, duration: 0.01 }, "+=0.4");
  });
}

// Balancement de Marill : le calque pivote autour du point d'accroche au plafond,
// par paliers pour rester dans l'esprit pixel.
// marill : élément img.wagon__marill
function balancer(marill) {
  gsap.set(marill, { rotation: -BALANCEMENT_ANGLE, transformOrigin: ACCROCHE_MARILL });
  gsap.to(marill, {
    rotation: BALANCEMENT_ANGLE,
    duration: BALANCEMENT_DUREE,
    ease: "steps(8)",
    repeat: -1,
    yoyo: true,
  });
}

// Fumée de la locomotive : dans chaque wagon, les copies du calque wagon__fumee
// s'agrandissent en boucle depuis le point de fuite, décalées dans le temps
// pour qu'il y ait toujours des bouffées le long des fenêtres.
// Chaque bouffée apparaît au loin, puis s'efface avant de sortir de l'écran.
function lancerFumee() {
  wagons.forEach((wagon) => {
    const copies = wagon.querySelectorAll(".wagon__fumee");
    copies.forEach((copie, i) => {
      const passage = gsap.timeline({ repeat: -1 })
        .fromTo(copie, { scale: 1 }, { scale: ECHELLE_FUMEE, duration: DUREE_FUMEE, ease: "power1.in" }, 0)
        .fromTo(copie, { opacity: 0 }, { opacity: 1, duration: DUREE_FUMEE * 0.2, ease: "steps(3)" }, 0)
        .to(copie, { opacity: 0, duration: DUREE_FUMEE * 0.3, ease: "steps(3)" }, DUREE_FUMEE * 0.7);
      passage.progress(i / copies.length);
    });
  });
}

// Fumée immobile quand l'utilisateur préfère moins d'animations : une seule copie, visible.
function poserFumee() {
  wagons.forEach((wagon) => {
    const copie = wagon.querySelector(".wagon__fumee");
    if (copie) {
      gsap.set(copie, { scale: 1.6, opacity: 1 });
    }
  });
}

// Flamme des lampes à gaz : l'opacité des halos varie un peu, sans cesse, par paliers.
// lueur : élément img.wagon__lueur
function vaciller(lueur) {
  gsap.to(lueur, {
    opacity: gsap.utils.random(LUEUR_MIN, LUEUR_MAX),
    duration: 0.05,
    ease: "steps(1)",
    delay: gsap.utils.random(LUEUR_DELAI_MIN, LUEUR_DELAI_MAX),
    onComplete: vaciller,
    onCompleteParams: [lueur],
  });
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
  // Sur l'écran d'accueil, le premier geste ferme seulement l'accueil
  onUp: () => (accueilOuvert ? fermerAccueil() : wagonSuivant()),
});

// Clavier : flèches droite et bas pour avancer, gauche et haut pour reculer,
// Échap pour fermer une pensée. Sur l'accueil, n'importe quelle touche ferme l'accueil.
document.addEventListener("keydown", (evenement) => {
  // Une touche maintenue enfoncée ne doit pas enchaîner les wagons
  if (evenement.repeat) {
    return;
  }
  if (accueilOuvert) {
    evenement.preventDefault();
    fermerAccueil();
    return;
  }
  relancerAttente();
  if (evenement.key === "ArrowRight" || evenement.key === "ArrowDown") {
    evenement.preventDefault();
    wagonSuivant();
  } else if (evenement.key === "ArrowLeft" || evenement.key === "ArrowUp") {
    evenement.preventDefault();
    wagonPrecedent();
  } else if (evenement.key === "Escape") {
    masquerPensee();
  } else if (evenement.key === "m" || evenement.key === "M") {
    basculerSon();
  }
});

// Écran d'accueil : un clic ou un tap n'importe où le ferme
accueil.addEventListener("pointerup", fermerAccueil);

// Boutons : retour au wagon précédent, passage au suivant (comme la porte du fond)
boutonArriere.addEventListener("click", wagonPrecedent);
boutonAvant.addEventListener("click", wagonSuivant);
// Bouton Son : coupe ou remet le son
boutonSon.addEventListener("click", basculerSon);

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

creerTrain();
preparerSons();
afficherWagon(0);
ouvrirAccueil();
lancerPaysage();
preparerPersonnages();

if (mouvementReduit) {
  poserFumee();
} else {
  secouer();
  scintiller();
  lancerFumee();
  document.querySelectorAll(".wagon__personnage").forEach(animerPersonnage);
  document.querySelectorAll(".wagon__lueur").forEach(vaciller);
  document.querySelectorAll(".wagon__marill").forEach(balancer);
  precharger();
}
