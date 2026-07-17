export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/token/',
    REFRESH: '/auth/token/refresh/',
    UPWORK_LOGIN: '/auth/upwork/login/',
    UPWORK_STATUS: '/auth/upwork/status/',
    UPWORK_CALLBACK: '/auth/upwork/callback/',
  },
  CLIENTS: {
    LIST: '/clients/',
    DETAIL: (id) => `/clients/${id}/`,
  },
  PROJECTS: {
    LIST: '/projects/',
    DETAIL: (id) => `/projects/${id}/`,
    MILESTONES: '/projects/milestones/',
  },
  MESSAGES: {
    LIST: '/messages/',
    DETAIL: (id) => `/messages/${id}/`,
    OPEN_IN_UPWORK: (id) => `/messages/${id}/open-in-upwork/`,
  },
  PROPOSALS: {
    LIST: '/proposals/',
    DETAIL: (id) => `/proposals/${id}/`,
    STATS: '/proposals/stats/',
    OPEN_IN_UPWORK: (id) => `/proposals/${id}/open-in-upwork/`,
  },
  PROFILE: {
    DETAIL: '/profile/',
  },
  SYNC: {
    STATUS: '/sync/status/',
    HISTORY: '/sync/history/',
    TRIGGER: '/sync/trigger/',
  },
}

export const QUERY_KEYS = {
  CLIENTS: 'clients',
  CLIENT: 'client',
  PROJECTS: 'projects',
  PROJECT: 'project',
  MILESTONES: 'milestones',
  MESSAGES: 'messages',
  MESSAGE: 'message',
  PROPOSALS: 'proposals',
  PROPOSAL_STATS: 'proposal-stats',
  PROFILE: 'profile',
  SYNC_STATUS: 'sync-status',
  SYNC_HISTORY: 'sync-history',
}