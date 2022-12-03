import { Box, HStack } from '@chakra-ui/react';
import { format } from 'date-fns';

import { SelfTalk } from '@/lib/backend';
import { EMOTION_KEYS } from '@/lib/constants';

export const SelfTalkItem = ({ selfTalk }: { selfTalk: SelfTalk }) => {
  const emotions = Object.entries(selfTalk).filter(([k, v]) => EMOTION_KEYS.includes(k) && !!v);
  return (
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
  );
};
