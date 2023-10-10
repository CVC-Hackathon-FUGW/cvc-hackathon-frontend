import { Card, Group, Image, Text } from '@mantine/core';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import 'src/styles/nft-card.css';
import { Project } from 'src/types';

interface NFTCardProps {
  project?: Project;
  onClick?: (nft: Partial<Project>) => void;
  height?: string;
}

const ProjectCard = (props: NFTCardProps) => {
  const { project, onClick, height = '20rem' } = props;
  return (
    <div className="card-container">
      <Card
        shadow="lg"
        padding="lg"
        radius="md"
        withBorder
        className="cursor-pointer grid gap-1 card"
        onClick={() => onClick?.({ ...project })}
      >
        <Card.Section>
          <Image
            src={project?.project_image}
            alt={project?.project_name || 'Box Image'}
            withPlaceholder
            height={height}
          />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <div className="">
            <Text weight={300}>Project name</Text>
            <Text weight={500}>{project?.project_name || 'Unnamed'}</Text>
          </div>
          <div className="">
            <Text weight={300}>Project Owner</Text>
            <Text weight={500}>{truncateMiddle(project?.project_owner)}</Text>
          </div>
          <div className="">
            <Text weight={300}>Total raise amount</Text>
            <Text weight={500}>{Number(project?.total_raise_amount)} RENT</Text>
          </div>
          <div className="">
            <Text weight={300}>Total fund raised</Text>
            <Text weight={500}>{Number(project?.total_fund_raised)} RENT</Text>
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default ProjectCard;
