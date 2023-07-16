import { Carousel } from '@mantine/carousel';
import { rem } from '@mantine/core';
import useNftDetector from 'src/hooks/useNftDetector';
import { Nft } from 'src/types';
import { Address } from 'wagmi';
import NFTCard from './NFTCard';

const NFTCollection = ({
  nftContract,
  onItemClick,
  selectedNft,
}: {
  nftContract?: Address;
  onItemClick: (nft: Partial<Nft>) => void;
  selectedNft?: Nft;
}) => {
  const nftIds = useNftDetector(nftContract);

  return (
    <Carousel
      slideSize="33%"
      breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: rem(2) }]}
      slideGap="xl"
      align="start"
    >
      {nftIds?.map((tokenId) => (
        <Carousel.Slide key={tokenId.toString()}>
          <NFTCard
            tokenId={tokenId}
            nftContract={nftContract}
            selectedNft={selectedNft}
            onClick={onItemClick}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
export default NFTCollection;
