export function createGame(nb, pseudos) {
    if (pseudos.length !== nb) {
        throw new Error("Le nombre de pseudos ne correspond pas au nombre de joueurs");
    }
    if (nb < 2) {
        throw new Error("Il faut au moins 2 joueurs pour créer une partie");
    }
    for (const pseudo of pseudos) {
        if (typeof pseudo !== "string" || pseudo.trim() === "") {
            throw new Error("Chaque pseudo doit être une chaîne de caractères non vide");
        }
    }
    const uniques = new Set(pseudos.map((p) => p.trim().toLowerCase()));
    if (uniques.size !== pseudos.length) {
        throw new Error("Les pseudos doivent être uniques");
    }
    return { nb, pseudos };
}