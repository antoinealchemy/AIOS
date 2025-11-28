# Checklist de déploiement Vercel

## Étapes de résolution 404:

### 1. Vérifier quelle branche Vercel déploie
- Aller sur https://vercel.com/dashboard
- Sélectionner le projet AIOS
- Onglet "Settings" → "Git"
- Vérifier "Production Branch" (doit être `main`)

### 2. Forcer un nouveau déploiement
- Onglet "Deployments"
- Cliquer sur le dernier déploiement
- Cliquer sur "⋯" (3 points) → "Redeploy"
- ✅ Cocher "Use existing Build Cache" = OFF
- Cliquer "Redeploy"

### 3. Vérifier les logs de build
- Pendant le déploiement, cliquer sur "Building"
- Vérifier qu'il n'y a pas d'erreurs TypeScript
- Vérifier que les routes sont générées : "Generating static pages"
- Chercher dans les logs : `○ /formulaire`

### 4. Variables d'environnement
- Settings → Environment Variables
- Vérifier que ces variables existent :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Commandes de debug local

```bash
# Build local pour vérifier
npm run build

# Vérifier les routes générées
ls -la .next/server/app/formulaire/

# Tester en local
npm run dev
# Ouvrir http://localhost:3000/formulaire
```
