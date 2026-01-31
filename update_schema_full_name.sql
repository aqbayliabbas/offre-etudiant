-- Request: add nom prénom field
ALTER TABLE candidates ADD COLUMN full_name TEXT NOT NULL DEFAULT 'Non spécifié';
