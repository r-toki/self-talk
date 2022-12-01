import { Button, HStack, Stack, Textarea } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEventHandler, useState } from 'react';

import { useAppToast } from '@/hooks/useAppToast';
import { useTextInput } from '@/hooks/useTextInput';
import { createSelfTalk as createSelfTalkFn } from '@/lib/backend';

export const SelfTalksNew = () => {
  const client = useQueryClient();
  const toast = useAppToast();

  const bodyInput = useTextInput();
  const joyInput = useEmotionInput();
  const trustInput = useEmotionInput();
  const fearInput = useEmotionInput();
  const surpriseInput = useEmotionInput();
  const sadnessInput = useEmotionInput();
  const disgustInput = useEmotionInput();
  const angerInput = useEmotionInput();
  const anticipationInput = useEmotionInput();

  const createSelfTalk = useMutation({
    mutationFn: createSelfTalkFn,
    onSuccess: () => {
      client.invalidateQueries(['self_talks']);
      toast({ status: 'success', title: 'Created.' });
    },
    onError: () => toast({ status: 'error', title: 'Failed.' }),
  });

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    await createSelfTalk.mutate({
      body: bodyInput.value,
      joy: joyInput.value,
      trust: trustInput.value,
      fear: fearInput.value,
      surprise: surpriseInput.value,
      sadness: sadnessInput.value,
      disgust: disgustInput.value,
      anger: angerInput.value,
      anticipation: anticipationInput.value,
    });

    bodyInput.set('');
    joyInput.set(0);
    trustInput.set(0);
    fearInput.set(0);
    surpriseInput.set(0);
    sadnessInput.set(0);
    disgustInput.set(0);
    angerInput.set(0);
    anticipationInput.set(0);
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="3">
        <Textarea rows={5} required {...bodyInput.bind} />

        <HStack>
          <Button colorScheme="joy" size="xs" flex="1" {...joyInput.bind}>
            joy {joyInput.value || ''}
          </Button>
          <Button colorScheme="trust" size="xs" flex="1" {...trustInput.bind}>
            trust {trustInput.value || ''}
          </Button>
          <Button colorScheme="fear" size="xs" flex="1" {...fearInput.bind}>
            fear {fearInput.value || ''}
          </Button>
          <Button colorScheme="surprise" size="xs" flex="1" {...surpriseInput.bind}>
            surprise {surpriseInput.value || ''}
          </Button>
        </HStack>

        <HStack>
          <Button colorScheme="sadness" size="xs" flex="1" {...sadnessInput.bind}>
            sadness {sadnessInput.value || ''}
          </Button>
          <Button colorScheme="disgust" size="xs" flex="1" {...disgustInput.bind}>
            disgust {disgustInput.value || ''}
          </Button>
          <Button colorScheme="anger" size="xs" flex="1" {...angerInput.bind}>
            anger {angerInput.value || ''}
          </Button>
          <Button colorScheme="anticipation" size="xs" flex="1" {...anticipationInput.bind}>
            anticip. {anticipationInput.value || ''}
          </Button>
        </HStack>

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
};

const useEmotionInput = () => {
  const [value, set] = useState(0);
  const onClick = () => set((v) => (v + 1) % 4);

  return {
    value,
    set,
    bind: { value, onClick },
  };
};