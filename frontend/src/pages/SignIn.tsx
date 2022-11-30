import { Box, Button, Container, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FormEventHandler } from 'react';

import { AppLink } from '@/components/AppLink';
import { useAppToast } from '@/hooks/useAppToast';
import { useTextInput } from '@/hooks/useTextInput';
import { getMe } from '@/lib/backend';

export const SignIn = () => {
  const client = useQueryClient();
  const toast = useAppToast();

  const emailInput = useTextInput();
  const passwordInput = useTextInput();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      await signInWithEmailAndPassword(getAuth(), email, password);
      await getMe();
    },
    onSuccess: () => {
      client.invalidateQueries(['me']);
      toast({ status: 'success', title: 'Signed in.' });
    },
    onError: () => toast({ status: 'error', title: 'Failed.' }),
  });

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    await signIn.mutate({
      email: emailInput.value,
      password: passwordInput.value,
    });
  };

  return (
    <Container maxW="md" py="10">
      <Box fontWeight="bold" fontSize="xl" textAlign="center">
        Self Talk
      </Box>

      <form onSubmit={onSubmit}>
        <Stack>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" required {...emailInput.bind} />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" required {...passwordInput.bind} />
          </FormControl>

          <Button type="submit" disabled={signIn.isLoading}>
            Sign In
          </Button>
        </Stack>
      </form>

      <AppLink to="/sign-up">to sign up</AppLink>
    </Container>
  );
};
