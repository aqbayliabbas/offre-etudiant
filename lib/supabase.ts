import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for the candidates table
export interface Candidate {
    id: string;
    full_name: string;
    service_type: string;
    budget: string;
    study_level: string;
    email: string;
    whatsapp: string | null;
    message: string;
    status: 'pending' | 'contacted' | 'in_progress' | 'completed';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export type CandidateInsert = Omit<Candidate, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'>;
export type CandidateUpdate = Partial<Omit<Candidate, 'id' | 'created_at'>>;
