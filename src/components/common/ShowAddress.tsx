import { Text, TextProps } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { truncateMiddle } from 'src/helpers/truncate-middle';

interface ShowAddressProps extends TextProps {
  canBeCopied?: boolean;
  address?: string;
  length?: number;
}

const ShowAddress = ({
  canBeCopied = true,
  address,
  length,
  children,
  ...rest
}: ShowAddressProps) => {
  const { copy } = useClipboard();
  return (
    <Text
      onClick={() => {
        if (canBeCopied) {
          copy(address);
          notifications.show({
            title: 'Address copied',
            message: 'You can paste it anywhere now',
          });
        }
      }}
      className="cursor-pointer"
      {...rest}
    >
      {children} {truncateMiddle(address, { length })}
    </Text>
  );
};

export default ShowAddress;
