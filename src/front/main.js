import { createGame } from "../engine/partie.js";

const playersList = document.getElementById("playersList");

function addPlayer() {
    const row = document.createElement("tr");
    row.innerHTML = '<td><input type="text" name="playerName" placeholder="Nom du joueur"></td>';
    playersList.appendChild(row);
}

document.getElementById("addPlayerBtn").addEventListener("click", addPlayer);