import { Avatar, Card, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Collection } from 'src/types';

export default function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  const navigate = useNavigate();
  const handleClickCollection = () => {
    navigate(`/marketplace/collection/${collection.collection_id}`);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="w-[280px] p-0 m-0 mt-5 cursor-pointer transition-transform duration-300 transform-gpu hover:scale-105"
      onClick={handleClickCollection}
    >
      <div className="flex flex-col items-center justify-center relative">
        <div className="w-full h-[100px] bg-blue-300"></div>
        <Avatar
          src={collection.image}
          radius="100%"
          size="90px"
          className="absolute top-1/2"
        />
      </div>

      <div style={{ wordWrap: 'break-word' }} className="mt-6 p-5">
        <div className="flex justify-center text-xl font-bold mt-2">
          <Text className="content-center text-[#79699B]">
            {collection.collection_name}
          </Text>
        </div>

        <div className="mt-4">
          <Text className="font-semibold text-gray-500">Address:</Text>
          <Text className="font-semibold">{collection.token_address}</Text>
        </div>
        <div className="mt-4">
          <Text className="font-semibold text-gray-500">Volume:</Text>
          <Text className="font-semibold">{collection.volume.toString()}</Text>
        </div>
      </div>
    </Card>
  );
}
