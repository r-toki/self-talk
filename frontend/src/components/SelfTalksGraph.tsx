import {
  Box,
  HStack,
  Input,
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
import { eachDayOfInterval, endOfDay, format, isAfter, startOfDay, subDays } from 'date-fns';
import { get, groupBy, sortBy } from 'lodash';
import { useMemo, useState } from 'react';

import { SelfTalkItem } from '@/components/SelfTalkItem';
import { getSelfTalksGraph as getSelfTalksGraphFn, SelfTalk } from '@/lib/backend';
import { EMOTION_KEYS } from '@/lib/constants';

export const SelfTalksGraph = () => {
  const [beforeOn, setBeforeOn] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [afterOn, setAfterOn] = useState(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
  const beforeAt = useMemo(() => endOfDay(new Date(beforeOn!)), [beforeOn]);
  const afterAt = useMemo(() => startOfDay(new Date(afterOn!)), [afterOn]);
  const before = useMemo(() => beforeAt.toISOString(), [beforeAt]);
  const after = useMemo(() => afterAt.toISOString(), [afterAt]);
  const dateRange = useMemo(
    () =>
      eachDayOfInterval({ start: new Date(afterOn), end: new Date(beforeOn) }).map((v) =>
        format(new Date(v), 'MM/dd'),
      ),
    [afterOn, beforeOn],
  );

  const [beforeHour, setBeforeHour] = useState(24);
  const [afterHour, setAfterHour] = useState(6);
  const hourRange = useMemo(
    () =>
      [...Array(beforeHour! - afterHour!).keys()]
        .map((v) => v + afterHour!)
        .map((v) => v.toString().padStart(2, '0')),
    [beforeHour, afterHour],
  );

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

      <Box as="details" px="6" pb="2">
        <Box as="summary">range</Box>
        <Stack py="2">
          <HStack color="gray" fontWeight="semibold" fontSize="xs" fontFamily="mono">
            <Box>date</Box>
            <Input
              type="date"
              size="xs"
              value={afterOn!}
              onChange={(e) => {
                const newAfterOn = e.target.value;
                if (!isAfter(new Date(newAfterOn), new Date(beforeOn!))) setAfterOn(newAfterOn);
              }}
            />
            <Box>~</Box>
            <Input
              type="date"
              size="xs"
              value={beforeOn!}
              onChange={(e) => {
                const newBeforeOn = e.target.value;
                if (!isAfter(new Date(afterOn!), new Date(newBeforeOn))) setBeforeOn(newBeforeOn);
              }}
            />
          </HStack>

          <HStack color="gray" fontWeight="semibold" fontSize="xs" fontFamily="mono">
            <Box>hour</Box>
            <Input
              type="number"
              size="xs"
              step="1"
              min={0}
              max={beforeHour! - 1}
              value={afterHour!}
              onChange={(e) => setAfterHour(Number(e.target.value))}
            />
            <Box>~</Box>
            <Input
              type="number"
              size="xs"
              step="1"
              min={afterHour! + 1}
              max={24}
              value={beforeHour!}
              onChange={(e) => setBeforeHour(Number(e.target.value))}
            />
          </HStack>
        </Stack>
      </Box>
    </Stack>
  );
};
