
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND?: string;
    readonly VITE_USE_MOCK?: string;
    readonly VITE_VOICE_ACCENT?: string;
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
