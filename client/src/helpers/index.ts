const makePaddedNumber = (v: number) => {
  return v.toString().padStart(2, '0');
};

export const secondsToDisplay = (seconds: number) => {
  let remain = seconds;

  const h = Math.floor(remain / 3600);
  remain -= 3600 * h;

  const m = Math.floor(remain / 60);
  remain -= 60 * m;

  const s = remain;

  const tokens = [];
  if (h > 0) {
    tokens.push(h);
    tokens.push(makePaddedNumber(m));
    tokens.push(makePaddedNumber(s));

  } else {
    tokens.push(m);
    tokens.push(makePaddedNumber(s));
  }

  return tokens.join(':');
};
