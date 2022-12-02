import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BiPlus } from 'react-icons/bi';
import { GoKebabVertical } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

import { useAppToast } from '@/hooks/useAppToast';
import { deleteSelfTalk as deleteSelfTalkFn, getSelfTalks, SelfTalk } from '@/lib/backend';

const EMOTION_KEYS = [
  'joy',
  'trust',
  'fear',
  'surprise',
  'sadness',
  'disgust',
  'anger',
  'anticipation',
];

export const SelfTalksList = () => {
  const navigate = useNavigate();

  const selfTalks = useQuery({
    queryKey: ['self_talks'],
    queryFn: getSelfTalks,
  });

  return (
    <Stack>
      {selfTalks.data?.map((selfTalk) => (
        <Stack key={selfTalk.id}>
          <SelfTalkListItem selfTalk={selfTalk} />
          <Divider />
        </Stack>
      ))}

      <Flex justify="end" position="fixed" bottom="10%" w={{ base: '327px', sm: '400px' }}>
        <Button h="16" w="16" rounded="full" onClick={() => navigate('/self_talks/new')}>
          <Icon as={BiPlus} fontSize="4xl" />
        </Button>
      </Flex>
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

  const emotions = Object.entries(selfTalk).filter(([k, v]) => EMOTION_KEYS.includes(k) && !!v);

  return (
    <Flex justifyContent="space-between">
      <Box>
        <Box fontSize="sm">{format(new Date(selfTalk.createdAt), 'MM/dd HH:mm')}</Box>
        <Box whiteSpace="pre-wrap">{selfTalk.body}</Box>
        {emotions.length > 0 && (
          <HStack spacing="1" mt="1">
            {emotions.map(([k, v]) => (
              <Box
                key={k}
                px="1"
                bg={`${k}.500`}
                color="white"
                rounded="md"
                fontSize="xs"
                fontWeight="bold"
              >
                {k} {v}
              </Box>
            ))}
          </HStack>
        )}
      </Box>

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
