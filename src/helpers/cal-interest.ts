// amount * APY * durations)/100/365;
export const calculateInterest = (
  amount: number,
  APY: number,
  duration: number
) => {
  return (amount * APY * duration) / 100 / 365;
};

// now > startTime + duration*86400
export const isLoanEnded = (startTime: number, duration: number) => {
  const now = Math.floor(Date.now() / 1000);
  return now > startTime + duration * 86400;
};
