export const truncateMiddle = (
  text?: string,
  { separator = '...', length = 16 } = {}
) => {
  if (!text) return '';
  if (text.length <= length) return text;

  const separatorLength = separator.length;
  const charsToShow = length - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return `${text.substring(0, frontChars)}${separator}${text.substring(
    text.length - backChars
  )}`;
};
