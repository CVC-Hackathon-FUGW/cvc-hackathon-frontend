import { abiNft } from 'src/configs/contract';
import { Abi, Address, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

const useNftDetector = (nftAddress?: Address) => {
  const { address } = useAccount();

  const { data: numberOfNFTs } = useContractRead({
    address: nftAddress,
    abi: abiNft,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!nftAddress,
    select: (data) => Number(data),
  });

  const { data: nftIds } = useContractReads({
    contracts: Array.from({
      length: numberOfNFTs || 0,
    }).map((_, index) => ({
      address: nftAddress,
      abi: abiNft as Abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address || zeroAddress, BigInt(index)],
    })),
    enabled: !!nftAddress,
    select: (data) => data.map(({ result }) => result),
  });

  return nftIds as bigint[];
};

export default useNftDetector;
