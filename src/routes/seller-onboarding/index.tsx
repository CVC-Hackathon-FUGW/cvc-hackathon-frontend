import { ActionIcon, Badge, Button, Group, Modal, Text } from '@mantine/core';
import { IconWallet } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PayPalMerchantId from 'src/components/common/PayPalMerchantId';
import ShowAddress from 'src/components/common/ShowAddress';
import { onError } from 'src/helpers/contract-call';
import api from 'src/services/api';
import { useAccount } from 'wagmi';

const SellerOnboarding = () => {
  const [searchParams] = useSearchParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const merchantId = searchParams.get('merchantIdInPayPal');

  const { mutate: createSeller } = useMutation({
    mutationFn: (params: { address: string; merchant_id: string }) =>
      api.post('/sellers', params),
    onSuccess: () => navigate('/marketplace'),
    onError,
  });

  return (
    <div>
      <Modal
        opened
        onClose={() => {
          //
        }}
        centered
        size="xl"
        withCloseButton={false}
      >
        <div className="flex flex-col items-center gap-4">
          <Text size="xl" weight="bold">
            Verify your merchant Id in PayPal and your Wallet address
          </Text>
          <PayPalMerchantId merchantId={merchantId} size="xl" />
          <Badge
            leftSection={
              <ActionIcon color="blue">
                <IconWallet />
              </ActionIcon>
            }
            variant="outline"
            size="xl"
          >
            <ShowAddress address={address} length={42} />
          </Badge>

          <Text size="sm">
            {`The merchant_id is the merchant ID of your PayPal account.To find the merchant ID of your PayPal account, log in to your PayPal account at paypal.com. Hover over your name or profile icon on the top right and select Account Settings > Business information > PayPal Merchant ID.`}
          </Text>
          <Group position="center">
            <Button
              onClick={() =>
                merchantId &&
                address &&
                createSeller({ address, merchant_id: merchantId })
              }
            >
              Confirm
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default SellerOnboarding;
