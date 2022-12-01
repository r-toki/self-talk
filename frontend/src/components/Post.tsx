import { Button, HStack, Stack, Textarea } from '@chakra-ui/react';
import { FormEventHandler, useState } from 'react';

import { useTextInput } from '@/hooks/useTextInput';

export const Post = () => {
  const bodyInput = useTextInput();
  const joyInput = useEmotionInput();
  const trustInput = useEmotionInput();
  const fearInput = useEmotionInput();
  const surpriseInput = useEmotionInput();
  const sadnessInput = useEmotionInput();
  const disgustInput = useEmotionInput();
  const angerInput = useEmotionInput();
  const anticipationInput = useEmotionInput();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
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
