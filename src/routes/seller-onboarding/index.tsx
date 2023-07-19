import { useSearchParams } from 'react-router-dom';

const SellerOnboarding = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('merchantId'));
  console.log(searchParams.get('merchantIdInPayPal'));

  return <div>SellerOnboarding</div>;
};

export default SellerOnboarding;
