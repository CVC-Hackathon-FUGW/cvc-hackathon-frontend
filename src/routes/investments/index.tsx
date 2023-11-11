import { Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import api from 'src/services/api';
import { Project } from 'src/types';
import { useAccount } from 'wagmi';

const columns = [
  {
    accessor: 'Project Id',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ project_id }: Project) => <Text>{Number(project_id)}</Text>,
  },
  {
    accessor: 'Project Name',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ project_name }: Project) => (
      <Text weight="bold">{project_name}</Text>
    ),
  },
  {
    accessor: 'Invested Fund',
    width: '15%',
    titleStyle: { fontSize: '25px' },
    render: ({ fund_attended }: Project) => (
      <Text weight="bold">{fund_attended}</Text>
    ),
  },
];

export default function InvestmentsPage() {
  const { address } = useAccount();

  const { data: investments } = useQuery<Project[]>({
    queryKey: ['investments', address],
    queryFn: () => api.get(`/participant/address/${address}`),
  });

  return (
    <div className="container">
      <div style={{ maxWidth: '1200px' }}>
        <Title size="3.2rem">Your investments</Title>
        <Text fz="lg"></Text>
      </div>
      <DataTable records={investments} columns={columns} />
    </div>
  );
}
