# 📘 Guide complet — Cockpit de pilotage projet SI

> Ce guide explique **à quoi sert chaque onglet**, **quoi mettre dans chaque champ** et **pourquoi**. Il est écrit pour être compris même si vous débutez en gestion de projet. Les termes techniques (MoSCoW, RACI, SLA…) sont définis au fur et à mesure et regroupés dans un **glossaire** à la fin.

---

## 🧭 1. C'est quoi ce widget, et à quoi il sert ?

Un **chef de projet SI** (Système d'Information) pilote un projet informatique : par exemple le remplacement d'un logiciel utilisé par des centaines de personnes. Son travail ne consiste pas seulement à « suivre des tâches », mais à garder le contrôle sur **6 grandes dimensions** :

1. **Ce qu'on doit livrer** (les besoins → les *exigences*)
2. **Quand on le livre** (le *planning* / la feuille de route)
3. **Ce qui peut mal tourner** (les *risques*)
4. **Qui décide et qui fait quoi** (la *gouvernance*)
5. **La qualité des données** qu'on va manipuler
6. **La formation** des utilisateurs et la **transformation des façons de travailler** (les *processus*)

Ce widget est un **tableau de bord unique** qui réunit ces 6 dimensions. On l'appelle un **« cockpit »** parce que, comme dans un avion, il rassemble tous les cadrans importants au même endroit pour piloter sereinement.

### Les deux « modes » du widget

Le widget se comporte différemment selon **qui** l'ouvre :

| Vous êtes… | Vous voyez… |
|------------|-------------|
| **Chef de projet** (droits *Owner* sur le document Grist) | Le **cockpit complet** : tous les onglets, en lecture **et** écriture. |
| **Référent métier** (droits *Editor*) | Un **mode contributeur** simplifié, limité à *votre* périmètre (votre direction/service). Vous ne saisissez que vos infos ; elles « remontent » automatiquement chez le chef de projet. |

> 💡 **Pourquoi cette distinction ?** Pour que chaque personne ne voie que ce qui la concerne, sans risquer de modifier le pilotage global. Le chef de projet garde la vue d'ensemble ; les référents nourrissent les données depuis le terrain.

---

## 🗂️ 2. Les onglets, un par un

### 📊 Onglet « Tableau de bord »

**À quoi ça sert :** c'est la **page d'accueil**, la synthèse en un coup d'œil. On n'y saisit rien : il **résume automatiquement** ce qui est dans les autres onglets. C'est la première chose que vous (ou un directeur) regardez le matin.

**Ce que vous y voyez :**

- Des **indicateurs clés** (appelés *KPI* — voir glossaire) sous forme de grandes cartes chiffrées :
  - **Exigences** : le nombre total de besoins recensés.
  - **Exigences « Must » restantes** : les besoins indispensables pas encore terminés (en orange s'il en reste).
  - **Risques critiques** : les dangers les plus graves encore ouverts (en rouge s'il y en a).
  - **Score qualité données** : une note globale (en %) sur la fiabilité de vos données (vert ≥ 80 %, orange ≥ 50 %, rouge en dessous).
  - **Agents formés** : le taux de présence aux formations déjà réalisées.
  - **Phases en cours** / **Décisions en attente**.
- **🔔 Activité des référents** : la liste des dernières saisies faites par les référents métiers (qui a fait quoi, quand). Les lignes non lues sont surlignées ; le bouton **« Tout marquer lu »** remet le compteur à zéro.
- **Prochaines instances** (réunions à venir) et **Risques critiques** détaillés.

> 💡 **Astuce :** si une carte est rouge ou orange, allez dans l'onglet correspondant pour comprendre et agir. Le tableau de bord vous **alerte** ; les autres onglets vous permettent d'**agir**.

---

### 📋 Onglet « Exigences »

**À quoi ça sert :** lister **tous les besoins** auxquels le futur outil devra répondre. Une *exigence*, c'est une phrase qui dit « le logiciel doit pouvoir faire ceci ». C'est la base d'un projet : si on ne sait pas ce qu'on veut, on ne peut pas le réussir.

**Le concept clé : la priorisation MoSCoW**
Tous les besoins ne se valent pas. La méthode **MoSCoW** (un moyen mnémotechnique) classe chaque exigence en 4 niveaux de priorité :

| Niveau | Signification | Exemple |
|--------|---------------|---------|
| **Must** (« doit ») | **Indispensable.** Sans ça, le projet échoue. Non négociable. | « Les utilisateurs doivent pouvoir se connecter. » |
| **Should** (« devrait ») | **Important** mais pas vital. On le fait si possible. | « Devrait envoyer un e-mail de confirmation. » |
| **Could** (« pourrait ») | **Souhaitable**, un bonus. À faire s'il reste du temps/budget. | « Pourrait afficher un thème sombre. » |
| **Won't** (« ne fera pas ») | **Exclu** pour cette fois (hors périmètre). On le note pour s'en souvenir, mais on ne le fait pas maintenant. | « Ne fera pas l'appli mobile (phase 2). » |

> 💡 Les lettres « o » de Mo**S**Co**W** ne servent qu'à rendre le mot prononçable. Retenez **M / S / C / W**.

**Les deux vues disponibles :**
- **Vue MoSCoW (board)** : 4 colonnes, une par priorité. Idéal pour visualiser l'équilibre (trop de « Must » = projet à risque).
- **Vue tableau** : la liste détaillée, triable.

**Quoi mettre dans chaque champ (bouton « + Nouvelle exigence ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Code** | Un identifiant court et unique, ex. `EXF-01`. | Pour référencer l'exigence dans les réunions/documents sans réécrire tout l'intitulé. |
| **Domaine** | Le grand thème concerné (Référentiel, GMAO, Pilotage, Usagers, SIG). | Pour regrouper et filtrer les besoins par sujet. |
| **Intitulé** | La phrase du besoin, claire et courte. | C'est le cœur de l'exigence. |
| **Règle métier** | La précision concrète : conditions, calculs, cas particuliers. | Pour que le prestataire sache **exactement** quoi développer. |
| **Priorité (MoSCoW)** | Must / Should / Could / Won't. | Pour savoir quoi faire **en premier** si le temps manque. |
| **Statut** | Où en est cette exigence : *à spécifier* → *validée* → *paramétrée* → *recettée*. | Pour suivre l'avancement (voir ci-dessous). |
| **Responsable** | La personne qui « porte » ce besoin côté métier. | Pour savoir qui contacter en cas de question. |

**Les statuts d'une exigence (son cycle de vie) :**
- **à spécifier** : le besoin est noté mais pas encore détaillé.
- **validée** : le métier a confirmé que c'est bien ce qu'il veut.
- **paramétrée** : c'est configuré/développé dans l'outil.
- **recettée** : c'est testé et ça fonctionne (« recette » = phase de test de validation).

---

### 🗺️ Onglet « Feuille de route »

**À quoi ça sert :** visualiser **le planning** du projet sous forme de **frise chronologique** (une barre par étape, placée dans le temps). On découpe un gros projet en **phases** successives.

**Définitions utiles :**
- **Phase** : une grande étape du projet (ex. « Conception », « Déploiement »).
- **Jalon** : un point de passage important / une date clé (ex. « mise en production »).
- **Livrable** : ce qu'on produit concrètement à la fin d'une phase (un document, une version du logiciel…).
- **Vague de déploiement** : quand un projet touche beaucoup de monde, on ne déploie pas pour tous en même temps. On y va **par vagues** (Vague 1 = un service pilote, Vague 2 = élargissement, etc.) pour limiter les risques.

**Quoi mettre dans chaque champ (« + Nouvelle phase ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Nom de la phase** | Ex. « Phase 1 — Conception fonctionnelle ». | Pour identifier l'étape. |
| **N°** | Un numéro d'ordre (0, 1, 2…). | Pour trier les phases dans le bon ordre. |
| **Début / Fin** | Les dates de la phase. | Pour positionner et dimensionner la barre sur la frise. |
| **Statut** | *à venir* / *en cours* / *terminée*. | La barre se colore selon le statut (gris / bleu / vert). |
| **Vague** | Le numéro de vague concerné, si applicable. | Pour distinguer les vagues de déploiement. |
| **Livrable** | Ce qui est produit à la fin de la phase. | Pour savoir ce qu'on attend concrètement. |

> 💡 La ligne **rouge en pointillés** sur la frise indique « aujourd'hui » : elle vous situe dans le temps par rapport à vos phases.

---

### ⚠️ Onglet « Risques »

**À quoi ça sert :** anticiper **ce qui pourrait mal se passer** et préparer des **parades**. Un projet sans gestion des risques, c'est conduire sans regarder la route.

**Le concept clé : la criticité = Probabilité × Impact**
On évalue chaque risque sur deux axes, notés de 1 à 3 :
- **Probabilité** : quelle est la chance que ça arrive ? (1 = Faible, 2 = Moyen, 3 = Fort)
- **Impact** : si ça arrive, quelle gravité ? (1 = Faible, 2 = Moyen, 3 = Fort)

On multiplie les deux pour obtenir un **score de criticité** (de 1 à 9). Plus le score est élevé, plus le risque est prioritaire.
- **Score 1-2** = vert (faible) • **3-4** = orange (moyen) • **6-9** = rouge (critique).

**La matrice de criticité** (le tableau coloré 3×3) place chaque risque dans une case selon sa probabilité (colonnes) et son impact (lignes). Le coin en haut à droite (rouge) = les risques à traiter en priorité.

**Définition : la « mitigation »** = la **mesure de réduction** du risque, l'action qu'on met en place pour diminuer sa probabilité ou son impact (ex. « former les équipes tôt » pour réduire le risque de rejet).

**Quoi mettre dans chaque champ (« + Nouveau risque ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Risque** | La description du danger, ex. « Résistance au changement des utilisateurs ». | Pour identifier la menace. |
| **Probabilité** | Faible / Moyen / Fort. | Pour évaluer la chance qu'il survienne. |
| **Impact** | Faible / Moyen / Fort. | Pour évaluer la gravité. |
| **Statut** | *ouvert* (à surveiller) / *maîtrisé* (sous contrôle) / *clos* (n'est plus d'actualité). | Pour suivre le traitement du risque. |
| **Mitigation** | L'action de réduction prévue. | Pour ne pas subir : on a une parade. |
| **Porteur** | Qui est responsable de surveiller ce risque. | Pour qu'il y ait toujours un responsable. |

---

### 👥 Onglet « RACI & Gouvernance »

**À quoi ça sert :** clarifier **qui décide, qui fait, qui est consulté, qui est informé** — et tracer les **réunions** et les **décisions**. Beaucoup de projets échouent parce que « tout le monde croyait que quelqu'un d'autre s'en occupait ». Cet onglet évite ça.

Il contient **3 sections** :

#### a) La matrice RACI
**RACI** est un acronyme. Pour **chaque activité** du projet, on attribue 4 rôles :

| Lettre | Signification | En clair |
|--------|---------------|----------|
| **R** | **Responsable** (Realize) | Celui qui **fait** le travail. |
| **A** | **Autorité** (Accountable) | Celui qui **décide** et **valide**. (Une seule personne idéalement.) |
| **C** | **Consulté** (Consulted) | Celui qu'on **demande son avis** avant. |
| **I** | **Informé** (Informed) | Celui qu'on **tient au courant** après. |

> 💡 Exemple : pour l'activité « Paramétrage du logiciel » → R = chef de projet informatique (il le fait), A = chef de projet fonctionnel (il valide), C = directeur métier (on lui demande son avis), I = DSI (on l'informe).

**Champs :** *Activité* (la tâche), puis *R / A / C / I* (le nom ou rôle de chaque personne).

#### b) Les instances de gouvernance
Une **instance** = une **réunion régulière** avec un rôle précis. Termes courants :
- **COPIL** (Comité de **pil**otage) : les décideurs, arbitrages stratégiques, peu fréquent (ex. trimestriel).
- **COPROJ** (Comité de **proj**et) : l'équipe projet, suivi de l'avancement, plus fréquent (ex. mensuel).
- **Ateliers métiers** : recueil des besoins avec les utilisateurs.
- **Comité data** : suivi de la qualité des données.

**Champs :** *Instance* (nom), *Composition* (qui y participe), *Fréquence* (à quel rythme), *Prochaine date*, *Rôle* (à quoi elle sert).

#### c) Le relevé de décisions & actions
Le **journal officiel** de ce qui a été décidé en réunion, et des actions qui en découlent. Indispensable pour ne rien oublier et savoir qui doit faire quoi pour quand.

**Champs :** *Date*, *Instance* (dans quelle réunion), *Décision*, *Action associée* (la tâche qui en découle), *Responsable*, *Échéance* (date limite — affichée en rouge si dépassée ⚠️), *Statut* (*ouverte* / *en cours* / *close*).

---

### 🧬 Onglet « Qualité des données »

**À quoi ça sert :** suivre la **fiabilité des données**. Un nouveau logiciel rempli de données fausses ou incomplètes ne sert à rien (« garbage in, garbage out » : si on entre du n'importe quoi, on en sort du n'importe quoi). Cet onglet mesure et pilote cette qualité.

**Le concept clé : les 5 dimensions de la qualité**

| Dimension | Question posée | Mesuré en |
|-----------|----------------|-----------|
| **Complétude** | Tous les champs obligatoires sont-ils remplis ? | % (100 % = rien ne manque) |
| **Exactitude** | Les valeurs correspondent-elles à la réalité ? | % |
| **Cohérence** | Y a-t-il des contradictions / doublons ? | % (100 % = aucune incohérence) |
| **Actualité** | Les données sont-elles à jour ? | en **jours** (délai moyen de mise à jour ; plus c'est bas, mieux c'est) |
| **Traçabilité** | Sait-on **qui** a modifié **quoi** et **quand** ? | % |

> 💡 Les couleurs : vert ≥ 80 %, orange ≥ 50 %, rouge en dessous. L'objectif est de faire monter ces scores au fil du projet.

L'onglet contient **3 sections** :

#### a) Qualité par périmètre
Un **périmètre** = un ensemble de données géré par une direction/service (ex. « Direction des Collèges »). Pour chacun, on saisit les 5 dimensions.
**Champs :** *Périmètre*, *Complétude %*, *Exactitude %*, *Cohérence %*, *Traçabilité %*, *Actualité (jours)*, *Date de mesure*.

#### b) Rôles data
Qui s'occupe des données ? Définitions :

| Rôle | Qui c'est | Ce qu'il fait |
|------|-----------|---------------|
| **Data Owner** (Propriétaire) | Un directeur métier | Définit les règles, valide, arbitre les litiges. |
| **Data Steward** (Gestionnaire) | Un référent applicatif | Contrôle la qualité au quotidien, corrige. |
| **Data Producer** (Producteur) | Un agent de terrain | **Saisit** les données à la source. |
| **Data Manager** (Pilote) | Le chef de projet fonctionnel | Anime la gouvernance, produit le tableau de bord qualité. |
| **Data Architect** (Architecte) | Le chef de projet informatique | Maintient le modèle de données, gère les intégrations techniques. |

**Champs :** *Rôle*, *Personne*, *Périmètre*.

#### c) Anomalies de données
Le registre des **problèmes détectés** sur les données (un champ vide, un doublon, une valeur fausse…).
**Champs :** *Description*, *Périmètre*, *Dimension* (laquelle des 5 est touchée), *Sévérité* (faible / moyenne / forte), *Statut* (*ouverte* / *corrigée*).

---

### 🎓 Onglet « Formation »

**À quoi ça sert :** organiser et suivre la **formation des utilisateurs**. Un super logiciel que personne ne sait utiliser = un échec. On planifie des **sessions** adaptées à chaque type d'utilisateur.

**À retenir :** on forme **par profil** (un directeur n'a pas besoin de la même formation qu'un agent de terrain) et **par vague** (en même temps que le déploiement).

**Les indicateurs en haut :** nombre de sessions, réalisées, planifiées, et le **taux de présence** (combien de personnes sont réellement venues par rapport au nombre de places).

**Quoi mettre dans chaque champ (« + Session ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Intitulé de la session** | Ex. « Agents patrimoine & maintenance ». | Pour identifier la session. |
| **Profil cible** | Le type d'utilisateurs visé. | Pour adapter le contenu. |
| **Vague** | La vague de déploiement associée. | Pour aligner formation et déploiement. |
| **Date** | Quand a lieu la session. | Pour planifier. |
| **Durée** | Ex. « 1 journée », « ½ journée ». | Pour dimensionner. |
| **Formateur** | Qui anime. | Pour savoir qui contacter. |
| **Capacité** | Nombre de places. | Pour calculer le taux de présence. |
| **Présents** | Nombre réel de participants. | Pour mesurer l'assiduité. |
| **Statut** | *planifiée* / *réalisée* / *annulée*. | Pour suivre. |

> 💡 Le **taux de présence** = Présents ÷ Capacité. C'est un bon indicateur d'adhésion au projet : un taux bas peut signaler un désintérêt à traiter.

---

### 🔄 Onglet « Processus »

**À quoi ça sert :** décrire **comment on travaille aujourd'hui** vs **comment on travaillera demain** avec le nouvel outil. Un projet SI ne change pas que le logiciel : il change les **façons de faire**. Formaliser les processus aide à mesurer le progrès et à préparer le paramétrage.

**Les concepts clés :**
- **As-Is** (« tel quel ») = la situation **actuelle**, avant le projet.
- **To-Be** (« tel que ce sera ») = la situation **cible**, après le projet.
- **Point de douleur** (*pain point*) = un dysfonctionnement actuel qui fait perdre du temps ou crée des erreurs.
- **Paramétrage requis** = ce qu'il faudra configurer dans le nouvel outil pour rendre le To-Be possible.

Chaque processus s'affiche sous forme de **fiche** avec deux colonnes côte à côte : **As-Is** (rouge, l'existant et ses douleurs) et **To-Be** (vert, la cible et ses gains).

**Quoi mettre dans chaque champ (« + Processus ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Nom du processus** | Ex. « Demande d'intervention ». | Pour identifier le processus. |
| **Intégration** | *à analyser* / *en cours* / *intégré*. | Pour suivre l'avancement de la transformation. |
| **Contexte / enjeux** | Pourquoi ce processus est important. | Pour comprendre les enjeux. |
| **As-Is** | Comment ça se passe aujourd'hui. | Point de départ. |
| **To-Be** | Comment ça se passera avec l'outil. | La cible. |
| **Points de douleur** | Les problèmes actuels. | Pour justifier le changement. |
| **Gains attendus** | Les bénéfices de la cible. | Pour mesurer la valeur. |
| **Paramétrage SIPI requis** | Ce qu'il faut configurer. | Pour préparer le travail technique. |

---

### 👤 Onglet « Référents » *(chef de projet uniquement)*

**À quoi ça sert :** déclarer les **référents métiers** qui pourront contribuer depuis le terrain, et **les rattacher à leur périmètre**. C'est ce qui active le « mode contributeur » pour eux.

**Comment ça marche :** vous associez l'**adresse e-mail Grist** d'un référent à son **périmètre** (sa direction) et à son **domaine** d'exigences. Quand ce référent ouvre le widget, il arrive automatiquement sur une interface simplifiée limitée à **son** périmètre.

**Quoi mettre dans chaque champ (« + Référent ») :**

| Champ | Quoi y mettre | Pourquoi |
|-------|---------------|----------|
| **Email Grist du référent** | L'e-mail avec lequel il se connecte à Grist. | C'est ce qui permet de le reconnaître automatiquement. |
| **Nom** | Son nom (pour l'affichage). | Pour lisibilité dans les notifications. |
| **Périmètre** | Sa direction/service (ex. « Direction des Collèges »). | Pour limiter sa saisie à son périmètre. |
| **Domaine d'exigences validé** | Le domaine dont il valide les besoins (Référentiel, GMAO…). | Pour ne lui montrer que les exigences qui le concernent. |

> ⚠️ **Important :** le référent doit avoir un accès **Editor** au document Grist (ni *Owner*, ni *Viewer*). C'est cet accès qui déclenche le mode contributeur. Si son e-mail n'est pas déclaré ici, il verra un message « Compte non rattaché ».

---

## 🤝 3. Le mode contributeur (côté référent métier)

Quand un référent (accès Editor, déclaré dans l'onglet Référents) ouvre le widget, il **ne voit pas** le cockpit complet. Il voit une page simplifiée centrée sur **son périmètre**, avec 4 sections :

1. **🧬 Qualité de mes données** — il saisit les 5 dimensions pour sa direction.
2. **🐞 Mes anomalies** — il signale les problèmes de données qu'il détecte.
3. **📋 Exigences de mon domaine** — il consulte les besoins de son domaine et clique sur **« Valider »** pour confirmer.
4. **🎓 Présences de mes formations** — il renseigne combien de personnes sont venues.

**Tout ce qu'il saisit alimente directement le cockpit du chef de projet** (mêmes tables de données) et **génère une notification 🔔**. Le chef de projet voit ainsi remonter, en temps réel, les contributions du terrain sans avoir à les ressaisir.

---

## ✅ 4. Par où commencer ? (ordre conseillé)

Si vous démarrez un projet de zéro, voici une progression logique :

1. **Tableau de bord → « Charger les données d'exemple »** (bouton visible quand tout est vide) pour voir le widget rempli et comprendre la cible. *(Vous pourrez tout modifier ensuite.)*
2. **Feuille de route** : posez vos grandes phases et leurs dates.
3. **Exigences** : recensez les besoins et priorisez-les en MoSCoW.
4. **Risques** : listez ce qui peut mal tourner et vos parades.
5. **RACI & Gouvernance** : clarifiez qui fait quoi, déclarez vos réunions.
6. **Qualité des données** : définissez vos périmètres et rôles data.
7. **Référents** : déclarez vos référents métiers pour qu'ils contribuent.
8. **Formation** et **Processus** : à mesure que le projet avance.

> 💡 Le **tableau de bord** se remplit tout seul au fur et à mesure. C'est votre boussole quotidienne.

---

## 📖 5. Glossaire express

| Terme | Définition simple |
|-------|-------------------|
| **As-Is / To-Be** | « Tel quel » (situation actuelle) / « Tel que ce sera » (situation cible). |
| **COPIL / COPROJ** | Comité de **pil**otage (les décideurs) / Comité de **proj**et (l'équipe projet). |
| **Criticité** | Gravité d'un risque = Probabilité × Impact. |
| **Data Owner / Steward / Producer / Manager / Architect** | Les 5 rôles autour de la donnée (voir onglet Qualité des données). |
| **Échéance** | Date limite pour réaliser une action. |
| **Exigence** | Un besoin auquel le futur outil doit répondre. |
| **GMAO** | Gestion de Maintenance Assistée par Ordinateur : le logiciel qui gère les interventions/réparations. |
| **Instance** | Une réunion récurrente du projet (COPIL, COPROJ…). |
| **Jalon** | Une date/étape clé du planning. |
| **KPI** | *Key Performance Indicator* : un indicateur chiffré qui mesure la santé du projet. |
| **Livrable** | Ce qu'on produit concrètement à la fin d'une étape. |
| **Mitigation** | Action mise en place pour réduire un risque. |
| **MoSCoW** | Méthode de priorisation : **M**ust (indispensable), **S**hould (important), **C**ould (souhaitable), **W**on't (exclu). |
| **Périmètre** | Le sous-ensemble de données ou d'organisation géré par une direction/service. |
| **Point de douleur** (*pain point*) | Un dysfonctionnement du processus actuel. |
| **RACI** | Qui est **R**esponsable (fait), **A**utorité (décide), **C**onsulté (avis), **I**nformé (au courant). |
| **Recette** | Phase de **tests de validation** : on vérifie que ça marche avant la mise en service. |
| **Référentiel** | La base de données « de référence », normalisée et partagée. |
| **SI** | Système d'Information : l'ensemble des outils informatiques d'une organisation. |
| **SIG** | Système d'Information Géographique : la cartographie (localiser des biens sur une carte). |
| **SLA** | *Service Level Agreement* : un engagement de délai (ex. « réparé sous 48 h »). |
| **Vague de déploiement** | Un groupe d'utilisateurs qu'on équipe à un moment donné (on déploie par étapes, pas tous d'un coup). |

---

*Besoin d'aller plus loin ? Ce guide accompagne le widget « Cockpit de pilotage projet SI ». Toutes vos données restent stockées dans votre document Grist.*
