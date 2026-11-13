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
  pet1: "assets/sons/pet-1.wav",
  pet2: "assets/sons/pet-2.wav",
  pet3: "assets/sons/pet-3.wav",
};
// Bruits de pet, un au hasard à chaque clic sur un voyageur
const SONS_PETS = ["pet1", "pet2", "pet3"];

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

// Agacement : cliquer (ou retoucher) un voyageur dont la pensée est ouverte l'embête.
// Le spectateur est invisible : le voyageur sent quelque chose et le pense, il ne nous parle pas.
// Chaque clic le fait monter d'un niveau ; sans être embêté pendant ce délai (en secondes), il se calme.
const DELAI_OUBLI_AGACEMENT = 4;
// Hauteur du sursaut d'un voyageur embêté, en pixels source
const HAUTEUR_SURSAUT = 6;
// Pensées, de la plus calme à la plus paniquée (une liste par niveau, tirée au hasard).
// Le dernier niveau est la colère : le voyageur tremble et sa pensée s'écrit en rouge.
const REPLIQUES_AGACEMENT = [
  ["Hein ? Quelqu'un m'a touché l'épaule ?", "C'était quoi, ça ?", "Tiens, un courant d'air."],
  ["Encore ! Il n'y a personne derrière moi, pourtant.", "Je sens une présence. Je ne me retourne pas.", "Ce train est hanté. Je le savais."],
  ["Respire. C'est la fatigue. Les fantômes, ça n'existe pas.", "Si ça recommence, je change de wagon.", "Je ne regarde pas. Si je ne regarde pas, ça n'existe pas."],
  ["JE SAIS QUE TU ES LÀ, FANTÔME !", "LAISSE-MOI TRANQUILLE, ESPRIT DU TRAIN !", "QUI EST LÀ ?!"],
];
// Après la colère, le voyageur fait le vide dans sa tête
const REPLIQUE_BOUDE = "Je ne pense à rien. Je ne pense à rien. Je ne pense à rien.";

// Chapeau magique : un voyageur avec data-chapeau (ligne du bas de son chapeau, en pixels source)
// perd son chapeau quand on clique dessus. Le chapeau s'envole et quelque chose en sort.
// Les tours s'enchaînent dans cet ordre, puis recommencent.
// surprise : sprite de SPRITES_SURPRISES, nombre : combien en sortent, tourne : le chapeau pivote,
// pensee : ce que pense le voyageur pendant le tour
const TOURS_CHAPEAU = [
  { surprise: "colombe", nombre: 3, tourne: true, pensee: "Mon chapeau s'envole tout seul ? Et... des colombes ?!" },
  { surprise: "carte", nombre: 6, tourne: true, pensee: "Des cartes ! Je ne sais même pas faire un tour de magie." },
  { surprise: "colombe", nombre: 5, tourne: true, pensee: "Encore des colombes. Ce chapeau est plus doué que moi." },
  { surprise: "cheddar", nombre: 1, tourne: false, pensee: "CHEDDAR ?! Tu étais caché là-dessous depuis le départ ?!" },
];
// Hauteur à laquelle monte le chapeau, en pixels source (moins haut quand Cheddar est dessous)
const HAUTEUR_VOL_CHAPEAU = 40;
const HAUTEUR_VOL_CHEDDAR = 26;
// Temps pendant lequel le chapeau reste en l'air, en secondes
const DUREE_VOL_CHAPEAU = 1.4;
// Petits sprites pixel art dessinés par main.js (pas de fichier image) :
// une lettre = un pixel de grille (2 x 2 pixels source), "." = transparent.
// Couleurs de la palette « Joaquim » (DOCUMENTATION.md, section 4).
const PALETTE_SURPRISES = {
  k: "#000000",
  w: "#ffffff",
  g: "#d1dae9",
  o: "#f58a4c",
  r: "#d8364b",
  y: "#fdc86e",
  b: "#d29a5c",
};
const SPRITES_SURPRISES = {
  colombe: [
    "....kk.......",
    "...kwwk......",
    "..kwwgk......",
    "..kwwgk...kk.",
    "kk.kwwgk.kwwk",
    "kwkkwwwwkwwkwk",
    ".kwwwwwwwwwkoo",
    "..kgwwwwwwwk..",
    "...kggwwwgk...",
    "....kkkkkk....",
  ],
  carte: [
    "kkkkkkk",
    "kwwwwwk",
    "kwrwrwk",
    "krrrrrk",
    "kwrrrwk",
    "kwwrwwk",
    "kwwwwwk",
    "kwwwwwk",
    "kkkkkkk",
  ],
  // Cheddar, le chien de Raphaël
  cheddar: [
    "....kkkkkk....",
    "...kyyyyyyk...",
    ".kkyyyyyyyykk.",
    "kbbkyyyyyykbbk",
    "kbbkykyykykbbk",
    "kbbkyyyyyykbbk",
    "kbbkyykkyykbbk",
    ".kbkyyyyyykbk.",
    "..kkyyrryykk..",
    "....kkrrkk....",
    "......kk......",
  ],
};

