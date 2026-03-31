/**
 * Mudra Wisdom Database
 * Scriptural knowledge base for each mudra with Sanskrit origins and benefits
 */

export interface MudraWisdom {
    sanskrit: string;
    meaning: string;
    element: string;
    chakra: string;
    benefits: string[];
    scripture?: string;
}

export const MUDRA_DATABASE: Record<string, MudraWisdom> = {
    "Gyan": {
        sanskrit: "Jnana Mudra",
        meaning: "Symbol of knowledge and concentration",
        element: "Space (Akasha)",
        chakra: "Crown (Sahasrara) & Root (Muladhara)",
        benefits: [
            "Enhances concentration and memory",
            "Calms the mind and reduces stress",
            "Stimulates the brain and nervous system",
            "Promotes wisdom and spiritual awakening"
        ],
        scripture: "The gesture of supreme knowledge, connecting individual consciousness with universal consciousness"
    },

    "Surya": {
        sanskrit: "Surya Mudra",
        meaning: "Symbol of fire and metabolic energy",
        element: "Fire (Agni)",
        chakra: "Solar Plexus (Manipura)",
        benefits: [
            "Boosts metabolism and digestion",
            "Increases body heat and energy",
            "Reduces cholesterol",
            "Enhances willpower and confidence"
        ],
        scripture: "The sun gesture, igniting the inner fire of transformation and vitality"
    },

    "Prana": {
        sanskrit: "Prana Mudra",
        meaning: "Symbol of life force and vital energy",
        element: "Earth (Prithvi)",
        chakra: "Root (Muladhara)",
        benefits: [
            "Activates dormant energy",
            "Improves immunity and vitality",
            "Reduces fatigue and nervousness",
            "Enhances vision and clarity"
        ],
        scripture: "The life force gesture, awakening the primal energy within"
    },

    "Apana": {
        sanskrit: "Apana Mudra",
        meaning: "Symbol of elimination and purification",
        element: "Earth & Fire",
        chakra: "Root (Muladhara)",
        benefits: [
            "Aids in detoxification",
            "Regulates excretory functions",
            "Balances doshas",
            "Promotes mental clarity"
        ],
        scripture: "The purification gesture, releasing toxins from body and mind"
    },

    "Varun": {
        sanskrit: "Varun Mudra",
        meaning: "Symbol of water and emotional balance",
        element: "Water (Jala)",
        chakra: "Sacral (Svadhisthana)",
        benefits: [
            "Balances water element in body",
            "Improves skin health and hydration",
            "Enhances emotional fluidity",
            "Reduces dryness and dehydration"
        ],
        scripture: "The water gesture, flowing with grace and emotional harmony"
    },

    "Namaste": {
        sanskrit: "Anjali Mudra",
        meaning: "Symbol of reverence and unity",
        element: "All Elements",
        chakra: "Heart (Anahata)",
        benefits: [
            "Centers the mind",
            "Opens the heart chakra",
            "Promotes gratitude and humility",
            "Connects left and right brain hemispheres"
        ],
        scripture: "The divine salutation, honoring the light within all beings"
    },

    "Vayu": {
        sanskrit: "Vayu Mudra",
        meaning: "Symbol of air and calming restlessness",
        element: "Air (Vayu)",
        chakra: "Heart (Anahata)",
        benefits: [
            "Relieves joint pain and arthritis",
            "Calms a restless and anxious mind",
            "Balances the air element in the body",
            "Reduces gas and bloating"
        ],
        scripture: "The wind gesture, bringing ease and freedom to the body"
    },

    "Shunya": {
        sanskrit: "Shunya Mudra",
        meaning: "Symbol of emptiness and openness",
        element: "Space (Akasha)",
        chakra: "Throat (Vishuddha)",
        benefits: [
            "Improves ear health and hearing",
            "Promotes mental clarity and stillness",
            "Opens the throat chakra",
            "Reduces vertigo and nausea"
        ],
        scripture: "The void gesture, listening to the silence within"
    },

    "Prithvi": {
        sanskrit: "Prithvi Mudra",
        meaning: "Symbol of earth and stability",
        element: "Earth (Prithvi)",
        chakra: "Root (Muladhara)",
        benefits: [
            "Increases physical strength and endurance",
            "Promotes grounding and stability",
            "Improves skin and hair health",
            "Reduces fatigue"
        ],
        scripture: "The earth gesture, grounding the spirit in strength"
    },

    "Adi": {
        sanskrit: "Adi Mudra",
        meaning: "Symbol of primal stillness",
        element: "Ether & Earth",
        chakra: "Crown (Sahasrara)",
        benefits: [
            "Calms the nervous system",
            "Prepares the mind for deep breathing",
            "Balances the flow of prana",
            "Reduces snoring"
        ],
        scripture: "The primal gesture, returning to the source of breath"
    },

    "Chin": {
        sanskrit: "Chin Mudra",
        meaning: "Symbol of consciousness",
        element: "Air & Fire",
        chakra: "Root (Muladhara)",
        benefits: [
            "Enhances memory and focus",
            "Promotes clear thinking",
            "Connects individual and universal consciousness",
            "Reduces insomnia"
        ],
        scripture: "The consciousness gesture, uniting self with validity"
    },

    "Dhyana": {
        sanskrit: "Dhyana Mudra",
        meaning: "Symbol of deep meditation",
        element: "All Elements",
        chakra: "Sacral (Svadhisthana)",
        benefits: [
            "Deepens meditation and concentration",
            "Balances the left and right energy channels",
            "Promotes inner peace and tranquility",
            "Cultivates healing energy"
        ],
        scripture: "The meditation gesture, a bowl to receive divine wisdom"
    },

    "Hakini": {
        sanskrit: "Hakini Mudra",
        meaning: "Symbol of brain power",
        element: "All Elements",
        chakra: "Third Eye (Ajna)",
        benefits: [
            "Boosts memory and concentration",
            "Balances right and left brain hemispheres",
            "Enhances intuition and clarity",
            "Promotes logical thinking"
        ],
        scripture: "The mind gesture, unlocking the power of the third eye"
    },

    "Ganesha": {
        sanskrit: "Ganesha Mudra",
        meaning: "Symbol of obstacle removal",
        element: "Fire (Agni)",
        chakra: "Heart (Anahata)",
        benefits: [
            "Strengthens the heart and lungs",
            "Boosts confidence and courage",
            "Removes emotional blockages",
            "Increases compassion"
        ],
        scripture: "The remover of obstacles, opening the heart to courage"
    },

    "Abhaya": {
        sanskrit: "Abhaya Mudra",
        meaning: "Symbol of fearlessness",
        element: "Air (Vayu)",
        chakra: "Heart (Anahata)",
        benefits: [
            "Dispels fear and anxiety",
            "Promotes a sense of safety and protection",
            "Strengthens inner peace",
            "Cultivates benevolence"
        ],
        scripture: "The gesture of fearlessness, granting protection and peace"
    },

    "Kali": {
        sanskrit: "Kali Mudra",
        meaning: "Symbol of transformation",
        element: "Fire (Agni)",
        chakra: "Solar Plexus (Manipura)",
        benefits: [
            "Empowers truth and courage",
            "Releases tension and negativity",
            "Activates digestion and metabolism",
            "Invokes the energy of transformation"
        ],
        scripture: "The goddess gesture, cutting through illusion with truth"
    }
};

/**
 * Get wisdom for a specific mudra
 */
export function getMudraWisdom(mudraNam: string): MudraWisdom | null {
    // Normalize mudra name (remove "Mudra" suffix if present)
    const normalizedName = mudraNam.replace(/\s*Mudra$/i, "").trim();

    // Handle special cases
    if (normalizedName === "Namaste" || normalizedName === "Anjali") {
        return MUDRA_DATABASE["Namaste"];
    }

    return MUDRA_DATABASE[normalizedName] || null;
}

/**
 * Get all available mudras
 */
export function getAllMudras(): string[] {
    return Object.keys(MUDRA_DATABASE);
}
