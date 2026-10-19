# Le Train des Époques : documentation commune

Projet de groupe, BUT MMI, ressource R3.08 Multimédia.
Équipe : 4 personnes.

Ce fichier est la référence unique du projet. Chaque membre le donne à son IA (ChatGPT, Claude, Copilot, etc.) au début de chaque session de travail, pour que tout le monde produise du code identique dans sa forme. En cas de doute, c'est ce fichier qui tranche. Toute modification de ce fichier se décide à quatre.

---

## 1. Le concept

L'utilisateur est debout sur le quai d'une gare. La vue est fixe : la caméra ne bouge jamais, c'est le train qui bouge.

Un train passe devant lui. Chaque wagon représente une époque différente. L'un des wagons reprend la composition de La Cène de Léonard de Vinci.

L'utilisateur est un spectateur omniscient : il peut lire les pensées des personnages et des objets présents dans le wagon arrêté devant lui.

### Navigation

| Action utilisateur | Effet |
|---|---|
| Molette vers le bas | Le train avance jusqu'au wagon suivant (époque suivante) |
| Molette vers le haut | Le train recule jusqu'au wagon précédent (époque précédente) |
| Swipe vers le haut (tactile) | Wagon suivant |
| Swipe vers le bas (tactile) | Wagon précédent |
| Flèche droite ou flèche bas | Wagon suivant |
| Flèche gauche ou flèche haut | Wagon précédent |

