import { axios } from './axios';
import { CreateMe, CreateSelfTalk, Me, SelfTalk } from './type';

export const getMe = () => axios.get<Me>('me').then(({ data }) => data);
export const createMe = (input: CreateMe) => axios.post('me', input);

export const getSelfTalks = () => axios.get<SelfTalk[]>('self_talks').then(({ data }) => data);
export const createSelfTalk = (input: CreateSelfTalk) => axios.post('self_talks', input);
export const deleteSelfTalk = (selfTalkId: number) => axios.delete(`self_talks/${selfTalkId}`);
