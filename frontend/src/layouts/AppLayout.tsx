// src/layouts/AppLayout.tsx

import type { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <main className="min-h-screen bg-gray-100">
            <div className="mx-auto flex h-screen max-w-5xl flex-col px-4">
                {children}
            </div>
        </main>
    );
}