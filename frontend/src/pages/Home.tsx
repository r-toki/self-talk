import { Box, Button, Flex, HStack, Icon, Link, Stack, useDisclosure } from '@chakra-ui/react';
import { BiMenuAltRight, BiPlus } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

import { AppLayout } from '@/components/AppLayout';
import { SelfTalksGraph } from '@/components/SelfTalksGraph';
import { SelfTalksList } from '@/components/SelfTalksList';

export const Home = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useLocalStorage<'list' | 'graph'>('home_tab', 'list');
  const filterPanel = useDisclosure();

  const onClickList = () => {
    filterPanel.onClose();
    setTab('list');
  };
  const onClickGraph = () => {
    filterPanel.onClose();
    setTab('graph');
  };

  return (
    <AppLayout>
      <Stack>
        <HStack justifyContent="center" position="relative">
          <Link color={tab == 'list' ? 'black' : 'gray.400'} onClick={onClickList}>
            list
          </Link>
          <Link color={tab == 'graph' ? 'black' : 'gray.400'} onClick={onClickGraph}>
            graph
          </Link>

          {tab == 'graph' && (
            <Button
              position="absolute"
              right="1"
              size="xs"
              variant="ghost"
              onClick={filterPanel.onToggle}
            >
              <Icon as={BiMenuAltRight} fontSize="lg" />
            </Button>
          )}
        </HStack>

        <Box px="2">
          {tab == 'list' && <SelfTalksList />}
          {tab == 'graph' && <SelfTalksGraph isFilterPanelOpen={filterPanel.isOpen} />}
        </Box>
      </Stack>

      <Flex
        justify="end"
        position="fixed"
        bottom="10%"
        w={{ base: 'full', sm: 'md' }}
        pr={{ base: '8', sm: '6' }}
      >
        <Button
          h="16"
          w="16"
          mr="2"
          rounded="full"
          cursor="pointer"
          onClick={() => navigate('/self_talks/new')}
        >
          <Icon as={BiPlus} fontSize="4xl" />
        </Button>
      </Flex>
    </AppLayout>
  );
};
