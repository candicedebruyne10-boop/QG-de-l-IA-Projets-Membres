/**
 * Code.gs — LEXPAT AML/KYC
 * Point d'entrée principal du système.
 * Contient : trigger onFormSubmit, orchestrateur principal, initialisation.
 *
 * ORDRE D'EXÉCUTION lors d'une réponse formulaire :
 * 1. onFormSubmit() reçoit l'événement
 * 2. parserReponseFormulaire() structure les données
 * 3. genererIdDossier() crée l'identifiant unique
 * 4. calculerScoreAML() calcule le risque
 * 5. creerArborescenceDossier() prépare Drive
 * 6. classerFichiersClient() déplace les pièces jointes
 * 7. genererFicheAnalyse() crée le Google Docs
 * 8. ecrireLigneDossier() enregistre tout dans Sheets
 * 9. envoyerNotificationInterne() alerte l'avocate
 */


// ============================================================
// TRIGGER PRINCIPAL — déclenché à chaque réponse formulaire
// ============================================================

/**
 * Fonction déclenchée automatiquement par le trigger onFormSubmit.
 * NE PAS RENOMMER — le nom est lié au trigger installé.
 *
 * @param {Object} e - Événement Apps Script (e.response = réponse Forms)
 */
function onFormSubmit(e) {
  var idDossier = null;

  try {
    chargerConfigurationDynamique();
    logInfo("onFormSubmit", null, "Nouvelle réponse formulaire reçue");

    // 1. Parser la réponse brute
    var donnees = parserReponseFormulaire(e.response);

    // 2. Générer les identifiants
    idDossier = genererIdDossier();
    var idPseudo = genererIdPseudo(idDossier);
    donnees.idDossier = idDossier;
    donnees.idPseudo  = idPseudo;
    donnees.dateReception = new Date();
    donnees.responsable   = CONFIG.EMAIL_AVOCAT || "LEXPAT";

    // 3. Calculer le score AML
    var scoring = calculerScoreAML(donnees);
    donnees.scoreRisque    = scoring.score;
    donnees.niveauRisque   = scoring.niveau;
    donnees.facteursRisque = formaterFacteurs(scoring.facteurs);

    // Déterminer le statut initial selon le niveau de risque
    donnees.statutDossier = _determinerStatutInitial(scoring.niveau);

    // 4. Créer l'arborescence Drive
    var arborescence = creerArborescenceDossier(idDossier);
    donnees.lienDossierDrive = arborescence.urlDossierClient;

    // 5. Classer les fichiers dans Drive
    var liens = classerFichiersClient(donnees, idDossier, arborescence);
    donnees.lienCarteIdentite = liens.carteIdentite || donnees.lienCarteIdentite;
    donnees.lienStatuts       = liens.statuts       || donnees.lienStatuts;
    donnees.lienRegistreUBO   = liens.registreUBO   || donnees.lienRegistreUBO;

    // 6. Générer la fiche d'analyse Google Docs
    var ficheResult = genererFicheAnalyse(donnees);
    donnees.lienFicheAnalyse = ficheResult.urlDoc;

    // 7. Déplacer la fiche dans le bon dossier Drive
    enregistrerFicheAnalyse(ficheResult.idDoc, arborescence, idDossier);

    // 8. Écrire la ligne dans Google Sheets
    ecrireLigneDossier(donnees);

    // 9. Envoyer la notification interne
    envoyerNotificationInterne(donnees);

    logInfo("onFormSubmit", idDossier, "Traitement complet — Score : " +
            scoring.score + " (" + scoring.niveau + ")");

  } catch (e) {
    logError("onFormSubmit", idDossier,
             "ERREUR CRITIQUE dans le traitement du formulaire", e);

    // Tenter d'envoyer une alerte d'erreur à l'avocate
    try {
      GmailApp.sendEmail(
        CONFIG.EMAIL_AVOCAT,
        "[LEXPAT AML] ERREUR — Traitement formulaire échoué",
        "Une erreur est survenue lors du traitement d'une réponse.\n\n" +
        "Dossier : " + (idDossier || "Non généré") + "\n" +
        "Erreur : " + e.message + "\n\n" +
        "Consulter la feuille Logs pour les détails."
      );
    } catch (mailErr) {
      console.error("Impossible d'envoyer l'alerte d'erreur : " + mailErr.message);
    }
  }
}


