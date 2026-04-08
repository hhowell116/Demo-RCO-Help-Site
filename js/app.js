// ============================================================
//  app.js — RCO IT Help Site (DEMO MODE — Static Preview)
//  Firebase auth, Firestore, and Apps Script integrations removed.
// ============================================================

// ── Mock user (replaces Firebase Auth) ─────────────────────────────────────
const currentUser = {
  displayName: 'Demo User',
  email: 'demo.admin@example.com',
  uid: 'demo-uid-001'
};

// Set user display immediately
document.addEventListener('DOMContentLoaded', () => {
  const userEl = document.getElementById('topbarUser');
  if (userEl) userEl.textContent = currentUser.email;
});

// ── Sign out (demo — disabled) ─────────────────────────────────────────────
document.getElementById('authBtn')?.addEventListener('click', () => {
  alert('Demo Mode: Sign out is disabled in the static preview.');
});

// ── Sidebar nav ─────────────────────────────────────────────────────────────
document.querySelectorAll('[data-section]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.section;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('[data-section]').forEach(b => b.classList.remove('active'));
    document.getElementById('section-' + name)?.classList.add('active');
    btn.classList.add('active');
    if (name === 'completed') {
      renderCompleted();
      if (typeof window.renderSubFilters === 'function') window.renderSubFilters(window._typeTab || 'surveys');
    }
    if (name === 'results' && typeof window.loadResults === 'function') {
      window.loadResults();
    }
  });
});

// ── Start survey button ─────────────────────────────────────────────────────
document.getElementById('startSurveyBtn')?.addEventListener('click', () => {
  window.location.href = 'surveys/tech-discovery.html';
});

// ── Refresh button ──────────────────────────────────────────────────────────
document.getElementById('refreshBtn')?.addEventListener('click', () => {
  renderCompleted();
});

// ── Expose renderCompleted for toggle buttons ───────────────────────────────
window._renderCompleted = renderCompleted;

// ── Helpers ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 5;

function renderCards(docs, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!docs.length) {
    container.innerHTML = `<div class="empty-state" style="padding:1.5rem 0">
      <div class="empty-icon">📭</div>
      <p style="color:var(--sb-muted)">No submissions yet.</p>
    </div>`;
    return;
  }

  function buildCard(doc) {
    const s = doc;
    const date = s.submittedAt || '—';
    return `<div class="card brown completed-card">
      <div class="card-top">
        <span class="card-status status-active">Submitted</span>
      </div>
      <h3 style="font-size:0.88rem">${s.title || 'Submission'}</h3>
      <div style="font-size:0.72rem;line-height:1.7;color:var(--sb-muted)">
        <div><strong>Department:</strong> ${s.dept || '—'}</div>
        <div style="white-space:nowrap"><strong>Submitted:</strong> ${date}</div>
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${s.userEmail || '—'}"><strong>By:</strong> ${s.userEmail || '—'}</div>
      </div>
      <div class="card-meta">
        <button class="card-action" data-url="${s.url || '#'}">Take Again →</button>
      </div>
    </div>`;
  }

  const visible  = docs.slice(0, PAGE_SIZE);
  const overflow = docs.slice(PAGE_SIZE);

  let html = `<div class="cards">${visible.map(buildCard).join('')}</div>`;

  if (overflow.length) {
    html += `
      <div id="${containerId}-more" class="cards" style="display:none">
        ${overflow.map(buildCard).join('')}
      </div>
      <div style="text-align:center;margin-top:1rem" id="${containerId}-more-wrap">
        <button class="clear-btn" style="font-size:0.82rem;font-weight:700"
                id="${containerId}-showmore">
          Show ${overflow.length} more submission${overflow.length !== 1 ? 's' : ''} ↓
        </button>
      </div>`;
  }

  container.innerHTML = html;

  document.getElementById(`${containerId}-showmore`)?.addEventListener('click', () => {
    document.getElementById(`${containerId}-more`).style.display = '';
    document.getElementById(`${containerId}-more-wrap`).style.display = 'none';
  });

  container.querySelectorAll('[data-url]').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = btn.dataset.url);
  });
}

// ── Sample completed submissions (hardcoded for demo) ───────────────────────
const SAMPLE_SURVEYS = [
  {
    title: 'RCO IT Software Inventory',
    dept: 'Marketing',
    url: 'surveys/tech-discovery.html',
    userEmail: 'demo.admin@example.com',
    submittedAt: 'Mar 15, 2026, 2:30 PM'
  },
  {
    title: 'RCO IT Software Inventory',
    dept: 'Operations',
    url: 'surveys/tech-discovery.html',
    userEmail: 'demo.admin@example.com',
    submittedAt: 'Feb 28, 2026, 10:15 AM'
  }
];

const SAMPLE_FORMS = [
  {
    title: 'User Onboarding Request',
    dept: 'Human Resources',
    url: 'forms/onboarding.html',
    userEmail: 'demo.admin@example.com',
    submittedAt: 'Mar 20, 2026, 9:45 AM'
  },
  {
    title: 'IT Equipment & Software Request',
    dept: 'Marketing',
    url: 'forms/equipment.html',
    userEmail: 'demo.admin@example.com',
    submittedAt: 'Mar 10, 2026, 4:20 PM'
  },
  {
    title: 'RCO Rockstars',
    dept: 'Company-Wide',
    url: 'forms/rockstars.html',
    userEmail: 'demo.admin@example.com',
    submittedAt: 'Mar 1, 2026, 11:00 AM'
  }
];

// ── Completed submissions (demo — uses hardcoded data) ──────────────────────
function renderCompleted() {
  const surveysList = document.getElementById('completedSurveysList');
  const formsList   = document.getElementById('completedFormsList');
  if (!surveysList || !formsList) return;

  const cfg       = window._contentConfig || { surveys: [], forms: [] };
  const subFilter = window._subFilter;

  let filteredSurveys = [...SAMPLE_SURVEYS];
  let filteredForms   = [...SAMPLE_FORMS];

  if (subFilter) {
    const items = [...(cfg.surveys || []), ...(cfg.forms || [])];
    const fi = items.find(c => c.id === subFilter);
    if (fi) {
      const ft = fi.title.toLowerCase();
      filteredSurveys = filteredSurveys.filter(d => d.title.toLowerCase().includes(ft) || ft.includes(d.title.toLowerCase()));
      filteredForms = filteredForms.filter(d => d.title.toLowerCase().includes(ft) || ft.includes(d.title.toLowerCase()));
    }
  }

  renderCards(filteredSurveys, 'completedSurveysList');
  renderCards(filteredForms, 'completedFormsList');
}

// ── Contact form ────────────────────────────────────────────────────────────
document.getElementById('sendBtn')?.addEventListener('click', () => {
  const from    = document.getElementById('contactFrom')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value.trim();
  const body    = document.getElementById('contactBody')?.value.trim();

  if (!from)    { setContactStatus('error', 'Please enter your email address.'); return; }
  if (!subject) { setContactStatus('error', 'Please enter a subject.'); return; }
  if (!body)    { setContactStatus('error', 'Please enter a message.'); return; }

  // Demo mode — don't actually open Gmail
  setContactStatus('success', 'Demo Mode: Message would be sent to demo.itsupport@example.com');
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
  ['contactFrom', 'contactSubject', 'contactBody'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setContactStatus('', '');
});

function setContactStatus(type, msg) {
  const el = document.getElementById('contactStatus');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'contact-status' + (type ? ' ' + type : '');
}