// Objets du décor (div.wagon__objet dans le HTML) : la lumière coupée par data-effet="lumiere"
// assombrit la scène jusqu'à cette opacité, pendant ce temps (en secondes)
const OPACITE_COUPURE = 0.75;
const DUREE_COUPURE = 0.6;

// Porte verrouillée du dernier wagon : ce que dit l'étiquette à chaque nouvel essai.
// La première est celle du simple survol ; la dernière reste affichée ensuite.
const REPLIQUES_PORTE = [
  "Fin du train",
  "C'est fermé.",
  "Toujours fermé.",
  "Tu crois que ça va s'ouvrir ?",
  "Il n'y a rien derrière. Promis.",
  "Bon. Il y a un lama. Mais c'est privé.",
];
// À partir de cet essai, tout le wagon tremble avec la porte
const ESSAI_COLERE_PORTE = 3;
// Les secousses de la porte grandissent à chaque essai, jusqu'à ce multiple de PAS_SECOUSSE
const FORCE_MAX_PORTE = 4;
// Temps pendant lequel l'étiquette reste affichée après un essai, en secondes
const DUREE_REPLIQUE_PORTE = 1.6;

// Sifflet (petit train de l'indicateur ou touche T) : texte du carton,
// accord joué (en Hz), deux coups de sifflet (début et durée en secondes), volume de 0 à 1,
// et décalage entre deux voyageurs qui sursautent (la ola part de la gauche)
const TEXTE_SIFFLET = "Tchou tchou !";
const NOTES_SIFFLET = [587, 740, 880];
const COUPS_SIFFLET = [{ debut: 0, duree: 0.3 }, { debut: 0.4, duree: 0.8 }];
const VOLUME_SIFFLET = 0.12;
const DECALAGE_OLA = 0.08;


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
// Voix propres à certains voyageurs (data-son sur l'image du personnage), une par image
const voix = new Map();
// Ambiance en train de jouer (null si aucune)
let ambianceActuelle = null;
// Vrai quand l'utilisateur a coupé le son
let sonCoupe = false;

// Voyageurs embêtés : pour chaque image, son niveau d'agacement et la minuterie qui le calme
const agacements = new Map();
// Nombre de fois où l'utilisateur a essayé d'ouvrir la porte verrouillée
let essaisPorte = 0;
// Objet du décor dont la pensée est affichée (null si aucun)
let objetAffiche = null;
// Pour chaque objet du décor, nombre de pensées déjà lues (pour passer à la suivante)
const compteursObjets = new Map();
// Coupure de lumière en cours (objet data-effet="lumiere"), gardée pour pouvoir l'arrêter
let coupureLumiere = null;
// Chapeau magique : copie du calque qui ne garde que le chapeau, pour chaque voyageur à chapeau
const chapeaux = new Map();
// Nombre de tours de chapeau déjà faits, et vrai pendant qu'un chapeau est en l'air
let toursChapeau = 0;
let chapeauEnVol = false;


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
  montrerCarton(`Wagon ${formaterNumero(index + 1)}`, wagons[index].dataset.titre);
}

