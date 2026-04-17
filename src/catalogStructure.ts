export interface SheetInfo {
  id: string;
  name: string;
}

export interface GroupInfo {
  id: string;
  name: string;
  sheets: SheetInfo[];
}

export const CATALOG_STRUCTURE: GroupInfo[] = [
  {
    id: 'engine',
    name: 'ENGINE (MOTOR)',
    sheets: [
      { id: 'E01', name: 'AIR CLEANER PARTS' },
      { id: 'E02', name: 'AIR HOSE' },
      { id: 'E03', name: 'AIR INTAKE PIPING' },
      { id: 'E04', name: 'DRAIN PIPING (ENGINE)' },
      { id: 'E05', name: 'ENGINE OIL FILTER PIPING' },
      { id: 'E06', name: 'ENGINE PARTS' },
      { id: 'E07', name: 'EXHAUST PIPING' },
      { id: 'E08', name: 'FAN DRIVE PIPING' },
      { id: 'E09', name: 'FUEL COOLER' },
      { id: 'E10', name: 'FUEL FEED PIPING' },
      { id: 'E11', name: 'FUEL PIPING (1)' },
      { id: 'E12', name: 'FUEL PIPING (2)' },
      { id: 'E13', name: 'FUEL PIPING (3)' },
      { id: 'E14', name: 'FUEL PIPING (4)' },
      { id: 'E15', name: 'LARGE AIR CLEANER PARTS' },
      { id: 'E16', name: 'MOTOR' },
      { id: 'E17', name: 'OIL COOLER PARTS' },
      { id: 'E18', name: 'OIL COOLER' },
      { id: 'E19', name: 'RADIATOR PARTS' },
      { id: 'E20', name: 'RADIATOR' },
      { id: 'E21', name: 'TRANSMISSION COOLER PIPING' },
      { id: 'E22', name: 'TRANSMISSION COOLER' },
    ]
  },
  {
    id: 'covers',
    name: 'COVERS (COBERTURAS)',
    sheets: [
      { id: 'C01', name: 'MUFFLER COVER' },
      { id: 'C02', name: 'OIL COOLER COVER' },
      { id: 'C03', name: 'RADIATOR COVER' },
      { id: 'C04', name: 'UNDER COVER' },
    ]
  },
  {
    id: 'front_attachment',
    name: 'FRONT ATTACHMENT (IMPLEMENTO FRONTAL)',
    sheets: [
      { id: 'F01', name: 'ARM CYLINDER' },
      { id: 'F02', name: 'BE-ARM 3.4m (CENTRO-MATIC LUBRICATION SYSTEM)' },
      { id: 'F03', name: 'BE-BOOM 7.55m' },
      { id: 'F04', name: 'BOOM CYLINDER' },
      { id: 'F05', name: 'BUCKET 7.0m3 (BE)(JIS 94)' },
      { id: 'F06', name: 'BUCKET CYLINDER' },
      { id: 'F07', name: 'FRONT PIPING (1)(BE BOOM)' },
      { id: 'F08', name: 'FRONT PIPING (2)(BE BOOM)' },
      { id: 'F09', name: 'FRONT PIPING (3)(BE BOOM)' },
    ]
  },
  {
    id: 'hydraulic_piping',
    name: 'HYDRAULIC PIPING (TUBULAÇÃO HIDRÁULICA)',
    sheets: [
      { id: 'HP01', name: 'DELIVERY PIPING (1)' },
      { id: 'HP02', name: 'DELIVERY PIPING (2)' },
      { id: 'HP03', name: 'DELIVERY PIPING (3)' },
      { id: 'HP04', name: 'DELIVERY PIPING (4)' },
      { id: 'HP05', name: 'DRAIN PIPING (WITH CONTAMINATION SENSOR)' },
      { id: 'HP06', name: 'DRAIN PIPING' },
      { id: 'HP07', name: 'MAKEUP PIPING (SWING)' },
      { id: 'HP08', name: 'RETURN PIPING (1)' },
      { id: 'HP09', name: 'RETURN PIPING (2)' },
      { id: 'HP10', name: 'SUCTION PIPING (1)' },
      { id: 'HP11', name: 'SUCTION PIPING (2)' },
      { id: 'HP12', name: 'MAIN PIPING (1-1)' },
      { id: 'HP13', name: 'MAIN PIPING (1-2)' },
      { id: 'HP14', name: 'MAIN PIPING (1-3)' },
      { id: 'HP15', name: 'MAIN PIPING (2)' },
      { id: 'HP16', name: 'MAIN PIPING (3)' },
      { id: 'HP17', name: 'MAIN PIPING (4)' },
      { id: 'HP18', name: 'MAIN PIPING (5)' },
      { id: 'HP19', name: 'PILOT PIPING (1)' },
      { id: 'HP20', name: 'PILOT PIPING (2-1)' },
      { id: 'HP21', name: 'PILOT PIPING (2-2)' },
      { id: 'HP22', name: 'PILOT PIPING (3)' },
      { id: 'HP23', name: 'PILOT PIPING (4)' },
      { id: 'HP24', name: 'PILOT PIPING (5)' },
      { id: 'HP25', name: 'PILOT PIPING (6-1)' },
      { id: 'HP26', name: 'PILOT PIPING (6-2)' },
      { id: 'HP27', name: 'PILOT PIPING (7)' },
      { id: 'HP28', name: 'PILOT PIPING (8)' },
      { id: 'HP29', name: 'PILOT PIPING (9)' },
      { id: 'HP30', name: 'PILOT PIPING (10)' },
      { id: 'HP31', name: 'PILOT PIPING (11)' },
    ]
  },
  {
    id: 'hydraulic_system',
    name: 'HYDRAULIC SYSTEM (SISTEMA HIDRÁULICO)',
    sheets: [
      { id: 'HS01', name: 'CONTROL VALVE (MAIN)' },
      { id: 'HS02', name: 'CONTROL VALVE (SWING)' },
      { id: 'HS03', name: 'FAN DRIVE (OIL COOLER)' },
      { id: 'HS04', name: 'FAN DRIVE (RADIATOR)' },
      { id: 'HS05', name: 'FUEL FEED PUMP' },
      { id: 'HS06', name: 'LUBRICATE PIPING (PUMP)' },
      { id: 'HS07', name: 'PUMP DEVICE' },
      { id: 'HS08', name: 'SWING DEVICE' },
    ]
  },
  {
    id: 'undercarriage',
    name: 'UNDERCARRIAGE (MATERIAL RODANTE)',
    sheets: [
      { id: 'U01', name: 'FRONT IDLER' },
      { id: 'U02', name: 'LOWER ROLLER' },
      { id: 'U03', name: 'TRACK SIDE FRAME' },
      { id: 'U04', name: 'TRAVEL PIPING (CENTER)' },
      { id: 'U05', name: 'TRAVEL PIPING (SIDE)' },
      { id: 'U06', name: 'TRAVEL PIPING COVER (CENTER)' },
      { id: 'U07', name: 'TRAVEL PIPING COVER (SIDE)' },
    ]
  }
];
