export type DoctorListItem = {
  id: number | string;
  name: string;
  specialization: string;
  years_of_practice?: number | string;
  consultation_fee?: number | string;
  image: string;
};
