# Cockpit de pilotage projet SI — Widget Grist

Widget Grist dédié au **chef de projet SI** pour piloter un projet de transformation (type renouvellement de système d'information). Autonome, bilingue **FR/EN**, orienté **pilotage & reporting** (CDP + COPIL).

> Conçu à partir d'un cas réel de renouvellement de SI patrimonial (note de cadrage, cahier des charges fonctionnel, gouvernance des données, plan de formation, formalisation des processus).

## 🧭 Modules (8 onglets)

| Module | Contenu |
|--------|---------|
| 📊 **Tableau de bord** | KPI de pilotage : exigences *Must* restantes, risques critiques, score qualité données, % agents formés, phases en cours, décisions en attente ; prochaines instances ; risques critiques |
| 📋 **Exigences** | Registre d'exigences priorisées **MoSCoW** (vue board + tableau), par domaine, avec règle métier, statut et responsable |
| 🗺️ **Feuille de route** | Phases & jalons sur une **frise chronologique** (vagues de déploiement, livrables, statut) |
| ⚠️ **Risques** | **Matrice de criticité 3×3** (proba × impact) + registre, mitigation, porteur, statut |
| 👥 **RACI & Gouvernance** | Matrice **RACI**, **instances** de gouvernance (COPIL/COPROJ/ateliers…), **relevé de décisions & actions** |
| 🧬 **Qualité des données** | Scorecard des **5 dimensions** (complétude, exactitude, cohérence, actualité, traçabilité) par périmètre, **rôles data** (Owner/Steward/…), **anomalies** |
| 🎓 **Formation** | Sessions par profil/vague, **taux de présence**, formateurs, statut |
| 🔄 **Processus** | Fiches **As-Is → To-Be** : points de douleur, gains, **paramétrage requis**, statut d'intégration |

## 🚀 Installation dans Grist

1. Dans votre document Grist : **Ajouter un widget → Custom → URL**.
2. URL : `https://isaytoo.github.io/grist-widget-sipi/`
3. Niveau d'accès : **Complet** (le widget crée et alimente ses tables `SIPI_*`).

Au premier chargement, le widget crée automatiquement **11 tables** (`SIPI_Requirements`, `SIPI_Phases`, `SIPI_Risks`, `SIPI_RACI`, `SIPI_Instances`, `SIPI_Decisions`, `SIPI_DataQuality`, `SIPI_DataRoles`, `SIPI_DataAnomalies`, `SIPI_Training`, `SIPI_Processes`).

## ✨ Caractéristiques

- **Vanilla JS** + `grist-plugin-api` (aucun build).
- Bilingue **FR / EN**.
- Modales fermées uniquement via la croix/Annuler (pas de fermeture accidentelle au clic extérieur).
- Synchro **live** (`grist.onRecords`) : les modifications faites directement dans les tables se reflètent dans le widget.
- Données stockées **dans le document Grist** (aucune dépendance externe).

## 📄 Licence

Apache License 2.0 — © 2026 Saïd Hamadou (isaytoo).