// Affiche un carton quelques instants (DUREE_CARTON), puis le cache.
// numero : petite ligne du haut (peut être vide)
// titre : grande ligne
function montrerCarton(numero, titre) {
  masquerCarton();
  cartonNumero.textContent = numero;
  cartonTitre.textContent = titre;
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
  masquerAccessoires();
  // Une coupure de lumière en cours ne doit pas gêner le fondu au noir
  if (coupureLumiere) {
    coupureLumiere.kill();
    gsap.set(fondu, { opacity: 0 });
  }
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

// Fait trembler la porte fermée, à gauche et à droite.
// Plus l'utilisateur insiste, plus elle tremble fort, puis tout le wagon tremble avec elle,
// et l'étiquette lui répond (REPLIQUES_PORTE).
// portes : battants renvoyés par trouverPortes()
function porteVerrouillee(portes) {
  essaisPorte += 1;
  const force = Math.min(essaisPorte, FORCE_MAX_PORTE);
  const unPixel = ((PAS_SECOUSSE * force) / TOILE_LARGEUR) * 100;
  const trajet = creerTrajet();
  jouerEffet("porteVerrouillee");
  trajet
    .to([portes.gauche, portes.droite], { xPercent: -unPixel, duration: 0.05, ease: "steps(1)" })
    .to([portes.gauche, portes.droite], { xPercent: unPixel, duration: 0.05, ease: "steps(1)", repeat: 3, yoyo: true })
    .to([portes.gauche, portes.droite], { xPercent: 0, duration: 0.05, ease: "steps(1)" });
  if (essaisPorte >= ESSAI_COLERE_PORTE && !mouvementReduit) {
    secouerDecor(trajet, force);
  }
  protesterPorte();
}

// Ajoute à une timeline une secousse horizontale de tout le décor (paysage et wagon).
// trajet : timeline GSAP
// force : multiple de PAS_SECOUSSE
function secouerDecor(trajet, force) {
  const decalage = ((PAS_SECOUSSE * force) / TOILE_LARGEUR) * 100;
  trajet
    .fromTo(decor, { xPercent: -decalage }, { xPercent: decalage, duration: 0.05, ease: "steps(1)", repeat: 3, yoyo: true }, 0)
    .set(decor, { xPercent: 0 });
}

// Texte de l'étiquette de la porte verrouillée, selon le nombre d'essais déjà faits.
function repliquePorte() {
  return REPLIQUES_PORTE[Math.min(essaisPorte, REPLIQUES_PORTE.length - 1)];
}

// Affiche quelques instants la réplique de la porte verrouillée, même sans survol
// (essai au bouton Suivant ou au clavier).
function protesterPorte() {
  etiquettePorte.textContent = repliquePorte();
  etiquettePorte.classList.add("etiquette-porte--fermee");
  gsap.killTweensOf(etiquettePorte);
  gsap.timeline()
    .to(etiquettePorte, { autoAlpha: 1, duration: 0.12, ease: "steps(2)" })
    .to(etiquettePorte, { autoAlpha: 0, duration: 0.12, ease: "steps(2)" }, `+=${DUREE_REPLIQUE_PORTE}`);
}


// Calques de décor placés après ce personnage dans son wagon (bancs de devant, par exemple) :
// ils sont dessinés par-dessus lui et cachent une partie de son corps.
// Les calques d'ambiance (lueurs, fumée) sont transparents à l'oeil et ne comptent pas.
// image : élément img.wagon__personnage
function calquesDevant(image) {
  const calques = [...image.closest(".wagon").querySelectorAll(".wagon__calque")];
  return calques
    .slice(calques.indexOf(image) + 1)
    .filter((calque) => !calque.matches(".wagon__personnage, .wagon__lueur, .wagon__fumee, .wagon__chapeau"));
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
  objetAffiche = null;
  image.classList.add("wagon__personnage--survole");
  // Les autres voyageurs du wagon passent en retrait (voir .wagon--lecture dans style.css)
  image.closest(".wagon").classList.add("wagon--lecture");
  personnageAffiche = image;
  jouerVoix(image);

  bulleNom.textContent = image.dataset.nom;
  // Un voyageur qui « parle » en code (data-langage, ex. Erine en PHP) a une bulle de code
  bulle.classList.toggle("pensee--code", Boolean(image.dataset.langage));
  bulle.classList.remove("pensee--colere");
  ecrirePensee(image.dataset.pensee);
  placerBulle(donneesPersonnages.get(image).ancre);
}

// Place la bulle au-dessus d'un point de la toile et la fait apparaître.
// ancre : { x, y } en pixels source (haut de la tête d'un voyageur, haut d'un objet)
function placerBulle(ancre) {
  const positionX = ancre.x / TOILE_LARGEUR;
  const presBordGauche = positionX < ZONE_BORD;
  const presBordDroit = positionX > 1 - ZONE_BORD;

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

// Embête un voyageur dont la pensée est déjà ouverte : il sursaute, monte d'un niveau
// d'agacement et répond dans sa bulle à la place de sa pensée.
// image : élément img.wagon__personnage
function embeterPersonnage(image) {
  const etat = agacements.get(image) || { niveau: 0, oubli: null };
  if (etat.oubli) {
    etat.oubli.kill();
  }
  etat.niveau += 1;
  // Laissé tranquille assez longtemps, il oublie tout
  etat.oubli = gsap.delayedCall(DELAI_OUBLI_AGACEMENT, () => agacements.delete(image));
  agacements.set(image, etat);

  const enColere = etat.niveau === REPLIQUES_AGACEMENT.length;
  jouerVoix(image);
  bulle.classList.toggle("pensee--colere", enColere);
  ecrirePensee(formulerReplique(image, choisirReplique(etat.niveau)));
  // La bulle se regonfle à chaque réplique
  gsap.killTweensOf(bulle);
  gsap.fromTo(bulle, { autoAlpha: 1, scale: 0.85 }, { scale: 1, duration: 0.12, ease: "steps(2)" });
  // Quand il boude, il ne bouge plus
  if (etat.niveau <= REPLIQUES_AGACEMENT.length) {
    sursauter(image, enColere);
  }
}

// Choisit au hasard une réplique du niveau d'agacement demandé.
// niveau : 1 pour le premier clic, puis 2, 3...
function choisirReplique(niveau) {
  if (niveau > REPLIQUES_AGACEMENT.length) {
    return REPLIQUE_BOUDE;
  }
  return gsap.utils.random(REPLIQUES_AGACEMENT[niveau - 1]);
}

// Adapte une réplique à la façon de parler du voyageur : Erine répond en PHP.
// image : élément img.wagon__personnage
// replique : texte à dire
function formulerReplique(image, replique) {
  if (image.dataset.langage === "php") {
    return `<?php die("${replique}"); ?>`;
  }
  return replique;
}

// Fait sursauter un voyageur de HAUTEUR_SURSAUT pixels source, pixel par pixel.
// En colère, il tremble en plus de gauche à droite.
// On anime x et y, et non xPercent et yPercent, pour ne pas gêner la respiration.
// image : élément img.wagon__personnage
// enColere : vrai pour ajouter le tremblement
function sursauter(image, enColere) {
  if (mouvementReduit) {
    return;
  }
  const unPixel = scene.getBoundingClientRect().height / TOILE_HAUTEUR;
  gsap.killTweensOf(image, "x,y");
  const saut = gsap.timeline()
    .to(image, { y: -HAUTEUR_SURSAUT * unPixel, duration: 0.12, ease: "steps(3)" })
    .to(image, { y: 0, duration: 0.12, ease: "steps(3)" });
  if (enColere) {
    saut
      .fromTo(image, { x: -PAS_SECOUSSE * unPixel }, { x: PAS_SECOUSSE * unPixel, duration: 0.04, ease: "steps(1)", repeat: 7, yoyo: true })
      .set(image, { x: 0 });
  }
}

// Coup de sifflet du train : le sifflet retentit, le wagon tremble,
// le carton annonce « Tchou tchou ! » et les voyageurs font la ola de gauche à droite.
function siffler() {
  if (enAnimation || accueilOuvert) {
    return;
  }
  relancerAttente();
  jouerSifflet();
  montrerCarton("", TEXTE_SIFFLET);
  if (mouvementReduit) {
    return;
  }
  secouerDecor(gsap.timeline(), 1);
  const voyageurs = [...wagons[wagonActuel].querySelectorAll(".wagon__personnage")]
    .filter((image) => donneesPersonnages.has(image))
    .sort((a, b) => donneesPersonnages.get(a).ancre.x - donneesPersonnages.get(b).ancre.x);
  voyageurs.forEach((image, i) => {
    gsap.delayedCall(i * DECALAGE_OLA, sursauter, [image, false]);
  });
}

// Joue le sifflet du train, fabriqué à la volée (pas de fichier son) :
// un accord de trois notes (NOTES_SIFFLET) en deux coups (COUPS_SIFFLET).
// Il passe par le volume général de Howler, donc le bouton Son le coupe aussi.
function jouerSifflet() {
  const contexte = Howler.ctx;
  if (!contexte || !Howler.masterGain) {
    return;
  }
  if (contexte.state === "suspended") {
    contexte.resume();
  }
  const depart = contexte.currentTime + 0.02;
  const volume = contexte.createGain();
  volume.gain.setValueAtTime(0, depart);
  volume.connect(Howler.masterGain);
  // Chaque coup monte vite, tient, puis retombe
  COUPS_SIFFLET.forEach(({ debut, duree }) => {
    const t = depart + debut;
    volume.gain.setValueAtTime(0, t);
    volume.gain.linearRampToValueAtTime(VOLUME_SIFFLET, t + 0.04);
    volume.gain.setValueAtTime(VOLUME_SIFFLET, t + duree - 0.08);
    volume.gain.linearRampToValueAtTime(0, t + duree);
  });
  const dernierCoup = COUPS_SIFFLET[COUPS_SIFFLET.length - 1];
  const fin = depart + dernierCoup.debut + dernierCoup.duree;
  NOTES_SIFFLET.forEach((frequence) => {
    const oscillateur = contexte.createOscillator();
    oscillateur.type = "triangle";
    oscillateur.frequency.value = frequence;
    oscillateur.connect(volume);
    oscillateur.start(depart);
    oscillateur.stop(fin);
  });
}

// Cache la bulle de pensée et retire le contour du personnage.
function masquerPensee() {
  scene.classList.remove("scene--survol-personnage");
  if (!personnageAffiche && !objetAffiche) {
    return;
  }
  retirerContour();
  objetAffiche = null;
  gsap.killTweensOf(bulle);
  gsap.to(bulle, { autoAlpha: 0, duration: 0.1, ease: "steps(2)" });
}

// Indique si le pointeur est sur le chapeau d'un voyageur (au-dessus de sa ligne data-chapeau).
// image : élément img.wagon__personnage sous le pointeur
// evenement : événement de pointeur
function estSurChapeau(image, evenement) {
  const pixel = convertirEnPixel(evenement);
  return Boolean(image.dataset.chapeau) && pixel !== null && pixel.y < Number(image.dataset.chapeau);
}

// Dessine un petit sprite (SPRITES_SURPRISES) dans un canvas, un pixel du canvas par lettre.
// Le CSS l'agrandit sans flou (.wagon__surprise).
// lignes : lignes de lettres du sprite
function dessinerSprite(lignes) {
  const toile = document.createElement("canvas");
  toile.className = "wagon__surprise";
  toile.width = Math.max(...lignes.map((ligne) => ligne.length));
  toile.height = lignes.length;
  const contexte = toile.getContext("2d");
  lignes.forEach((ligne, y) => {
    [...ligne].forEach((lettre, x) => {
      if (lettre !== ".") {
        contexte.fillStyle = PALETTE_SURPRISES[lettre];
        contexte.fillRect(x, y, 1, 1);
      }
    });
  });
  return toile;
}

// Pose un sprite dans la scène : le milieu de son bord bas sur le point (x, y) de la toile.
// Il est agrandi pour qu'un pixel de grille fasse 2 pixels source, comme tout le projet.
// sprite : canvas renvoyé par dessinerSprite()
// x, y : point de la toile, en pixels source
function poserSprite(sprite, x, y) {
  gsap.set(sprite, {
    left: `${(x / TOILE_LARGEUR) * 100}%`,
    top: `${(y / TOILE_HAUTEUR) * 100}%`,
    width: `${((sprite.width * 2) / TOILE_LARGEUR) * 100}%`,
    xPercent: -50,
    yPercent: -100,
  });
}

// Crée (la première fois) la copie du calque d'un voyageur qui ne garde que son chapeau :
// elle est découpée sous la ligne data-chapeau et posée juste au-dessus du voyageur.
// image : élément img.wagon__personnage avec data-chapeau
function preparerChapeau(image) {
  if (chapeaux.has(image)) {
    return chapeaux.get(image);
  }
  const chapeau = document.createElement("img");
  chapeau.className = "wagon__calque wagon__chapeau";
  chapeau.src = image.src;
  chapeau.alt = "";
  const bas = (Number(image.dataset.chapeau) / TOILE_HAUTEUR) * 100;
  gsap.set(chapeau, { clipPath: `inset(0% 0% ${100 - bas}% 0%)`, autoAlpha: 0 });
  image.after(chapeau);
  chapeaux.set(image, chapeau);
  return chapeau;
}

// Tour de chapeau : le chapeau du voyageur s'envole, quelque chose en sort (TOURS_CHAPEAU),
// puis il retombe sur sa tête. Le voyageur pense ce qui lui arrive.
// image : élément img.wagon__personnage avec data-chapeau
function tourDeChapeau(image) {
  if (chapeauEnVol) {
    return;
  }
  const tour = TOURS_CHAPEAU[toursChapeau % TOURS_CHAPEAU.length];
  toursChapeau += 1;
  afficherPensee(image);
  bulle.classList.remove("pensee--colere");
  ecrirePensee(tour.pensee);
  if (mouvementReduit) {
    return;
  }
  chapeauEnVol = true;

  const chapeau = preparerChapeau(image);
  const { ancre } = donneesPersonnages.get(image);
  const bas = Number(image.dataset.chapeau);
  const unPixel = scene.getBoundingClientRect().height / TOILE_HAUTEUR;
  const hauteur = tour.surprise === "cheddar" ? HAUTEUR_VOL_CHEDDAR : HAUTEUR_VOL_CHAPEAU;
  // La bulle monte au-dessus du chapeau en l'air, pour ne pas le cacher
  placerBulle({ x: ancre.x, y: ancre.y - hauteur });

  // Le voyageur est coupé au bord de son chapeau : seule la copie montre le chapeau, qui peut partir
  gsap.set(image, { clipPath: `inset(${(bas / TOILE_HAUTEUR) * 100}% 0% 0% 0%)` });
  gsap.set(chapeau, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    rotation: 0,
    yPercent: gsap.getProperty(image, "yPercent"),
    transformOrigin: `${(ancre.x / TOILE_LARGEUR) * 100}% ${(((ancre.y + bas) / 2) / TOILE_HAUTEUR) * 100}%`,
  });

  const vol = gsap.timeline({
    onComplete: () => {
      gsap.set(image, { clipPath: "none" });
      gsap.set(chapeau, { autoAlpha: 0, rotation: 0 });
      chapeauEnVol = false;
    },
  });
  vol.to(chapeau, { y: -hauteur * unPixel, rotation: tour.tourne ? 360 : 0, duration: 0.4, ease: "steps(8)" });

  if (tour.surprise === "cheddar") {
    // Cheddar était assis sur la tête, sous le chapeau : il apparaît quand le chapeau monte
    const chien = dessinerSprite(SPRITES_SURPRISES.cheddar);
    chapeau.before(chien);
    poserSprite(chien, ancre.x, bas);
    vol
      .fromTo(chien, { rotation: -8 }, { rotation: 8, duration: 0.12, ease: "steps(1)", repeat: 9, yoyo: true }, 0.4)
      // Il disparaît une fois le chapeau retombé sur lui
      .call(() => chien.remove(), null, 0.4 + DUREE_VOL_CHAPEAU + 0.3);
  } else {
    vol.call(lacherSurprises, [tour, image.closest(".wagon"), ancre.x, bas - hauteur, unPixel], 0.4);
  }

  // Le chapeau retombe sur la tête et rebondit d'un pixel
  vol
    .to(chapeau, { y: 0, duration: 0.3, ease: "steps(6)" }, 0.4 + DUREE_VOL_CHAPEAU)
    .to(chapeau, { y: -2 * unPixel, duration: 0.06, ease: "steps(1)" })
    .to(chapeau, { y: 0, duration: 0.06, ease: "steps(1)" });
}

// Fait sortir des colombes (qui s'envolent) ou des cartes (qui retombent) du chapeau en l'air.
// tour : élément de TOURS_CHAPEAU
// wagon : section.wagon où poser les sprites
// x, y : ouverture du chapeau sur la toile, en pixels source
// unPixel : taille d'un pixel source à l'écran
function lacherSurprises(tour, wagon, x, y, unPixel) {
  for (let i = 0; i < tour.nombre; i++) {
    const sprite = dessinerSprite(SPRITES_SURPRISES[tour.surprise]);
    wagon.append(sprite);
    poserSprite(sprite, x, y);
    const envol = gsap.timeline({ delay: i * 0.12, onComplete: () => sprite.remove() })
      .fromTo(sprite, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "steps(1)" });

    if (tour.surprise === "colombe") {
      // Vers le haut de l'écran, plutôt vers le milieu du wagon ; le sprite regarde vers où il vole
      const dx = gsap.utils.random(-240, 60);
      gsap.set(sprite, { scaleX: dx < 0 ? -1 : 1 });
      envol
        .to(sprite, { x: dx * unPixel, y: gsap.utils.random(-300, -200) * unPixel, duration: 1.4, ease: "steps(14)" })
        .fromTo(sprite, { scaleY: 1 }, { scaleY: 0.5, duration: 0.1, ease: "steps(1)", repeat: 13, yoyo: true }, "<");
    } else {
      // Les cartes jaillissent, tournent et retombent jusqu'en bas de l'écran
      const dx = gsap.utils.random(-90, 90);
      envol
        .to(sprite, { x: dx * 0.5 * unPixel, y: gsap.utils.random(-90, -50) * unPixel, rotation: gsap.utils.random(-90, 90), duration: 0.35, ease: "steps(5)" })
        .to(sprite, { x: dx * unPixel, y: 220 * unPixel, rotation: gsap.utils.random(-360, 360), duration: 0.9, ease: "steps(9)" });
    }
  }
}

