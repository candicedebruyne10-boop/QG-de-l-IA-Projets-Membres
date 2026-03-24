/**
 * Notifier.gs — LEXPAT AML/KYC
 * Gestion des notifications par email.
 * Deux types : notification interne à l'avocate + accusé de réception client.
 */


/**
 * Envoie la notification interne à l'avocate lorsqu'un nouveau dossier est créé.
 *
 * @param {Object} donneesDossier - Données complètes du dossier
 */
function envoyerNotificationInterne(donneesDossier) {
  try {
    var sujet = "[LEXPAT AML] Nouveau dossier — " + donneesDossier.idDossier +
                " — Risque " + donneesDossier.niveauRisque;

    var corps = _construireEmailInterne(donneesDossier);

    GmailApp.sendEmail(
      CONFIG.EMAIL_AVOCAT,
      sujet,
      "",  // corps texte brut (vide — on utilise uniquement HTML)
      {
        htmlBody: corps,
        name: "LEXPAT AML — Système automatique"
      }
    );

    logInfo("envoyerNotificationInterne", donneesDossier.idDossier,
            "Notification interne envoyée à " + CONFIG.EMAIL_AVOCAT);

  } catch (e) {
    logError("envoyerNotificationInterne", donneesDossier.idDossier,
             "Échec envoi notification interne", e);
    // Ne pas faire planter le processus principal
  }
}


/**
 * Construit le corps HTML de l'email de notification interne.
 * Inclut un tableau récapitulatif et les liens Drive/Docs.
 */
function _construireEmailInterne(d) {
  var couleurRisque = {
    "FAIBLE": "#1B5E20", "MOYEN": "#F57F17", "ÉLEVÉ": "#B71C1C"
  }[d.niveauRisque] || "#000000";

  return [
    "<div style='font-family:Arial,sans-serif;max-width:600px'>",
    "<h2 style='color:#1A237E;border-bottom:2px solid #1A237E;padding-bottom:8px'>",
    "LEXPAT — Nouveau dossier AML reçu</h2>",

    "<table style='border-collapse:collapse;width:100%'>",
    _ligneEmail("Identifiant dossier", "<strong>" + d.idDossier + "</strong>"),
    _ligneEmail("ID pseudonymisé", d.idPseudo),
    _ligneEmail("Nom complet", d.nomComplet),
    _ligneEmail("Date de réception", Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm")),
    _ligneEmail("Type de mission", d.typeMission),
    _ligneEmail("Nationalité", d.nationalite),
    _ligneEmail("Score de risque",
      "<strong style='color:" + couleurRisque + "'>" +
      d.scoreRisque + " / 100 — " + d.niveauRisque + "</strong>"),
    _ligneEmail("Facteurs détectés", d.facteursRisque),
    _ligneEmail("Statut", d.statutDossier),
    "</table>",

    d.lienFicheAnalyse ? "<p><a href='" + d.lienFicheAnalyse + "' style='background:#1A237E;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none'>Ouvrir la fiche d'analyse</a></p>" : "",
    d.lienDossierDrive ? "<p><a href='" + d.lienDossierDrive + "' style='color:#1A237E'>Accéder au dossier Drive</a></p>" : "",

    "<p style='color:#999;font-size:12px;margin-top:24px'>",
    "Message automatique — Système LEXPAT AML/KYC. Ne pas répondre à cet email.</p>",
    "</div>"
  ].join("\n");
}


/**
 * Génère une ligne de tableau HTML pour l'email.
 */
function _ligneEmail(label, valeur) {
  return "<tr>" +
    "<td style='padding:6px 12px;border:1px solid #eee;background:#f5f5f5;width:40%;font-size:13px;color:#555'>" + label + "</td>" +
    "<td style='padding:6px 12px;border:1px solid #eee;font-size:13px'>" + (valeur || "—") + "</td>" +
    "</tr>";
}
