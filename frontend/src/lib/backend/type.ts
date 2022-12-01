export type Me = {
  id: string;
  name: string;
};
export type CreateMe = {
  name: string;
};

export type SelfTalk = {
  id: number;
  body: string;
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
  createdAt: string;
};
export type CreateSelfTalk = {
  body: string;
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
};
