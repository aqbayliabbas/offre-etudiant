'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase, Candidate, CandidateUpdate } from '@/lib/supabase';
import {
    ArrowsCounterClockwise,
    SignOut,
    MagnifyingGlass,
    CaretDown,
    Plus,
    Users,
    Eye,
    PencilSimple,
    Trash,
    X,
    CircleNotch,
    CheckCircle
} from '@phosphor-icons/react';

// Status configuration
const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
    contacted: { label: 'Contacté', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    in_progress: { label: 'En cours', color: 'bg-accent/10 text-accent border-accent/20' },
    completed: { label: 'Terminé', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
    rejected: { label: 'Rejeté', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

// Service type labels
const serviceLabels: Record<string, string> = {
    web: 'Développement Web / Mobile',
    writing: 'Rédaction académique',
};

// Budget labels
const budgetLabels: Record<string, string> = {
    '5000-10000': '5 000 – 10 000 DA',
    '25000-50000': '25 000 – 50 000 DA',
};

// Study level labels
const studyLabels: Record<string, string> = {
    licence: 'Licence',
    master: 'Master',
};

export default function AdminDashboard() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
    const [editForm, setEditForm] = useState<Partial<Candidate>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin');
        }
    }, [authLoading, user, router]);

    // Fetch candidates
    const fetchCandidates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('candidates')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCandidates(data as Candidate[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchCandidates();
        }
    }, [user]);

    // Filter candidates
    const filteredCandidates = candidates.filter((candidate) => {
        const matchesSearch =
            (candidate.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (candidate.whatsapp && candidate.whatsapp.includes(searchTerm));

        const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // CRUD Operations
    const handleCreate = () => {
        setEditForm({
            full_name: '',
            service_type: 'web',
            budget: '5000-10000',
            study_level: 'master',
            email: '',
            whatsapp: '',
            message: '',
            status: 'pending',
            notes: '',
        });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleView = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setEditForm({ ...candidate });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);

        if (modalMode === 'create') {
            const { error } = await supabase.from('candidates').insert([{
                full_name: editForm.full_name,
                service_type: editForm.service_type,
                budget: editForm.budget,
                study_level: editForm.study_level,
                email: editForm.email,
                whatsapp: editForm.whatsapp || null,
                message: editForm.message,
                status: editForm.status || 'pending',
                notes: editForm.notes || null,
            }]);

            if (!error) {
                setIsModalOpen(false);
                fetchCandidates();
            }
        } else if (modalMode === 'edit' && selectedCandidate) {
            const updateData: CandidateUpdate = {
                full_name: editForm.full_name,
                service_type: editForm.service_type,
                budget: editForm.budget,
                study_level: editForm.study_level,
                email: editForm.email,
                whatsapp: editForm.whatsapp || null,
                message: editForm.message,
                status: editForm.status as Candidate['status'],
                notes: editForm.notes || null,
            };

            const { error } = await supabase
                .from('candidates')
                .update(updateData)
                .eq('id', selectedCandidate.id);

            if (!error) {
                setIsModalOpen(false);
                fetchCandidates();
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        const { error } = await supabase.from('candidates').delete().eq('id', id);

        if (!error) {
            setCandidates(candidates.filter((c) => c.id !== id));
            setShowDeleteConfirm(null);
        }
        setIsDeleting(false);
    };

    const handleStatusChange = async (id: string, newStatus: Candidate['status']) => {
        const { error } = await supabase
            .from('candidates')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setCandidates(
                candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
            );
        }
    };

    // Stats
    const stats = {
        total: candidates.length,
        pending: candidates.filter((c) => c.status === 'pending').length,
        inProgress: candidates.filter((c) => c.status === 'in_progress').length,
        completed: candidates.filter((c) => c.status === 'completed').length,
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CircleNotch className="w-8 h-8 text-accent animate-spin" weight="bold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <div>
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-4"
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
                                Tableau de bord
                            </p>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Candidatures
                        </motion.h1>

                        <motion.p
                            className="text-muted-foreground mt-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Gestion des demandes d&apos;accompagnement
                        </motion.p>
                    </div>

                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.button
                            onClick={fetchCandidates}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-card/50 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-border transition-all backdrop-blur-sm"
                        >
                            <ArrowsCounterClockwise className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <motion.button
                            onClick={signOut}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-3 bg-card/50 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-border transition-all backdrop-blur-sm"
                        >
                            <SignOut className="w-5 h-5" />
                            <span className="hidden md:inline">Déconnexion</span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {[
                        { label: 'Total', value: stats.total, gradient: 'from-accent/10 to-accent/5', borderColor: 'border-accent/20' },
                        { label: 'En attente', value: stats.pending, gradient: 'from-yellow-500/10 to-yellow-500/5', borderColor: 'border-yellow-500/20' },
                        { label: 'En cours', value: stats.inProgress, gradient: 'from-blue-500/10 to-blue-500/5', borderColor: 'border-blue-500/20' },
                        { label: 'Terminé', value: stats.completed, gradient: 'from-green-500/10 to-green-500/5', borderColor: 'border-green-500/20' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            whileHover={{ scale: 1.02 }}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} backdrop-blur-md`}
                        >
                            <p className="text-4xl md:text-5xl font-black text-foreground">{stat.value}</p>
                            <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    className="flex flex-col md:flex-row gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="bold" />
                        <input
                            type="text"
                            placeholder="Rechercher par email, message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all hover:border-border"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-4 pr-10 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all hover:border-border min-w-[180px]"
                        >
                            <option value="all">Tous les statuts</option>
                            {Object.entries(statusConfig).map(([value, { label }]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" weight="bold" />
                    </div>

                    {/* Add Button */}
                    <motion.button
                        onClick={handleCreate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-full shadow-lg hover:shadow-accent/30 transition-all"
                    >
                        <Plus className="w-5 h-5" weight="bold" />
                        <span>Ajouter</span>
                    </motion.button>
                </motion.div>

                {/* Candidates Table */}
                <motion.div
                    className="rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <CircleNotch className="w-8 h-8 text-accent animate-spin" weight="bold" />
                        </div>
                    ) : filteredCandidates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Users className="w-12 h-12 mb-4 opacity-50" weight="light" />
                            <p>Aucun candidat trouvé</p>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Candidat</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden lg:table-cell">Service / Budget</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCandidates.map((candidate, index) => (
                                        <motion.tr
                                            key={candidate.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-border/30 hover:bg-card/30 transition-colors"
                                        >
                                            <td className="py-6 px-6">
                                                <p className="text-foreground font-semibold">{candidate.full_name}</p>
                                            </td>
                                            <td className="py-6 px-6 hidden md:table-cell">
                                                <p className="text-foreground text-sm">{candidate.email}</p>
                                                <p className="text-muted-foreground text-xs">{candidate.whatsapp}</p>
                                            </td>
                                            <td className="py-6 px-6 hidden lg:table-cell">
                                                <p className="text-muted-foreground text-sm">
                                                    {serviceLabels[candidate.service_type] || candidate.service_type}
                                                </p>
                                                <p className="text-accent font-medium text-xs">
                                                    {budgetLabels[candidate.budget] || candidate.budget}
                                                </p>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="relative group">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig[candidate.status]?.color || statusConfig.pending.color}`}>
                                                        {statusConfig[candidate.status]?.label || 'En attente'}
                                                    </span>
                                                    {/* Status Dropdown */}
                                                    <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                                                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl min-w-[150px]">
                                                            {Object.entries(statusConfig).map(([value, { label }]) => (
                                                                <button
                                                                    key={value}
                                                                    onClick={() => handleStatusChange(candidate.id, value as Candidate['status'])}
                                                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors"
                                                                >
                                                                    {label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 hidden lg:table-cell">
                                                <span className="text-muted-foreground text-sm">
                                                    {new Date(candidate.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <motion.button
                                                        onClick={() => handleView(candidate)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleEdit(candidate)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                                    >
                                                        <PencilSimple className="w-4 h-4" />
                                                    </motion.button>
                                                    <div className="relative">
                                                        <motion.button
                                                            onClick={() => setShowDeleteConfirm(candidate.id)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                            <span>Supprimer</span>
                                                        </motion.button>
                                                        {/* Delete Confirmation */}
                                                        <AnimatePresence>
                                                            {showDeleteConfirm === candidate.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                                    className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl p-4 shadow-xl z-20 min-w-[200px]"
                                                                >
                                                                    <p className="text-foreground text-sm mb-3">Supprimer ce candidat ?</p>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => setShowDeleteConfirm(null)}
                                                                            className="flex-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors"
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(candidate.id)}
                                                                            disabled={isDeleting}
                                                                            className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                                        >
                                                                            {isDeleting ? (
                                                                                <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
                                                                            ) : (
                                                                                'Supprimer'
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-xl font-bold text-foreground">
                                    {modalMode === 'view' && 'Détails du candidat'}
                                    {modalMode === 'edit' && 'Modifier le candidat'}
                                    {modalMode === 'create' && 'Nouveau candidat'}
                                </h2>
                                <motion.button
                                    onClick={() => setIsModalOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" weight="bold" />
                                </motion.button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {modalMode === 'view' && selectedCandidate && (
                                    <div className="space-y-6">
                                        {/* Info Cards */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-muted/50 rounded-xl p-4 col-span-2">
                                                <p className="text-muted-foreground text-xs mb-1">Nom & Prénom</p>
                                                <p className="text-foreground font-bold text-lg">{selectedCandidate.full_name}</p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Email</p>
                                                <p className="text-foreground font-medium">{selectedCandidate.email}</p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Téléphone</p>
                                                <p className="text-foreground font-medium">{selectedCandidate.whatsapp || '—'}</p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Service</p>
                                                <p className="text-foreground font-medium text-sm">
                                                    {serviceLabels[selectedCandidate.service_type] || selectedCandidate.service_type}
                                                </p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Budget</p>
                                                <p className="text-foreground font-medium">
                                                    {budgetLabels[selectedCandidate.budget] || selectedCandidate.budget}
                                                </p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Niveau</p>
                                                <p className="text-foreground font-medium">
                                                    {studyLabels[selectedCandidate.study_level] || selectedCandidate.study_level}
                                                </p>
                                            </div>
                                            <div className="bg-muted/50 rounded-xl p-4">
                                                <p className="text-muted-foreground text-xs mb-1">Date</p>
                                                <p className="text-foreground font-medium">
                                                    {new Date(selectedCandidate.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="bg-muted/50 rounded-xl p-4">
                                            <p className="text-muted-foreground text-xs mb-2">Message</p>
                                            <p className="text-foreground whitespace-pre-wrap">{selectedCandidate.message}</p>
                                        </div>

                                        {/* Notes */}
                                        {selectedCandidate.notes && (
                                            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                                                <p className="text-accent text-xs mb-2">Notes internes</p>
                                                <p className="text-foreground whitespace-pre-wrap">{selectedCandidate.notes}</p>
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground text-sm">Statut actuel:</span>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${statusConfig[selectedCandidate.status]?.color || statusConfig.pending.color}`}>
                                                {statusConfig[selectedCandidate.status]?.label || 'En attente'}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4 border-t border-border">
                                            <motion.button
                                                onClick={() => {
                                                    setEditForm({ ...selectedCandidate });
                                                    setModalMode('edit');
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-full transition-colors"
                                            >
                                                Modifier
                                            </motion.button>
                                        </div>
                                    </div>
                                )}

                                {(modalMode === 'edit' || modalMode === 'create') && (
                                    <div className="space-y-5">
                                        {/* Nom & Prénom */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Nom & Prénom</label>
                                            <input
                                                type="text"
                                                value={editForm.full_name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                                required
                                                placeholder="Nom complet du candidat"
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                            />
                                        </div>

                                        {/* Service Type */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Type de service</label>
                                            <select
                                                value={editForm.service_type || ''}
                                                onChange={(e) => setEditForm({ ...editForm, service_type: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <option value="web">Développement Web / Application Mobile</option>
                                                <option value="writing">Rédaction académique</option>
                                            </select>
                                        </div>

                                        {/* Budget */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Budget</label>
                                            <select
                                                value={editForm.budget || ''}
                                                onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <option value="5000-10000">5 000 – 10 000 DA</option>
                                                <option value="25000-50000">25 000 – 50 000 DA</option>
                                            </select>
                                        </div>

                                        {/* Study Level */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Niveau d&apos;étude</label>
                                            <select
                                                value={editForm.study_level || ''}
                                                onChange={(e) => setEditForm({ ...editForm, study_level: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <option value="licence">Licence</option>
                                                <option value="master">Master</option>
                                            </select>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Email</label>
                                            <input
                                                type="email"
                                                value={editForm.email || ''}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                            />
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Téléphone / WhatsApp</label>
                                            <input
                                                type="tel"
                                                value={editForm.whatsapp || ''}
                                                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Message</label>
                                            <textarea
                                                value={editForm.message || ''}
                                                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                                rows={4}
                                                required
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Statut</label>
                                            <select
                                                value={editForm.status || 'pending'}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Candidate['status'] })}
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                {Object.entries(statusConfig).map(([value, { label }]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Notes internes</label>
                                            <textarea
                                                value={editForm.notes || ''}
                                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                rows={3}
                                                placeholder="Notes visibles uniquement par les administrateurs..."
                                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <motion.button
                                                onClick={() => setIsModalOpen(false)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-full transition-colors"
                                            >
                                                Annuler
                                            </motion.button>
                                            <motion.button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-full shadow-lg hover:shadow-accent/30 disabled:opacity-70 transition-all"
                                            >
                                                {isSaving ? (
                                                    <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                                                ) : (
                                                    'Enregistrer'
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
