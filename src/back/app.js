import { gameLoop } from "../engine/partie.js";

const cards = [1, 2, 3, 5, 8, 13, 20, 40, 100];
const rule = "strict";
const players = ["Alice", "Bob", "Charlie"];

await gameLoop("exemples/exemple_backlog.json", players, cards, rule);