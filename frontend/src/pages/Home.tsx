import { Box, HStack, Link, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { AppLayout } from '@/components/AppLayout';
import { Post } from '@/components/Post';

export const Home = () => {
  const [tab, setTab] = useState<'post' | 'list' | 'graph'>('post');

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

        <Box px="2">{tab == 'post' && <Post />}</Box>
      </Stack>
    </AppLayout>
  );
};