// ============================================================
// FONCTIONS D'INSTALLATION ET DE CONFIGURATION
// ============================================================

/**
 * À exécuter UNE SEULE FOIS lors de l'installation initiale.
 * Configure les en-têtes Sheets et installe le trigger Forms.
 * Exécuter depuis l'éditeur Apps Script : Exécuter → initialiserSysteme
 */
function initialiserSysteme() {
  try {
    chargerConfigurationDynamique();
    Logger.log("=== INITIALISATION DU SYSTÈME LEXPAT AML ===");

    // Créer/compléter les feuilles indispensables du classeur
    initialiserClasseurPrincipal();
    Logger.log("✓ Classeur principal initialisé");

    // Initialiser la feuille Dossiers
    initialiserFeuilleDossiers();
    Logger.log("✓ Feuille Dossiers initialisée");

    // Installer le trigger onFormSubmit
    _installerTriggerFormulaire();
    Logger.log("✓ Trigger formulaire installé");

    Logger.log("=== INITIALISATION TERMINÉE ===");
    Logger.log("Prochaine étape : vérifier que CONFIG.DOCS_TEMPLATE_ID est renseigné");

  } catch (e) {
    Logger.log("ERREUR lors de l'initialisation : " + e.message);
    throw e;
  }
}


/**
 * Crée automatiquement le Google Form AML avec les bonnes questions
 * et le relie au Google Sheets principal.
 * À exécuter avant initialiserSysteme() si le formulaire n'existe pas encore.
 */
function creerFormulaireAML() {
  try {
    chargerConfigurationDynamique();

    var form = FormApp.create("LEXPAT — Identification client AML");
    form.setDescription(
      "Dans le cadre de nos obligations légales en matière de lutte contre le blanchiment de capitaux (LBC-FT), " +
      "nous vous remercions de bien vouloir compléter ce formulaire. Les informations collectées sont confidentielles " +
      "et traitées conformément au RGPD."
    );
    form.setAllowResponseEdits(false);
    form.setConfirmationMessage(
      "Merci. Votre dossier d'identification a été transmis au cabinet LEXPAT. " +
      "Vous recevrez un accusé de réception par email."
    );
    form.setCollectEmail(true);
    form.setDestination(FormApp.DestinationType.SPREADSHEET, CONFIG.SPREADSHEET_ID);

    form.addTextItem()
      .setTitle("Nom de famille")
      .setRequired(true);

    form.addTextItem()
      .setTitle("Prénom")
      .setRequired(true);

    form.addDateItem()
      .setTitle("Date de naissance")
      .setRequired(true);

    form.addTextItem()
      .setTitle("Nationalité")
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("Adresse complète")
      .setRequired(true);

    form.addTextItem()
      .setTitle("Profession actuelle")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("Type de mission")
      .setChoiceValues([
        "Permis unique",
        "Carte professionnelle",
        "Création de société",
        "Investissement en Belgique",
        "Autre"
      ])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("Origine des fonds utilisés pour cette opération")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("Êtes-vous administrateur ou actionnaire d'une société ?")
      .setChoiceValues(["Oui", "Non"])
      .setRequired(true);

    form.addFileUploadItem()
      .setTitle("Carte d'identité (recto-verso)")
      .setRequired(true)
      .setMaxFiles(1);

    form.addFileUploadItem()
      .setTitle("Statuts de la société (si applicable)")
      .setRequired(false)
      .setMaxFiles(1);

    form.addFileUploadItem()
      .setTitle("Extrait du registre UBO (si applicable)")
      .setRequired(false)
      .setMaxFiles(1);

    Logger.log("Formulaire créé : " + form.getEditUrl());
    Logger.log("FORM_ID à copier dans Config.gs : " + form.getId());
    return {
      id: form.getId(),
      editUrl: form.getEditUrl(),
      publishedUrl: form.getPublishedUrl()
    };
  } catch (e) {
    logError("creerFormulaireAML", null, "Échec création formulaire AML", e);
    throw e;
  }
}


