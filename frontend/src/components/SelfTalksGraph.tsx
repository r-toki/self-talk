import { Box, Flex, HStack, Input, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import {
  eachDayOfInterval,
  format,
  getDate,
  isAfter,
  isBefore,
  isSameDay,
  startOfToday,
  subDays,
  subHours,
} from 'date-fns';
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

import { getSelfTalksGraph as getSelfTalksGraphFn } from '@/lib/backend';

export const SelfTalksGraph = () => {
  const [beforeOn, setBeforeOn] = useLocalStorage(
    'graph_before_on',
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [afterOn, setAfterOn] = useLocalStorage('graph_after_on', format(new Date(), 'yyyy-MM-dd'));
  const beforeAt = subHours(new Date(beforeOn!), 9);
  const afterAt = subHours(new Date(afterOn!), 9);
  const before = beforeAt.toISOString();
  const after = afterAt.toISOString();
  const dateRange = eachDayOfInterval({ start: afterAt, end: beforeAt });

  const [beforeHour, setBeforeHour] = useLocalStorage('graph_before_hour', 24);
  const [afterHour, setAfterHour] = useLocalStorage('graph_after_hour', 6);
  const hourRange = [...Array(beforeHour! - afterHour!).keys()].map((i) => i + afterHour!);

  // const selfTalks = useQuery({
  //   queryKey: ['self_talks', { before, after }],
  //   queryFn: () => getSelfTalksGraphFn({ before, after }),
  // });

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

      <Stack direction="row">
        <Box>
          {hourRange.map((hour) => (
            <Box
              key={hour}
              h="10"
              color="gray"
              fontWeight="semibold"
              fontSize="xs"
              fontFamily="mono"
            >
              {hour.toString().padStart(2, '0')}
            </Box>
          ))}
        </Box>

        {dateRange.map((date) => (
          <Box key={date.toISOString()} flex="1">
            {hourRange.map((hour) => (
              <Box key={hour} h="10"></Box>
            ))}

            <Box color="gray" fontWeight="semibold" fontSize="xs" fontFamily="mono">
              {format(date, 'MM/dd')}
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
