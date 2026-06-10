/*
 * Cockpit de pilotage projet SI — Widget Grist
 * Copyright 2026 Saïd Hamadou (isaytoo) — Apache License 2.0
 */

// =============================================================================
// TABLES
// =============================================================================
var T = {
  REQ: 'SIPI_Requirements',
  PHASE: 'SIPI_Phases',
  RISK: 'SIPI_Risks',
  RACI: 'SIPI_RACI',
  INST: 'SIPI_Instances',
  DEC: 'SIPI_Decisions',
  DQ: 'SIPI_DataQuality',
  DROLE: 'SIPI_DataRoles',
  DANO: 'SIPI_DataAnomalies',
  TRAIN: 'SIPI_Training',
  PROC: 'SIPI_Processes'
};

// =============================================================================
// I18N
// =============================================================================
var currentLang = 'fr';
var I18N = {
  fr: {
    appTitle: 'Cockpit de pilotage projet SI', appSubtitle: 'Pilotage exigences, risques, données, gouvernance, formation',
    tabDashboard: 'Tableau de bord', tabRequirements: 'Exigences', tabRoadmap: 'Feuille de route', tabRisks: 'Risques',
    tabGovernance: 'RACI & Gouvernance', tabData: 'Qualité données', tabTraining: 'Formation', tabProcesses: 'Processus',
    add: 'Ajouter', edit: 'Modifier', del: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler', close: 'Fermer',
    confirmDelete: 'Confirmer la suppression ?', saved: 'Enregistré ✓', deleted: 'Supprimé ✓', exportPdf: 'Export PDF', exportExcel: 'Export Excel',
    comingSoon: 'Module en cours de développement', noData: 'Aucune donnée pour le moment',
    // dashboard
    dashTitle: 'Synthèse de pilotage', kpiReqMust: 'Exigences « Must » restantes', kpiRisksCritical: 'Risques critiques',
    kpiDataScore: 'Score qualité données', kpiTrained: 'Agents formés', kpiReqTotal: 'Exigences', kpiPhases: 'Phases en cours', kpiDecisionsOpen: 'Décisions en attente',
    // requirements
    reqTitle: 'Exigences fonctionnelles', reqNew: 'Nouvelle exigence', reqCode: 'Code', reqLabel: 'Intitulé',
    reqDomain: 'Domaine', reqPriority: 'Priorité (MoSCoW)', reqRule: 'Règle métier', reqStatus: 'Statut', reqOwner: 'Responsable',
    viewBoard: 'Vue MoSCoW', viewTable: 'Vue tableau'
  },
  en: {
    appTitle: 'IT Project Cockpit', appSubtitle: 'Requirements, risks, data, governance, training',
    tabDashboard: 'Dashboard', tabRequirements: 'Requirements', tabRoadmap: 'Roadmap', tabRisks: 'Risks',
    tabGovernance: 'RACI & Governance', tabData: 'Data quality', tabTraining: 'Training', tabProcesses: 'Processes',
    add: 'Add', edit: 'Edit', del: 'Delete', save: 'Save', cancel: 'Cancel', close: 'Close',
    confirmDelete: 'Confirm deletion?', saved: 'Saved ✓', deleted: 'Deleted ✓', exportPdf: 'Export PDF', exportExcel: 'Export Excel',
    comingSoon: 'Module under development', noData: 'No data yet',
    dashTitle: 'Steering summary', kpiReqMust: 'Remaining "Must" requirements', kpiRisksCritical: 'Critical risks',
    kpiDataScore: 'Data quality score', kpiTrained: 'Trained agents', kpiReqTotal: 'Requirements', kpiPhases: 'Phases in progress', kpiDecisionsOpen: 'Pending decisions',
    reqTitle: 'Functional requirements', reqNew: 'New requirement', reqCode: 'Code', reqLabel: 'Title',
    reqDomain: 'Domain', reqPriority: 'Priority (MoSCoW)', reqRule: 'Business rule', reqStatus: 'Status', reqOwner: 'Owner',
    viewBoard: 'MoSCoW view', viewTable: 'Table view'
  }
};
function t(k) { return (I18N[currentLang] && I18N[currentLang][k]) || (I18N.fr[k]) || k; }
function setLang(l) {
  currentLang = l;
  document.getElementById('lang-fr').classList.toggle('active', l === 'fr');
  document.getElementById('lang-en').classList.toggle('active', l === 'en');
  applyI18n();
  renderCurrentTab();
}
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) { el.textContent = t(el.getAttribute('data-i18n')); });
}

// =============================================================================
// DATA
// =============================================================================
var data = { req: [], phase: [], risk: [], raci: [], inst: [], dec: [], dq: [], drole: [], dano: [], train: [], proc: [] };
var canEdit = false;

function sanitize(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showToast(msg, type) {
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type || 'info');
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

// Modale : fermeture uniquement via la croix/Annuler (jamais au clic extérieur)
function openModal(title, bodyHtml, footerHtml) {
  var html = '<div class="modal-overlay"><div class="modal" onclick="event.stopPropagation()">';
  html += '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close" onclick="closeModalForce()">✕</button></div>';
  html += '<div class="modal-body">' + bodyHtml + '</div>';
  html += '<div class="modal-footer">' + (footerHtml || '') + '</div>';
  html += '</div></div>';
  document.getElementById('modal-container').innerHTML = html;
}
function closeModalForce() { document.getElementById('modal-container').innerHTML = ''; }

// CRUD génériques
async function saveRow(table, id, rec) {
  try {
    if (id) await grist.docApi.applyUserActions([['UpdateRecord', table, id, rec]]);
    else await grist.docApi.applyUserActions([['AddRecord', table, null, rec]]);
    showToast(t('saved'), 'success'); closeModalForce(); await loadAll();
  } catch (e) { showToast('Erreur: ' + e.message, 'error'); }
}
async function deleteRow(table, id) {
  if (!confirm(t('confirmDelete'))) return;
  try { await grist.docApi.applyUserActions([['RemoveRecord', table, id]]); showToast(t('deleted'), 'success'); closeModalForce(); await loadAll(); }
  catch (e) { showToast('Erreur: ' + e.message, 'error'); }
}

function fromEpoch(s) { if (!s) return ''; return new Date(s * 1000).toISOString().split('T')[0]; }
function toEpoch(str) { if (!str) return null; var d = new Date(str + 'T00:00:00'); return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000); }
function formatDate(s) { if (!s) return ''; var d = new Date(s * 1000); return d.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }); }

// =============================================================================
// GRIST INIT + TABLES
// =============================================================================
function isInsideGrist() { try { return window.self !== window.top; } catch (e) { return true; } }

