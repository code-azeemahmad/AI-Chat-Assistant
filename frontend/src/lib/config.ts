// src/lib/config.ts

interface Config {
    /** AI Chat Assistant */
    readonly appName: string;

    /** development | staging | production */
    readonly environment: string;

    /** http://localhost:8000 */
    readonly apiBaseUrl: string;

    /** v1 */
    readonly apiVersion: string;

    /** http://localhost:8000/api/v1 */
    readonly apiUrl: string;

    /** Enable streaming endpoints */
    readonly streamingEnabled: boolean;
}

function requireEnv(
    value: string | undefined,
    name: string,
): string {
    if (!value?.trim()) {
        throw new Error(
            `Missing required environment variable: ${name}`,
        );
    }

    return value.trim();
}

function parseBoolean(
    value: string | undefined,
): boolean {
    if (!value) {
        return false;
    }

    return ["true", "1", "yes", "on"].includes(
        value.trim().toLowerCase(),
    );
}

const apiBaseUrl = requireEnv(
    import.meta.env.VITE_API_BASE_URL,
    "VITE_API_BASE_URL",
).replace(/\/+$/, "");

const apiVersion = requireEnv(
    import.meta.env.VITE_API_VERSION,
    "VITE_API_VERSION",
);

export const config: Config = Object.freeze({
    appName:
        import.meta.env.VITE_APP_NAME ??
        "AI Chat Assistant",

    environment:
        import.meta.env.MODE,

    apiBaseUrl,

    apiVersion,

    apiUrl: new URL(
        `/api/${apiVersion}`,
        `${apiBaseUrl}/`,
    ).toString().replace(/\/$/, ""),

    streamingEnabled: parseBoolean(
        import.meta.env.VITE_ENABLE_STREAMING,
    ),
});