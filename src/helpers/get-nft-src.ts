export const getNftSrc = (src?: string) => {
  if (!src) {
    return '';
  }

  return src.replace('ipfs://', 'https://ipfs.io/ipfs/');
};
