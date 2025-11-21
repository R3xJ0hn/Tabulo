export type SubCriterion = {
  id: string;
  name: string;
  weight: number;
};

export type Criterion = {
  id: string;
  name: string;
  weight: number;
  subcriteria?: SubCriterion[];
};

export type Candidate = {
  id: number;
  number: number;
  name: string;
  category: "Male" | "Female";
  representing: string;
  img: string;
};

export type Scores = Record<string, number>;


export type Judge = {
  id: number;
  name: string;
  username: string;
  password?: string;
};