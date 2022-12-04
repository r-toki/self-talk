import { Box, Button, Flex, HStack, Icon, Link, Stack } from '@chakra-ui/react';
import { BiPlus } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

import { AppLayout } from '@/components/AppLayout';
import { SelfTalksGraph } from '@/components/SelfTalksGraph';
import { SelfTalksList } from '@/components/SelfTalksList';

export const Home = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useLocalStorage<'list' | 'graph'>('home_tab', 'list');

  return (
    <AppLayout>
      <Stack>
        <HStack justifyContent="center">
          <Link color={tab == 'list' ? 'black' : 'gray.400'} onClick={() => setTab('list')}>
            list
          </Link>
          <Link color={tab == 'graph' ? 'black' : 'gray.400'} onClick={() => setTab('graph')}>
            graph
          </Link>
        </HStack>

        <Box px="2">
          {tab == 'list' && <SelfTalksList />}
          {tab == 'graph' && <SelfTalksGraph />}
        </Box>
      </Stack>

      <Flex
        justify="end"
        position="fixed"
        bottom="10%"
        w={{ base: 'full', sm: 'md' }}
        pr={{ base: '8', sm: '6' }}
      >
        <Button h="16" w="16" mr="2" rounded="full" onClick={() => navigate('/self_talks/new')}>
          <Icon as={BiPlus} fontSize="4xl" />
        </Button>
      </Flex>
    </AppLayout>
  );
};
