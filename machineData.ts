export interface Machine {
  tag: string;
  model: string;
  sn: string;
  delivery: string;
  customer?: string;
  isHidden?: boolean;
}

export const MACHINE_DATABASE: Machine[] = [
  { tag: "EH-01", model: "EX2600-7-BH", sn: "007053", delivery: "2022" },
  { tag: "EH-02", model: "EX2600-7-BH", sn: "007071", delivery: "2023" },
  { tag: "EH-03", model: "EX2600-7-BH", sn: "007085", delivery: "2023" },
  { tag: "EH-4031", model: "EX1200-7-BH", sn: "007132", delivery: "2021" },
  { tag: "EH-4032", model: "EX1200-7-BH", sn: "007135", delivery: "2021" },
  { tag: "EH-4033", model: "EX1200-7-BH", sn: "007136", delivery: "2021" },
  { tag: "EH-4034", model: "EX1200-7-BH", sn: "007138", delivery: "2021" },
  { tag: "EH-4035", model: "EX1200-7-BH", sn: "007139", delivery: "2021" },
  { tag: "EH-4036", model: "EX1200-7-BH", sn: "007188", delivery: "2022" },
  { tag: "EH-4037", model: "EX1200-7-BH", sn: "007185", delivery: "2022" },
  { tag: "EH-4038", model: "EX1200-7-BH", sn: "007192", delivery: "2022" },
  { tag: "EH-4039", model: "EX1200-7-BH", sn: "007193", delivery: "2022" },
  { tag: "EH-4040", model: "EX1200-7-BH", sn: "007271", delivery: "2023" },
  { tag: "EH-4041", model: "EX1200-7-BH", sn: "007266", delivery: "2023" },
  { tag: "EH-4042", model: "EX1200-7-BH", sn: "007313", delivery: "2024" },
  { tag: "EH-4043", model: "EX1200-7-BH", sn: "007290", delivery: "2023" },
  { tag: "EH-4044", model: "EX1200-7-BH", sn: "007309", delivery: "2024" },
  { tag: "EH-4045", model: "EX1200-7-BH", sn: "007355", delivery: "2025" },
  { tag: "EH-4046", model: "EX1200-7-BH", sn: "007365", delivery: "2025" },
  { tag: "EH-4047", model: "EX1200-7-BH", sn: "007369", delivery: "2025" },
  { tag: "EH-4048", model: "EX1200-7-BH", sn: "007458", delivery: "2024" },
  { tag: "EH-4049", model: "EX1200-7-BH", sn: "007482", delivery: "2025" },
  { tag: "EH-4050", model: "EX1200-7-BH", sn: "007487", delivery: "2025" },
  { tag: "EH-5035", model: "EX2600-7-BH", sn: "007055", delivery: "2023" },
  { tag: "EH-5036", model: "EX2600-7-BH", sn: "007063", delivery: "2023" },
  { tag: "EH-5037", model: "EX2600-7-BH", sn: "007070", delivery: "2023" },
  { tag: "EH112", model: "EX2600-7-BH", sn: "007106", delivery: "2024" },
  { tag: "EH132", model: "EX1200-7-BH", sn: "007433", delivery: "2024" },
  { tag: "EH133", model: "EX1200-7-BH", sn: "007095", delivery: "2024" },
  { tag: "EH-04", model: "EX2600-7-BH", sn: "007090", delivery: "2024" },
  { tag: "EH-05", model: "EX2600-7-BH", sn: "007095", delivery: "2024" },
  { tag: "EH-06", model: "EX2600-7-BH", sn: "007100", delivery: "2024" },
  { tag: "EH-07", model: "EX2600-7", sn: "007105", delivery: "2024" },
  { tag: "EH-08", model: "EX2600-7", sn: "007110", delivery: "2024" },
  { tag: "RED004 (EH85)", model: "EX2600-7-BH", sn: "", delivery: "2023" },
  { tag: "EH-09", model: "EX2600-7-BH", sn: "007115", delivery: "2025" },
  { tag: "EH-10", model: "EX2600-7-BH", sn: "007120", delivery: "2025" },
  { tag: "EH-11", model: "EX2600-7", sn: "007125", delivery: "2025" },
  { tag: "EH-12", model: "EX2600-7", sn: "007130", delivery: "2025" },
];
