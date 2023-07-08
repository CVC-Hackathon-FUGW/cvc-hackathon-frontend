// amount * APY * durations)/100/365;
export const calculateInterest = (
  amount: number,
  APY: number,
  duration: number
) => {
  return (amount * APY * duration) / 100 / 365;
};
