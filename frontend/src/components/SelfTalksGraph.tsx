import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
  subDays,
} from 'date-fns';
import { get, groupBy, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useEvent, useLocalStorage, useUnmount } from 'react-use';

import { SelfTalkItem } from '@/components/SelfTalkItem';
import { getSelfTalksGraph as getSelfTalksGraphFn, SelfTalk } from '@/lib/backend';
import { EMOTION_KEYS } from '@/lib/constants';

export const SelfTalksGraph = ({ isFilterPanelOpen }: { isFilterPanelOpen: boolean }) => {
  const [beforeAt, setBeforeAt] = useState(endOfDay(new Date()));
  const [afterAt, setAfterAt] = useState(startOfDay(subDays(new Date(), 1)));
  const before = useMemo(() => beforeAt.toISOString(), [beforeAt]);
  const after = useMemo(() => afterAt.toISOString(), [afterAt]);
  const dateRange = useMemo(
    () =>
      eachDayOfInterval({ start: afterAt, end: beforeAt }).map((v) => format(new Date(v), 'MM/dd')),
    [afterAt, beforeAt],
  );
  const beforeAtFmt = useMemo(() => format(beforeAt, 'MM/dd'), [beforeAt]);
  const afterAtFmt = useMemo(() => format(afterAt, 'MM/dd'), [afterAt]);
  const incBeforeAt = () => setBeforeAt((prev) => addDays(prev, 1));
  const decBeforeAt = () =>
    setBeforeAt((prev) => {
      const next = subDays(prev, 1);
      return isAfter(next, afterAt) ? next : prev;
    });
  const incAfterAt = () => {
    setAfterAt((prev) => {
      const next = addDays(prev, 1);
      return isBefore(next, beforeAt) ? next : prev;
    });
  };
  const decAfterAt = () => setAfterAt((prev) => subDays(prev, 1));

  const [storedBeforeHour, setStoredBeforeHour] = useLocalStorage('graph_before_hour', 24);
  const [storedAfterHour, setStoredAfterHour] = useLocalStorage('graph_after_hour', 9);
  const [beforeHour, setBeforeHour] = useState(storedBeforeHour!);
  const [afterHour, setAfterHour] = useState(storedAfterHour!);
  const hourRange = useMemo(
    () =>
      [...Array(beforeHour - afterHour).keys()]
        .map((v) => v + afterHour)
        .map((v) => v.toString().padStart(2, '0')),
    [beforeHour, afterHour],
  );
  const beforeHourFmt = useMemo(() => beforeHour.toString().padStart(2, '0'), [beforeHour]);
  const afterHourFmt = useMemo(() => afterHour.toString().padStart(2, '0'), [afterHour]);
  const incBeforeHour = () =>
    setBeforeHour((prev) => {
      const next = prev + 1;
      return next <= 24 ? next : prev;
    });
  const decBeforeHour = () => {
    setBeforeHour((prev) => {
      const next = prev - 1;
      return next > afterHour! ? next : prev;
    });
  };
  const incAfterHour = () => {
    setAfterHour((prev) => {
      const next = prev + 1;
      return next < beforeHour! ? next : prev;
    });
  };
  const decAfterHour = () => {
    setAfterHour((prev) => {
      const next = prev - 1;
      return next >= 0 ? next : prev;
    });
  };
  useUnmount(() => {
    setStoredBeforeHour(beforeHour);
    setStoredAfterHour(afterHour);
  });
  useEvent('beforeunload', () => {
    setStoredBeforeHour(beforeHour);
    setStoredAfterHour(afterHour);
  });

  const selfTalks = useQuery({
    queryKey: ['self_talks', { before, after }],
    queryFn: () => getSelfTalksGraphFn({ before, after }),
  });
  const groupedByDate = useMemo(
    () => groupBy(selfTalks.data, (v) => format(new Date(v.createdAt), 'MM/dd')),
    [selfTalks.data],
  );
  const groupedByHour = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(groupedByDate)
          .map(([k, v]) => [k, groupBy(v, (vv) => format(new Date(vv.createdAt), 'HH'))])
          .map(([k, v]) => [
            k,
            Object.fromEntries(Object.entries(v).map(([kk, vv]) => [kk, sortBy(vv, 'createdAt')])),
          ]),
      ) as Record<string, Record<string, SelfTalk[]>>,
    [groupedByDate],
  );

  return (
    <Stack spacing="4">
      {isFilterPanelOpen && (
        <Flex justify="space-around">
          <Stack>
            <Box fontSize="sm" fontFamily="mono">
              hour
            </Box>
            <HStack>
              <Button size="xs" onClick={decAfterHour}>
                <Icon as={FaArrowLeft} color="gray" />
              </Button>
              <Box color="gray" fontWeight="semibold" fontSize="sm" fontFamily="mono">
                {afterHourFmt}
              </Box>
              <Button size="xs" onClick={incAfterHour}>
                <Icon as={FaArrowRight} color="gray" />
              </Button>
            </HStack>
            <HStack>
              <Button size="xs" onClick={decBeforeHour}>
                <Icon as={FaArrowLeft} color="gray" />
              </Button>
              <Box color="gray" fontWeight="semibold" fontSize="sm" fontFamily="mono">
                {beforeHourFmt}
              </Box>
              <Button size="xs" onClick={incBeforeHour}>
                <Icon as={FaArrowRight} color="gray" />
              </Button>
            </HStack>
          </Stack>

          <Stack>
            <Box fontSize="sm" fontFamily="mono">
              date
            </Box>
            <HStack>
              <Button size="xs" onClick={decAfterAt}>
                <Icon as={FaArrowLeft} color="gray" />
              </Button>
              <Box color="gray" fontWeight="semibold" fontSize="sm" fontFamily="mono">
                {afterAtFmt}
              </Box>
              <Button size="xs" onClick={incAfterAt}>
                <Icon as={FaArrowRight} color="gray" />
              </Button>
            </HStack>
            <HStack>
              <Button size="xs" onClick={decBeforeAt}>
                <Icon as={FaArrowLeft} color="gray" />
              </Button>
              <Box color="gray" fontWeight="semibold" fontSize="sm" fontFamily="mono">
                {beforeAtFmt}
              </Box>
              <Button size="xs" onClick={incBeforeAt}>
                <Icon as={FaArrowRight} color="gray" />
              </Button>
            </HStack>
          </Stack>
        </Flex>
      )}

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th></Th>
              {dateRange.map((v) => (
                <Th key={v} color="gray" fontWeight="semibold" fontSize="xs" fontFamily="mono">
                  {v}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {hourRange.map((h) => (
              <Tr key={h}>
                <>
                  <Td color="gray" fontWeight="semibold" fontSize="xs" fontFamily="mono">
                    {h}
                  </Td>
                  {dateRange.map((d) => {
                    const data = get(get(groupedByHour, d), h) ?? [];
                    return (
                      <Td key={d}>
                        <Stack>
                          {data.map((v) => {
                            const emotions = Object.entries(v).filter(
                              ([k, v]) => EMOTION_KEYS.includes(k) && !!v,
                            );
                            return (
                              <Box key={v.id}>
                                <Popover>
                                  <PopoverTrigger>
                                    <HStack spacing="0.5" w="max-content">
                                      {emotions.length == 0 && (
                                        <Box w="3" h="3" rounded="full" bg="gray.00" />
                                      )}
                                      {emotions.map(([k]) => (
                                        <Box key={k} w="3" h="3" rounded="full" bg={`${k}.500`} />
                                      ))}
                                    </HStack>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    w="max-content"
                                    maxW="300px"
                                    transform="translateX(-5px)!important"
                                  >
                                    <PopoverBody>
                                      <SelfTalkItem selfTalk={v} />
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </Box>
                            );
                          })}
                        </Stack>
                      </Td>
                    );
                  })}
                </>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
