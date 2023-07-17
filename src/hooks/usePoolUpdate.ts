import { useMutation, useQuery } from '@tanstack/react-query';
import api from 'src/services/api';
import { Pool } from 'src/types';

const usePoolUpdate = ({ id }: { id?: number }) => {
  const { data: pool } = useQuery<Pool>({
    queryKey: ['pool', id],
    queryFn: () => api.get<void, Pool>(`/pools/${id}`),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationKey: ['update-pool'],
    mutationFn: (params: Pool) => api.patch('/pools', params),
  });

  return { pool, ...mutation };
};

export default usePoolUpdate;