/**
 * Installe le trigger onFormSubmit lié au formulaire configuré.
 * Supprime les triggers existants pour éviter les doublons.
 */
function _installerTriggerFormulaire() {
  // Supprimer les anciens triggers onFormSubmit
  var triggersExistants = ScriptApp.getProjectTriggers();
  triggersExistants.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === "onFormSubmit") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Créer le nouveau trigger
  var formulaire = FormApp.openById(CONFIG.FORM_ID);
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(formulaire)
    .onFormSubmit()
    .create();

  Logger.log("Trigger onFormSubmit installé pour le formulaire : " + CONFIG.FORM_ID);
}


/**
 * Retraite un dossier existant (en cas d'erreur lors du traitement initial).
 * À utiliser depuis l'éditeur Apps Script en cas de problème.
 *
 * @param {string} idDossier - Identifiant du dossier à retraiter
 */
function retraiterDossier(idDossier) {
  try {
    chargerConfigurationDynamique();
    Logger.log("Retraitement du dossier : " + idDossier);
    var donnees = lireDossierParId(idDossier);
    if (!donnees) {
      Logger.log("Dossier introuvable : " + idDossier);
      return;
    }

    // Regénérer uniquement la fiche si nécessaire
    if (!donnees.lienFicheAnalyse) {
      var scoring = calculerScoreAML(donnees);
      donnees.scoreRisque    = scoring.score;
      donnees.niveauRisque   = scoring.niveau;
      donnees.facteursRisque = formaterFacteurs(scoring.facteurs);

      var ficheResult = genererFicheAnalyse(donnees);
      var numLigne = trouverLignePourId(idDossier);
      mettreAJourLigneDossier(numLigne, {
        LIEN_FICHE_ANALYSE: ficheResult.urlDoc
      });
      Logger.log("Fiche régénérée : " + ficheResult.urlDoc);
    }

    Logger.log("Retraitement terminé pour : " + idDossier);
  } catch (e) {
    logError("retraiterDossier", idDossier, "Échec retraitement", e);
    Logger.log("ERREUR : " + e.message);
  }
}


// ============================================================
// FONCTIONS UTILITAIRES INTERNES
// ============================================================

/**
 * Détermine le statut initial d'un dossier selon son niveau de risque.
 * Un risque élevé passe directement en vigilance renforcée.
 */
function _determinerStatutInitial(niveauRisque) {
  if (niveauRisque === CONFIG.NIVEAUX_RISQUE.ELEVE) {
    return CONFIG.STATUTS.VIGILANCE_RENFORCEE;
  }
  return CONFIG.STATUTS.A_VERIFIER;
}


/**
 * Teste le système avec des données fictives (sans passer par Forms).
 * À utiliser uniquement en développement/test.
 * Exécuter depuis l'éditeur : Exécuter → testerSystemeComplet
 */
function testerSystemeComplet() {
  chargerConfigurationDynamique();
  var donneesTest = {
    nom: "Dupont",
    prenom: "Jean",
    nomComplet: "Jean Dupont",
    dateNaissance: "01/01/1980",
    nationalite: "Française",
    adresse: "10 rue de la Paix, 75001 Paris",
    profession: "Chef d'entreprise",
    typeMission: "Création de société",
    origineFonds: "Cession de parts sociales",
    estDirigeant: "Oui",
    lienCarteIdentite: "",
    lienStatuts: "",
    lienRegistreUBO: "",
    aCarteIdentite: false,
    aStatuts: false,
    aRegistreUBO: false,
    documentsRecus: "Aucun",
    dateReception: new Date(),
    responsable: "LEXPAT"
  };

  Logger.log("=== TEST SYSTÈME ===");

  // Test scoring
  var scoring = calculerScoreAML(donneesTest);
  Logger.log("Score : " + scoring.score + " / Niveau : " + scoring.niveau);
  Logger.log("Facteurs : " + scoring.facteurs.join(" | "));

  // Test génération ID
  Logger.log("ID test (sans incrémenter) : simulé uniquement");

  Logger.log("=== TEST TERMINÉ ===");
}
