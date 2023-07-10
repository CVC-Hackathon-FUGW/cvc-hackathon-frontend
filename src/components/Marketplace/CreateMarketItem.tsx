import { Carousel } from '@mantine/carousel';
import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Stepper,
  TextInput,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import {
  abiNft,
  addressMarket,
  borrowPrice,
  contractMarket,
} from 'src/configs/contract';
import useNftDetector from 'src/hooks/useNftDetector';
import { Nft } from 'src/types';
import { parseEther, zeroAddress } from 'viem';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import NFTCard from './NFTCard';

interface CreateMarketItemProps {
  opened: boolean;
  onClose: () => void;
}

const listNftAddress: Address[] = [
  '0xFB4b0A946AFbFb4267bB05B4e73e26481cEa983B',
];

const CreateMarketItem = (props: CreateMarketItemProps) => {
  const { opened, onClose } = props;
  const [active, setActive] = useState(0);
  const [selectedNft, setSelectedNft] = useState<Nft>();

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = getPublicClient();

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      price: 0,
      isVisaAccepted: false,
      isOfferable: false,
    },
  });

  const {
    write: approve,
    reset,
    data: allowance,
  } = useContractWrite({
    address: selectedNft?.nftContract || zeroAddress,
    abi: abiNft,
    functionName: 'approve',
  });
  const { data: approved } = useContractRead({
    address: selectedNft?.nftContract || zeroAddress,
    abi: abiNft,
    functionName: 'getApproved',
    args: [selectedNft?.tokenId],
    enabled: !!selectedNft?.nftContract,
    select: (data) => data === addressMarket,
  });

  const { isLoading } = useWaitForTransaction({
    hash: allowance?.hash,
    onSuccess: () => {
      setActive(1);
      notifications.show({
        title: 'Approve successfully',
        message: 'You can now Borrow',
      });
    },
    enabled: !!allowance?.hash,
  });

  const handleListNft = async ({
    nftContract = '',
    tokenId = 0n,
    price = '0',
    isVisaAccepted = false,
    isOfferable = false,
  }) => {
    try {
      const { request } = await publicClient.simulateContract({
        ...contractMarket,
        functionName: 'CreateMarketItem',
        value: borrowPrice,
        args: [
          nftContract,
          tokenId,
          parseEther(price),
          isVisaAccepted,
          isOfferable,
        ],
        account: address,
      });

      await walletClient?.writeContract(request);
      onClose();
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        reset();
        onClose();
      }}
      size={'xl'}
      centered
    >
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="Select NFT" description="Select NFT to list">
          {listNftAddress.map((nftAddress) => (
            <NFTCollection
              key={nftAddress}
              nftAddress={opened ? nftAddress : undefined}
              selectedNft={selectedNft}
              setSelectedNft={setSelectedNft}
            />
          ))}
          <Group position="center" m={'md'}>
            <Button
              disabled={!selectedNft}
              onClick={() => {
                if (approved) {
                  return nextStep();
                }
                approve({
                  args: [addressMarket, selectedNft?.tokenId],
                });
              }}
            >
              {approved ? 'Next' : 'Approve'}
            </Button>
          </Group>
          <LoadingOverlay visible={isLoading} />
        </Stepper.Step>
        <Stepper.Step
          label="Set Price & Approve"
          description="Set price for your NFT"
        >
          <form
            className="flex flex-col gap-4"
            onSubmit={onSubmit((values) =>
              handleListNft({
                ...values,
                price: values.price.toString(),
                nftContract: selectedNft?.nftContract,
                tokenId: selectedNft?.tokenId,
              })
            )}
          >
            <TextInput
              label="Price"
              placeholder="Enter price"
              type="number"
              {...getInputProps('price')}
            />
            <div className="flex flex-row items-center justify-evenly">
              <Checkbox
                label="Accept PayPal"
                {...getInputProps('isVisaAccepted', { type: 'checkbox' })}
              />
              <Checkbox
                label="Offerable"
                {...getInputProps('isOfferable', { type: 'checkbox' })}
              />
            </div>
            <Button type="submit">List NFT</Button>
          </form>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
};

export default CreateMarketItem;

const NFTCollection = ({
  nftAddress,
  setSelectedNft,
  selectedNft,
}: {
  nftAddress?: Address;
  setSelectedNft: (nft: Nft) => void;
  selectedNft?: Nft;
}) => {
  const nftIds = useNftDetector(nftAddress);

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
            nftAddress={nftAddress}
            selectedNft={selectedNft}
            setSelectedNft={setSelectedNft}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
