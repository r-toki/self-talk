import { Box, HStack, Link, Stack } from '@chakra-ui/react';
import { useLocalStorage } from 'react-use';

import { AppLayout } from '@/components/AppLayout';
import { SelfTalksList } from '@/components/SelfTalksList';

export const Home = () => {
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

        <Box px="2">{tab == 'list' && <SelfTalksList />}</Box>
      </Stack>
    </AppLayout>
  );
};
