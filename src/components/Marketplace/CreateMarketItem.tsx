import {
  Button,
  Collapse,
  Group,
  LoadingOverlay,
  Modal,
  Stepper,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { IconExternalLink } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  abiNft,
  addressMarket,
  borrowPrice,
  contractMarket,
} from 'src/configs/contract';
import useMerchantId from 'src/hooks/useMerchantId';
import api from 'src/services/api';
import { Collection, Nft } from 'src/types';
import { parseEther, zeroAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import PayPalMerchantId from '../common/PayPalMerchantId';
import NFTCard from './NFTCard';
import NFTCollection from './NFTCollection';
import { ListNftContractParams, MarketNft } from './types';

interface CreateMarketItemProps {
  opened: boolean;
  onClose: () => void;
  collection?: Collection;
}

const CreateMarketItem = (props: CreateMarketItemProps) => {
  const { opened, onClose, collection } = props;
  const [selectedNft, setSelectedNft] = useState<Nft>();
  const [step, setStep] = useState(0);

  const { address } = useAccount();
  const [{ isPending }] = usePayPalScriptReducer();
  const merchantId = useMerchantId();

  const { onSubmit, getInputProps, values } = useForm({
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
      setStep(1);
    },
    enabled: !!allowance?.hash,
  });
  // call the contract to list the nft
  const { writeAsync: listNft } = useContractWrite({
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
    merchantId = '',
  }: ListNftContractParams) => {
    await listNft({
      args: [
        nftContract,
        tokenId,
        parseEther(price),
        isVisaAccepted,
        isOfferable,
        merchantId,
      ],
    });
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
      merchant_id: merchantId,
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
      size="85%"
      centered
    >
      <Stepper
        active={step}
        onStepClick={setStep}
        breakpoint="sm"
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Select NFT" description="Select NFT to list">
          <div className="flex flex-col gap-4">
            <NFTCollection
              nftContract={opened ? collection?.token_address : undefined}
              selectedNft={selectedNft}
              onItemClick={setSelectedNft as any}
            />
          </div>
          <Group position="center" m={'md'}>
            <Button
              disabled={!selectedNft}
              onClick={() => {
                if (approved) {
                  return setStep(1);
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
          <div className="grid grid-cols-2 gap-4">
            <NFTCard
              tokenId={selectedNft?.tokenId}
              nftContract={selectedNft?.nftContract}
            />
            <form
              className="flex flex-col gap-4"
              onSubmit={onSubmit((values) =>
                handleListNft({
                  ...values,
                  price: values.price.toString(),
                  nftContract: selectedNft?.nftContract,
                  tokenId: selectedNft?.tokenId,
                  merchantId,
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
                label="Offerable"
                {...getInputProps('isOfferable', { type: 'checkbox' })}
              />
              <Switch
                label="Accept PayPal"
                {...getInputProps('isVisaAccepted', { type: 'checkbox' })}
              />
              <Collapse in={values.isVisaAccepted}>
                {merchantId ? (
                  <PayPalMerchantId merchantId={merchantId} size="lg" />
                ) : (
                  <Button
                    variant="light"
                    component="a"
                    href={'/profile'}
                    target="_blank"
                    rightIcon={<IconExternalLink />}
                  >
                    Connect PayPal
                  </Button>
                )}
              </Collapse>
              <Button
                type="submit"
                className="mt-auto"
                disabled={values.isVisaAccepted && !merchantId}
              >
                List NFT
              </Button>
              <LoadingOverlay visible={isPending} />
            </form>
          </div>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
};

export default CreateMarketItem;
