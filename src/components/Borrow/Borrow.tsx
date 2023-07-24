import { Button, Input, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import api from 'src/services/api';
import { Pool, WrappedPool } from 'src/types';
import { formatEther } from 'viem';
import AvailablePool from '../Lend/AvailablePool';
import Collection from '../Lend/Collection';
import DrawerBorrow from './DrawerBorrow';
import { debounce } from 'lodash';

const columns = [
  {
    accessor: 'collection',
    width: '25%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { collection_name, image } }: WrappedPool) => (
      <Collection name={collection_name} img={image} />
    ),
  },
  {
    accessor: 'totalPoolAmount',
    width: '20%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { total_pool_amount }, loan_count }: WrappedPool) => (
      <AvailablePool
        number={formatEther(total_pool_amount || 0n)}
        description={loan_count}
      />
    ),
  },
  {
    accessor: 'bestOffer',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ loan_max_amount }: WrappedPool) => (
      <Text size="lg" weight={700}>
        {formatEther(loan_max_amount || 0n)}
      </Text>
    ),
  },
  {
    accessor: 'APY',
    width: '15%',
    sortable: true,
    titleStyle: { fontSize: '25px' },
    render: ({ pool: { apy } }: WrappedPool) => (
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
    render: ({ pool: { duration } }: WrappedPool) => (
      <Text size="30px" weight={700}>
        {Number(duration)}d
      </Text>
    ),
  },
];

export default function Borrow() {
  const [pool, setPool] = useState<Pool>();
  const [nameSearch, setNameSearch] = useState('');
  const handleSearch = debounce((value) => {
    setNameSearch(value.target.value);
  }, 400);
  const { data: pools } = useQuery<WrappedPool[]>({
    queryKey: ['pools', nameSearch],
    queryFn: () => api.get(`/pools/loan?name=${nameSearch}`),
  });
  return (
    <>
      <DrawerBorrow
        opened={Boolean(pool)}
        close={() => setPool(undefined)}
        data={pool}
      />
      <div className="container">
        <div style={{ maxWidth: '990px' }}>
          <Title size="3.2rem">Make loan offers on NFT collections.</Title>
          <Text fz="lg">
            Take out a loan right away using your NFTs. Your NFT will be
            transferred to the smart contract whenever you accept a loan offer.
            To automatically receive the NFT returned, you must successfully
            repay the loan in full by the due date. If not, the lender could
            take your NFT, making it impossible for you to obtain it back.
          </Text>
        </div>
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <Input
            icon={<IconSearch />}
            size="xl"
            placeholder="search collections..."
            onChange={handleSearch}
          />
        </div>

        <DataTable
          records={pools?.filter(({ pool }) => pool?.state) || []}
          columns={[
            ...columns,
            {
              accessor: ' ',
              width: '10%',
              render: (dataPool) => (
                <Button onClick={() => setPool(dataPool.pool)} size="md">
                  Borrow
                </Button>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
