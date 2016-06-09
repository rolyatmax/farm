// @flow

import expect from 'expect';
import { DEFAULT_LIFESPAN, MUTATION_RATE } from './settings';
import { rand, pI, leftPad } from './utils';
import type { Vector, Color } from './utils'; // eslint-disable-line


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

export function dnaToProps(dna: string): CreatureProps {
  return {
    size: pI(dna.slice(0, 2)),
    color: [
      pI(dna.slice(2, 5)),
      pI(dna.slice(5, 8)),
      pI(dna.slice(8, 11)),
      Math.max(0.1, pI(dna.slice(11, 13)) / 120),
    ],
    velocity: [
      (pI(dna.slice(13, 15)) - 50) / 25,
      (pI(dna.slice(15, 17)) - 50) / 25,
    ],
  };
}

export function createRandomDNA(): string {
  const size = leftPad(rand(100), 2);
  const r = leftPad(rand(256), 3);
  const g = leftPad(rand(256), 3);
  const b = leftPad(rand(256), 3);
  const a = leftPad(rand(100), 2);
  const x = leftPad(rand(100), 2);
  const y = leftPad(rand(100), 2);
  return [size, r, g, b, a, x, y].join('');
}

export function mergeDNA(dna1: string, dna2: string): string {
  const cut = rand(dna1.length);
  const genes = '1234567890';
  const dna = (dna1.slice(0, cut) + dna2.slice(cut)).split('');
  for (let i = 0; i < dna.length; i++) {
    if (Math.random() < MUTATION_RATE) dna[i] = genes[rand(genes.length)];
  }
  return dna.join('');
}

export function createCreature(position: Vector, dna: string): Creature {
  const lifespan = DEFAULT_LIFESPAN;
  const birthdate = Date.now();
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


expect(leftPad(15, 3)).toBe('015');
expect(leftPad(15, 2)).toBe('15');
expect(leftPad('15', 4)).toBe('0015');
expect(mergeDNA('abcdefg', 'hijklmn').length).toBe(7, 'mergeDNA: output length does not match');
const dnaTestIn = ['12', '053', '012', '245', '21', '75', '30'].join('');
const dnaTestOut = dnaToProps(dnaTestIn);
expect(dnaTestOut).toEqual({
  size: 12,
  color: [53, 12, 245, 0.175],
  velocity: [1, -0.8],
}, `dnaToProps: output does not match input.\n\ninput: ${dnaTestIn} \n\noutput: ${dnaTestOut}`);
console.log('Tests pass!');
