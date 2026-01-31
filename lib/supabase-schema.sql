-- Supabase SQL Schema for Candidates Dashboard
-- Run this in your Supabase SQL Editor

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  study_level TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert (for form submissions)
CREATE POLICY "Allow anonymous insert" ON candidates
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can read candidates
CREATE POLICY "Allow authenticated read" ON candidates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update candidates
CREATE POLICY "Allow authenticated update" ON candidates
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete candidates
CREATE POLICY "Allow authenticated delete" ON candidates
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
