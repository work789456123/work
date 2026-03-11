interface Config {
    API_BASE_URL: string;
    FEATURE_FLAGS: {
        ENABLE_RBAC_UI: boolean;
        ENABLE_AI_REPORTS: boolean;
    };
}

const config: Config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    FEATURE_FLAGS: {
        ENABLE_RBAC_UI: true,
        ENABLE_AI_REPORTS: false, // Flag out unfinished features
    }
};

export default config;
