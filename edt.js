export default async function handler(req, res) {
    // L'URL officielle de ton emploi du temps Lyon 1
    const ICAL_URL = "https://edt.univ-lyon1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=13655&projectId=1&calType=ical&firstDate=2025-08-18&lastDate=2026-08-01";

    try {
        // 1. Le serveur Vercel récupère les données (pas de blocage CORS ici car c'est de serveur à serveur)
        const response = await fetch(ICAL_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur Université: ${response.status}`);
        }

        const data = await response.text();

        // 2. On configure le cache pour que ça soit ultra rapide (garde les données 1h en mémoire)
        // S-Maxage = cache serveur, Stale-while-revalidate = sert le vieux contenu pendant qu'il met à jour le nouveau
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
        
        // 3. On renvoie les données propres au site
        res.status(200).send(data);

    } catch (error) {
        console.error("Erreur Fetch EDT:", error);
        res.status(500).json({ 
            error: 'Impossible de récupérer l\'emploi du temps.',
            details: error.message 
        });
    }
}