async function ensureTables() {
  var existing = await grist.docApi.listTables();
  var defs = [
    [T.REQ, [
      { id: 'Code', type: 'Text' }, { id: 'Title', type: 'Text' },
      { id: 'Domain', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['Référentiel', 'GMAO', 'Pilotage', 'Usagers', 'SIG'] }) },
      { id: 'Priority', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['must', 'should', 'could', 'wont'] }) },
      { id: 'Rule', type: 'Text' },
      { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['à spécifier', 'validée', 'paramétrée', 'recettée'] }) },
      { id: 'Owner', type: 'Text' }, { id: 'Notes', type: 'Text' }
    ]],
    [T.PHASE, [
      { id: 'Name', type: 'Text' }, { id: 'Phase_Num', type: 'Int' }, { id: 'Start_Date', type: 'Date' }, { id: 'End_Date', type: 'Date' },
      { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['à venir', 'en cours', 'terminée'] }) },
      { id: 'Deliverable', type: 'Text' }, { id: 'Wave', type: 'Text' }
    ]],
    [T.RISK, [
      { id: 'Title', type: 'Text' }, { id: 'Probability', type: 'Int' }, { id: 'Impact', type: 'Int' },
      { id: 'Mitigation', type: 'Text' }, { id: 'Owner', type: 'Text' },
      { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['ouvert', 'maîtrisé', 'clos'] }) }
    ]],
    [T.RACI, [{ id: 'Activity', type: 'Text' }, { id: 'R', type: 'Text' }, { id: 'A', type: 'Text' }, { id: 'C', type: 'Text' }, { id: 'I', type: 'Text' }, { id: 'Order', type: 'Int' }]],
    [T.INST, [{ id: 'Name', type: 'Text' }, { id: 'Composition', type: 'Text' }, { id: 'Frequency', type: 'Text' }, { id: 'Next_Date', type: 'Date' }, { id: 'Role', type: 'Text' }]],
    [T.DEC, [{ id: 'Date', type: 'Date' }, { id: 'Instance', type: 'Text' }, { id: 'Decision', type: 'Text' }, { id: 'Action', type: 'Text' }, { id: 'Responsible', type: 'Text' }, { id: 'Due_Date', type: 'Date' }, { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['ouverte', 'en cours', 'close'] }) }]],
    [T.DQ, [{ id: 'Perimeter', type: 'Text' }, { id: 'Completeness', type: 'Numeric' }, { id: 'Accuracy', type: 'Numeric' }, { id: 'Consistency', type: 'Numeric' }, { id: 'Freshness', type: 'Numeric' }, { id: 'Traceability', type: 'Numeric' }, { id: 'Updated_At', type: 'Date' }]],
    [T.DROLE, [{ id: 'Role', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['Data Owner', 'Data Steward', 'Data Producer', 'Data Manager', 'Data Architect'] }) }, { id: 'Person', type: 'Text' }, { id: 'Perimeter', type: 'Text' }]],
    [T.DANO, [{ id: 'Description', type: 'Text' }, { id: 'Perimeter', type: 'Text' }, { id: 'Dimension', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['Complétude', 'Exactitude', 'Cohérence', 'Actualité', 'Traçabilité'] }) }, { id: 'Severity', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['faible', 'moyenne', 'forte'] }) }, { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['ouverte', 'corrigée'] }) }, { id: 'Detected_At', type: 'Date' }]],
    [T.TRAIN, [{ id: 'Session', type: 'Text' }, { id: 'Profile', type: 'Text' }, { id: 'Wave', type: 'Text' }, { id: 'Date', type: 'Date' }, { id: 'Duration', type: 'Text' }, { id: 'Trainer', type: 'Text' }, { id: 'Capacity', type: 'Int' }, { id: 'Attendees', type: 'Int' }, { id: 'Status', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['planifiée', 'réalisée', 'annulée'] }) }]],
    [T.PROC, [{ id: 'Name', type: 'Text' }, { id: 'Context', type: 'Text' }, { id: 'AsIs', type: 'Text' }, { id: 'ToBe', type: 'Text' }, { id: 'PainPoints', type: 'Text' }, { id: 'Gains', type: 'Text' }, { id: 'ConfigRequired', type: 'Text' }, { id: 'IntegrationStatus', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['à analyser', 'en cours', 'intégré'] }) }]]
  ];
  for (var i = 0; i < defs.length; i++) {
    if (existing.indexOf(defs[i][0]) === -1) {
      try { await grist.docApi.applyUserActions([['AddTable', defs[i][0], defs[i][1]]]); }
      catch (e) { console.warn('AddTable ' + defs[i][0], e.message); }
    }
  }
}

async function fetchAll(table) {
  try {
    var d = await grist.docApi.fetchTable(table);
    if (!d || !d.id) return [];
    var cols = Object.keys(d).filter(function(k) { return k !== 'id'; });
    var rows = [];
    for (var i = 0; i < d.id.length; i++) {
      var r = { id: d.id[i] };
      cols.forEach(function(c) { r[c] = d[c][i]; });
      rows.push(r);
    }
    return rows;
  } catch (e) { return []; }
}

async function loadAll() {
  data.req = await fetchAll(T.REQ);
  data.phase = await fetchAll(T.PHASE);
  data.risk = await fetchAll(T.RISK);
  data.raci = await fetchAll(T.RACI);
  data.inst = await fetchAll(T.INST);
  data.dec = await fetchAll(T.DEC);
  data.dq = await fetchAll(T.DQ);
  data.drole = await fetchAll(T.DROLE);
  data.dano = await fetchAll(T.DANO);
  data.train = await fetchAll(T.TRAIN);
  data.proc = await fetchAll(T.PROC);
  renderCurrentTab();
}

// =============================================================================
// NAVIGATION
// =============================================================================
var currentTab = 'dashboard';
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-tab') === tab); });
  document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.toggle('active', c.id === 'tab-' + tab); });
  renderCurrentTab();
}
function renderCurrentTab() {
  var r = { dashboard: renderDashboard, requirements: renderRequirements, roadmap: renderRoadmap, risks: renderRisks,
    governance: renderGovernance, data: renderData, training: renderTraining, processes: renderProcesses };
  if (r[currentTab]) r[currentTab]();
}
function placeholder(viewId, icon, label) {
  document.getElementById(viewId).innerHTML = '<div class="section-card"><div class="empty-hint"><div style="font-size:42px;">' + icon + '</div><h3 style="color:#475569;margin:8px 0;">' + label + '</h3><p>' + t('comingSoon') + '</p></div></div>';
}

// =============================================================================
// DASHBOARD
// =============================================================================
function renderDashboard() {
  var mustLeft = data.req.filter(function(r) { return r.Priority === 'must' && r.Status !== 'recettée'; }).length;
  var risksCrit = data.risk.filter(function(r) { return (r.Probability || 0) * (r.Impact || 0) >= 6 && r.Status !== 'clos'; }).length;
  var dataScore = computeGlobalDataScore();
  var trainedPct = computeTrainedPct();
  var phasesInProgress = data.phase.filter(function(p) { return p.Status === 'en cours'; }).length;
  var decOpen = data.dec.filter(function(d) { return d.Status !== 'close'; }).length;

  var html = '<div class="section-card"><div class="section-title">📊 ' + t('dashTitle') + '</div>';
  html += '<div class="kpi-grid">';
  html += kpi(data.req.length, t('kpiReqTotal'), '');
  html += kpi(mustLeft, t('kpiReqMust'), mustLeft > 0 ? 'warn' : 'ok');
  html += kpi(risksCrit, t('kpiRisksCritical'), risksCrit > 0 ? 'danger' : 'ok');
  html += kpi(dataScore + '%', t('kpiDataScore'), dataScore >= 80 ? 'ok' : (dataScore >= 50 ? 'warn' : 'danger'));
  html += kpi(trainedPct + '%', t('kpiTrained'), trainedPct >= 80 ? 'ok' : 'warn');
  html += kpi(phasesInProgress, t('kpiPhases'), '');
  html += kpi(decOpen, t('kpiDecisionsOpen'), decOpen > 0 ? 'warn' : 'ok');
  html += '</div></div>';

  // Prochaines instances
  var upcoming = data.inst.filter(function(i) { return i.Next_Date; }).sort(function(a, b) { return a.Next_Date - b.Next_Date; }).slice(0, 5);
  if (upcoming.length) {
    html += '<div class="section-card"><div class="section-title">📅 ' + (currentLang === 'fr' ? 'Prochaines instances' : 'Upcoming meetings') + '</div><table class="data-table"><thead><tr><th>' + (currentLang === 'fr' ? 'Instance' : 'Meeting') + '</th><th>' + (currentLang === 'fr' ? 'Date' : 'Date') + '</th><th>' + (currentLang === 'fr' ? 'Fréquence' : 'Frequency') + '</th></tr></thead><tbody>';
    upcoming.forEach(function(i) { html += '<tr><td><strong>' + sanitize(i.Name) + '</strong></td><td>' + formatDate(i.Next_Date) + '</td><td>' + sanitize(i.Frequency || '') + '</td></tr>'; });
    html += '</tbody></table></div>';
  }

  // Risques critiques
  var crit = data.risk.filter(function(r) { return (r.Probability || 0) * (r.Impact || 0) >= 6 && r.Status !== 'clos'; });
  if (crit.length) {
    html += '<div class="section-card"><div class="section-title">⚠️ ' + t('kpiRisksCritical') + '</div><table class="data-table"><thead><tr><th>' + (currentLang === 'fr' ? 'Risque' : 'Risk') + '</th><th>Score</th><th>' + (currentLang === 'fr' ? 'Mitigation' : 'Mitigation') + '</th></tr></thead><tbody>';
    crit.forEach(function(r) { html += '<tr><td><strong>' + sanitize(r.Title) + '</strong></td><td><span class="badge badge-must">' + ((r.Probability || 0) * (r.Impact || 0)) + '</span></td><td>' + sanitize(r.Mitigation || '') + '</td></tr>'; });
    html += '</tbody></table></div>';
  }

  document.getElementById('view-dashboard').innerHTML = html;
}
function kpi(value, label, cls) {
  return '<div class="kpi-card ' + (cls || '') + '"><div class="kpi-value">' + value + '</div><div class="kpi-label">' + label + '</div></div>';
}
function computeGlobalDataScore() {
  if (!data.dq.length) return 0;
  var sum = 0, n = 0;
  data.dq.forEach(function(d) {
    ['Completeness', 'Accuracy', 'Consistency', 'Traceability'].forEach(function(k) {
      if (typeof d[k] === 'number') { sum += d[k]; n++; }
    });
  });
  return n ? Math.round(sum / n) : 0;
}
function computeTrainedPct() {
  var done = data.train.filter(function(s) { return s.Status === 'réalisée'; });
  if (!done.length) return 0;
  var cap = 0, att = 0;
  done.forEach(function(s) { cap += (s.Capacity || 0); att += (s.Attendees || 0); });
  return cap ? Math.round(att / cap * 100) : 0;
}

