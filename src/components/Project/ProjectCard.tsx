import { Card, Group, Image, Text } from '@mantine/core';
import { getNftSrc } from 'src/helpers/get-nft-src';
import 'src/styles/nft-card.css';
import { Project } from 'src/types';

interface NFTCardProps {
  box?: Project;
  onClick?: (nft: Partial<Project>) => void;
  height?: string;
}

const ProjectCard = (props: NFTCardProps) => {
  const { box, onClick, height = '20rem' } = props;
  return (
    <div className="card-container">
      <Card
        shadow="lg"
        padding="lg"
        radius="md"
        withBorder
        className="cursor-pointer grid gap-1 card"
        onClick={() => onClick?.({ ...box })}
      >
        <Card.Section>
          <Image
            src={getNftSrc(box?.image)}
            alt={box?.name || 'Box Image'}
            withPlaceholder
            height={height}
          />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{box?.name || 'Unnamed'}</Text>
        </Group>
      </Card>
    </div>
  );
};

export default ProjectCard;
