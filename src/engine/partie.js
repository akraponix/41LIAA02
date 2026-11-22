import { loadBacklog } from "./backlog.js";
import { readFileSync } from "fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

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

export function validateVote(votes, rule, turn) {
    if (turn < 1) {
        throw new Error("Le tour doit être supérieur ou égal à 1");
    }
    if (turn === 1) {
        if (votes.every( (val, i, arr) => val === arr[0] )) {
            return votes[0];
        }
        return -1;
    }
    if (rule === "strict") {
        if (votes.every( (val, i, arr) => val === arr[0] )) {
            return votes[0];
        }
        return -1;
    }
    if (rule === "majority_absolute") {
        const counts = {};
        for (const vote of votes) {
            counts[vote] = (counts[vote] || 0) + 1;
        }
        const max = Math.max(...Object.values(counts));
        if (max > votes.length / 2) {
            return parseInt(Object.keys(counts).find((key) => counts[key] === max));
        }
        return -1;
    }
}

export function createVote(players){
    if (!Array.isArray(players) || players.length < 2) {
        throw new Error("Il faut au moins 2 joueurs pour créer un vote");
    }
    const votes = {}
    for (const player of players) {
        votes[player] = null;
    }
    return votes;
}

export async function submitHiddenVote(prompt, votes, allowedCards) {
    console.log(`Prompt: ${prompt}`);
    const rl = createInterface({
        input: stdin,
        output: stdout
    });
    try {
        for (const player of Object.keys(votes)) {
            let vote;

            while (true) {
                const answer = await rl.question(
                    `Joueur ${player}, saisissez votre vote : `
                );
                vote = Number(answer.trim());
                if (allowedCards.includes(vote)) {
                    break;
                };
            }
            votes[player] = vote;
        }
        return votes;
    } finally {
        rl.close();
    }
}

export function processVote(prompt, votes, rule, turn) {
    console.log("Votes:",JSON.stringify(votes));
    const result = validateVote(Object.values(votes), rule, turn);
    return result;
}

export async function gameLoop(backlog, players, cards, rule) {
    const loaded_backlog = loadBacklog(readFileSync(backlog));
    const loaded_players = createGame(players.length, players).pseudos;
    console.log(`Planning Poker pour le projet : ${loaded_backlog.projet}`);
    console.log(`Règle de vote : ${rule}`);
    console.log(`Joueurs : ${loaded_players.join(", ")}`);
    console.log(`Cartes disponibles : ${cards.join(", ")}`);
    console.log(`Nombre de fonctionnalités à estimer : ${loaded_backlog.fonctionnalites.length}\n`);
    for (const feature of loaded_backlog.fonctionnalites) {
        let turn = 1;
        let agreed = false;
        while (!agreed) {
            console.log(`Tour ${turn}: Estimation de la fonctionnalité "${feature.titre}" (ID: ${feature.id})`);
            let votes = createVote(loaded_players);
            const prompt = `Estimation pour la fonctionnalité "${feature.titre}" (ID: ${feature.id})`;
            votes = await submitHiddenVote(prompt, votes, cards);
            console.log("Votes:",JSON.stringify(votes));
            const result = validateVote(Object.values(votes), rule, turn);
            agreed = result !== -1;
            if (result === -1) {
                console.log(`\tAucun consensus n'a été atteint.\n`);
            } else {
                console.log(`\tLe consensus est atteint avec la valeur : ${result}\n`);
            }
            turn++;
        }
    }
}