export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  JOBS: {
    ALL: "/jobs",
    CREATE: "/jobs",
    MY:"/jobs/me",
    STATS: "jobs/stats",
  },
  APPLICATIONS: {
    APPLY: (jobId) => `/applications/${jobId}`,
    MY: "/applications/me",
  },
};