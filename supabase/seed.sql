-- Comptes de démonstration
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'claire@qg-ia.fr',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Claire Martin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'samir@qg-ia.fr',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Samir Benali"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000099',
    'authenticated',
    'authenticated',
    'admin@qg-ia.fr',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Équipe QG"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '{"sub":"10000000-0000-0000-0000-000000000001","email":"claire@qg-ia.fr"}', 'email', 'claire@qg-ia.fr', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '{"sub":"10000000-0000-0000-0000-000000000002","email":"samir@qg-ia.fr"}', 'email', 'samir@qg-ia.fr', now(), now()),
  ('20000000-0000-0000-0000-000000000099', '10000000-0000-0000-0000-000000000099', '{"sub":"10000000-0000-0000-0000-000000000099","email":"admin@qg-ia.fr"}', 'email', 'admin@qg-ia.fr', now(), now())
on conflict (id) do nothing;

update public.profiles
set role = 'admin'
where id = '10000000-0000-0000-0000-000000000099';

update public.profiles
set bio = 'Créatrice d’outils IA orientés opérations et professions réglementées.',
    username = 'clairemartin'
where id = '10000000-0000-0000-0000-000000000001';

update public.profiles
set bio = 'Builder no-code et automatisations pour PME, studios et communautés.',
    username = 'samirbenali'
where id = '10000000-0000-0000-0000-000000000002';

