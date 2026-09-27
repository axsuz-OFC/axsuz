const PEXELS_KEY = 'jgFxtvFxOb2UsD7aFcy7EAOTerW1VPOmggCjZojzY6b1XxMmEVdYE34T';
const PEXELS_URL = 'https://api.pexels.com/v1';

const PexelsAPI = {
    getTrending: async (page = 1) => {
        try {
            const res = await fetch(`${PEXELS_URL}/curated?page=${page}&per_page=12`, {
                headers: { 'Authorization': PEXELS_KEY }
            });
            const data = await res.json();
            return data.photos || [];
        } catch (e) { return []; }
    },
    
    search: async (query, page = 1) => {
        try {
            const res = await fetch(`${PEXELS_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=12`, {
                headers: { 'Authorization': PEXELS_KEY }
            });
            const data = await res.json();
            return data.photos || [];
        } catch (e) { return []; }
    }
};