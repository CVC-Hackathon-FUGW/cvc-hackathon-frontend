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
import { Collection, Nft } from 'src/types';
import { parseEther, zeroAddress } from 'viem';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import NFTCard from './NFTCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'src/services/api';
import { ListNftContractParams, MarketNft } from './types';

interface CreateMarketItemProps {
  opened: boolean;
  onClose: () => void;
}

const CreateMarketItem = (props: CreateMarketItemProps) => {
  const { opened, onClose } = props;
  const [active, setActive] = useState(0);
  const [selectedNft, setSelectedNft] = useState<Nft>();

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));

  const { address } = useAccount();

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      price: 0,
      isVisaAccepted: false,
      isOfferable: false,
    },
  });

  const { data: listNftContract } = useQuery({
    queryKey: ['get-marketItems'],
    queryFn: () => api.get<void, Collection[]>('/marketCollections'),
    initialData: [],
    select: (data) => data?.map(({ token_address }) => token_address) || [],
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
  // call the contract to list the nft
  const { write: listNft } = useContractWrite({
    ...contractMarket,
    functionName: 'CreateMarketItem',
    value: borrowPrice,
    account: address,
  });
  // call the api to add the nft to the collection
  const { mutate: addMarketItem } = useMutation({
    mutationKey: ['add-marketItem'],
    mutationFn: (params: MarketNft) => api.post('/marketItems', params),
  });

  const handleListNft = async ({
    nftContract,
    tokenId = 0n,
    price = '0',
    isVisaAccepted = false,
    isOfferable = false,
  }: ListNftContractParams) => {
    addMarketItem({
      accept_visa_payment: isVisaAccepted,
      is_offerable: isOfferable,
      price: BigInt(parseEther(price)),
      address: nftContract,
      current_offer_value: 0n,
      current_offerer: zeroAddress,
      owner: zeroAddress,
      seller: address,
      token_id: tokenId,
      sold: false,
    });
    listNft({
      args: [
        nftContract,
        tokenId,
        parseEther(price),
        isVisaAccepted,
        isOfferable,
      ],
    });
    onClose();
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
      <Stepper
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Select NFT" description="Select NFT to list">
          {listNftContract?.map((nftContract) => (
            <NFTCollection
              key={nftContract}
              nftContract={opened ? nftContract : undefined}
              selectedNft={selectedNft}
              onItemClick={setSelectedNft as any}
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
