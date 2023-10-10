import { Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ProjectCard from 'src/components/Project/ProjectCard';
import api from 'src/services/api';
import { Project } from 'src/types';

const ProjectPage = () => {
  const navigate = useNavigate();

  const { data: projects } = useQuery<Project[]>({
    queryFn: () => api.get('/project'),
    queryKey: ['get-project'],
  });

  return (
    <div className="container flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between mb-4">
        <Title>Invest into Projects to gain products</Title>
      </div>
      <Text></Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {projects?.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            onClick={() => navigate(`${project.project_address}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