// Retire le contour et le retrait des autres voyageurs, si une pensée de voyageur est ouverte.
function retirerContour() {
  if (!personnageAffiche) {
    return;
  }
  personnageAffiche.classList.remove("wagon__personnage--survole");
  personnageAffiche.closest(".wagon").classList.remove("wagon--lecture");
  personnageAffiche = null;
}

// Lit la zone d'un objet du décor (data-zone="gauche haut droite bas", en pixels source).
// objet : élément .wagon__objet
function lireZone(objet) {
  const [gauche, haut, droite, bas] = objet.dataset.zone.split(" ").map(Number);
  return { gauche, haut, droite, bas };
}

// Renvoie l'objet du décor du wagon courant situé sous le pointeur, ou null.
// evenement : événement de pointeur
function trouverObjet(evenement) {
  const pixel = convertirEnPixel(evenement);
  if (!pixel) {
    return null;
  }
  const objets = [...wagons[wagonActuel].querySelectorAll(".wagon__objet")];
  const objet = objets.find((element) => {
    const zone = lireZone(element);
    return pixel.x >= zone.gauche && pixel.x < zone.droite && pixel.y >= zone.haut && pixel.y < zone.bas;
  });
  return objet || null;
}

// Affiche la pensée suivante d'un objet du décor, au-dessus de lui.
// Ses pensées (data-pensees, séparées par |) défilent dans l'ordre à chaque clic, puis recommencent.
// objet : élément .wagon__objet
function afficherObjet(objet) {
  retirerContour();
  objetAffiche = objet;
  const pensees = objet.dataset.pensees.split("|");
  const rang = compteursObjets.get(objet) || 0;
  compteursObjets.set(objet, rang + 1);

  jouerEffet("bulle");
  bulleNom.textContent = objet.dataset.nom;
  bulle.classList.toggle("pensee--code", Boolean(objet.dataset.langage));
  bulle.classList.remove("pensee--colere");
  ecrirePensee(pensees[rang % pensees.length]);
  const zone = lireZone(objet);
  placerBulle({ x: (zone.gauche + zone.droite) / 2, y: zone.haut });
  reagirObjet(objet.dataset.effet);
}

