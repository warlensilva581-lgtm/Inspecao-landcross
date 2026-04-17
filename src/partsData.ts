export interface Part {
  id: string;
  sheet: string;
  group: string;
  category: string; // This will be the sheet name
  itemNumber: string;
  partNumber: string;
  description: string;
}

export const PARTS_DATA: Part[] = [
  // GROUP: ENGINE (MOTOR) - SHEET E06 - ENGINE PARTS
  { id: 'ft01', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00A', partNumber: 'YA40030142', description: 'TANK;FUEL' },
  { id: 'ft02', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00B', partNumber: 'J271025', description: 'BOLT;SEMS' },
  { id: 'ft03', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00C', partNumber: 'A810160', description: 'O-RING' },
  { id: 'ft04', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00D', partNumber: '8023981', description: 'COVER' },
  { id: 'ft05', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00E', partNumber: '8067496', description: 'COVER' },
  { id: 'ft06', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00F', partNumber: '94-1702', description: 'ADAPTER;S' },
  { id: 'ft07', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00G', partNumber: '4209782', description: 'VALVE;BALL' },
  { id: 'ft08', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00H', partNumber: '94-1305', description: 'ADAPTER;S' },
  { id: 'ft09', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00I', partNumber: '4113926', description: 'PLUG' },
  { id: 'ft10', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00I1', partNumber: '4506429', description: 'O-RING' },
  { id: 'ft11', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00J', partNumber: '4174542', description: 'PLUG' },
  { id: 'ft12', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00J1', partNumber: '4506424', description: 'O-RING' },
  { id: 'ft13', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00K', partNumber: '4655968', description: 'PLUG' },
  { id: 'ft14', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00L', partNumber: '8033923', description: 'GAUGE;LEVEL' },
  { id: 'ft15', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00L1', partNumber: '4100967', description: 'BOLT' },
  { id: 'ft16', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00M', partNumber: 'Z449558', description: 'WASHER;SEAL' },
  { id: 'ft17', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00N', partNumber: '4664585', description: 'FLOAT' },
  { id: 'ft18', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00O', partNumber: '4269607', description: 'PACKING' },
  { id: 'ft19', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00P', partNumber: 'J450510', description: 'SCREW;SEMS' },
  { id: 'ft20', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00Q', partNumber: '4207240', description: 'CAP' },
  { id: 'ft21', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '00R', partNumber: '4623860', description: 'SWITCH;LEVEL' },
  { id: 'ft22', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '03', partNumber: 'J932400', description: 'BOLT' },
  { id: 'ft23', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '04', partNumber: '4404224', description: 'SPACER' },
  { id: 'ft24', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '06', partNumber: 'J932030', description: 'BOLT' },
  { id: 'ft25', sheet: 'E06', group: 'ENGINE (MOTOR)', category: 'ENGINE PARTS', itemNumber: '07', partNumber: 'J222020', description: 'WASHER' },

  // GROUP: COVERS (COBERTURAS) - SHEET C04 - UNDER COVER
  { id: 'fr01', sheet: 'C04', group: 'COVERS (COBERTURAS)', category: 'UNDER COVER', itemNumber: '01', partNumber: '8067401', description: 'FRAME;MAIN' },
  { id: 'fr02', sheet: 'C04', group: 'COVERS (COBERTURAS)', category: 'UNDER COVER', itemNumber: '02', partNumber: '8067402', description: 'FRAME;SIDE (L)' },
  { id: 'fr03', sheet: 'C04', group: 'COVERS (COBERTURAS)', category: 'UNDER COVER', itemNumber: '03', partNumber: '8067403', description: 'FRAME;SIDE (R)' },

  // GROUP: HYDRAULIC SYSTEM (SISTEMA HIDRÁULICO) - SHEET HS01 - CONTROL VALVE (MAIN)
  { id: 'cvm01', sheet: 'HS01', group: 'HYDRAULIC SYSTEM (SISTEMA HIDRÁULICO)', category: 'CONTROL VALVE (MAIN)', itemNumber: '01', partNumber: '4655968', description: 'VALVE;CONTROL' },
];
