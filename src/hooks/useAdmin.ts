import { useMemo } from 'react';
import { adminAddress } from 'src/configs/contract';
import { useAccount } from 'wagmi';

const useAdmin = () => {
  const { address } = useAccount();
  const isAdmin = useMemo(() => {
    // if in dev mode, return true
    // if (import.meta.env.DEV) return true;
    if (!address) return false;
    if (!adminAddress) return false;

    return address === adminAddress;
  }, [address]);

  return { isAdmin };
};

export default useAdmin;
