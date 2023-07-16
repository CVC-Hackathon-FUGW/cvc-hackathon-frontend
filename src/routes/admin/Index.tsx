import { Avatar, Button, Divider, Group, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { contractMortgage } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import api from 'src/services/api';
import { Collection, ContractPool } from 'src/types';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import CreatePool from './components/CreatPool';
import EditPool from './components/EditPool';
import UpdateFloorPrice from './components/UpdateFloorPrice';
import CreateCollection from './components/CreateCollection';
import ShowAddress from 'src/components/common/ShowAddress';
import { notifications } from '@mantine/notifications';
import useAdmin from 'src/hooks/useAdmin';

const poolColumns = [
  {
    accessor: 'tokenAddress',
    width: '15%',
    render: (value: ContractPool) => `${truncateMiddle(value.tokenAddress)}`,
  },
  {
    accessor: 'APY',
    width: '25%',
    cellsStyle: { color: 'green', fontWeight: 'bold' },
    render: (value: ContractPool) => `${Number(value.APY)}%`,
  },
  {
    accessor: 'Duration',
    width: '20%',
    render: (value: ContractPool) => `${Number(value.duration)}d`,
  },
  {
    accessor: 'poolId',
    width: '15%',
    render: (value: ContractPool) => `${Number(value.poolId)}`,
  },
  {
    accessor: 'TotalPoolAmount',
    width: '15%',
    render: (value: ContractPool) => `${formatEther(value.totalPoolAmount)}`,
  },
];

const Admin = () => {
  const [editingPool, setEditingPool] = useState<ContractPool | null>(null);
  const [createAction, setCreateAction] = useState<'pool' | 'collection'>();
  const { isAdmin } = useAdmin();
  const { data: pools } = useContractRead<
    unknown[],
    'getAllPool',
    ContractPool[]
  >({
    ...contractMortgage,
    functionName: 'getAllPool',
    watch: true,
  });

  const { data: marketCollections, refetch } = useQuery<Collection[]>({
    queryFn: () => api.get('/marketCollections'),
    queryKey: ['get-marketItems'],
  });

  const { mutate } = useMutation({
    mutationFn: (id: number) => api.delete(`/marketCollections/${id}`),
    onSuccess: () => {
      refetch();
      notifications.show({
        title: 'Success',
        message: 'Collection deleted',
      });
    },
  });

  const openFloorPriceModal = ({ tokenAddress }: ContractPool) => {
    modals.open({
      title: 'Update Floor Price',
      centered: true,
      children: <UpdateFloorPrice tokenAddress={tokenAddress} />,
    });
  };

  const openDeleteModal = ({ collection_id }: Collection) => {
    modals.openConfirmModal({
      title: 'Delete Collection',
      centered: true,
      onConfirm: () => mutate(collection_id),
      confirmProps: { color: 'red' },
      labels: {
        cancel: 'Cancel',
        confirm: 'Delete',
      },
    });
  };

  if (!isAdmin) {
    return <Text>You can't access this page</Text>;
  }

  return (
    <div className="container">
      <Title>Mortgages</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('pool')}>Create Pool</Button>
      </Group>
      <DataTable
        records={pools || []}
        columns={[
          ...poolColumns,
          {
            accessor: ' ',
            render: (value: ContractPool) => (
              <div className="flex flex-row gap-2">
                <Button onClick={() => setEditingPool(value)}>Update</Button>
                <Button onClick={() => openFloorPriceModal(value)} color="teal">
                  Set Floor price
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Divider variant="dashed" className="my-5" />
      <Title>Marketplace collection</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('collection')}>
          Create Collection
        </Button>
      </Group>
      <DataTable
        records={marketCollections || []}
        columns={[
          {
            accessor: 'Image',
            render: (value) => <Avatar src={value.image} />,
          },
          {
            accessor: 'collection_name',
          },
          {
            accessor: 'token_address',
            cellsStyle: { color: 'green', fontWeight: 'bold' },
            render: (value) => <ShowAddress address={value.token_address} />,
          },
          {
            accessor: ' ',
            render: (value) => (
              <div className="flex flex-row gap-2">
                <Button color="red" onClick={() => openDeleteModal(value)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
      <CreatePool
        opened={createAction === 'pool'}
        close={() => setCreateAction(undefined)}
      />
      <CreateCollection
        opened={createAction === 'collection'}
        close={() => {
          refetch();
          setCreateAction(undefined);
        }}
      />
      <EditPool
        opened={Boolean(editingPool)}
        close={() => setEditingPool(null)}
        editingPool={editingPool}
        key={`${editingPool?.poolId}`}
      />
    </div>
  );
};

export default Admin;