Règles :
- Un cran de molette, un swipe ou un appui sur une flèche = un seul wagon, jamais plus.
- Le train s'arrête toujours pile devant l'utilisateur.
- Pendant une animation, les nouvelles actions sont ignorées (pas de file d'attente).
- Au premier wagon, on ne peut pas reculer. Au dernier, on ne peut pas avancer.

---

## 2. Technologies imposées

Uniquement les technologies ci-dessous. Aucune autre bibliothèque, aucun framework, aucun outil n'est ajouté sans accord de toute l'équipe.

| Technologie | Rôle | Chargement |
|---|---|---|
| HTML5 | Structure | Natif |
| CSS3 | Mise en forme, mise en page | Natif, un seul fichier |
| JavaScript (ES6+) | Logique | Natif, sans module ni build |
| GSAP 3 | Animations du train | CDN |
| GSAP Observer | Détection molette, tactile | CDN |
| Howler.js | Son (plus tard) | CDN |

Interdits : npm, Vite, Webpack, Sass, TypeScript, React, Vue, jQuery, Tailwind, Bootstrap, tout framework CSS ou JS.

Test en local : extension Live Server de VS Code (clic droit sur `index.html`, "Open with Live Server").

### Liens CDN (versions figées, tout le monde utilise exactement celles-ci)

À placer à la fin du `<body>`, avant `js/main.js`, dans cet ordre :

```html
<!-- GSAP : moteur d'animation -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<!-- Plugin Observer : écoute molette, tactile et pointeur -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Observer.min.js"></script>
<!-- Howler : gestion du son (activé plus tard) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>
<!-- Notre script, toujours en dernier -->
<script src="js/main.js"></script>
```

Ne jamais changer une version sans prévenir l'équipe.

---

## 3. Structure des fichiers

```
R.308---Multimedia/
├── README.md             présentation courte du dépôt
├── DOCUMENTATION.md      ce fichier
├── index.html            la seule page du site
├── css/
│   └── style.css         tout le style
├── js/
│   └── main.js           toute la logique
└── assets/
    ├── images/           illustrations (décor, wagons, personnages, objets)
    └── sons/             fichiers audio
```

Règles :
- On ne crée pas de nouveau fichier ou dossier sans accord de l'équipe.
- Un seul fichier CSS, un seul fichier JS, tant que l'équipe n'a pas décidé autrement.
- Chemins toujours relatifs (`assets/images/quai.png`), jamais absolus (`C:\...` ou `/Users/...`).

### Nommage des fichiers d'assets

- Tout en minuscules, sans accent, sans espace, mots séparés par des tirets.
- Préfixe = numéro du wagon sur deux chiffres, puis le sujet.
- Exemples : `01-wagon-fond.png`, `03-cene-jesus.png`, `03-cene-calice.png`, `quai-fond.png`, `train-roulement.mp3`.
- Formats : `.webp` ou `.png` pour les images (`.svg` si vectoriel), `.mp3` pour les sons.

---

## 4. Conventions de code communes

### Règles générales

- Indentation : 2 espaces (pas de tabulation). Dans VS Code : "Spaces: 2" en bas à droite.
- Encodage : UTF-8.
- Commentaires en français, clairs, au-dessus du bloc qu'ils expliquent.
- Noms de variables, fonctions et classes CSS : en anglais ou en français, mais l'équipe choisit une langue et s'y tient. Choix retenu : **français sans accent** (ex. `wagonActuel`, `.wagon__titre`).
- Aucun emoji, ni dans le code, ni dans les commentaires, ni dans les textes du site.
- Pas de code mort ni de `console.log` oubliés dans ce qui est partagé.

### HTML

- `<html lang="fr">`, `<meta charset="UTF-8">`, `<meta name="viewport" ...>`.
- Balises sémantiques : `<main>`, `<section>`, `<article>`, `<button>`.
- Chaque wagon est un élément avec la classe `wagon` et un attribut `data-epoque` :
  ```html
  <section class="wagon" data-epoque="renaissance">
    <!-- contenu du wagon -->
  </section>
  ```
- Chaque élément "lisible" (personnage ou objet) porte `data-pensee` (texte ajouté plus tard, après validation) :
  ```html
  <img class="wagon__element" src="assets/images/03-cene-calice.png" alt="Calice posé sur la table" data-pensee="">
  ```
- Toute image a un `alt` descriptif en français.
- Pas de style en ligne (`style="..."`) ni de script en ligne (`onclick="..."`).

### CSS

- Nommage des classes en BEM : `bloc`, `bloc__element`, `bloc--variante`.
  Exemples : `.quai`, `.train`, `.wagon`, `.wagon__element`, `.wagon--actif`.
- Couleurs, tailles et durées en variables dans `:root`, en haut du fichier :
  ```css
  :root {
    --couleur-fond: #1a1a1a;
    --couleur-texte: #f2f2f2;
    --largeur-wagon: 100vw;
  }
  ```
- Ordre du fichier, séparé par des commentaires de section :
  1. Variables
  2. Reset et base
  3. Décor (fond)
  4. Train et wagons
  5. Quai (premier plan)
  6. Pensées (bulles)
  7. Indicateur de l'époque courante
  8. Responsive (media queries)
- Pas de `!important`. Pas d'`id` pour styler (les `id` servent au JS si besoin).
- Les animations de déplacement du train se font en GSAP, pas en CSS.

### JavaScript

- `const` par défaut, `let` si la valeur change, jamais `var`.
- Fonctions nommées et courtes, une seule responsabilité chacune.
- camelCase pour variables et fonctions (`allerAuWagon`), MAJUSCULES pour les constantes de réglage (`DUREE_TRANSITION`).
- Le DOM est sélectionné une seule fois au début du fichier.
- Organisation de `main.js`, avec un commentaire de section pour chaque partie :
  1. Réglages (constantes)
  2. Sélection des éléments du DOM
  3. État (wagon actuel, animation en cours)
  4. Fonctions (déplacement du train, etc.)
  5. Écouteurs (Observer pour molette et tactile, clavier)
  6. Initialisation
- Commentaire en tête de chaque fonction :
  ```js
  // Déplace le train pour placer le wagon demandé devant l'utilisateur.
  // index : numéro du wagon (0 = premier wagon)
  function allerAuWagon(index) {
    // ...
  }
  ```

### Animations (GSAP)

- Le train est un conteneur unique (`.train`) déplacé horizontalement avec `gsap.to()` sur `xPercent` ou `x`.
- Durée et easing communs, définis dans les réglages :
  `DUREE_TRANSITION = 1.2` (secondes), easing `"power2.inOut"`.
- Un booléen `enAnimation` bloque toute nouvelle action tant que le train roule.
- La molette et le tactile passent par `Observer.create()` (avec `type: "wheel,touch"` et une `tolerance`) ; le clavier par `keydown`.
- Respect de `prefers-reduced-motion` : si l'utilisateur le demande, durée raccourcie.

---

## 5. Les wagons

Liste provisoire, à compléter par l'équipe. L'ordre de ce tableau est l'ordre du train.

| N° | `data-epoque` | Époque | Responsable | État |
|---|---|---|---|---|
| 01 | à définir | à définir | à définir | à faire |
| 02 | à définir | à définir | à définir | à faire |
| 03 | `renaissance` | Renaissance, La Cène | à définir | à faire |
| 04 | à définir | à définir | à définir | à faire |

Ajouter ou retirer un wagon = modifier le HTML uniquement. Le JavaScript compte les wagons tout seul et ne doit jamais contenir un nombre de wagons écrit en dur.

---

## 6. Organisation du travail en équipe

- Chacun travaille sur sa partie (un wagon, ou une fonctionnalité), sans réécrire celle des autres.
- Avant de modifier une partie commune (structure HTML du train, `main.js`, variables CSS), on prévient le groupe.
- On garde toujours une version qui fonctionne : on ne partage jamais un code qui casse le site.
- Si l'équipe utilise Git : une branche par personne ou par fonctionnalité, messages de commit en français à l'impératif (ex. `Ajoute le wagon de la Renaissance`).

---

## 7. Règles pour les IA

Copier le bloc ci-dessous en début de conversation avec son IA, avec ce fichier en pièce jointe.

```
Tu m'aides sur un projet scolaire de groupe (BUT MMI, R3.08 Multimédia).
Le fichier DOCUMENTATION.md joint est la référence absolue : respecte
strictement ses technologies, sa structure, ses conventions de nommage
et l'organisation de ses fichiers. Nous sommes 4 et nos IA doivent
produire du code identique dans sa forme.

Règles :
- HTML, CSS et JavaScript natifs uniquement, GSAP + Observer et Howler
  via les liens CDN donnés. N'ajoute aucune autre bibliothèque, aucun
  outil de build, aucun fichier ou dossier non prévu sans me demander.
- Commente le code en français. Aucun emoji nulle part.
- Avance étape par étape : un fichier ou une modification à la fois.
  Pour chacun, explique brièvement ce qu'il contient et pourquoi, puis
  attends ma validation avant de passer à la suite.
- Ne réécris pas les parties du code qui ne concernent pas ma demande.
  Montre uniquement ce qui change et où le placer.
- N'ajoute pas les pensées des personnages, le son ou les vraies
  illustrations sans que je le demande explicitement.
- Si une demande contredit DOCUMENTATION.md, signale-le avant d'agir.
```

---

## 8. Étapes du projet

Chaque étape est validée par l'équipe avant de passer à la suivante.

1. Documentation commune (ce fichier)
2. Squelette : `index.html`, `css/style.css`, `js/main.js`, dossiers d'assets
3. Quai fixe et train avec des wagons de couleur unie (sans illustration)
4. Navigation : molette, tactile, clavier, arrêt pile sur chaque wagon
5. Contenu des wagons : personnages et objets (images provisoires)
6. Pensées : affichage au survol ou au clic (après validation)
7. Son avec Howler (après validation)
8. Illustrations définitives (après validation)
9. Responsive, accessibilité, tests sur plusieurs navigateurs
