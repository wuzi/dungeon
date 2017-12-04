export function randomInteger(min, max, { onlyOdd = false, onlyEven = false } = {}) {
  if (onlyOdd) return randomOddInteger(min, max);
  else if (onlyEven) return randomEvenInteger(min, max);
  else return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomEvenInteger(min, max) {
  if (min % 2 !== 0 && min < max) min++;
  if (max % 2 !== 0 && max > min) max--;
  const range = (max - min) / 2;
  return Math.floor(Math.random() * (range + 1)) * 2 + min;
}

export function randomOddInteger(min, max) {
  if (min % 2 === 0) min++;
  if (max % 2 === 0) max--;
  const range = (max - min) / 2;
  return Math.floor(Math.random() * (range + 1)) * 2 + min;
}

export function randomPick(array) {
  return array[randomInteger(0, array.length - 1)];
}
