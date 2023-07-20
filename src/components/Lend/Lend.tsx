import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import api from 'src/services/api';
import { Pool } from 'src/types';
import { formatEther } from 'viem';
import AvailablePool from './AvailablePool';
import Collection from './Collection';
import ModalLend from './ModalLend';
import { debounce } from 'lodash';

const columns = [
  {
    accessor: 'collection',
    width: '25%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ collection_name, image }: Pool) => (
      <Collection img={image} name={collection_name} />
    ),
  },
  {
    accessor: 'totalPoolAmount',
    width: '20%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ total_pool_amount }: Pool) => (
      <AvailablePool
        number={formatEther(total_pool_amount || 0n)}
        description="1344 of 1410 offers taken"
      />
    ),
  },
  {
    accessor: 'bestOffer',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: () => 'Pending',
  },
  {
    accessor: 'APY',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ apy }: Pool) => (
      <Text size="30px" weight={700} color="green">
        {Number(apy)}%
      </Text>
    ),
  },
  {
    accessor: 'duration',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ duration }: Pool) => (
      <Text size="30px" weight={700}>
        {Number(duration)}d
      </Text>
    ),
  },
];

export default function Lend() {
  const [pool, setPool] = useState<Pool>();
  const [nameSearch, setNameSearch] = useState('')
  const handleSearch = debounce((value) => {
    setNameSearch(value.target.value);
  }, 400);

  const { data: pools } = useQuery<Pool[]>({
    queryKey: ['pools',nameSearch],
    queryFn: () => api.get(`/pools?name=${nameSearch}`),
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
            onChange={handleSearch}
          />
        </div>

        <DataTable
          records={(pools as Pool[])?.filter(({ state }) => state) || []}
          columns={[
            ...columns,
            {
              accessor: ' ',
              width: '10%',
              render: (dataPool) => (
                <Button onClick={() => setPool(dataPool)} size="md">
                  Lend
                </Button>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
