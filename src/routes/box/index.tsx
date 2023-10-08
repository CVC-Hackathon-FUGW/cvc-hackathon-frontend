import { Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import BoxCard from 'src/components/Box/BoxCard';
import api from 'src/services/api';
import { BoxCollection } from 'src/types';

const BoxPage = () => {
  const navigate = useNavigate();

  const { data: boxes } = useQuery<BoxCollection[]>({
    queryFn: () => api.get('/boxCollection'),
    queryKey: ['get-boxCollection'],
  });

  return (
    <div className="container flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between mb-4">
        <Title>Mystery Box</Title>
      </div>
      <Text></Text>
      <div className="flex flex-row items-center justify-center"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {boxes?.map((box) => (
          <BoxCard
            key={Number(box.box_collection_id)}
            onClick={() => navigate(`${box.box_collection_id}`)}
            box={box}
          />
        ))}
      </div>
    </div>
  );
};

export default BoxPage;
