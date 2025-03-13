export type Harvest = {
  id: number;
  datetime: string;
  location: {
    id: number;
    name: string;
  };
  pic: {
    id: number;
    name: string;
  };
  siklus: number;
  total: number;
  total_ex_momoka: number;
  Packing: {
    id: number;
    package_id: number;
    quantity: number;
    package: {
      id: number;
      name: string;
    };
  }[];
  Reject: {
    id: number;
    reason_id: number;
    quantity: number;
    reason: {
      id: number;
      name: string;
    };
  }[];
  Yield: {
    id: number;
    variant_grade_id: number;
    quantity: number;
    variantGrade: {
      id: number;
      variant: {
        id: number;
        name: string;
      };
      grade: {
        id: number;
        name: string;
      };
    };
  }[];
};