// =============================================================================
// REQUIREMENTS (MoSCoW)
// =============================================================================
var reqView = 'board';
var MOSCOW = [
  { key: 'must', label_fr: 'Must (indispensable)', label_en: 'Must have', cls: 'badge-must' },
  { key: 'should', label_fr: 'Should (important)', label_en: 'Should have', cls: 'badge-should' },
  { key: 'could', label_fr: 'Could (souhaitable)', label_en: 'Could have', cls: 'badge-could' },
  { key: 'wont', label_fr: "Won't (exclu)", label_en: "Won't have", cls: 'badge-wont' }
];
function moscowLabel(k) { var m = MOSCOW.find(function(x) { return x.key === k; }); return m ? (currentLang === 'fr' ? m.label_fr : m.label_en) : k; }
function moscowCls(k) { var m = MOSCOW.find(function(x) { return x.key === k; }); return m ? m.cls : 'badge-wont'; }

function renderRequirements() {
  var html = '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>📋 ' + t('reqTitle') + '</span>';
  html += '<span style="display:flex;gap:8px;">';
  html += '<button class="btn btn-secondary btn-sm" onclick="toggleReqView()">' + (reqView === 'board' ? t('viewTable') : t('viewBoard')) + '</button>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openReqModal()">+ ' + t('reqNew') + '</button>';
  html += '</span></div>';

  if (data.req.length === 0) {
    html += '<div class="empty-hint">' + t('noData') + '</div></div>';
    document.getElementById('view-requirements').innerHTML = html;
    return;
  }

  if (reqView === 'board') {
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">';
    MOSCOW.forEach(function(m) {
      var items = data.req.filter(function(r) { return r.Priority === m.key; });
      html += '<div style="background:#f8fafc;border-radius:10px;padding:10px;">';
      html += '<div style="font-weight:800;margin-bottom:8px;"><span class="badge ' + m.cls + '">' + moscowLabel(m.key) + '</span> <span style="color:#94a3b8;">' + items.length + '</span></div>';
      items.forEach(function(r) {
        html += '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;margin-bottom:6px;cursor:' + (canEdit ? 'pointer' : 'default') + ';"' + (canEdit ? ' onclick="openReqModal(' + r.id + ')"' : '') + '>';
        html += '<div style="font-size:10px;color:#94a3b8;">' + sanitize(r.Code || '') + ' · ' + sanitize(r.Domain || '') + '</div>';
        html += '<div style="font-weight:700;font-size:12px;">' + sanitize(r.Title || '') + '</div>';
        html += '<div style="font-size:10px;color:#64748b;margin-top:3px;">' + sanitize(r.Status || '') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
  } else {
    html += '<table class="data-table"><thead><tr><th>' + t('reqCode') + '</th><th>' + t('reqLabel') + '</th><th>' + t('reqDomain') + '</th><th>' + t('reqPriority') + '</th><th>' + t('reqStatus') + '</th><th>' + t('reqOwner') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.req.forEach(function(r) {
      html += '<tr>';
      html += '<td>' + sanitize(r.Code || '') + '</td><td><strong>' + sanitize(r.Title || '') + '</strong>' + (r.Rule ? '<div style="font-size:11px;color:#94a3b8;">' + sanitize(r.Rule) + '</div>' : '') + '</td>';
      html += '<td>' + sanitize(r.Domain || '') + '</td><td><span class="badge ' + moscowCls(r.Priority) + '">' + moscowLabel(r.Priority) + '</span></td>';
      html += '<td>' + sanitize(r.Status || '') + '</td><td>' + sanitize(r.Owner || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openReqModal(' + r.id + ')">✏️</button><button class="btn-icon" onclick="deleteReq(' + r.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('view-requirements').innerHTML = html;
}
function toggleReqView() { reqView = reqView === 'board' ? 'table' : 'board'; renderRequirements(); }

function openReqModal(id) {
  if (!canEdit) return;
  var r = id ? data.req.find(function(x) { return x.id === id; }) : {};
  var domains = ['Référentiel', 'GMAO', 'Pilotage', 'Usagers', 'SIG'];
  var statuses = ['à spécifier', 'validée', 'paramétrée', 'recettée'];
  var b = '';
  b += '<div class="form-row"><div class="form-group"><label>' + t('reqCode') + '</label><input id="rq-code" value="' + sanitize(r.Code || '') + '"></div>';
  b += '<div class="form-group"><label>' + t('reqDomain') + '</label><select id="rq-domain">' + domains.map(function(d) { return '<option' + (r.Domain === d ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></div></div>';
  b += '<div class="form-group"><label>' + t('reqLabel') + '</label><input id="rq-title" value="' + sanitize(r.Title || '') + '"></div>';
  b += '<div class="form-group"><label>' + t('reqRule') + '</label><textarea id="rq-rule" rows="2">' + sanitize(r.Rule || '') + '</textarea></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + t('reqPriority') + '</label><select id="rq-prio">' + MOSCOW.map(function(m) { return '<option value="' + m.key + '"' + (r.Priority === m.key ? ' selected' : '') + '>' + moscowLabel(m.key) + '</option>'; }).join('') + '</select></div>';
  b += '<div class="form-group"><label>' + t('reqStatus') + '</label><select id="rq-status">' + statuses.map(function(s) { return '<option' + (r.Status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div></div>';
  b += '<div class="form-group"><label>' + t('reqOwner') + '</label><input id="rq-owner" value="' + sanitize(r.Owner || '') + '"></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteReq(' + id + ')">🗑️ ' + t('del') + '</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveReq(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal((id ? '✏️ ' : '✨ ') + t('reqNew'), b, f);
}
async function saveReq(id) {
  var rec = {
    Code: document.getElementById('rq-code').value.trim(),
    Title: document.getElementById('rq-title').value.trim(),
    Domain: document.getElementById('rq-domain').value,
    Rule: document.getElementById('rq-rule').value.trim(),
    Priority: document.getElementById('rq-prio').value,
    Status: document.getElementById('rq-status').value,
    Owner: document.getElementById('rq-owner').value.trim()
  };
  if (!rec.Title) { showToast(currentLang === 'fr' ? 'Intitulé requis' : 'Title required', 'error'); return; }
  try {
    if (id) await grist.docApi.applyUserActions([['UpdateRecord', T.REQ, id, rec]]);
    else await grist.docApi.applyUserActions([['AddRecord', T.REQ, null, rec]]);
    showToast(t('saved'), 'success');
    closeModalForce();
    await loadAll();
  } catch (e) { showToast('Erreur: ' + e.message, 'error'); }
}
async function deleteReq(id) {
  if (!confirm(t('confirmDelete'))) return;
  try { await grist.docApi.applyUserActions([['RemoveRecord', T.REQ, id]]); showToast(t('deleted'), 'success'); closeModalForce(); await loadAll(); }
  catch (e) { showToast('Erreur: ' + e.message, 'error'); }
}

// =============================================================================
// MODULES À VENIR (placeholders — implémentés dans les prochains incréments)
// =============================================================================
function phaseStatusColor(s) { return s === 'terminée' ? '#22c55e' : s === 'en cours' ? '#4f46e5' : '#94a3b8'; }
function renderRoadmap() {
  var phases = data.phase.slice().sort(function(a, b) { return (a.Phase_Num || 0) - (b.Phase_Num || 0) || (a.Start_Date || 0) - (b.Start_Date || 0); });
  var html = '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🗺️ ' + t('tabRoadmap') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openPhaseModal()">+ ' + (currentLang === 'fr' ? 'Nouvelle phase' : 'New phase') + '</button>';
  html += '</span></div>';
  if (!phases.length) { html += '<div class="empty-hint">' + t('noData') + '</div></div>'; document.getElementById('view-roadmap').innerHTML = html; return; }

  // Frise chronologique (barres proportionnelles)
  var allDates = [];
  phases.forEach(function(p) { if (p.Start_Date) allDates.push(p.Start_Date); if (p.End_Date) allDates.push(p.End_Date); });
  var minD = Math.min.apply(null, allDates), maxD = Math.max.apply(null, allDates), span = Math.max(1, maxD - minD);
  var now = Math.floor(Date.now() / 1000);
  html += '<div style="display:flex;flex-direction:column;gap:8px;">';
  phases.forEach(function(p) {
    var s = p.Start_Date || minD, e = p.End_Date || maxD;
    var left = Math.round((s - minD) / span * 100), width = Math.max(3, Math.round((e - s) / span * 100));
    html += '<div style="display:flex;align-items:center;gap:10px;' + (canEdit ? 'cursor:pointer;' : '') + '"' + (canEdit ? ' onclick="openPhaseModal(' + p.id + ')"' : '') + '>';
    html += '<div style="width:230px;flex-shrink:0;font-size:12px;"><strong>' + sanitize(p.Name) + '</strong>' + (p.Wave ? ' <span class="badge badge-could">' + sanitize(p.Wave) + '</span>' : '') + '<div style="font-size:10px;color:#94a3b8;">' + formatDate(p.Start_Date) + ' → ' + formatDate(p.End_Date) + '</div></div>';
    html += '<div style="flex:1;position:relative;height:26px;background:#f1f5f9;border-radius:6px;">';
    html += '<div style="position:absolute;left:' + left + '%;width:' + width + '%;height:100%;background:' + phaseStatusColor(p.Status) + ';border-radius:6px;display:flex;align-items:center;padding:0 8px;color:#fff;font-size:10px;font-weight:700;overflow:hidden;white-space:nowrap;">' + sanitize(p.Deliverable || p.Status || '') + '</div>';
    html += '</div></div>';
  });
  // ligne "aujourd'hui"
  if (now >= minD && now <= maxD) {
    var nowPct = Math.round((now - minD) / span * 100);
    html += '<div style="margin-left:240px;position:relative;height:0;"><div style="position:absolute;left:' + nowPct + '%;top:-' + (phases.length * 34) + 'px;height:' + (phases.length * 34) + 'px;border-left:2px dashed #ef4444;"></div></div>';
  }
  html += '</div></div>';
  document.getElementById('view-roadmap').innerHTML = html;
}
function openPhaseModal(id) {
  if (!canEdit) return;
  var p = id ? data.phase.find(function(x) { return x.id === id; }) : { Status: 'à venir' };
  var statuses = ['à venir', 'en cours', 'terminée'];
  var b = '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Nom de la phase' : 'Phase name') + '</label><input id="ph-name" value="' + sanitize(p.Name || '') + '"></div>';
  b += '<div class="form-group" style="max-width:90px;"><label>N°</label><input type="number" id="ph-num" value="' + (p.Phase_Num || '') + '"></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Début' : 'Start') + '</label><input type="date" id="ph-start" value="' + fromEpoch(p.Start_Date) + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Fin' : 'End') + '</label><input type="date" id="ph-end" value="' + fromEpoch(p.End_Date) + '"></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Statut' : 'Status') + '</label><select id="ph-status">' + statuses.map(function(s) { return '<option' + (p.Status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Vague' : 'Wave') + '</label><input id="ph-wave" value="' + sanitize(p.Wave || '') + '"></div></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Livrable' : 'Deliverable') + '</label><input id="ph-deliv" value="' + sanitize(p.Deliverable || '') + '"></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.PHASE + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="savePhase(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal((id ? '✏️ ' : '✨ ') + (currentLang === 'fr' ? 'Phase' : 'Phase'), b, f);
}
async function savePhase(id) {
  var rec = { Name: document.getElementById('ph-name').value.trim(), Phase_Num: parseInt(document.getElementById('ph-num').value) || null, Start_Date: toEpoch(document.getElementById('ph-start').value), End_Date: toEpoch(document.getElementById('ph-end').value), Status: document.getElementById('ph-status').value, Wave: document.getElementById('ph-wave').value.trim(), Deliverable: document.getElementById('ph-deliv').value.trim() };
  if (!rec.Name) { showToast(currentLang === 'fr' ? 'Nom requis' : 'Name required', 'error'); return; }
  await saveRow(T.PHASE, id, rec);
}
function pi3Label(v) { return v === 3 ? (currentLang === 'fr' ? 'Fort' : 'High') : v === 2 ? (currentLang === 'fr' ? 'Moyen' : 'Medium') : (currentLang === 'fr' ? 'Faible' : 'Low'); }
function riskScoreColor(s) { return s >= 6 ? '#ef4444' : s >= 3 ? '#f59e0b' : '#22c55e'; }
function renderRisks() {
  var html = '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>⚠️ ' + t('tabRisks') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openRiskModal()">+ ' + (currentLang === 'fr' ? 'Nouveau risque' : 'New risk') + '</button>';
  html += '</span></div>';

  // Matrice de criticité 3x3 (impact en lignes, probabilité en colonnes)
  html += '<div style="overflow-x:auto;"><table class="data-table" style="text-align:center;"><thead><tr><th style="background:#1e293b;">' + (currentLang === 'fr' ? 'Impact \\ Proba' : 'Impact \\ Prob') + '</th><th>' + pi3Label(1) + '</th><th>' + pi3Label(2) + '</th><th>' + pi3Label(3) + '</th></tr></thead><tbody>';
  [3, 2, 1].forEach(function(imp) {
    html += '<tr><td style="background:#312e81;color:#fff;font-weight:700;">' + pi3Label(imp) + '</td>';
    [1, 2, 3].forEach(function(prob) {
      var cell = data.risk.filter(function(r) { return r.Impact === imp && r.Probability === prob && r.Status !== 'clos'; });
      var sc = imp * prob;
      html += '<td style="background:' + riskScoreColor(sc) + '22;min-width:120px;height:64px;vertical-align:top;">';
      cell.forEach(function(r) { html += '<div style="background:' + riskScoreColor(sc) + ';color:#fff;border-radius:6px;padding:2px 6px;font-size:10px;margin:2px;cursor:' + (canEdit ? 'pointer' : 'default') + ';"' + (canEdit ? ' onclick="openRiskModal(' + r.id + ')"' : '') + '>' + sanitize(r.Title) + '</div>'; });
      html += '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Liste détaillée
  html += '<div class="section-card"><div class="section-title">📑 ' + (currentLang === 'fr' ? 'Registre des risques' : 'Risk register') + '</div>';
  if (!data.risk.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (currentLang === 'fr' ? 'Risque' : 'Risk') + '</th><th>' + (currentLang === 'fr' ? 'Proba' : 'Prob') + '</th><th>Impact</th><th>Score</th><th>' + (currentLang === 'fr' ? 'Mitigation' : 'Mitigation') + '</th><th>' + (currentLang === 'fr' ? 'Porteur' : 'Owner') + '</th><th>' + (currentLang === 'fr' ? 'Statut' : 'Status') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.risk.slice().sort(function(a, b) { return (b.Probability * b.Impact) - (a.Probability * a.Impact); }).forEach(function(r) {
      var sc = (r.Probability || 0) * (r.Impact || 0);
      html += '<tr><td><strong>' + sanitize(r.Title) + '</strong></td><td>' + pi3Label(r.Probability) + '</td><td>' + pi3Label(r.Impact) + '</td>';
      html += '<td><span class="badge" style="background:' + riskScoreColor(sc) + ';color:#fff;">' + sc + '</span></td>';
      html += '<td>' + sanitize(r.Mitigation || '') + '</td><td>' + sanitize(r.Owner || '') + '</td><td>' + sanitize(r.Status || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openRiskModal(' + r.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.RISK + '\',' + r.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('view-risks').innerHTML = html;
}
function openRiskModal(id) {
  if (!canEdit) return;
  var r = id ? data.risk.find(function(x) { return x.id === id; }) : { Probability: 2, Impact: 2, Status: 'ouvert' };
  var sel3 = function(idAttr, val) { return '<select id="' + idAttr + '">' + [1, 2, 3].map(function(v) { return '<option value="' + v + '"' + (val === v ? ' selected' : '') + '>' + pi3Label(v) + '</option>'; }).join('') + '</select>'; };
  var statuses = ['ouvert', 'maîtrisé', 'clos'];
  var b = '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Risque' : 'Risk') + '</label><input id="rk-title" value="' + sanitize(r.Title || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Probabilité' : 'Probability') + '</label>' + sel3('rk-prob', r.Probability || 2) + '</div>';
  b += '<div class="form-group"><label>Impact</label>' + sel3('rk-impact', r.Impact || 2) + '</div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Statut' : 'Status') + '</label><select id="rk-status">' + statuses.map(function(s) { return '<option' + (r.Status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Mitigation' : 'Mitigation') + '</label><textarea id="rk-mit" rows="2">' + sanitize(r.Mitigation || '') + '</textarea></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Porteur' : 'Owner') + '</label><input id="rk-owner" value="' + sanitize(r.Owner || '') + '"></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.RISK + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveRisk(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal((id ? '✏️ ' : '✨ ') + (currentLang === 'fr' ? 'Risque' : 'Risk'), b, f);
}
async function saveRisk(id) {
  var rec = { Title: document.getElementById('rk-title').value.trim(), Probability: parseInt(document.getElementById('rk-prob').value), Impact: parseInt(document.getElementById('rk-impact').value), Status: document.getElementById('rk-status').value, Mitigation: document.getElementById('rk-mit').value.trim(), Owner: document.getElementById('rk-owner').value.trim() };
  if (!rec.Title) { showToast(currentLang === 'fr' ? 'Titre requis' : 'Title required', 'error'); return; }
  await saveRow(T.RISK, id, rec);
}
function renderGovernance() {
  var L = currentLang === 'fr';
  var html = '';

  // --- RACI ---
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>📌 ' + (L ? 'Matrice RACI' : 'RACI matrix') + ' <span class="section-subtitle">R=Réalise · A=Autorité · C=Consulté · I=Informé</span></span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openRaciModal()">+ ' + (L ? 'Activité' : 'Activity') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.raci.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Activité' : 'Activity') + '</th><th>R</th><th>A</th><th>C</th><th>I</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.raci.slice().sort(function(a, b) { return (a.Order || 0) - (b.Order || 0); }).forEach(function(r) {
      html += '<tr><td><strong>' + sanitize(r.Activity || '') + '</strong></td><td>' + sanitize(r.R || '') + '</td><td>' + sanitize(r.A || '') + '</td><td>' + sanitize(r.C || '') + '</td><td>' + sanitize(r.I || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openRaciModal(' + r.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.RACI + '\',' + r.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  // --- Instances ---
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🏛️ ' + (L ? 'Instances de gouvernance' : 'Governance bodies') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openInstModal()">+ ' + (L ? 'Instance' : 'Body') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.inst.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Instance' : 'Body') + '</th><th>' + (L ? 'Composition' : 'Composition') + '</th><th>' + (L ? 'Fréquence' : 'Frequency') + '</th><th>' + (L ? 'Prochaine' : 'Next') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.inst.forEach(function(i) {
      html += '<tr><td><strong>' + sanitize(i.Name || '') + '</strong></td><td>' + sanitize(i.Composition || '') + '</td><td>' + sanitize(i.Frequency || '') + '</td><td>' + (i.Next_Date ? formatDate(i.Next_Date) : '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openInstModal(' + i.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.INST + '\',' + i.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  // --- Décisions / actions ---
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>✅ ' + (L ? 'Relevé de décisions & actions' : 'Decisions & actions log') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openDecModal()">+ ' + (L ? 'Décision' : 'Decision') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.dec.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Date' : 'Date') + '</th><th>' + (L ? 'Instance' : 'Body') + '</th><th>' + (L ? 'Décision / action' : 'Decision / action') + '</th><th>' + (L ? 'Responsable' : 'Owner') + '</th><th>' + (L ? 'Échéance' : 'Due') + '</th><th>' + (L ? 'Statut' : 'Status') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.dec.slice().sort(function(a, b) { return (b.Date || 0) - (a.Date || 0); }).forEach(function(d) {
      var overdue = d.Due_Date && d.Status !== 'close' && d.Due_Date < Math.floor(Date.now() / 1000);
      html += '<tr><td>' + (d.Date ? formatDate(d.Date) : '') + '</td><td>' + sanitize(d.Instance || '') + '</td>';
      html += '<td><strong>' + sanitize(d.Decision || '') + '</strong>' + (d.Action ? '<div style="font-size:11px;color:#64748b;">→ ' + sanitize(d.Action) + '</div>' : '') + '</td>';
      html += '<td>' + sanitize(d.Responsible || '') + '</td><td style="' + (overdue ? 'color:#ef4444;font-weight:700;' : '') + '">' + (d.Due_Date ? formatDate(d.Due_Date) + (overdue ? ' ⚠️' : '') : '') + '</td><td>' + sanitize(d.Status || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openDecModal(' + d.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.DEC + '\',' + d.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('view-governance').innerHTML = html;
}
function openRaciModal(id) {
  if (!canEdit) return;
  var r = id ? data.raci.find(function(x) { return x.id === id; }) : {};
  var b = '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Activité' : 'Activity') + '</label><input id="ra-act" value="' + sanitize(r.Activity || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>R (Réalise)</label><input id="ra-r" value="' + sanitize(r.R || '') + '"></div><div class="form-group"><label>A (Autorité)</label><input id="ra-a" value="' + sanitize(r.A || '') + '"></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>C (Consulté)</label><input id="ra-c" value="' + sanitize(r.C || '') + '"></div><div class="form-group"><label>I (Informé)</label><input id="ra-i" value="' + sanitize(r.I || '') + '"></div></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.RACI + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveRaci(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal('RACI', b, f);
}
async function saveRaci(id) {
  var rec = { Activity: document.getElementById('ra-act').value.trim(), R: document.getElementById('ra-r').value.trim(), A: document.getElementById('ra-a').value.trim(), C: document.getElementById('ra-c').value.trim(), I: document.getElementById('ra-i').value.trim() };
  if (!rec.Activity) { showToast(currentLang === 'fr' ? 'Activité requise' : 'Activity required', 'error'); return; }
  await saveRow(T.RACI, id, rec);
}
function openInstModal(id) {
  if (!canEdit) return;
  var i = id ? data.inst.find(function(x) { return x.id === id; }) : {};
  var b = '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Instance' : 'Body') + '</label><input id="in-name" value="' + sanitize(i.Name || '') + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Composition' : 'Composition') + '</label><input id="in-comp" value="' + sanitize(i.Composition || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Fréquence' : 'Frequency') + '</label><input id="in-freq" value="' + sanitize(i.Frequency || '') + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Prochaine date' : 'Next date') + '</label><input type="date" id="in-next" value="' + fromEpoch(i.Next_Date) + '"></div></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Rôle' : 'Role') + '</label><input id="in-role" value="' + sanitize(i.Role || '') + '"></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.INST + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveInst(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(currentLang === 'fr' ? 'Instance' : 'Body', b, f);
}
async function saveInst(id) {
  var rec = { Name: document.getElementById('in-name').value.trim(), Composition: document.getElementById('in-comp').value.trim(), Frequency: document.getElementById('in-freq').value.trim(), Next_Date: toEpoch(document.getElementById('in-next').value), Role: document.getElementById('in-role').value.trim() };
  if (!rec.Name) { showToast(currentLang === 'fr' ? 'Nom requis' : 'Name required', 'error'); return; }
  await saveRow(T.INST, id, rec);
}
function openDecModal(id) {
  if (!canEdit) return;
  var d = id ? data.dec.find(function(x) { return x.id === id; }) : { Status: 'ouverte', Date: Math.floor(Date.now() / 1000) };
  var statuses = ['ouverte', 'en cours', 'close'];
  var instOpts = '<option value=""></option>' + data.inst.map(function(i) { return '<option' + (d.Instance === i.Name ? ' selected' : '') + '>' + sanitize(i.Name) + '</option>'; }).join('');
  var b = '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Date' : 'Date') + '</label><input type="date" id="de-date" value="' + fromEpoch(d.Date) + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Instance' : 'Body') + '</label><select id="de-inst">' + instOpts + '</select></div></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Décision' : 'Decision') + '</label><textarea id="de-dec" rows="2">' + sanitize(d.Decision || '') + '</textarea></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Action associée' : 'Associated action') + '</label><input id="de-action" value="' + sanitize(d.Action || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Responsable' : 'Owner') + '</label><input id="de-resp" value="' + sanitize(d.Responsible || '') + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Échéance' : 'Due') + '</label><input type="date" id="de-due" value="' + fromEpoch(d.Due_Date) + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Statut' : 'Status') + '</label><select id="de-status">' + statuses.map(function(s) { return '<option' + (d.Status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.DEC + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveDec(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(currentLang === 'fr' ? 'Décision / action' : 'Decision / action', b, f);
}
async function saveDec(id) {
  var rec = { Date: toEpoch(document.getElementById('de-date').value), Instance: document.getElementById('de-inst').value, Decision: document.getElementById('de-dec').value.trim(), Action: document.getElementById('de-action').value.trim(), Responsible: document.getElementById('de-resp').value.trim(), Due_Date: toEpoch(document.getElementById('de-due').value), Status: document.getElementById('de-status').value };
  if (!rec.Decision) { showToast(currentLang === 'fr' ? 'Décision requise' : 'Decision required', 'error'); return; }
  await saveRow(T.DEC, id, rec);
}
function scoreColor(v) { return v >= 80 ? '#22c55e' : v >= 50 ? '#f59e0b' : '#ef4444'; }
function pctCell(v) { if (typeof v !== 'number') return '<td style="color:#cbd5e1;">—</td>'; return '<td><span class="badge" style="background:' + scoreColor(v) + '22;color:' + scoreColor(v) + ';">' + Math.round(v) + '%</span></td>'; }
function renderData() {
  var L = currentLang === 'fr';
  var html = '';
  // Scorecard qualité (5 dimensions)
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🧬 ' + (L ? 'Qualité des données par périmètre' : 'Data quality by scope') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openDqModal()">+ ' + (L ? 'Périmètre' : 'Scope') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.dq.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Périmètre' : 'Scope') + '</th><th>' + (L ? 'Complétude' : 'Completeness') + '</th><th>' + (L ? 'Exactitude' : 'Accuracy') + '</th><th>' + (L ? 'Cohérence' : 'Consistency') + '</th><th>' + (L ? 'Actualité (j)' : 'Freshness (d)') + '</th><th>' + (L ? 'Traçabilité' : 'Traceability') + '</th><th>' + (L ? 'MàJ' : 'Updated') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.dq.forEach(function(d) {
      html += '<tr><td><strong>' + sanitize(d.Perimeter || '') + '</strong></td>' + pctCell(d.Completeness) + pctCell(d.Accuracy) + pctCell(d.Consistency);
      html += '<td>' + (typeof d.Freshness === 'number' ? Math.round(d.Freshness) + ' j' : '—') + '</td>' + pctCell(d.Traceability);
      html += '<td>' + (d.Updated_At ? formatDate(d.Updated_At) : '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openDqModal(' + d.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.DQ + '\',' + d.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  // Rôles data
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>👤 ' + (L ? 'Rôles data' : 'Data roles') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openDroleModal()">+ ' + (L ? 'Rôle' : 'Role') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.drole.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Rôle' : 'Role') + '</th><th>' + (L ? 'Personne' : 'Person') + '</th><th>' + (L ? 'Périmètre' : 'Scope') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.drole.forEach(function(d) {
      html += '<tr><td><span class="badge badge-could">' + sanitize(d.Role || '') + '</span></td><td>' + sanitize(d.Person || '') + '</td><td>' + sanitize(d.Perimeter || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openDroleModal(' + d.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.DROLE + '\',' + d.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  // Anomalies
  html += '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🐞 ' + (L ? 'Anomalies de données' : 'Data anomalies') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openDanoModal()">+ ' + (L ? 'Anomalie' : 'Anomaly') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.dano.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Description' : 'Description') + '</th><th>' + (L ? 'Périmètre' : 'Scope') + '</th><th>' + (L ? 'Dimension' : 'Dimension') + '</th><th>' + (L ? 'Sévérité' : 'Severity') + '</th><th>' + (L ? 'Statut' : 'Status') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.dano.forEach(function(d) {
      var sevCls = d.Severity === 'forte' ? 'badge-must' : d.Severity === 'moyenne' ? 'badge-should' : 'badge-wont';
      html += '<tr><td><strong>' + sanitize(d.Description || '') + '</strong></td><td>' + sanitize(d.Perimeter || '') + '</td><td>' + sanitize(d.Dimension || '') + '</td><td><span class="badge ' + sevCls + '">' + sanitize(d.Severity || '') + '</span></td><td>' + sanitize(d.Status || '') + '</td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openDanoModal(' + d.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.DANO + '\',' + d.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('view-data').innerHTML = html;
}
function numInput(id, val) { return '<input type="number" min="0" max="100" id="' + id + '" value="' + (typeof val === 'number' ? val : '') + '">'; }
function openDqModal(id) {
  if (!canEdit) return;
  var d = id ? data.dq.find(function(x) { return x.id === id; }) : { Updated_At: Math.floor(Date.now() / 1000) };
  var L = currentLang === 'fr';
  var b = '<div class="form-group"><label>' + (L ? 'Périmètre (direction)' : 'Scope (department)') + '</label><input id="dq-per" value="' + sanitize(d.Perimeter || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Complétude %' : 'Completeness %') + '</label>' + numInput('dq-comp', d.Completeness) + '</div><div class="form-group"><label>' + (L ? 'Exactitude %' : 'Accuracy %') + '</label>' + numInput('dq-acc', d.Accuracy) + '</div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Cohérence %' : 'Consistency %') + '</label>' + numInput('dq-cons', d.Consistency) + '</div><div class="form-group"><label>' + (L ? 'Traçabilité %' : 'Traceability %') + '</label>' + numInput('dq-trac', d.Traceability) + '</div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Actualité (jours)' : 'Freshness (days)') + '</label><input type="number" min="0" id="dq-fresh" value="' + (typeof d.Freshness === 'number' ? d.Freshness : '') + '"></div>';
  b += '<div class="form-group"><label>' + (L ? 'Date de mesure' : 'Measured on') + '</label><input type="date" id="dq-date" value="' + fromEpoch(d.Updated_At) + '"></div></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.DQ + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveDq(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(L ? 'Qualité des données' : 'Data quality', b, f);
}
function numVal(id) { var v = document.getElementById(id).value; return v === '' ? null : parseFloat(v); }
async function saveDq(id) {
  var rec = { Perimeter: document.getElementById('dq-per').value.trim(), Completeness: numVal('dq-comp'), Accuracy: numVal('dq-acc'), Consistency: numVal('dq-cons'), Traceability: numVal('dq-trac'), Freshness: numVal('dq-fresh'), Updated_At: toEpoch(document.getElementById('dq-date').value) };
  if (!rec.Perimeter) { showToast(currentLang === 'fr' ? 'Périmètre requis' : 'Scope required', 'error'); return; }
  await saveRow(T.DQ, id, rec);
}
function openDroleModal(id) {
  if (!canEdit) return;
  var d = id ? data.drole.find(function(x) { return x.id === id; }) : {};
  var roles = ['Data Owner', 'Data Steward', 'Data Producer', 'Data Manager', 'Data Architect'];
  var b = '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Rôle' : 'Role') + '</label><select id="dr-role">' + roles.map(function(r) { return '<option' + (d.Role === r ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Personne' : 'Person') + '</label><input id="dr-person" value="' + sanitize(d.Person || '') + '"></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Périmètre' : 'Scope') + '</label><input id="dr-per" value="' + sanitize(d.Perimeter || '') + '"></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.DROLE + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveDrole(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(currentLang === 'fr' ? 'Rôle data' : 'Data role', b, f);
}
async function saveDrole(id) {
  var rec = { Role: document.getElementById('dr-role').value, Person: document.getElementById('dr-person').value.trim(), Perimeter: document.getElementById('dr-per').value.trim() };
  if (!rec.Person) { showToast(currentLang === 'fr' ? 'Personne requise' : 'Person required', 'error'); return; }
  await saveRow(T.DROLE, id, rec);
}
function openDanoModal(id) {
  if (!canEdit) return;
  var d = id ? data.dano.find(function(x) { return x.id === id; }) : { Status: 'ouverte', Detected_At: Math.floor(Date.now() / 1000) };
  var dims = ['Complétude', 'Exactitude', 'Cohérence', 'Actualité', 'Traçabilité'];
  var sevs = ['faible', 'moyenne', 'forte'];
  var b = '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Description' : 'Description') + '</label><input id="da-desc" value="' + sanitize(d.Description || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Périmètre' : 'Scope') + '</label><input id="da-per" value="' + sanitize(d.Perimeter || '') + '"></div>';
  b += '<div class="form-group"><label>Dimension</label><select id="da-dim">' + dims.map(function(x) { return '<option' + (d.Dimension === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (currentLang === 'fr' ? 'Sévérité' : 'Severity') + '</label><select id="da-sev">' + sevs.map(function(x) { return '<option' + (d.Severity === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div>';
  b += '<div class="form-group"><label>' + (currentLang === 'fr' ? 'Statut' : 'Status') + '</label><select id="da-status"><option' + (d.Status === 'ouverte' ? ' selected' : '') + '>ouverte</option><option' + (d.Status === 'corrigée' ? ' selected' : '') + '>corrigée</option></select></div></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.DANO + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveDano(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(currentLang === 'fr' ? 'Anomalie' : 'Anomaly', b, f);
}
async function saveDano(id) {
  var rec = { Description: document.getElementById('da-desc').value.trim(), Perimeter: document.getElementById('da-per').value.trim(), Dimension: document.getElementById('da-dim').value, Severity: document.getElementById('da-sev').value, Status: document.getElementById('da-status').value };
  if (!rec.Description) { showToast(currentLang === 'fr' ? 'Description requise' : 'Description required', 'error'); return; }
  await saveRow(T.DANO, id, rec);
}
function renderTraining() {
  var L = currentLang === 'fr';
  var html = '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🎓 ' + t('tabTraining') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openTrainModal()">+ ' + (L ? 'Session' : 'Session') + '</button></span></div>';
  else html += '</span></div>';

  // KPI formation
  var done = data.train.filter(function(s) { return s.Status === 'réalisée'; });
  var planned = data.train.filter(function(s) { return s.Status === 'planifiée'; });
  var cap = 0, att = 0; done.forEach(function(s) { cap += (s.Capacity || 0); att += (s.Attendees || 0); });
  html += '<div class="kpi-grid" style="margin-bottom:14px;">';
  html += kpi(data.train.length, L ? 'Sessions' : 'Sessions', '');
  html += kpi(done.length, L ? 'Réalisées' : 'Completed', 'ok');
  html += kpi(planned.length, L ? 'Planifiées' : 'Planned', '');
  html += kpi((cap ? Math.round(att / cap * 100) : 0) + '%', L ? 'Taux de présence' : 'Attendance rate', cap && att / cap >= 0.8 ? 'ok' : 'warn');
  html += '</div>';

  if (!data.train.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  else {
    html += '<table class="data-table"><thead><tr><th>' + (L ? 'Session' : 'Session') + '</th><th>' + (L ? 'Profil' : 'Profile') + '</th><th>' + (L ? 'Vague' : 'Wave') + '</th><th>' + (L ? 'Date' : 'Date') + '</th><th>' + (L ? 'Durée' : 'Duration') + '</th><th>' + (L ? 'Formateur' : 'Trainer') + '</th><th>' + (L ? 'Présents' : 'Attendees') + '</th><th>' + (L ? 'Statut' : 'Status') + '</th>' + (canEdit ? '<th></th>' : '') + '</tr></thead><tbody>';
    data.train.slice().sort(function(a, b) { return (a.Date || 0) - (b.Date || 0); }).forEach(function(s) {
      var ratio = s.Capacity ? Math.round((s.Attendees || 0) / s.Capacity * 100) : null;
      html += '<tr><td><strong>' + sanitize(s.Session || '') + '</strong></td><td>' + sanitize(s.Profile || '') + '</td><td>' + sanitize(s.Wave || '') + '</td><td>' + (s.Date ? formatDate(s.Date) : '') + '</td><td>' + sanitize(s.Duration || '') + '</td><td>' + sanitize(s.Trainer || '') + '</td>';
      html += '<td>' + (s.Attendees != null ? s.Attendees : 0) + (s.Capacity ? ' / ' + s.Capacity + (ratio != null ? ' <span class="badge" style="background:' + scoreColor(ratio) + '22;color:' + scoreColor(ratio) + ';">' + ratio + '%</span>' : '') : '') + '</td>';
      var stCls = s.Status === 'réalisée' ? 'badge-could' : s.Status === 'annulée' ? 'badge-must' : 'badge-should';
      html += '<td><span class="badge ' + stCls + '">' + sanitize(s.Status || '') + '</span></td>';
      if (canEdit) html += '<td><button class="btn-icon" onclick="openTrainModal(' + s.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.TRAIN + '\',' + s.id + ')">🗑️</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('view-training').innerHTML = html;
}
function openTrainModal(id) {
  if (!canEdit) return;
  var s = id ? data.train.find(function(x) { return x.id === id; }) : { Status: 'planifiée' };
  var L = currentLang === 'fr';
  var statuses = ['planifiée', 'réalisée', 'annulée'];
  var b = '<div class="form-group"><label>' + (L ? 'Intitulé de la session' : 'Session title') + '</label><input id="tr-session" value="' + sanitize(s.Session || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Profil cible' : 'Target profile') + '</label><input id="tr-profile" value="' + sanitize(s.Profile || '') + '"></div>';
  b += '<div class="form-group"><label>' + (L ? 'Vague' : 'Wave') + '</label><input id="tr-wave" value="' + sanitize(s.Wave || '') + '"></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Date' : 'Date') + '</label><input type="date" id="tr-date" value="' + fromEpoch(s.Date) + '"></div>';
  b += '<div class="form-group"><label>' + (L ? 'Durée' : 'Duration') + '</label><input id="tr-dur" value="' + sanitize(s.Duration || '') + '" placeholder="' + (L ? 'ex. 1 journée' : 'e.g. 1 day') + '"></div></div>';
  b += '<div class="form-group"><label>' + (L ? 'Formateur' : 'Trainer') + '</label><input id="tr-trainer" value="' + sanitize(s.Trainer || '') + '"></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Capacité' : 'Capacity') + '</label><input type="number" min="0" id="tr-cap" value="' + (s.Capacity || '') + '"></div>';
  b += '<div class="form-group"><label>' + (L ? 'Présents' : 'Attendees') + '</label><input type="number" min="0" id="tr-att" value="' + (s.Attendees || '') + '"></div>';
  b += '<div class="form-group"><label>' + (L ? 'Statut' : 'Status') + '</label><select id="tr-status">' + statuses.map(function(x) { return '<option' + (s.Status === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.TRAIN + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveTrain(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(L ? 'Session de formation' : 'Training session', b, f);
}
async function saveTrain(id) {
  var rec = { Session: document.getElementById('tr-session').value.trim(), Profile: document.getElementById('tr-profile').value.trim(), Wave: document.getElementById('tr-wave').value.trim(), Date: toEpoch(document.getElementById('tr-date').value), Duration: document.getElementById('tr-dur').value.trim(), Trainer: document.getElementById('tr-trainer').value.trim(), Capacity: parseInt(document.getElementById('tr-cap').value) || null, Attendees: parseInt(document.getElementById('tr-att').value) || null, Status: document.getElementById('tr-status').value };
  if (!rec.Session) { showToast(currentLang === 'fr' ? 'Intitulé requis' : 'Title required', 'error'); return; }
  await saveRow(T.TRAIN, id, rec);
}
function procStatusCls(s) { return s === 'intégré' ? 'badge-could' : s === 'en cours' ? 'badge-should' : 'badge-wont'; }
function renderProcesses() {
  var L = currentLang === 'fr';
  var html = '<div class="section-card"><div class="section-title" style="justify-content:space-between;"><span>🔄 ' + t('tabProcesses') + '</span>';
  if (canEdit) html += '<button class="btn btn-primary btn-sm" onclick="openProcModal()">+ ' + (L ? 'Processus' : 'Process') + '</button></span></div>';
  else html += '</span></div>';
  if (!data.proc.length) html += '<div class="empty-hint">' + t('noData') + '</div>';
  html += '</div>';

  data.proc.forEach(function(p) {
    html += '<div class="section-card">';
    html += '<div class="section-title" style="justify-content:space-between;"><span>' + sanitize(p.Name || '') + ' <span class="badge ' + procStatusCls(p.IntegrationStatus) + '">' + sanitize(p.IntegrationStatus || '') + '</span></span>';
    if (canEdit) html += '<span><button class="btn-icon" onclick="openProcModal(' + p.id + ')">✏️</button><button class="btn-icon" onclick="deleteRow(\'' + T.PROC + '\',' + p.id + ')">🗑️</button></span>';
    html += '</div>';
    if (p.Context) html += '<p style="color:#64748b;margin-bottom:12px;">' + sanitize(p.Context) + '</p>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    html += '<div style="background:#fef2f2;border-radius:10px;padding:12px;"><div style="font-weight:800;color:#b91c1c;margin-bottom:6px;">⚠️ As-Is</div><div style="font-size:12px;white-space:pre-wrap;">' + sanitize(p.AsIs || '—') + '</div>' + (p.PainPoints ? '<div style="font-size:11px;color:#b91c1c;margin-top:8px;"><strong>' + (L ? 'Points de douleur :' : 'Pain points:') + '</strong> ' + sanitize(p.PainPoints) + '</div>' : '') + '</div>';
    html += '<div style="background:#f0fdf4;border-radius:10px;padding:12px;"><div style="font-weight:800;color:#15803d;margin-bottom:6px;">✅ To-Be (SIPI)</div><div style="font-size:12px;white-space:pre-wrap;">' + sanitize(p.ToBe || '—') + '</div>' + (p.Gains ? '<div style="font-size:11px;color:#15803d;margin-top:8px;"><strong>' + (L ? 'Gains :' : 'Gains:') + '</strong> ' + sanitize(p.Gains) + '</div>' : '') + '</div>';
    html += '</div>';
    if (p.ConfigRequired) html += '<div style="background:#eef2ff;border-radius:10px;padding:10px 12px;margin-top:10px;font-size:12px;"><strong>⚙️ ' + (L ? 'Paramétrage SIPI requis :' : 'Required SIPI config:') + '</strong> ' + sanitize(p.ConfigRequired) + '</div>';
    html += '</div>';
  });
  document.getElementById('view-processes').innerHTML = html;
}
function openProcModal(id) {
  if (!canEdit) return;
  var p = id ? data.proc.find(function(x) { return x.id === id; }) : { IntegrationStatus: 'à analyser' };
  var L = currentLang === 'fr';
  var statuses = ['à analyser', 'en cours', 'intégré'];
  var b = '<div class="form-row"><div class="form-group"><label>' + (L ? 'Nom du processus' : 'Process name') + '</label><input id="pr-name" value="' + sanitize(p.Name || '') + '"></div>';
  b += '<div class="form-group" style="max-width:160px;"><label>' + (L ? 'Intégration' : 'Integration') + '</label><select id="pr-status">' + statuses.map(function(s) { return '<option' + (p.IntegrationStatus === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div></div>';
  b += '<div class="form-group"><label>' + (L ? 'Contexte / enjeux' : 'Context') + '</label><textarea id="pr-ctx" rows="2">' + sanitize(p.Context || '') + '</textarea></div>';
  b += '<div class="form-row"><div class="form-group"><label>As-Is</label><textarea id="pr-asis" rows="3">' + sanitize(p.AsIs || '') + '</textarea></div>';
  b += '<div class="form-group"><label>To-Be</label><textarea id="pr-tobe" rows="3">' + sanitize(p.ToBe || '') + '</textarea></div></div>';
  b += '<div class="form-row"><div class="form-group"><label>' + (L ? 'Points de douleur' : 'Pain points') + '</label><textarea id="pr-pain" rows="2">' + sanitize(p.PainPoints || '') + '</textarea></div>';
  b += '<div class="form-group"><label>' + (L ? 'Gains attendus' : 'Expected gains') + '</label><textarea id="pr-gains" rows="2">' + sanitize(p.Gains || '') + '</textarea></div></div>';
  b += '<div class="form-group"><label>' + (L ? 'Paramétrage SIPI requis' : 'Required SIPI config') + '</label><textarea id="pr-cfg" rows="2">' + sanitize(p.ConfigRequired || '') + '</textarea></div>';
  var f = (id ? '<button class="btn btn-danger" onclick="deleteRow(\'' + T.PROC + '\',' + id + ')">🗑️</button>' : '') + '<button class="btn btn-secondary" onclick="closeModalForce()">' + t('cancel') + '</button><button class="btn btn-primary" onclick="saveProc(' + (id || 'null') + ')">💾 ' + t('save') + '</button>';
  openModal(L ? 'Processus métier' : 'Business process', b, f);
}
async function saveProc(id) {
  var rec = { Name: document.getElementById('pr-name').value.trim(), IntegrationStatus: document.getElementById('pr-status').value, Context: document.getElementById('pr-ctx').value.trim(), AsIs: document.getElementById('pr-asis').value.trim(), ToBe: document.getElementById('pr-tobe').value.trim(), PainPoints: document.getElementById('pr-pain').value.trim(), Gains: document.getElementById('pr-gains').value.trim(), ConfigRequired: document.getElementById('pr-cfg').value.trim() };
  if (!rec.Name) { showToast(currentLang === 'fr' ? 'Nom requis' : 'Name required', 'error'); return; }
  await saveRow(T.PROC, id, rec);
}

// =============================================================================
// BOOT
// =============================================================================
if (!isInsideGrist()) {
  document.getElementById('not-in-grist').classList.remove('hidden');
  document.getElementById('main-content').classList.add('hidden');
} else {
  (async function() {
    try {
      await grist.ready({ requiredAccess: 'full' });
      canEdit = true;
    } catch (e) { canEdit = false; }
    try { await ensureTables(); } catch (e) { console.warn('ensureTables', e); }
    await loadAll();
    applyI18n();
    if (typeof grist.onRecords === 'function') {
      var tmr = null;
      grist.onRecords(function() {
        if (tmr) clearTimeout(tmr);
        tmr = setTimeout(function() {
          if (document.getElementById('modal-container').innerHTML.trim() !== '') return;
          loadAll();
        }, 500);
      });
    }
  })();
}
