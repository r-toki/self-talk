import { Button, HStack, Stack, Textarea } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import { useAppToast } from '@/hooks/useAppToast';
import { useTextInput } from '@/hooks/useTextInput';
import { createSelfTalk as createSelfTalkFn } from '@/lib/backend';

const OPACITY = 0.4;

export const SelfTalksNew = () => {
  const client = useQueryClient();
  const navigate = useNavigate();
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

  const emotionsCount = [
    bodyInput.value,
    joyInput.value,
    trustInput.value,
    fearInput.value,
    surpriseInput.value,
    sadnessInput.value,
    disgustInput.value,
    angerInput.value,
    anticipationInput.value,
  ].filter((v) => v > 0).length;

  const createSelfTalk = useMutation({
    mutationFn: createSelfTalkFn,
    onSuccess: () => {
      client.invalidateQueries(['self_talks']);
      navigate('/home');
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
    <AppLayout back="/home">
      <form onSubmit={onSubmit}>
        <Stack spacing="3">
          <Textarea rows={5} required {...bodyInput.bind} />

          <HStack>
            <Button
              colorScheme="joy"
              size="xs"
              flex="1"
              opacity={joyInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || joyInput.value > 0)}
              {...joyInput.bind}
            >
              joy {joyInput.value || ''}
            </Button>
            <Button
              colorScheme="trust"
              size="xs"
              flex="1"
              opacity={trustInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || trustInput.value > 0)}
              {...trustInput.bind}
            >
              trust {trustInput.value || ''}
            </Button>
            <Button
              colorScheme="fear"
              size="xs"
              flex="1"
              opacity={fearInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || fearInput.value > 0)}
              {...fearInput.bind}
            >
              fear {fearInput.value || ''}
            </Button>
            <Button
              colorScheme="surprise"
              size="xs"
              flex="1"
              opacity={surpriseInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || surpriseInput.value > 0)}
              {...surpriseInput.bind}
            >
              surprise {surpriseInput.value || ''}
            </Button>
          </HStack>

          <HStack>
            <Button
              colorScheme="sadness"
              size="xs"
              flex="1"
              opacity={sadnessInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || sadnessInput.value > 0)}
              {...sadnessInput.bind}
            >
              sadness {sadnessInput.value || ''}
            </Button>
            <Button
              colorScheme="disgust"
              size="xs"
              flex="1"
              opacity={disgustInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || disgustInput.value > 0)}
              {...disgustInput.bind}
            >
              disgust {disgustInput.value || ''}
            </Button>
            <Button
              colorScheme="anger"
              size="xs"
              flex="1"
              opacity={angerInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || angerInput.value > 0)}
              {...angerInput.bind}
            >
              anger {angerInput.value || ''}
            </Button>
            <Button
              colorScheme="anticipation"
              size="xs"
              flex="1"
              opacity={anticipationInput.value ? 1 : OPACITY}
              disabled={!(emotionsCount < 2 || anticipationInput.value > 0)}
              {...anticipationInput.bind}
            >
              anticip. {anticipationInput.value || ''}
            </Button>
          </HStack>

          <Button type="submit" disabled={!(bodyInput.value.length > 0 && emotionsCount > 0)}>
            Save
          </Button>
        </Stack>
      </form>
    </AppLayout>
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
