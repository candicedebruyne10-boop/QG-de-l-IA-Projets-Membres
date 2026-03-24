# BLOC 2 — Configuration Google Workspace
# LEXPAT AML/KYC — Guide de mise en place manuelle

## ÉTAPE 1 — Google Drive : créer la structure de dossiers

### 1.1 Créer le dossier racine

1. Ouvrir Google Drive
2. Créer un dossier nommé exactement : `AML`
3. Dans `AML`, créer un sous-dossier : `Clients`
4. Dans `AML`, créer un sous-dossier : `Templates`
5. Copier l'ID du dossier `AML` (visible dans l'URL : drive.google.com/drive/folders/[ID_ICI])
   → Ce sera la valeur de `ID_DOSSIER_DRIVE_ROOT` dans la feuille Configuration

### 1.2 Permissions Drive

- Clic droit sur le dossier `AML` → Partager
- Partager uniquement avec les collaborateurs du cabinet (accès "Éditeur")
- NE PAS rendre public

---

## ÉTAPE 2 — Google Sheets : créer le registre AML

### 2.1 Créer le classeur

1. Créer un nouveau Google Sheets
2. Nommer le classeur : `LEXPAT_AML_Registre`
3. Renommer l'onglet par défaut : `Dossiers`
4. Ajouter deux onglets : `Configuration` et `Logs`

### 2.2 Feuille "Dossiers" — créer les en-têtes (ligne 1)

Copier-coller ces en-têtes exactement dans la ligne 1, colonnes A à AB :

```
Date de réception | Identifiant dossier | ID pseudonymisé | Nom | Prénom | Nom complet | Date de naissance | Nationalité | Adresse complète | Profession | Type de mission | Origine des fonds | Administrateur / actionnaire | Lien carte d'identité | Lien statuts | Lien registre UBO | Documents reçus | Score de risque | Niveau de risque | Facteurs de risque | Analyse effectuée | Décision | Responsable | Date de validation | Statut du dossier | Lien fiche analyse | Lien dossier Drive | Observations
```

### 2.3 Feuille "Dossiers" — formatage des colonnes

| Colonne | Largeur | Format              | Couleur en-tête |
|---------|---------|---------------------|-----------------|
| A       | 130px   | Date (dd/mm/yyyy)   | #E8F4FD         |
| B       | 160px   | Texte               | #E8F4FD         |
| C       | 120px   | Texte               | #E8F4FD         |
| D–F     | 120px   | Texte               | #FFF3E0         |
| G–J     | 140px   | Texte               | #FFF3E0         |
| K–M     | 160px   | Texte               | #F3E5F5         |
| N–Q     | 180px   | Texte (URL)         | #E8F5E9         |
| R       | 100px   | Nombre (0 déc.)     | #FFEBEE         |
| S       | 120px   | Texte               | #FFEBEE         |
| T       | 200px   | Texte               | #FFEBEE         |
| U–X     | 130px   | Texte               | #FFF8E1         |
| Y       | 150px   | Texte               | #FFF8E1         |
| Z–AA    | 180px   | Texte (URL)         | #E8F4FD         |
| AB      | 250px   | Texte               | #F5F5F5         |

### 2.4 Feuille "Dossiers" — règles de mise en forme conditionnelle

Appliquer sur la colonne Y (Statut du dossier) :

| Condition "le texte contient" | Couleur fond | Couleur texte |
|-------------------------------|--------------|---------------|
| À VÉRIFIER                    | #FFE0B2      | #E65100       |
| VALIDÉ                        | #C8E6C9      | #1B5E20       |
| VIGILANCE RENFORCÉE           | #FFCDD2      | #B71C1C       |
| REFUSÉ                        | #EEEEEE      | #616161       |
| INCOMPLET                     | #FFF9C4      | #F57F17       |

Appliquer sur la colonne S (Niveau de risque) :

| Condition                     | Couleur fond | Couleur texte |
|-------------------------------|--------------|---------------|
| FAIBLE                        | #C8E6C9      | #1B5E20       |
| MOYEN                         | #FFF9C4      | #F57F17       |
| ÉLEVÉ                         | #FFCDD2      | #B71C1C       |

### 2.5 Feuille "Configuration" — remplir les valeurs

Saisir ces données dans la feuille `Configuration` :

