import { axios } from './axios';
import { CreateMe, Me } from './type';

export const getMe = () => axios.get<Me>('me').then(({ data }) => data);
export const createMe = (input: CreateMe) => axios.post('me', input);