// Effet visible quand on touche un objet (data-effet, facultatif) :
// "lumiere" fait sauter la lumière, "secousse" fait trembler le wagon.
// effet : nom de l'effet, ou undefined
function reagirObjet(effet) {
  if (mouvementReduit || !effet) {
    return;
  }
  if (effet === "secousse") {
    secouerDecor(gsap.timeline(), 2);
  } else if (effet === "lumiere") {
    if (coupureLumiere) {
      coupureLumiere.kill();
    }
    coupureLumiere = gsap.timeline()
      .to(fondu, { opacity: OPACITE_COUPURE, duration: 0.05, ease: "steps(1)" })
      .to(fondu, { opacity: 0, duration: 0.05, ease: "steps(1)" }, "+=0.08")
      .to(fondu, { opacity: OPACITE_COUPURE, duration: 0.05, ease: "steps(1)" }, "+=0.1")
      .to(fondu, { opacity: 0, duration: 0.05, ease: "steps(1)" }, `+=${DUREE_COUPURE}`);
  }
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
    etiquettePorte.textContent = dernierWagon ? repliquePorte() : "Wagon suivant";
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
  // Un personnage devant un objet ou la porte a la priorité sur eux
  const objet = personnage ? null : trouverObjet(evenement);
  if (personnage) {
    afficherPensee(personnage);
  } else if (objet === null || objet !== objetAffiche) {
    // La pensée d'un objet reste ouverte tant que la souris reste dessus
    masquerPensee();
  }
  const surPorte = personnage === null && objet === null && estSurPorte(evenement);
  survolerPorte(surPorte);
  scene.classList.toggle("scene--survol-personnage", personnage !== null);
  scene.classList.toggle("scene--survol-objet", objet !== null);
  scene.classList.toggle("scene--survol-chapeau", personnage !== null && estSurChapeau(personnage, evenement));
  scene.classList.toggle("scene--survol-porte", surPorte);
}

