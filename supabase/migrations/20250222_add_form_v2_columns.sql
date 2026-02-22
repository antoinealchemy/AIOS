-- Migration: Add form v2 qualification columns
-- Date: 2025-02-22
-- Description: Adds new columns for the updated qualification form

-- Add new columns to leads table (if they don't exist)
DO $$
BEGIN
    -- secteur (text) - Secteur d'activité
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'secteur') THEN
        ALTER TABLE leads ADD COLUMN secteur TEXT;
    END IF;

    -- secteur_autre (text, nullable) - Précision si "Autre" sélectionné
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'secteur_autre') THEN
        ALTER TABLE leads ADD COLUMN secteur_autre TEXT;
    END IF;

    -- chiffre_affaires (text) - Tranche de CA annuel
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'chiffre_affaires') THEN
        ALTER TABLE leads ADD COLUMN chiffre_affaires TEXT;
    END IF;

    -- nombre_employes (text) - Tranche nombre d'employés
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'nombre_employes') THEN
        ALTER TABLE leads ADD COLUMN nombre_employes TEXT;
    END IF;

    -- intensite_probleme (integer) - Score 1-10
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'intensite_probleme') THEN
        ALTER TABLE leads ADD COLUMN intensite_probleme INTEGER;
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN leads.secteur IS 'Secteur d''activité: cabinet-avocats, cabinet-comptable, cabinet-conseil, medical-sante, agence-immobiliere, bureau-etudes, services-b2b, rh-recrutement, autre';
COMMENT ON COLUMN leads.secteur_autre IS 'Précision secteur si "autre" sélectionné';
COMMENT ON COLUMN leads.chiffre_affaires IS 'CA annuel: moins-250k, 250k-500k, plus-500k';
COMMENT ON COLUMN leads.nombre_employes IS 'Nombre employés: 1-10, 11-50, 51-200, plus-200';
COMMENT ON COLUMN leads.intensite_probleme IS 'Intensité du problème de recherche d''information (1-10)';
