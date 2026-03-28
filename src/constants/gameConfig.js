export const QUEST_DIFFICULTIES = {
  EASY: {
    label: 'E-Rank',
    xp: 20,
    color: '#888888',
  },
  NORMAL: {
    label: 'D-Rank',
    xp: 50,
    color: '#00d4ff',
  },
  HARD: {
    label: 'C-Rank',
    xp: 100,
    color: '#7b2fff',
  },
  LEGENDARY: {
    label: 'S-Rank',
    xp: 250,
    color: '#ffaa00',
  },
};

export const RANKS = [
  { minLevel: 1,  maxLevel: 9,  rank: 'E',  label: 'E-Class Hunter',  color: '#888888' },
  { minLevel: 10, maxLevel: 19, rank: 'D',  label: 'D-Class Hunter',  color: '#00d4ff' },
  { minLevel: 20, maxLevel: 29, rank: 'C',  label: 'C-Class Hunter',  color: '#00ff88' },
  { minLevel: 30, maxLevel: 39, rank: 'B',  label: 'B-Class Hunter',  color: '#7b2fff' },
  { minLevel: 40, maxLevel: 49, rank: 'A',  label: 'A-Class Hunter',  color: '#ff8800' },
  { minLevel: 50, maxLevel: Infinity, rank: 'S',  label: 'S-Class Hunter',  color: '#ffaa00' },
];

export function getXpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getRankForLevel(level) {
  return (
    RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) || RANKS[RANKS.length - 1]
  );
}