| A (clé)               | B (valeur — à adapter) |
|-----------------------|------------------------|
| ANNEE_COURANTE        | 2026                   |
| PREFIXE_DOSSIER       | LEX-AML                |
| SEUIL_RISQUE_FAIBLE   | 30                     |
| SEUIL_RISQUE_MOYEN    | 60                     |
| EMAIL_AVOCAT          | votre@email.be         |
| RESPONSABLE_DEFAUT    | LEXPAT                 |
| ID_TEMPLATE_DOCS      | (à remplir à l'étape 4)|
| ID_DOSSIER_DRIVE_ROOT | (copié à l'étape 1)    |
| DERNIER_NUMERO        | 0                      |

### 2.6 Feuille "Logs" — créer les en-têtes

Ligne 1, colonnes A à F :
```
Timestamp | Niveau | Fonction | ID Dossier | Message | Détails
```

Figer la ligne 1 (Vue → Figer → 1 ligne).

---

## ÉTAPE 3 — Google Forms : créer le formulaire client

### 3.1 Créer le formulaire

1. Aller sur forms.google.com
2. Créer un nouveau formulaire
3. Titre : `LEXPAT — Identification client AML`
4. Description : `Dans le cadre de nos obligations légales en matière de lutte contre le blanchiment de capitaux (LBC-FT), nous vous remercions de bien vouloir compléter ce formulaire. Les informations collectées sont confidentielles et traitées conformément au RGPD.`

### 3.2 Section 1 — Identification (champs obligatoires)

| Question                  | Type            | Obligatoire |
|---------------------------|-----------------|-------------|
| Nom de famille            | Réponse courte  | Oui         |
| Prénom                    | Réponse courte  | Oui         |
| Date de naissance         | Date            | Oui         |
| Nationalité               | Réponse courte  | Oui         |
| Adresse complète          | Paragraphe      | Oui         |
| Profession actuelle       | Réponse courte  | Oui         |

### 3.3 Section 2 — Mission confiée au cabinet

| Question          | Type         | Options                                                                                           |
|-------------------|--------------|---------------------------------------------------------------------------------------------------|
| Type de mission   | Choix unique | Permis unique / Carte professionnelle / Création de société / Investissement en Belgique / Autre  |

### 3.4 Section 3 — Informations financières

| Question                                          | Type       | Obligatoire |
|---------------------------------------------------|------------|-------------|
| Origine des fonds utilisés pour cette opération   | Paragraphe | Oui         |

### 3.5 Section 4 — Structure sociétaire

| Question                                                    | Type         | Options   |
|-------------------------------------------------------------|--------------|-----------|
| Êtes-vous administrateur ou actionnaire d'une société ?     | Choix unique | Oui / Non |

### 3.6 Section 5 — Documents à téléverser

| Question                                         | Type         | Obligatoire |
|--------------------------------------------------|--------------|-------------|
| Carte d'identité (recto-verso)                   | Fichier      | Oui         |
| Statuts de la société (si applicable)             | Fichier      | Non         |
| Extrait du registre UBO (si applicable)           | Fichier      | Non         |

**Paramètres fichiers :**
- Types autorisés : PDF, JPG, PNG
- Taille max : 10 Mo par fichier

### 3.7 Paramètres du formulaire

- Onglet "Paramètres" → Réponses → Désactiver "Autoriser modifier après envoi"
- Onglet "Paramètres" → Présentation → Message de confirmation :
  `Merci. Votre dossier d'identification a été transmis au cabinet LEXPAT. Vous recevrez un accusé de réception par email. Pour toute question : contact@lexpat.be`
- Onglet "Réponses" → Cliquer l'icône Sheets → Sélectionner "LEXPAT_AML_Registre" → Créer ou sélectionner une nouvelle feuille nommée `Réponses_Formulaire`

### 3.8 Copier l'ID du formulaire

L'URL du formulaire en mode édition contient l'ID :
`https://docs.google.com/forms/d/[FORM_ID]/edit`

Copier cet ID — il sera utilisé dans `Config.gs`.

---

## ÉTAPE 4 — Google Docs : créer le template de fiche analyse

### 4.1 Créer le document template

1. Créer un nouveau Google Docs dans `AML/Templates/`
2. Nommer : `[TEMPLATE] Fiche Analyse de Risque`
3. Copier le contenu du fichier `templates/fiche_analyse_risque.md` dans ce document
4. Les balises `{{VARIABLE}}` seront remplacées automatiquement par le script
5. Copier l'ID du document (dans l'URL Google Docs)
6. Coller cet ID dans la feuille `Configuration`, ligne `ID_TEMPLATE_DOCS`

### 4.2 Variables disponibles dans le template

Le script remplacera automatiquement ces balises :

```
{{ID_DOSSIER}}          {{ID_PSEUDO}}
{{DATE_ANALYSE}}        {{NOM_COMPLET}}
{{DATE_NAISSANCE}}      {{NATIONALITE}}
{{ADRESSE}}             {{PROFESSION}}
{{TYPE_MISSION}}        {{ORIGINE_FONDS}}
{{EST_DIRIGEANT}}       {{DOCUMENTS_RECUS}}
{{SCORE_RISQUE}}        {{NIVEAU_RISQUE}}
{{FACTEURS_RISQUE}}     {{STATUT_DOSSIER}}
{{RESPONSABLE}}
```

---

## ÉTAPE 5 — Lier le formulaire à Google Sheets (vérification)

1. Ouvrir `LEXPAT_AML_Registre`
2. Vérifier que la feuille `Réponses_Formulaire` existe
3. Vérifier que les colonnes correspondent aux questions du formulaire
4. La feuille `Réponses_Formulaire` sera lue par le script — ne pas la renommer

---

## Récapitulatif des IDs à collecter avant le déploiement du script

| Élément                    | Où le trouver                          | Variable dans Config.gs     |
|----------------------------|----------------------------------------|-----------------------------|
| ID Dossier Drive AML       | URL du dossier Drive                   | DRIVE_ROOT_FOLDER_ID        |
| ID Google Sheets            | URL du classeur Sheets                 | SPREADSHEET_ID              |
| ID Google Forms             | URL du formulaire                      | FORM_ID                     |
| ID Template Google Docs     | URL du document Docs                   | DOCS_TEMPLATE_ID            |
