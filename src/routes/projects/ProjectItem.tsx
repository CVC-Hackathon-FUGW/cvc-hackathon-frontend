import { Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import PackageCard from 'src/components/Project/PackageCard';
import api from 'src/services/api';
import { Package } from 'src/types';

const ProjectItem = () => {
  const { project_address } = useParams();

  const { data: packages } = useQuery<Package[]>({
    queryKey: ['get-package', project_address],
    queryFn: () => api.get(`/package/address/${project_address}`),
    enabled: !!project_address,
  });

  return (
    <div className="container grid place-items-center gap-8">
      <div className="flex flex-row items-center justify-between mb-4">
        <Title>Invest into Projects to gain products</Title>
      </div>
      <Text></Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {packages?.map((p, index) => (
          <PackageCard key={index} _package={p} />
        ))}
      </div>
    </div>
  );
};

export default ProjectItem;