// Clic (souris) ou tap (doigt) dans la scène :
// sur un personnage, affiche sa pensée (ou l'embête si elle est déjà ouverte) ;
// sur un objet du décor, affiche sa pensée suivante ;
// sur la porte, passe au wagon suivant ; ailleurs, cache la pensée.
// Un glissé est ignoré (le swipe sert déjà à changer de wagon).
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
  const objet = personnage ? null : trouverObjet(evenement);
  if (personnage && estSurChapeau(personnage, evenement)) {
    tourDeChapeau(personnage);
  } else if (personnage && personnage === personnageAffiche) {
    jouerPet();
    embeterPersonnage(personnage);
  } else if (personnage) {
    jouerPet();
    afficherPensee(personnage);
  } else if (objet) {
    afficherObjet(objet);
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
  // Un voyageur peut avoir sa propre voix (data-son), jouée à la place du son de bulle
  document.querySelectorAll(".wagon__personnage[data-son]").forEach((image) => {
    voix.set(image, new Howl({ src: [image.dataset.son], volume: VOLUME_EFFETS }));
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

// Joue un bruit de pet au hasard (clic ou toucher sur un voyageur).
function jouerPet() {
  jouerEffet(SONS_PETS[Math.floor(Math.random() * SONS_PETS.length)]);
}

// Joue la voix d'un voyageur quand on le survole ou le touche (data-son),
// ou le son de bulle s'il n'en a pas. La voix repart du début si elle jouait déjà.
// image : élément img.wagon__personnage
function jouerVoix(image) {
  const sienne = voix.get(image);
  if (!sienne) {
    jouerEffet("bulle");
    return;
  }
  sienne.stop();
  sienne.play();
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
      const tenue = trouverAccessoire("ds-tenue");
      const sol = trouverAccessoire("ds-sol");
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
const accessoires = new Map();

// Renvoie l'objet d'un nom (la crée au premier appel), centré sur le point donné par left et top.
// nom : nom du fichier dans assets/images/objets (sans .png)
function trouverAccessoire(nom) {
  if (!accessoires.has(nom)) {
    const objet = document.createElement("img");
    objet.className = "objet";
    objet.alt = "";
    objet.src = `assets/images/objets/${nom}.png`;
    objet.addEventListener("load", () => {
      objet.style.width = `${(objet.naturalWidth / TOILE_LARGEUR) * 100}%`;
    });
    scene.append(objet);
    gsap.set(objet, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
    accessoires.set(nom, objet);
  }
  return accessoires.get(nom);
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
function masquerAccessoires() {
  accessoires.forEach((objet) => gsap.set(objet, { autoAlpha: 0 }));
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
  ["ds-tenue", "ds-sol"].forEach(trouverAccessoire);
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
    const etincelle = trouverAccessoire("eclair");
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
  } else if (evenement.key === "t" || evenement.key === "T") {
    siffler();
  }
});

// Petit train de l'indicateur : coup de sifflet (aussi avec la touche T)
indicateur.addEventListener("click", siffler);

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
