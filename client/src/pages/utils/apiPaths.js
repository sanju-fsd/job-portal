export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  USERS: {
    UPDATE: "/users",
    UPLOAD_ASSETS: "/users/candidate-assets",
    UPLOAD_EMPLOYER_LOGO: "/users/employer-logo",
    DELETE: "/users",
  },
  JOBS: {
    ALL: "/jobs",
    CREATE: "/jobs",
    MY: "/jobs/my",
    STATS: "/jobs/stats",
    DETAILS: (jobId) => `/jobs/${jobId}`,
    UPDATE: (jobId) => `/jobs/${jobId}`,
    DELETE: (jobId) => `/jobs/${jobId}`,
    BY_EMPLOYER: (employerId) => `/jobs/employer/${employerId}`,
  },
  APPLICATIONS: {
    APPLY: "/applications/apply",
    MY: "/applications/me",
    BY_JOB: (jobId) => `/applications/job/${jobId}`,
    UPDATE_STATUS: (applicationId) => `/applications/${applicationId}/status`,
  },
  SAVED_JOBS: {
    LIST: "/saved-jobs",
    SAVE: (jobId) => `/saved-jobs/${jobId}`,
    REMOVE: (jobId) => `/saved-jobs/${jobId}`,
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    JOBS: "/admin/jobs",
    APPROVE_EMPLOYER: (employerId) => `/admin/employers/${employerId}/approve`,
    UPDATE_EMPLOYER_STATUS: (employerId) => `/admin/employers/${employerId}/status`,
    DELETE_EMPLOYER: (employerId) => `/admin/employers/${employerId}`,
    DELETE_CANDIDATE: (candidateId) => `/admin/candidates/${candidateId}`,
  },
};
