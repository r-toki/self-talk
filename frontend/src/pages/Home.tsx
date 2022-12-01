import { Box, HStack, Link, Stack } from '@chakra-ui/react';
import { useLocalStorage } from 'react-use';

import { AppLayout } from '@/components/AppLayout';
import { SelfTalksList } from '@/components/SelfTalksList';
import { SelfTalksNew } from '@/components/SelfTalksNew';

export const Home = () => {
  const [tab, setTab] = useLocalStorage<'post' | 'list' | 'graph'>('home_tab', 'post');

  return (
    <AppLayout>
      <Stack>
        <HStack justifyContent="center">
          <Link color={tab == 'post' ? 'black' : 'gray.400'} onClick={() => setTab('post')}>
            post
          </Link>
          <Link color={tab == 'list' ? 'black' : 'gray.400'} onClick={() => setTab('list')}>
            list
          </Link>
          <Link color={tab == 'graph' ? 'black' : 'gray.400'} onClick={() => setTab('graph')}>
            graph
          </Link>
        </HStack>

        <Box px="2">
          {tab == 'post' && <SelfTalksNew />}
          {tab == 'list' && <SelfTalksList />}
        </Box>
      </Stack>
    </AppLayout>
  );
};
