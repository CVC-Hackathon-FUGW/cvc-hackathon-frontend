import { ActionIcon, Badge, BadgeProps } from '@mantine/core';
import { IconBrandPaypal } from '@tabler/icons-react';
import React from 'react';
import ShowAddress from './ShowAddress';

interface PayPalMerchantIdProps extends BadgeProps {
  merchantId: string | null;
}

const PayPalMerchantId = (props: PayPalMerchantIdProps) => {
  const { merchantId, ...rest } = props;
  return (
    <Badge
      {...rest}
      leftSection={
        <ActionIcon color="blue">
          <IconBrandPaypal />
        </ActionIcon>
      }
      variant="outline"
    >
      <ShowAddress address={`${merchantId}`} />
    </Badge>
  );
};

export default PayPalMerchantId;
