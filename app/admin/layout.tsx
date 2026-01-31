'use client';

import { AuthProvider } from '@/lib/auth-context';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
                {children}
            </div>
        </AuthProvider>
    );
}
