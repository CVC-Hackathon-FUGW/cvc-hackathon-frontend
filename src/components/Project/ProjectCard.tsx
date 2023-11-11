import { Button, Card, Group, Image, Progress, Text } from '@mantine/core';
import { abiRaiseFundInside } from 'src/configs/contract';
import { truncateMiddle } from 'src/helpers/truncate-middle';
import 'src/styles/nft-card.css';
import { Project } from 'src/types';
import { zeroAddress } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';

interface NFTCardProps {
  project?: Project;
  onClick?: (nft: Partial<Project>) => void;
  height?: string;
}

const ProjectCard = (props: NFTCardProps) => {
  const { project, onClick, height = '20rem' } = props;

  const { address } = useAccount();
  const { writeAsync: withdrawFund } = useContractWrite({
    address: project?.project_address ?? zeroAddress,
    abi: abiRaiseFundInside,
    functionName: 'withdrawFund',
  });

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
          <div className="w-full">
            <Text weight={300}>Progress</Text>
            <Progress
              value={
                (Number(project?.total_fund_raised) /
                  Number(project?.total_raise_amount)) *
                100
              }
              color="green"
            />
          </div>
          {address === project?.project_owner && (
            <Button
              className="w-full"
              onClick={async (e) => {
                e.stopPropagation();
                await withdrawFund();
              }}
            >
              Withdraw
            </Button>
          )}
        </Group>
      </Card>
    </div>
  );
};

export default ProjectCard;
