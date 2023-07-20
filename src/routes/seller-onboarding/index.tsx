import { Modal } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

const SellerOnboarding = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('merchantId'));
  console.log(searchParams.get('merchantIdInPayPal'));

  return (
    <div>
      <Modal
        opened={true}
        onClose={() => {
          //
        }}
        centered
        size="lg"
      ></Modal>
    </div>
  );
};

export default SellerOnboarding;
