import { Button, Flex, Modal, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useSwitchNetwork } from 'wagmi';

interface SwitchNetworkModalProps {
  opened: boolean;
  onClose: () => void;
  disconnect: () => void;
}

const SwitchNetworkModal = ({
  opened,
  onClose,
  disconnect,
}: SwitchNetworkModalProps) => {
  const { chains, switchNetwork } = useSwitchNetwork({
    onSuccess: onClose,
  });

  const handleSwitchNetwork = useCallback(() => {
    disconnect();
    onClose();
  }, [disconnect, onClose]);

  return (
    <Modal opened={opened} onClose={handleSwitchNetwork} centered>
      <Flex justify="center" align="center" direction="column" gap="xs">
        <Text size="xl" weight="bold">
          Unsupported Network
        </Text>
        <Text size="sm" align="center">
          Please switch to supported network to continue using the app
        </Text>
        <Flex
          justify="space-around"
          align="center"
          direction="row"
          gap="xs"
          wrap="wrap"
        >
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant="gradient"
              onClick={() => switchNetwork?.(chain.id)}
            >
              {chain.name}
            </Button>
          ))}
          <Button variant="outline" color="red" onClick={handleSwitchNetwork}>
            Disconnect
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default SwitchNetworkModal;