insert into public.projects (
  id, user_id, title, slug, short_description, long_description, external_url, category, profession,
  project_status, stage, pricing_model, price_label, qg_special_offer, qg_special_offer_details, beta_available,
  methodology, problem_solved, target_audience, creator_feedback, thumbnail_url, is_featured, moderation_status,
  published_at, created_at, updated_at
)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'JuriPilot', 'juripilot', 'Assistant IA pour préqualifier des dossiers et standardiser les réponses clients.', 'JuriPilot structure les demandes entrantes, produit un premier cadrage et aide les cabinets à maintenir un niveau de réponse homogène sans allonger les délais.', 'https://example.com/juripilot', 'applications', 'juridique', 'lancé', 'bêta', 'abonnement', 'À partir de 39 €/mois', true, '2 mois offerts aux membres QG.', true, 'Conception des flux dans Cursor, prompts de qualification sur ChatGPT et orchestration Make pour les notifications et la relance.', 'Réduire le temps perdu sur les dossiers mal qualifiés et homogénéiser le premier niveau de réponse.', 'Cabinets, juristes indépendants et équipes conformité.', 'Le vrai enjeu a été de rendre les étapes rassurantes pour des utilisateurs non techniques.', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80', true, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'EduCapsule', 'educapsule', 'Création de capsules pédagogiques prêtes à diffuser avec trames, quiz et synthèses.', 'EduCapsule aide les formateurs à produire plus vite des séquences courtes et cohérentes, en combinant IA éditoriale et automatisation de publication.', 'https://example.com/educapsule', 'sites web', 'éducation', 'lancé', 'production', 'freemium', 'Version gratuite + plan Pro', false, null, false, 'Construction des scénarios avec Claude, enrichissement via ChatGPT et automatisation des exports pédagogiques.', 'Réduire le temps de création de contenu pédagogique structuré.', 'Formateurs indépendants, organismes et infopreneurs.', 'Le format capsule a très bien marché une fois les gabarits simplifiés.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', true, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Studio Persona', 'studio-persona', 'Générateur de personas et d’angles créatifs pour équipes branding et UX.', 'Studio Persona combine recherche synthétique, formulation d’hypothèses et variations créatives pour accélérer les premières phases de cadrage d’un produit ou d’une identité.', 'https://example.com/studio-persona', 'outils', 'design', 'en cours', 'MVP', 'payant', 'Pack mission', false, null, false, 'Prompts de recherche sur Claude, enrichissements visuels dans Midjourney et consolidation des livrables dans Notion.', 'Éviter les cadrages de départ trop faibles ou trop génériques.', 'Studios, freelances branding, UX designers.', 'Les utilisateurs achètent surtout le gain de clarté sur l’angle créatif.', 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Ops Radar', 'ops-radar', 'Dashboard IA de suivi d’opérations, alertes et synthèses hebdomadaires.', 'Ops Radar centralise les points de blocage, remonte les signaux faibles et met en forme une lecture managériale sobre et utile chaque semaine.', 'https://example.com/ops-radar', 'dashboards', 'productivité', 'lancé', 'bêta', 'abonnement', 'À partir de 49 €/mois', false, null, true, 'Architecture no-code avec n8n, interface sobre, et enrichissement des synthèses par Claude.', 'Faciliter le pilotage d’équipes avec moins de reporting manuel.', 'Opérations, COO, équipes projets.', 'Le produit plaît quand les alertes restent peu nombreuses mais bien priorisées.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Talent Match IA', 'talent-match-ia', 'Plateforme de matching entre profils freelances et besoins opérationnels.', 'Le produit agrège des briefs, extrait les signaux clés et aide à formuler un matching plus cohérent entre besoin, timing et expertise réelle.', 'https://example.com/talent-match-ia', 'marketplaces', 'RH', 'lancé', 'MVP', 'abonnement', 'Sur devis', false, null, false, 'Bubble pour la structure, ChatGPT pour l’interprétation des briefs, Make pour la synchronisation.', 'Mieux orienter les demandes entrantes et limiter les mises en relation hors sujet.', 'Agences, collectifs, recruteurs freelances.', 'Le matching assisté rassure surtout quand il reste explicable.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Immo Brief', 'immo-brief', 'Agent conversationnel qui prépare des synthèses de biens et des réponses acquéreurs.', 'Immo Brief structure la matière commerciale, reformule les points clés et aide les agents à rester rapides sans être génériques.', 'https://example.com/immo-brief', 'agents IA', 'immobilier', 'en cours', 'bêta', 'freemium', 'Freemium', true, 'Audit de setup offert.', true, 'Prototypage dans Replit, agent orienté réponse commerciale et workflows n8n pour les relances.', 'Réduire les délais de réponse tout en conservant un niveau de personnalisation crédible.', 'Agents immobiliers indépendants et réseaux.', 'Les réponses pré-rédigées sont utiles si elles restent révisables en un clic.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'CareFlow Notes', 'careflow-notes', 'Automatisation de comptes rendus et relances administratives à partir d’entretiens.', 'Le produit assiste les équipes dans la rédaction de notes, relances et synthèses sans prétendre remplacer la validation humaine.', 'https://example.com/careflow-notes', 'automatisations', 'santé', 'en cours', 'MVP', 'payant', 'Projet pilote', false, null, false, 'ChatGPT pour les brouillons, Make pour les notifications et cadrage strict des champs sensibles.', 'Gagner du temps sur l’administratif et sécuriser les relances.', 'Structures de santé et accompagnement.', 'La conformité a imposé une approche très prudente et progressive.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'NoCode Sprint', 'nocode-sprint', 'Kit d’accélération pour transformer une idée métier en MVP no-code testable.', 'NoCode Sprint combine ateliers de cadrage, trames IA et stack no-code pour réduire le temps entre intuition métier et test terrain.', 'https://example.com/nocode-sprint', 'produits no-code', 'autre', 'lancé', 'production', 'payant', 'Accompagnement dès 790 €', false, null, false, 'Lovable pour l’itération rapide, Bubble pour les cas plus complexes et ChatGPT pour la structuration.', 'Réduire les délais de passage de l’idée au test.', 'Solopreneurs, PME et builders en reconversion.', 'Le cadrage initial fait gagner autant que l’outil lui-même.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', 'Freelance Scope', 'freelance-scope', 'Outil de cadrage d’offres et de livrables pour freelances IA et consultants.', 'Freelance Scope aide à transformer un besoin flou en proposition plus nette, plus vendable et moins risquée à délivrer.', 'https://example.com/freelance-scope', 'outils', 'marketing', 'lancé', 'production', 'abonnement', '19 €/mois', false, null, false, 'Cursor pour le produit, prompts ChatGPT pour les angles de vente et base de gabarits Notion.', 'Améliorer la qualité des propositions commerciales et réduire les malentendus en mission.', 'Freelances, consultants et studios.', 'Le gain perçu vient de la clarté commerciale plus que de la technologie.', 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', 'QG Market Signals', 'qg-market-signals', 'Veille enrichie par IA pour suivre niches, signaux faibles et angles de positionnement.', 'QG Market Signals condense de nombreuses sources en synthèses lisibles et exploitables pour les membres qui veulent se positionner plus vite sur une opportunité.', 'https://example.com/qg-market-signals', 'dashboards', 'marketing', 'lancé', 'production', 'abonnement', '29 €/mois', true, 'Accès premium QG au plan annuel.', false, 'Sources collectées par automatisations, tri sémantique et restitution éditoriale sobre.', 'Aider les membres à repérer plus tôt les sujets prometteurs sans passer des heures en veille.', 'Freelances, studios, builders et formateurs.', 'La valeur est dans le tri et la hiérarchie, pas seulement dans la collecte.', 'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1200&q=80', true, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'BackOffice Pulse', 'backoffice-pulse', 'Centre d’opérations interne pour suivre tâches, incidents et arbitrages d’équipe.', 'BackOffice Pulse rassemble les points opérationnels importants et aide les équipes à garder une vision partagée sans multiplier les statuts manuels.', 'https://example.com/backoffice-pulse', 'automatisations', 'productivité', 'en cours', 'MVP', 'abonnement', 'Sur devis', false, null, false, 'Cursor pour l’implémentation, n8n pour les flux et ChatGPT pour les résumés internes.', 'Réduire la friction de coordination dans les petites équipes.', 'COO, office managers et petites équipes de production.', 'Ce produit fonctionne surtout quand il reste simple et peu intrusif.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now()),
  ('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'Cercle Communauté', 'cercle-communaute', 'Produit communautaire pour centraliser ressources, projets et entraide entre membres.', 'Cercle Communauté structure les échanges et rend les ressources plus durables, en donnant une place claire aux projets publiés et aux demandes d’entraide.', 'https://example.com/cercle-communaute', 'applications', 'autre', 'lancé', 'bêta', 'gratuit', 'Accès gratuit', false, null, true, 'Bubble pour le socle, ChatGPT pour les aides contextuelles et Make pour les synchronisations.', 'Éviter que les échanges et ressources utiles se perdent dans les discussions.', 'Communautés privées, collectifs et réseaux d’experts.', 'La structure éditoriale compte autant que la partie technique.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80', false, 'approved', now(), now(), now())
on conflict (id) do nothing;

insert into public.project_tools (project_id, tool_name)
values
  ('30000000-0000-0000-0000-000000000001', 'ChatGPT'),
  ('30000000-0000-0000-0000-000000000001', 'Make'),
  ('30000000-0000-0000-0000-000000000001', 'Cursor'),
  ('30000000-0000-0000-0000-000000000002', 'Claude'),
  ('30000000-0000-0000-0000-000000000002', 'ChatGPT'),
  ('30000000-0000-0000-0000-000000000003', 'Claude'),
  ('30000000-0000-0000-0000-000000000003', 'Midjourney'),
  ('30000000-0000-0000-0000-000000000004', 'Claude'),
  ('30000000-0000-0000-0000-000000000004', 'n8n'),
  ('30000000-0000-0000-0000-000000000005', 'Bubble'),
  ('30000000-0000-0000-0000-000000000005', 'Make'),
  ('30000000-0000-0000-0000-000000000006', 'Replit'),
  ('30000000-0000-0000-0000-000000000006', 'n8n'),
  ('30000000-0000-0000-0000-000000000007', 'ChatGPT'),
  ('30000000-0000-0000-0000-000000000007', 'Make'),
  ('30000000-0000-0000-0000-000000000008', 'Lovable'),
  ('30000000-0000-0000-0000-000000000008', 'Bubble'),
  ('30000000-0000-0000-0000-000000000009', 'Cursor'),
  ('30000000-0000-0000-0000-000000000009', 'ChatGPT'),
  ('30000000-0000-0000-0000-000000000010', 'Claude'),
  ('30000000-0000-0000-0000-000000000010', 'Make'),
  ('30000000-0000-0000-0000-000000000011', 'Cursor'),
  ('30000000-0000-0000-0000-000000000011', 'n8n'),
  ('30000000-0000-0000-0000-000000000012', 'Bubble'),
  ('30000000-0000-0000-0000-000000000012', 'ChatGPT')
on conflict do nothing;

insert into public.project_tags (project_id, tag)
values
  ('30000000-0000-0000-0000-000000000001', 'cabinet'),
  ('30000000-0000-0000-0000-000000000001', 'workflow'),
  ('30000000-0000-0000-0000-000000000002', 'formation'),
  ('30000000-0000-0000-0000-000000000003', 'branding'),
  ('30000000-0000-0000-0000-000000000004', 'pilotage'),
  ('30000000-0000-0000-0000-000000000005', 'matching'),
  ('30000000-0000-0000-0000-000000000006', 'agent'),
  ('30000000-0000-0000-0000-000000000007', 'back-office'),
  ('30000000-0000-0000-0000-000000000008', 'MVP'),
  ('30000000-0000-0000-0000-000000000009', 'vente'),
  ('30000000-0000-0000-0000-000000000010', 'veille'),
  ('30000000-0000-0000-0000-000000000011', 'ops'),
  ('30000000-0000-0000-0000-000000000012', 'communauté')
on conflict do nothing;

insert into public.project_likes (project_id, user_id)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002')
on conflict do nothing;

insert into public.beta_requests (project_id, requester_id, message)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Je peux tester le flux côté cabinet et faire un retour détaillé sous 48h.'),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Intéressée pour un angle immobilier haut de gamme avec scripts de réponse.')
on conflict do nothing;

insert into public.comments (project_id, user_id, body)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Positionnement clair et cas d’usage crédible. Une courte démo vidéo renforcerait encore la fiche.'),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'La promesse de veille est bien formulée. J’aimerais voir un exemple de synthèse hebdomadaire.')
on conflict do nothing;
