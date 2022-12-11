import {
  Box,
  Center,
  Divider,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GoKebabVertical } from 'react-icons/go';

import { SelfTalkItem } from '@/components/SelfTalkItem';
import { useAppToast } from '@/hooks/useAppToast';
import { deleteSelfTalk as deleteSelfTalkFn, getSelfTalks, SelfTalk } from '@/lib/backend';

export const SelfTalksList = () => {
  const selfTalks = useInfiniteQuery({
    queryKey: ['self_talks'],
    queryFn: ({ pageParam = new Date().toISOString() }) => getSelfTalks({ before: pageParam }),
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.createdAt,
  });

  return (
    <Stack>
      {selfTalks.status == 'loading' && (
        <Center py="2">
          <Spinner />
        </Center>
      )}

      {selfTalks.data?.pages
        .flatMap((group) => group)
        .map((selfTalk) => (
          <Stack key={selfTalk.id}>
            <SelfTalkListItem selfTalk={selfTalk} />
            <Divider />
          </Stack>
        ))}

      {selfTalks.data?.pages.flatMap((group) => group).length == 0 && (
        <Box textAlign="center">there are no self talks.</Box>
      )}

      {selfTalks.isFetchingNextPage && (
        <Center py="2">
          <Spinner />
        </Center>
      )}

      {!selfTalks.isFetchingNextPage && selfTalks.hasNextPage && (
        <Link alignSelf="center" pb="2" onClick={() => selfTalks.fetchNextPage()}>
          more
        </Link>
      )}
    </Stack>
  );
};

const SelfTalkListItem = ({ selfTalk }: { selfTalk: SelfTalk }) => {
  const client = useQueryClient();
  const toast = useAppToast();

  const deleteSelfTalk = useMutation({
    mutationFn: () => deleteSelfTalkFn(selfTalk.id),
    onSuccess: () => {
      client.invalidateQueries(['self_talks']);
      toast({ status: 'success', title: 'Deleted.' });
    },
    onError: () => toast({ status: 'error', title: 'Failed.' }),
  });

  const onDeleteSelfTalk = async () => {
    if (window.confirm('Delete?')) await deleteSelfTalk.mutate();
  };

  return (
    <Flex justifyContent="space-between">
      <SelfTalkItem selfTalk={selfTalk} />

      <Box>
        <Menu placement="bottom-end">
          <MenuButton as={IconButton} icon={<GoKebabVertical />} size="xs" variant="ghost" />
          <MenuList>
            <MenuItem onClick={onDeleteSelfTalk}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};
