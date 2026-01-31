'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { CircleNotch } from '@phosphor-icons/react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { signIn, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Redirect if already logged in
    if (!authLoading && user) {
        router.push('/admin/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError('Email ou mot de passe incorrect');
            setLoading(false);
        } else {
            router.push('/admin/dashboard');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CircleNotch className="w-8 h-8 text-accent animate-spin" weight="bold" />
            </div>
        );
    }

    return (
        <section className="w-full relative overflow-hidden min-h-screen flex items-center justify-center px-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="w-2 h-2 rounded-full bg-accent"
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <p className="text-xs md:text-sm font-medium text-accent tracking-wide uppercase">
                            Espace Administrateur
                        </p>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Connexion
                    </motion.h1>

                    <motion.p
                        className="text-muted-foreground mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Accédez au tableau de bord
                    </motion.p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={loading ? {} : { scale: 1.02 }}
                            whileTap={loading ? {} : { scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-full shadow-lg hover:shadow-accent/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Footer */}
                <motion.p
                    className="text-center text-muted-foreground text-sm mt-6"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    Accès réservé aux administrateurs
                </motion.p>
            </div>
        </section>
    );
}
