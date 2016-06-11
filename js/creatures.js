// @flow

import expect from 'expect';
import { DEFAULT_LIFESPAN, MUTATION_RATE } from './settings';
import { random } from 'utils';

type Vector = [number, number]; // each up to 3 digits
type Color = [number, number, number, number]; // each up to 255

export const pI = (val: string): number => parseInt(val, 10);

export type Creature = {
  dna: string,
  lifespan: number,
  birthdate: number,
  position: Vector,
  size: number, // 2 digits
  color: Color,
  velocity: Vector
};

type CreatureProps = {
  size: number, // 2 digits
  color: Color,
  velocity: Vector
};

const genes = '1234567890'.split('');

export function dnaToProps(dna: string): CreatureProps {
  return {
    size: pI(dna.slice(0, 2)),
    color: [
      pI(dna.slice(2, 5)) / 1000 * 256 | 0,
      pI(dna.slice(5, 8)) / 1000 * 256 | 0,
      pI(dna.slice(8, 11)) / 1000 * 256 | 0,
      Math.max(0.1, pI(dna.slice(11, 13)) / 120),
    ],
    velocity: [
      (pI(dna.slice(13, 15)) - 50) / 25,
      (pI(dna.slice(15, 17)) - 50) / 25,
    ],
  };
}

export function createRandomDNA(): string {
  let dnaLength = 17;
  let dna = '';
  while (dnaLength--) {
    dna += random(genes);
  }
  return dna;
}

export function mergeDNA(dna1: string, dna2: string): string {
  const cut = random(dna1.length);
  const dna = (dna1.slice(0, cut) + dna2.slice(cut)).split('');
  for (let i = 0; i < dna.length; i++) {
    if (Math.random() < MUTATION_RATE) dna[i] = random(genes);
  }
  return dna.join('');
}

export function createCreature(position: Vector, birthdate: number, dna: string): Creature {
  const lifespan = DEFAULT_LIFESPAN;
  return {
    dna,
    lifespan,
    birthdate,
    position,
    ...dnaToProps(dna),
  };
}

export function drawCreature(ctx: Object, c: Creature): void {
  const { position: [x, y], size: size, color: [r, g, b, a] } = c;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  ctx.fill();
}

export function updateCreature(ctx: Object, c: Creature): void {
  const [xP, yP] = c.position;
  if (xP > ctx.width || xP < 0) c.velocity[0] *= -1;
  if (yP > ctx.height || yP < 0) c.velocity[1] *= -1;
  const [xV, yV] = c.velocity;
  c.position = [xP + xV, yP + yV];
}


// ******** tests ********


expect(mergeDNA('abcdefg', 'hijklmn').length).toBe(7, 'mergeDNA: output length does not match');
const dnaTestIn = ['12', '500', '250', '999', '21', '75', '30'].join('');
const dnaTestOut = dnaToProps(dnaTestIn);
expect(dnaTestOut).toEqual({
  size: 12,
  color: [128, 64, 255, 0.175],
  velocity: [1, -0.8],
}, `dnaToProps: output does not match input.\n\ninput: ${dnaTestIn} \n\noutput: ${dnaTestOut}`);
console.log('Tests pass!');
