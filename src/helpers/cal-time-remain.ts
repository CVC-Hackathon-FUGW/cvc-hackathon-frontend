export const calTimeRemain = (
  duration?: bigint,
  start_time?: bigint | number
) => {
  const unixTime =
    Number(start_time) +
    Number(duration) * 86400 -
    Math.floor(Date.now() / 1000);

  return unixTime;
};
