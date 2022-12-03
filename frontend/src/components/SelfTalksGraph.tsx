import {
  Box,
  HStack,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { eachDayOfInterval, endOfDay, format, isAfter, startOfDay, subDays } from 'date-fns';
import { get, groupBy, sortBy } from 'lodash';
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

import { getSelfTalksGraph as getSelfTalksGraphFn, SelfTalk } from '@/lib/backend';
import { EMOTION_KEYS } from '@/lib/constants';

export const SelfTalksGraph = () => {
  const [beforeOn, setBeforeOn] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [afterOn, setAfterOn] = useState(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
  const beforeAt = endOfDay(new Date(beforeOn!));
  const afterAt = startOfDay(new Date(afterOn!));
  const before = beforeAt.toISOString();
  const after = afterAt.toISOString();
  const dateRange = eachDayOfInterval({ start: new Date(afterOn), end: new Date(beforeOn) }).map(
    (v) => format(new Date(v), 'dd'),
  );

  const [beforeHour, setBeforeHour] = useLocalStorage('graph_before_hour', 24);
  const [afterHour, setAfterHour] = useLocalStorage('graph_after_hour', 6);
  const hourRange = [...Array(beforeHour! - afterHour!).keys()]
    .map((v) => v + afterHour!)
    .map((v) => v.toString().padStart(2, '0'));

  const selfTalks = useQuery({
    queryKey: ['self_talks', { before, after }],
    queryFn: () => getSelfTalksGraphFn({ before, after }),
  });

  const groupedByDate = groupBy(selfTalks.data, (v) => format(new Date(v.createdAt), 'dd'));
  const groupedByHour = Object.fromEntries(
    Object.entries(groupedByDate)
      .map(([k, v]) => [k, groupBy(v, (vv) => format(new Date(vv.createdAt), 'HH'))])
      .map(([k, v]) => [
        k,
        Object.fromEntries(Object.entries(v).map(([kk, vv]) => [kk, sortBy(vv, 'createdAt')])),
      ]),
  ) as Record<string, Record<string, SelfTalk[]>>;

  return (
    <Stack spacing="4">
      <Stack>
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
                              <Tooltip
                                key={v.id}
                                label={`${v.body}\n${format(new Date(v.createdAt), 'MM/dd HH:mm')}`}
                                whiteSpace="pre-wrap"
                              >
                                <HStack spacing="0.5">
                                  {emotions.map(([k]) => (
                                    <Box key={k} w="3" h="3" rounded="full" bg={`${k}.500`} />
                                  ))}
                                </HStack>
                              </Tooltip>
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
