import { Avatar, Button, Divider, Group, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import ShowAddress from 'src/components/common/ShowAddress';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import useAdmin from 'src/hooks/useAdmin';
import { useIsMounted } from 'src/hooks/useIsMounted';
import api from 'src/services/api';
import { BoxCollection, Collection, Package, Pool, Project } from 'src/types';
import dayjs from 'src/utils/dayjs';
import { formatEther } from 'viem';
import CreatePool from './components/CreatPool';
import CreateBox from './components/CreateBox';
import CreateCollection from './components/CreateCollection';
import CreatePackage from './components/CreatePackage';
import CreateProject from './components/CreateProject';
import EditPool from './components/EditPool';
import UpdateFloorPrice from './components/UpdateFloorPrice';

const poolColumns = [
  {
    accessor: 'tokenAddress',
    width: '15%',
    render: (value: Pool) => `${truncateMiddle(value.token_address)}`,
  },
  {
    accessor: 'APY',
    width: '25%',
    cellsStyle: { color: 'green', fontWeight: 'bold' },
    render: (value: Pool) => `${Number(value.apy)}%`,
  },
  {
    accessor: 'Duration',
    width: '20%',
    render: (value: Pool) => `${Number(value.duration)}d`,
  },
  {
    accessor: 'poolId',
    width: '15%',
    render: (value: Pool) => `${Number(value.pool_id)}`,
  },
  {
    accessor: 'TotalPoolAmount',
    width: '15%',
    render: (value: Pool) => `${formatEther(value.total_pool_amount || 0n)}`,
  },
];

const Admin = () => {
  const [createAction, setCreateAction] = useState<
    'pool' | 'collection' | 'box' | 'project'
  >();
  const [editingPool, setEditingPool] = useState<Pool>();
  const [editingProject, setEditingProject] = useState<Project>();

  const { isAdmin } = useAdmin();
  const { data: pools } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: () => api.get('/pools'),
  });

  const { data: marketCollections, refetch } = useQuery<Collection[]>({
    queryFn: () => api.get('/marketCollections'),
    queryKey: ['get-marketItems'],
  });

  const { data: boxes } = useQuery<BoxCollection[]>({
    queryFn: () => api.get('/boxCollection'),
    queryKey: ['get-boxCollection'],
  });
  const { data: projects } = useQuery<Project[]>({
    queryFn: () => api.get('/project'),
    queryKey: ['get-project'],
  });

  const { mutateAsync: deleteCollection } = useMutation({
    mutationFn: (id: number) => api.delete(`/marketCollections/${id}`),
    onSuccess: () => {
      refetch();
      notifications.show({
        title: 'Success',
        message: 'Collection deleted',
      });
    },
  });

  const openFloorPriceModal = ({ token_address }: Pool) => {
    modals.open({
      title: 'Update Floor Price',
      centered: true,
      children: <UpdateFloorPrice tokenAddress={token_address} />,
    });
  };

  const openDeleteModal = ({ collection_id }: Collection) => {
    modals.openConfirmModal({
      title: 'Delete Collection',
      centered: true,
      onConfirm: () => deleteCollection(collection_id),
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
            render: (value: Pool) => (
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
        close={() => setEditingPool(undefined)}
        editingPool={editingPool}
        key={`${editingPool?.pool_id}`}
      />

      <Divider variant="dashed" className="my-5" />
      <Title>Boxes</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('box')}>Create Box</Button>
      </Group>
      <DataTable
        records={boxes || []}
        columns={[
          {
            accessor: 'Image',
            render: (value) => <Avatar src={value.image} />,
          },
          {
            accessor: 'box_collection_address',
            cellsStyle: { color: 'green', fontWeight: 'bold' },
            render: (value) => (
              <ShowAddress address={value.box_collection_address} />
            ),
          },
          {
            accessor: 'origin_address',
            cellsStyle: { color: 'green', fontWeight: 'bold' },
            render: (value) => <ShowAddress address={value.origin_address} />,
          },
        ]}
      />
      <CreateBox
        opened={createAction === 'box'}
        close={() => setCreateAction(undefined)}
      />
      <Divider variant="dashed" className="my-5" />
      <Title>Projects</Title>
      <Group position="right">
        <Button onClick={() => setCreateAction('project')}>
          Create Project
        </Button>
      </Group>
      <DataTable
        records={projects || []}
        columns={[
          {
            accessor: 'Image',
            render: (value) => <Avatar src={value.project_image} />,
          },
          {
            accessor: 'project_name',
            cellsStyle: { fontWeight: 'bold' },
          },
          {
            accessor: 'project_address',
            cellsStyle: { color: 'green', fontWeight: 'bold' },
            render: (value) => <ShowAddress address={value.project_address} />,
          },
          {
            accessor: 'total_raise_amount',
          },
          {
            accessor: 'project_description',
          },
          {
            accessor: 'project_owner',
            render: (value) => <ShowAddress address={value.project_owner} />,
          },
          {
            accessor: 'due_time',
            render: (value) => (
              <>{dayjs.unix(value.due_time).format('DD/MM/YYYY')}</>
            ),
          },
          {
            accessor: '',
            render: (value) => (
              <Button onClick={() => setEditingProject(value)}>
                Create package
              </Button>
            ),
          },
        ]}
        rowExpansion={{
          content: ({ record }) => <ProjectRowExpansion record={record} />,
        }}
      />
      <CreateProject
        opened={createAction === 'project'}
        close={() => setCreateAction(undefined)}
      />
      <CreatePackage
        opened={Boolean(editingProject)}
        close={() => setEditingProject(undefined)}
        editingProject={editingProject}
      />
    </div>
  );
};

export default Admin;

const ProjectRowExpansion = ({ record }: { record: Project }) => {
  const isMounted = useIsMounted();

  const { data: packages } = useQuery<Package[]>({
    queryKey: ['get-package', record.project_address],
    queryFn: () => api.get(`/package/address/${record.project_address}`),
    enabled: isMounted,
  });

  return (
    <DataTable
      records={packages || []}
      className="pl-10"
      columns={[
        {
          accessor: 'Image',
          render: (value) => <Avatar src={value.package_image} />,
        },
        {
          accessor: 'package_price',
          cellsStyle: { fontWeight: 'bold', color: 'green' },
        },
        {
          accessor: 'package_name',
        },
        {
          accessor: 'package_description',
        },
      ]}
    />
  );
};
