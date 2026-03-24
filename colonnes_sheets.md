# Schéma de données — Google Sheets LEXPAT_AML_Registre
# Feuille : Dossiers

## Colonnes exactes (ordre d'implémentation)

| Col | Lettre | Nom interne (COLUMN_MAP)    | Label affiché dans Sheets              | Source              |
|-----|--------|-----------------------------|----------------------------------------|---------------------|
| 1   | A      | DATE_RECEPTION              | Date de réception                      | Auto (script)       |
| 2   | B      | ID_DOSSIER                  | Identifiant dossier                    | Auto (script)       |
| 3   | C      | ID_PSEUDO                   | ID pseudonymisé                        | Auto (script)       |
| 4   | D      | NOM                         | Nom                                    | Formulaire          |
| 5   | E      | PRENOM                      | Prénom                                 | Formulaire          |
| 6   | F      | NOM_COMPLET                 | Nom complet                            | Auto (D+E)          |
| 7   | G      | DATE_NAISSANCE              | Date de naissance                      | Formulaire          |
| 8   | H      | NATIONALITE                 | Nationalité                            | Formulaire          |
| 9   | I      | ADRESSE                     | Adresse complète                       | Formulaire          |
| 10  | J      | PROFESSION                  | Profession                             | Formulaire          |
| 11  | K      | TYPE_MISSION                | Type de mission                        | Formulaire          |
| 12  | L      | ORIGINE_FONDS               | Origine des fonds                      | Formulaire          |
| 13  | M      | EST_DIRIGEANT               | Administrateur / actionnaire           | Formulaire          |
| 14  | N      | LIEN_CARTE_IDENTITE         | Lien carte d'identité (Drive)          | Auto (script)       |
| 15  | O      | LIEN_STATUTS                | Lien statuts société (Drive)           | Auto (script)       |
| 16  | P      | LIEN_REGISTRE_UBO           | Lien registre UBO (Drive)              | Auto (script)       |
| 17  | Q      | DOCUMENTS_RECUS             | Documents reçus (liste)                | Auto (script)       |
| 18  | R      | SCORE_RISQUE                | Score de risque (0–100)                | Auto (script)       |
| 19  | S      | NIVEAU_RISQUE               | Niveau de risque                       | Auto (script)       |
| 20  | T      | FACTEURS_RISQUE             | Facteurs détectés                      | Auto (script)       |
| 21  | U      | ANALYSE_EFFECTUEE           | Analyse effectuée (O/N)                | Manuel              |
| 22  | V      | DECISION                    | Décision du cabinet                    | Manuel              |
| 23  | W      | RESPONSABLE                 | Responsable dossier                    | Manuel / Auto       |
| 24  | X      | DATE_VALIDATION             | Date de validation                     | Manuel              |
| 25  | Y      | STATUT_DOSSIER              | Statut du dossier                      | Auto → Manuel       |
| 26  | Z      | LIEN_FICHE_ANALYSE          | Lien fiche Google Docs                 | Auto (script)       |
| 27  | AA     | LIEN_DOSSIER_DRIVE          | Lien dossier Drive                     | Auto (script)       |
| 28  | AB     | OBSERVATIONS                | Observations internes                  | Manuel              |

---

## Feuille : Configuration

| Ligne | Colonne A (clé)          | Colonne B (valeur)                    |
|-------|--------------------------|---------------------------------------|
| 1     | ANNEE_COURANTE           | 2026                                  |
| 2     | PREFIXE_DOSSIER          | LEX-AML                               |
| 3     | SEUIL_RISQUE_FAIBLE      | 30                                    |
| 4     | SEUIL_RISQUE_MOYEN       | 60                                    |
| 5     | EMAIL_AVOCAT             | votre@cabinet.be                      |
| 6     | RESPONSABLE_DEFAUT       | LEXPAT                                |
| 7     | ID_TEMPLATE_DOCS         | (ID du Google Doc template)           |
| 8     | ID_DOSSIER_DRIVE_ROOT    | (ID du dossier racine AML dans Drive) |
| 9     | DERNIER_NUMERO           | 0 (auto-incrémenté)                   |

---

## Feuille : Logs

| Col | Nom          | Contenu                              |
|-----|--------------|--------------------------------------|
| A   | TIMESTAMP    | Date/heure de l'événement            |
| B   | NIVEAU       | INFO / WARNING / ERROR               |
| C   | FONCTION     | Nom de la fonction Apps Script       |
| D   | ID_DOSSIER   | Identifiant concerné (si applicable) |
| E   | MESSAGE      | Description de l'événement           |
| F   | DETAILS      | Stack trace ou données supplémentaires|
