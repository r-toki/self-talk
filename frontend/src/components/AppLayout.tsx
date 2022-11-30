import {
  Box,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut as signOutFn } from 'firebase/auth';
import { ReactNode } from 'react';
import { GoThreeBars } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

import { useAppToast } from '@/hooks/useAppToast';
import { useMe } from '@/providers/me';

export const AppLayout = ({
  title = 'Self Talk',
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const toast = useAppToast();

  const { me } = useMe();

  const signOut = useMutation({
    mutationFn: () => signOutFn(getAuth()),
    onSuccess: () => {
      client.setQueryData(['me'], null);
      toast({ status: 'success', title: 'Signed out.' });
    },
  });

  return (
    <Container maxW="md" py="2">
      <Stack spacing="4">
        <Flex justifyContent="end" alignItems="center" position="relative" h="40px">
          <Box
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            fontWeight="bold"
            fontSize="xl"
          >
            {title}
          </Box>

          <Box>
            <Menu placement="bottom-end">
              <MenuButton as={IconButton} icon={<GoThreeBars />} />
              <MenuList>
                <MenuItem onClick={() => navigate('/home')}>{me!.name}</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => signOut.mutate()} disabled={signOut.isLoading}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>

        <Box>{children}</Box>
      </Stack>
    </Container>
  );
};
