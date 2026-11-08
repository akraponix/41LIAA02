import { readFileSync } from "fs";


export function loadBacklog(backlog) {
    let json;
    try {
        json = JSON.parse(backlog);
    } catch {
        throw new Error("Le backlog n'est pas un JSON valide");
    }
    //backlog vide
    if (!Array.isArray(json.fonctionnalites) || json.fonctionnalites.length === 0) {
        throw new Error("Le backlog est vide");
    }
    //on doit vérifier que chaque fonctionnalité a un id et un titre
    for (const f of json.fonctionnalites) {
        if (typeof f.id !== "string" || typeof f.titre !== "string") {
            throw new Error("Chaque fonctionnalité doit avoir un id et un titre");
        }
    }
    return json;
}

const backlog = loadBacklog(readFileSync("exemples/exemple_backlog.json"));
console.log("Backlog chargé :", backlog["fonctionnalites"][0]["titre"]);
