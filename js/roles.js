/**
 * roles.js — RCO IT Help Site (DEMO MODE)
 * Firebase RTDB removed. All access granted for demo user.
 */

// ── Hierarchy ───────────────────────────────────────────────────────────────
const LEVELS = { it_admin: 4, c_suite: 3, director: 2, manager: 1, staff: 0 };

const MEMBERS = {
  it_admin: ['demo.admin@example.com', 'demo.admin2@example.com'],
  c_suite: ['demo.exec@example.com'],
  director: ['demo.director@example.com', 'demo.director2@example.com'],
  manager: ['demo.manager@example.com', 'demo.manager2@example.com', 'demo.manager3@example.com'],
  staff: ['demo.staff@example.com', 'demo.staff2@example.com', 'demo.staff3@example.com', 'demo.staff4@example.com'],
};

// ── Content config (surveys / forms) ────────────────────────────────────────
export const CONTENT_CONFIG = {
  surveys: [
    {
      id:       'tech-discovery',
      title:    'RCO IT Software Inventory',
      minRole:  'manager',
      sheetUrl: '#',
      url:      'surveys/tech-discovery.html',
    },
  ],
  forms: [
    {
      id:       'onboarding',
      title:    'User Onboarding Request',
      minRole:  'manager',
      sheetUrl: '#',
      url:      'forms/onboarding.html',
    },
    {
      id:       'offboarding',
      title:    'User Offboarding Request',
      minRole:  'manager',
      sheetUrl: '#',
      url:      'forms/offboarding.html',
    },
    {
      id:       'equipment',
      title:    'IT Equipment & Software Request',
      minRole:  'manager',
      sheetUrl: '#',
      url:      'forms/equipment.html',
    },
    {
      id:       'rockstars',
      title:    'RCO Rockstars',
      minRole:  'manager',
      sheetUrl: '#',
      url:      'forms/rockstars.html',
    },
  ],
};

// ── Site features ──────────────────────────────────────────────────────────
export const FEATURES_CONFIG = [
  { id: 'results',         title: 'Survey & Form Results', minRole: 'it_admin' },
  { id: 'sheets',          title: 'Google Sheets',         minRole: 'it_admin' },
  { id: 'roles',           title: 'Roles / Access Panel',  minRole: 'it_admin' },
  { id: 'all_submissions', title: 'View All Submissions',  minRole: 'it_admin' },
  { id: 'knowledge',       title: 'IT Knowledge Base',     minRole: 'staff'    },
];

export const ROLE_NAMES  = ['it_admin', 'c_suite', 'director', 'manager', 'staff'];
export const ROLE_LABELS = { it_admin:'IT Admin', c_suite:'C-Suite', director:'Director', manager:'Manager', staff:'Staff' };

// ── Load permissions (no-op in demo) ────────────────────────────────────────
export async function loadPermissions() { /* no-op */ }
export async function saveRolePermissions(roleName, contentIds) { /* no-op */ }

// ── Core helpers ────────────────────────────────────────────────────────────
export function getRole(email) {
  // Demo user is always IT Admin for full access
  return 'it_admin';
}

export function getRoleLevel(email) { return LEVELS[getRole(email)] ?? 0; }
export function getRoleLabel(email) { return ROLE_LABELS[getRole(email)] ?? 'Staff'; }

export function getAllItems() {
  return [
    ...CONTENT_CONFIG.surveys.map(c => ({ ...c, type: 'Survey' })),
    ...CONTENT_CONFIG.forms.map(c =>   ({ ...c, type: 'Form' })),
    ...FEATURES_CONFIG.map(f =>        ({ ...f, type: 'Feature' })),
  ];
}

export function canAccess(email, itemId) { return true; }
export function roleHasAccess(roleName, itemId) { return true; }

export function getRoleContentIds(roleName) {
  return getAllItems().map(c => c.id);
}

export function canViewSheets(email)         { return true; }
export function canViewAllSubmissions(email) { return true; }
export function canViewResults(email)        { return true; }
export function canViewRoles(email)          { return true; }

export { MEMBERS, LEVELS };
