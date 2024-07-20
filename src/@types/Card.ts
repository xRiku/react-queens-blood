export type CardInfo = {
  name: string;
  pawnsPositions: number[][];
  affectedPositions?: number[][];
  affectedAllyEffectValue?: number;
  affectedEnemyEffectValue?: number;
  points: number;
  pawnsCost: number;
  placedByPlayerOne?: boolean;
};

export type CardUnity = CardInfo & { id: number };
