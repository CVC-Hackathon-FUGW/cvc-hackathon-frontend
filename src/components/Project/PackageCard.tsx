import {
  Button,
  Card,
  Group,
  Image,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { abiRaiseFundInside, contractCheckIn } from 'src/configs/contract';
import api from 'src/services/api';
import 'src/styles/nft-card.css';
import { Package } from 'src/types';
import { parseEther, zeroAddress } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';

interface PackageCardProps {
  _package?: Package;
  onClick?: (nft: Partial<Package>) => void;
  height?: string;
}

const PackageCard = (props: PackageCardProps) => {
  const { _package, onClick, height = '20rem' } = props;
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const {
    writeAsync: approve,
    reset,
    data: allowance,
  } = useContractWrite({
    ...contractCheckIn,
    functionName: 'approve',
  });

  const { writeAsync: raiseFund } = useContractWrite({
    address: _package?.project_address || zeroAddress,
    abi: abiRaiseFundInside,
    functionName: 'raiseFund',
  });

  const { mutateAsync: invest } = useMutation({
    mutationKey: ['invest'],
    mutationFn: (params: any) => api.post('/participant/invest', params),
  });

  return (
    <>
      <div className="card-container">
        <Card
          shadow="lg"
          padding="lg"
          radius="md"
          withBorder
          className="cursor-pointer grid gap-1 card"
          onClick={() => onClick?.({ ..._package })}
        >
          <Card.Section>
            <Image
              src={_package?.package_image}
              alt={_package?.package_name || 'Box Image'}
              withPlaceholder
              height={height}
            />
          </Card.Section>
          <Group position="apart" mt="md" mb="xs">
            <div className="">
              <Text weight={300}>Package name</Text>
              <Text weight={500}>{_package?.package_name || 'Unnamed'}</Text>
            </div>
            <div className="">
              <Text weight={300}>Package price</Text>
              <Text weight={500}>{_package?.package_price}</Text>
            </div>
            <div className="">
              <Text weight={300}>Package description</Text>
              <Text weight={500}>{_package?.package_description}</Text>
            </div>
          </Group>
          <Button
            fullWidth
            onClick={async () => {
              setLoading(true);
              try {
                if (_package?.package_price) {
                  const price = parseEther(`${_package.package_price}`);
                  const approveData = await approve({
                    args: [_package?.project_address, price],
                  });

                  await waitForTransaction(approveData);
                  const raiseFundData = await raiseFund({ args: [price] });
                  await waitForTransaction(raiseFundData);
                  await invest({
                    project_id: _package?.project_id,
                    project_name: _package?.project_name,
                    fund_attended: _package?.package_price,
                    participant_address: address,
                  });
                }
              } catch {
                //
              } finally {
                setLoading(false);
              }
            }}
          >
            Invest
          </Button>
        </Card>
      </div>
      <LoadingOverlay visible={loading} overlayBlur={2} />
    </>
  );
};

export default PackageCard;
