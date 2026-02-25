-- Migration: Ajouter colonne source à la table leads
-- À exécuter dans Supabase SQL Editor

-- Ajouter la colonne source avec valeur par défaut 'main'
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'main';

-- Mettre à jour les leads existants (optionnel - ils auront déjà 'main' par défaut)
-- UPDATE leads SET source = 'main' WHERE source IS NULL;

-- Index pour filtrer rapidement par source
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Vérifier la structure
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'leads' AND column_name = 'source';
