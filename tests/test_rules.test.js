import { describe, it, expect } from 'vitest';
import { validateVote } from '../src/engine/partie.js';

describe('Valider un vote', () => {
    it('test_CA_02_01_strict_tour_1', () => {
        const rule = "strict";
        const turn = 1;
        const votes = [5,5,5];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(5);
    });

    it('test_CA_03_01_strict_tour_2', () => {
        const rule = "strict";
        const turn = 2;
        const votes = [5,5,8];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(-1);
    });

    it('test_CA_02_01_majorite_nette_sans_unanimite', () => {
        const rule = "majority_absolute";
        const turn = 1;
        const votes = [5,8,8,8];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(-1);
    });

    it('test_CA_02_01_majorite_nette_avec_unanimite', () => {
        const rule = "majority_absolute";
        const turn = 1;
        const votes = [8,8,8,8];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(8);
    });

    it('test_CA_07_01_majorite_nette_consensus_tour_2', () => {
        const rule = "majority_absolute";
        const turn = 2;
        const votes = [5,8,8,8];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(8);
    });

    it('test_CA_07_01_majorite_nette_egalite_tour_2', () => {
        const rule = "majority_absolute";
        const turn = 2;
        const votes = [5,5,8,8];

        const result = validateVote(votes, rule, turn);

        expect(result).toBe(-1);
    });
});