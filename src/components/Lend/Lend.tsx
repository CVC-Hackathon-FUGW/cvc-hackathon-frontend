import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import { Pool } from 'src/types';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import AvailablePool from './AvailablePool';
import Collection from './Collection';
import ModalLend from './ModalLend';

const tempImage =
  'https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg';

export default function Lend() {
  const [pool, setPool] = useState<Pool>();

  const { data: pools } = useContractRead({
    ...contractMortgage,
    functionName: 'getAllPool',
    watch: true,
  });

  // Mapping data to record
  const dataRecord = (pools as Pool[])
    .filter(({ state }) => state)
    ?.map((dataPool) => {
      const { APY, duration, tokenAddress, totalPoolAmount } = dataPool;
      return {
        collection: (
          <Collection img={tempImage} name={truncateMiddle(tokenAddress)} />
        ),
        availablePool: (
          <AvailablePool
            number={formatEther(totalPoolAmount)}
            description="1344 of 1410 offers taken"
          />
        ),
        bestOffer: 'Pending',
        apy: (
          <Text size="30px" weight={700} color="green">
            {Number(APY)}%
          </Text>
        ),
        duration: (
          <Text size="30px" weight={700}>
            {Number(duration)}d
          </Text>
        ),
        ' ': (
          <Button onClick={() => setPool(dataPool)} color="red" size="md">
            Lend
          </Button>
        ),
      };
    });

  return (
    <>
      <ModalLend
        opened={Boolean(pool)}
        close={() => setPool(undefined)}
        data={pool}
      />
      <div className="container">
        <div style={{ maxWidth: '990px' }}>
          <Title size="3.2rem">Make loan offers on NFT collections.</Title>
          <Text fz="lg">
            Browse collections below, and name your price. The current best
            offer will be shown to borrowers. To take your offer, they lock in
            an NFT from that collection to use as collateral. You will be repaid
            at the end of the loan, plus interest. If they fail to repay, you
            get to keep the NFT.
          </Text>
        </div>
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <Input
            icon={<IconSearch />}
            variant="filled"
            size="xl"
            placeholder="search collections..."
          />
        </div>

        <DataTable
          records={dataRecord}
          columns={[
            {
              accessor: 'collection',
              width: '25%',
              sortable: true,
              titleStyle: { fontSize: '25px' },
            },
            {
              accessor: 'availablePool',
              width: '20%',
              sortable: true,
              titleStyle: { fontSize: '25px' },
            },
            {
              accessor: 'bestOffer',
              width: '15%',
              sortable: true,
              titleStyle: { fontSize: '25px' },
            },
            {
              accessor: 'apy',
              width: '15%',
              sortable: true,
              titleStyle: { fontSize: '25px' },
            },
            {
              accessor: 'duration',
              width: '15%',
              sortable: true,
              titleStyle: { fontSize: '25px' },
            },
            { accessor: ' ', width: '10%' },
          ]}
        />
      </div>
    </>
  );
}
