import { contract } from 'src/configs/contract';
import { useContractRead } from 'wagmi';
import HeroImage from './components/Hero';

const HomePage = () => {
  const { data } = useContractRead({
    ...contract,
    functionName: 'getAllPool',
  });

  console.log(data);

  return (
    <div>
      <HeroImage />
    </div>
  );
};

export default HomePage;
