import { axios } from './axios';
import { CreateMe, CreateSelfTalk, GetSelfTalks, GetSelfTalksGraph, Me, SelfTalk } from './type';

export const getMe = () => axios.get<Me>('me').then(({ data }) => data);
export const createMe = (input: CreateMe) => axios.post('me', input);

export const getSelfTalks = (query: GetSelfTalks) =>
  axios.get<SelfTalk[]>('self_talks' + toQueryString(query)).then(({ data }) => data);
export const getSelfTalksGraph = (query: GetSelfTalksGraph) =>
  axios.get<SelfTalk[]>('self_talks/graph' + toQueryString(query)).then(({ data }) => data);
export const createSelfTalk = (input: CreateSelfTalk) => axios.post('self_talks', input);
export const deleteSelfTalk = (selfTalkId: number) => axios.delete(`self_talks/${selfTalkId}`);

const toQueryString = (query: Record<string, unknown>) =>
  Object.entries(query)
    .filter((v) => v[1] != undefined)
    .reduce((acc, curr, idx) => acc + (idx == 0 ? '?' : '&') + `${curr[0]}=${curr[1]}`, '');
