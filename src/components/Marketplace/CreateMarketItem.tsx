import { Carousel } from '@mantine/carousel';
import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Stepper,
  Switch,
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
import NFTCollection from './NFTCollection';

interface CreateMarketItemProps {
  opened: boolean;
  onClose: () => void;
}

const CreateMarketItem = (props: CreateMarketItemProps) => {
  const { opened, onClose } = props;
  const [selectedNft, setSelectedNft] = useState<Nft>();
  const [step, setStep] = useState(0);

  const nextStep = () =>
    setStep((current) => (current < 2 ? current + 1 : current));

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
      setStep(1);
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
  const { mutateAsync: addMarketItem } = useMutation({
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
    await addMarketItem({
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
        active={step}
        onStepClick={setStep}
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

            <Switch
              label="Accept PayPal"
              {...getInputProps('isVisaAccepted', { type: 'checkbox' })}
            />
            <Switch
              label="Offerable"
              {...getInputProps('isOfferable', { type: 'checkbox' })}
            />

            <Button type="submit">List NFT</Button>
          </form>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
};

export default CreateMarketItem;
