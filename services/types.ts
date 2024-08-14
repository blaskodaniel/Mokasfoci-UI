export type Group = {
  _id: string;
  name: string;
};

export type Team = {
  name: string;
  flag: string;
  win?: number;
  draw?: number;
  loss?: number;
  score?: number;
  getgoal?: number;
  kickgoal?: number;
  active?: boolean;
};

export type LoginType = {
  data: { token: string };
};
