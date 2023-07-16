import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMemo, useState } from 'react';
import {
  abiNft,
  addressMortgage,
  contractMortgage,
} from 'src/configs/contract';
import { calculateInterest } from 'src/helpers/cal-interest';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import useNftDetector from 'src/hooks/useNftDetector';
import { ContractLoan, Nft, Pool } from 'src/types';
import { tempImage } from 'src/utils/contains';
import { formatEther, zeroAddress } from 'viem';
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import NFTCollection from '../Marketplace/NFTCollection';

interface ModalLendProps {
  opened: boolean;
  close: () => void;
  data?: Pool;
}

export default function DrawerBorrow({ opened, close, data }: ModalLendProps) {
  const { apy, duration, image, pool_id, token_address } = { ...data };
  const [selectedLoan, setSelectedLoan] = useState<ContractLoan | null>();
  const [step, setStep] = useState(0);
  const [selectedNft, setSelectedNft] = useState<Nft>();

  const nftIds = useNftDetector(token_address);
  console.log(nftIds);

  const { data: allLoans } = useContractRead<
    unknown[],
    'getAllLoans',
    ContractLoan[]
  >({
    ...contractMortgage,
    functionName: 'getAllLoans',
  });

  const { data: floorPriceGwei } = useContractRead({
    ...contractMortgage,
    functionName: 'getFloorPrice',
    args: [token_address],
    enabled: opened,
  });

  const { data: approved } = useContractRead({
    address: token_address,
    abi: abiNft,
    functionName: 'getApproved',
    args: [selectedNft?.tokenId],
    enabled: !!selectedNft?.tokenId,
    select: (value) => value === addressMortgage,
  });

  const {
    write: approve,
    reset,
    data: allowance,
  } = useContractWrite({
    address: token_address,
    abi: abiNft,
    functionName: 'approve',
  });

  const { write: borrow } = useContractWrite({
    ...contractMortgage,
    functionName: 'BorrowerTakeLoan',
  });

  const { isLoading } = useWaitForTransaction({
    hash: allowance?.hash,
    onSuccess: () =>
      notifications.show({
        title: 'Approve successfully',
        message: 'You can now Borrow',
      }),
  });

  const loans = useMemo(() => {
    if (allLoans) {
      return allLoans.filter(
        (loan) =>
          Number(loan.poolId) === pool_id &&
          !loan.state &&
          loan.lender !== zeroAddress
      );
    }
  }, [allLoans, pool_id]);

  const floorPrice = useMemo(() => {
    if (floorPriceGwei) {
      return Number(formatEther(floorPriceGwei as bigint));
    }
    return 0;
  }, [floorPriceGwei]);

  const nextStep = () =>
    setStep((current) => (current < 2 ? current + 1 : current));

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setSelectedLoan(null);
        reset();
        close();
      }}
      size={'xl'}
      centered
    >
      <div className="flex flex-row gap-2 items-center justify-between mb-10">
        <Group className="flex flex-row gap-2 items-center">
          <Avatar
            size="lg"
            src={image || tempImage}
            radius="xl"
            alt="it's me"
          />
          <Title order={3}>{truncateMiddle(token_address)}</Title>
        </Group>
        <Group className="flex flex-row gap-2 items-center">
          <Card
            shadow="sm"
            padding="xs"
            radius="md"
            withBorder
            className="w-fit"
          >
            <Text weight={700} size="20px">
              Floor
            </Text>
            <Text weight={700} size="20px">
              XCR {floorPrice}
            </Text>
          </Card>
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            className="w-fit"
          >
            <Text weight={700} size="20px">
              Duration
            </Text>
            <Text weight={700} size="20px">
              {Number(duration)}d
            </Text>
          </Card>
        </Group>
      </div>
      <Stepper
        active={step}
        onStepClick={setStep}
        breakpoint="sm"
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Select NFT" description="Select NFT">
          <NFTCollection
            nftContract={opened ? token_address : undefined}
            selectedNft={selectedNft}
            onItemClick={setSelectedNft as any}
          />
          <Group position="center" m={'md'}>
            <Button
              disabled={!selectedNft}
              onClick={() => {
                if (approved) {
                  return nextStep();
                }
                return approve({
                  args: [addressMortgage, selectedNft?.tokenId],
                });
              }}
            >
              {approved ? 'Next' : 'Approve'}
            </Button>
          </Group>
          <LoadingOverlay visible={isLoading} />
        </Stepper.Step>
        <Stepper.Step label="Select a loan" description="Select a loan">
          <div className="flex flex-row overflow-x-auto gap-2">
            {loans?.map((loan) => (
              <Card
                withBorder
                shadow="sm"
                radius="md"
                className="w-full"
                key={loan.loanId.toString()}
                onClick={() => setSelectedLoan(loan)}
                c={selectedLoan?.loanId === loan.loanId ? 'blue' : 'gray'}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Card.Section
                  p="sm"
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex flex-col gap-2">
                    <Text size="xl" fw="bold">
                      {truncateMiddle(loan.tokenAddress)}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Lender: {truncateMiddle(loan.lender)}
                    </Text>
                  </div>
                  <Badge variant="outline">
                    XCR {formatEther(loan.amount)}
                  </Badge>
                </Card.Section>
                <Divider />
                <Card.Section p="sm">
                  <Text>
                    Interest:{' '}
                    {calculateInterest(
                      Number(formatEther(loan.amount)),
                      Number(apy),
                      Number(duration)
                    )}
                  </Text>
                </Card.Section>
              </Card>
            ))}
          </div>
        </Stepper.Step>
      </Stepper>
      <div className="flex flex-col gap-2">
        {/* <Divider /> */}

        {/* <form
          className="flex flex-col gap-2"
          onSubmit={onSubmit(({ tokenId }) => {
            if (!tokenId) return;
            const bigTokenId = BigInt(tokenId);
            if (isSuccess || isApproved) {
              return borrow({
                args: [pool_id, bigTokenId, selectedLoan?.loanId],
              });
            }
            return approve({
              args: [addressMortgage, bigTokenId],
            });
          })}
        >
          <Input {...getInputProps('tokenId')} placeholder="Enter Token ID" />
          <Group position="center">
            <Button disabled={!selectedLoan && !isApproved} type="submit">
              {isSuccess || isApproved ? 'Borrow' : 'Approve'}
            </Button>
          </Group>
        </form> */}
      </div>
    </Modal>
  );
}
