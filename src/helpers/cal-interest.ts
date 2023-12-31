// amount * APY * durations)/100/365;
export const calculateInterest = (
  amount: number,
  APY: number,
  duration: number,
  round = 12
) => {
  return ((amount * APY * duration) / 100 / 365).toFixed(round);
};

// now > startTime + duration*86400
export const isLoanEnded = (startTime: number, duration: number) => {
  const now = Math.floor(Math.floor(Date.now() / 1000));
  return now > startTime + duration * 86400;
};
