# LEXPAT AML/KYC — Structure du projet

## Arborescence des fichiers

```
LEXPAT-AML/
│
├── README.md                          ← Guide d'installation complet
│
├── /apps-script/                      ← Code Google Apps Script
│   ├── Code.gs                        ← Point d'entrée principal + triggers
│   ├── Config.gs                      ← Constantes centralisées (noms, IDs, seuils)
│   ├── FormHandler.gs                 ← Traitement réponses formulaire
│   ├── DossierManager.gs              ← Génération ID + pseudonymisation
│   ├── ScoringAML.gs                  ← Moteur de calcul du score de risque
│   ├── DriveManager.gs                ← Création arborescence + classement fichiers
│   ├── SheetsManager.gs               ← Lecture/écriture Google Sheets
│   ├── DocsGenerator.gs               ← Génération fiche analyse Google Docs
│   ├── Notifier.gs                    ← Envoi emails Gmail
│   └── Logger.gs                      ← Journal d'erreurs et d'événements
│
├── /templates/                        ← Modèles de documents
│   ├── fiche_analyse_risque.md        ← Template fiche d'analyse (à copier dans Google Docs)
│   ├── email_client_confirmation.md   ← Email de confirmation au client
│   ├── email_interne_alerte.md        ← Email interne notification dossier
│   └── manuel_aml_cabinet.md          ← Mini-manuel AML du cabinet
│
├── /config/                           ← Configuration
│   ├── colonnes_sheets.md             ← Schéma exact des colonnes Google Sheets
│   ├── scoring_rules.md               ← Documentation des règles de scoring
│   └── drive_structure.md             ← Arborescence Drive attendue
│
└── /docs/                             ← Documentation
    ├── guide_utilisateur.md           ← Guide pour l'assistante / l'avocate
    ├── checklist_test.md              ← Checklist de validation du système
    └── evolutions_futures.md          ← Roadmap technique
```

---

## Composants Google Workspace utilisés

| Composant         | Rôle                                              | Obligatoire |
|-------------------|---------------------------------------------------|-------------|
| Google Forms      | Collecte des données client                       | Oui         |
| Google Sheets     | Registre AML principal                            | Oui         |
| Google Drive      | Classement des documents par dossier              | Oui         |
| Google Docs       | Génération de la fiche d'analyse de risque        | Oui         |
| Google Apps Script| Moteur d'automatisation (triggers + logique)      | Oui         |
| Gmail             | Notifications internes + accusés de réception     | Optionnel   |

---

## Nommage des objets Google Workspace

| Objet                     | Nom exact à utiliser                    |
|---------------------------|-----------------------------------------|
| Google Sheet principal    | `LEXPAT_AML_Registre`                   |
| Feuille données           | `Dossiers`                              |
| Feuille configuration     | `Configuration`                         |
| Feuille logs              | `Logs`                                  |
| Formulaire                | `LEXPAT — Identification client AML`    |
| Dossier Drive racine      | `AML`                                   |
| Sous-dossier clients      | `AML/Clients`                           |
| Template Docs             | `[TEMPLATE] Fiche Analyse de Risque`    |

---

## Clés de données — ce qui relie les composants

```
Google Forms response
  └─ row_index dans Google Sheets (Dossiers)
       ├─ ID_DOSSIER → clé primaire → nom du dossier Drive
       ├─ ID_PSEUDO  → version anonymisée pour l'IA
       └─ LIEN_FICHE → URL Google Docs généré

Google Sheets (Dossiers)
  ├─ Colonne B  = ID_DOSSIER  (ex: LEX-AML-2026-0001)
  ├─ Colonne C  = NOM
  ├─ Colonne D  = PRÉNOM
  └─ Colonne X  = LIEN_FICHE_ANALYSE

Google Drive
  AML/
  └─ Clients/
       └─ LEX-AML-2026-0001/
            ├─ 01_Formulaire/
            ├─ 02_Identité/
            ├─ 03_Société/
            ├─ 04_Analyse/       ← fiche Docs va ici
            └─ 05_Archivage/
```

---

## Statuts du dossier (codifiés dans Sheets)

| Code statut         | Signification                        | Couleur Sheets |
|---------------------|--------------------------------------|----------------|
| `À VÉRIFIER`        | Dossier reçu, en attente de révision | Orange #FFB347 |
| `VALIDÉ`            | Accepté, mission peut démarrer       | Vert   #90EE90 |
| `VIGILANCE RENFORCÉE`| Risque élevé, diligences accrues    | Rouge  #FF6B6B |
| `REFUSÉ`            | Dossier refusé                       | Gris   #C0C0C0 |
| `INCOMPLET`         | Documents manquants                  | Jaune  #FFFF99 |

---

## Niveaux de risque AML

| Score   | Niveau  | Action requise                              |
|---------|---------|---------------------------------------------|
| 0–30    | FAIBLE  | Vérification standard                       |
| 31–60   | MOYEN   | Diligences renforcées recommandées          |
| 61–100  | ÉLEVÉ   | Diligences renforcées obligatoires / refus  |
