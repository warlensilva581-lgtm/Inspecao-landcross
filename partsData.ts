export interface Part {
  id: string;
  sheet: string;
  category: string;
  itemNumber: string;
  partNumber: string;
  description: string;
  model: string;
  photo?: string;
  quantity?: number;
}

export const PARTS_DATA: Part[] = [
  // SHEET 01 - FRAME
  { id: 'ex1200_frame_00', sheet: '01', category: 'FRAME', itemNumber: '00', partNumber: '++++++++++', description: 'FRAME;MAIN', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_02', sheet: '01', category: 'FRAME', itemNumber: '02', partNumber: '4244942', description: 'BUSHING', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_03', sheet: '01', category: 'FRAME', itemNumber: '03', partNumber: '8045389', description: 'PIN', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_04', sheet: '01', category: 'FRAME', itemNumber: '04', partNumber: 'YA00056423', description: 'BRACKET', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_05', sheet: '01', category: 'FRAME', itemNumber: '05', partNumber: '4179432', description: 'PLATE', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_06', sheet: '01', category: 'FRAME', itemNumber: '06', partNumber: 'J922045', description: 'BOLT', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_07', sheet: '01', category: 'FRAME', itemNumber: '07', partNumber: 'J222020', description: 'WASHER', model: 'EX1200-7-BH' },
  { id: 'ex1200_frame_08', sheet: '01', category: 'FRAME', itemNumber: '08', partNumber: '4309865', description: 'SHIM (t=2.3mm)', model: 'EX1200-7-BH' },

  // SHEET 03 - COUNTERWEIGHT
  { id: 'ex1200_cw_00', sheet: '03', category: 'COUNTERWEIGHT', itemNumber: '00', partNumber: 'YA40033741', description: 'WEIGHT;COUNTER (18.0t)', model: 'EX1200-7-BH' },
  { id: 'ex1200_cw_00a', sheet: '03', category: 'COUNTERWEIGHT', itemNumber: '00A', partNumber: 'XV00000936', description: 'SEAL;RUBBER', model: 'EX1200-7-BH' },
  { id: 'ex1200_cw_01', sheet: '03', category: 'COUNTERWEIGHT', itemNumber: '01', partNumber: 'YA00048666', description: 'BOLT', model: 'EX1200-7-BH' },
  { id: 'ex1200_cw_02', sheet: '03', category: 'COUNTERWEIGHT', itemNumber: '02', partNumber: 'YA00048667', description: 'WASHER', model: 'EX1200-7-BH' },

  // SHEET 73 - ENGINE
  { id: 'ex1200_eng_00', sheet: '73', category: 'ENGINE', itemNumber: '00', partNumber: 'YA00051454', description: 'ENGINE', model: 'EX1200-7-BH' },
  { id: 'ex1200_eng_00a', sheet: '73', category: 'ENGINE', itemNumber: '00A', partNumber: '4266063', description: 'ELEMENT', model: 'EX1200-7-BH' },
  { id: 'ex1200_eng_00b', sheet: '73', category: 'ENGINE', itemNumber: '00B', partNumber: 'YA00057822', description: 'BELT', model: 'EX1200-7-BH' },

  // SHEET 05A - BATTERY COVER
  { id: 'ex1200_bc_00', sheet: '05A', category: 'BATTERY COVER', itemNumber: '00', partNumber: 'YA40034412', description: 'COVER', model: 'EX1200-7-BH' },
  { id: 'ex1200_bc_01', sheet: '05A', category: 'BATTERY COVER', itemNumber: '01', partNumber: 'J281250', description: 'BOLT;SEMS', model: 'EX1200-7-BH' },
  { id: 'ex1200_bc_02', sheet: '05A', category: 'BATTERY COVER', itemNumber: '02', partNumber: '4312368', description: 'BUSHING;RUBBER', model: 'EX1200-7-BH' },
  { id: 'ex1200_bc_05', sheet: '05A', category: 'BATTERY COVER', itemNumber: '05', partNumber: 'YA60059288', description: 'COVER', model: 'EX1200-7-BH' },
  { id: 'ex1200_bc_05a', sheet: '05A', category: 'BATTERY COVER', itemNumber: '05A', partNumber: 'YA40034413', description: '* COVER', model: 'EX1200-7-BH' },
  { id: 'ex1200_bc_05b', sheet: '05A', category: 'BATTERY COVER', itemNumber: '05B', partNumber: 'XV00003281', description: '* SEAL;RUBBER', model: 'EX1200-7-BH' },

  // SHEET 75 - ENGINE OIL FILTER PIPING
  { id: 'ex1200_eof_04', sheet: '75', category: 'ENGINE OIL FILTER PIPING', itemNumber: '04', partNumber: '4297383', description: 'O-RING', model: 'EX1200-7-BH' },
  { id: 'ex1200_eof_11', sheet: '75', category: 'ENGINE OIL FILTER PIPING', itemNumber: '11', partNumber: 'YA00049057', description: 'ELBOW;S', model: 'EX1200-7-BH' },
  { id: 'ex1200_eof_15', sheet: '75', category: 'ENGINE OIL FILTER PIPING', itemNumber: '15', partNumber: 'YA00053414', description: 'BLOCK;PORT', model: 'EX1200-7-BH' },
  { id: 'ex1200_eof_100', sheet: '75', category: 'ENGINE OIL FILTER PIPING', itemNumber: '100', partNumber: '+++++++', description: 'ENGINE OIL FILTER', model: 'EX1200-7-BH' },
  { id: 'ex1200_eof_100a', sheet: '75', category: 'ENGINE OIL FILTER PIPING', itemNumber: '100A', partNumber: 'YA00003793', description: '* ELEMENT;FILTER', model: 'EX1200-7-BH' },

  // SHEET 02 - FUEL PIPINGS
  { id: 'ex1200_fuel_00', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '00', partNumber: 'YA00049099', description: 'Fuel Hose (00)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_01', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '01', partNumber: 'YA00052211', description: 'Fuel Hose (20)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_02', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '02', partNumber: 'YA00052212', description: 'Fuel Hose (21)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_03', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '03', partNumber: 'YA00052213', description: 'Fuel Hose (22)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_04', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '04', partNumber: 'YA00052214', description: 'Fuel Hose (23)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_05', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '05', partNumber: 'YA00052215', description: 'Fuel Hose (24)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_06', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '06', partNumber: 'YA00049132', description: 'Fuel Hose (04)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_07', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '07', partNumber: '4639391', description: 'Fuel Hose (00)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fuel_08', sheet: '02', category: 'FUEL PIPINGS', itemNumber: '08', partNumber: 'YA00049131', description: 'Fuel Hose (03)', model: 'EX1200-7-BH' },

  // SHEET 03 - FUEL COOLER PIPING
  { id: 'ex1200_fc_00', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '00', partNumber: 'YA60049445', description: 'Cooler Hose (64)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fc_01', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '01', partNumber: 'YA00052210', description: 'Cooler Hose (54)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fc_02', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '02', partNumber: 'YA00052209', description: 'Cooler Hose (53)', model: 'EX1200-7-BH' },
  { id: 'ex1200_fc_03', sheet: '03', category: 'FUEL COOLER PIPING', itemNumber: '03', partNumber: 'YA60049444', description: 'Cooler Hose (63)', model: 'EX1200-7-BH' },

  // SHEET 04 - SUCTION PIPINGS
  { id: 'ex1200_suc_00', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '00', partNumber: '4193871', description: 'Suction Hose (06)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_01', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '01', partNumber: 'YA00051594', description: 'Suction Hose (21)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_02', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '02', partNumber: 'YA00051595', description: 'Suction Hose (22)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_03', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '03', partNumber: '4204186', description: 'Suction Hose (23)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_04', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '04', partNumber: '4204186', description: 'Suction Hose (23)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_05', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '05', partNumber: '4441963', description: 'Suction Hose (25)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_06', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '06', partNumber: '4441961', description: 'Suction Hose (24)', model: 'EX1200-7-BH' },
  { id: 'ex1200_suc_07', sheet: '04', category: 'SUCTION PIPINGS', itemNumber: '07', partNumber: '4442830', description: 'Suction Hose (26)', model: 'EX1200-7-BH' },

  // SHEET 05 - TRANSMISSION COOLER PIPINGS (1)
  { id: 'tc1_1', sheet: '05', category: 'TRANSMISSION COOLER PIPINGS (1)', itemNumber: '00', partNumber: 'YA60048807', description: 'Cooler Hose (07)', model: 'EX1200-7-BH' },
  { id: 'tc1_2', sheet: '05', category: 'TRANSMISSION COOLER PIPINGS (1)', itemNumber: '01', partNumber: 'YA60048808', description: 'Cooler Hose (08)', model: 'EX1200-7-BH' },

  // SHEET 06 - TRANSMISSION COOLER PIPINGS (2)
  { id: 'tc2_1', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '00', partNumber: '4684745', description: 'Cooler Hose (11)', model: 'EX1200-7-BH' },
  { id: 'tc2_2', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '01', partNumber: '4641112', description: 'Cooler Hose (10)', model: 'EX1200-7-BH' },
  { id: 'tc2_3', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '02', partNumber: 'YA00008490', description: 'Cooler Hose (12)', model: 'EX1200-7-BH' },
  { id: 'tc2_4', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '03', partNumber: '4365395', description: 'Cooler Hose (16)', model: 'EX1200-7-BH' },
  { id: 'tc2_5', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '04', partNumber: '4251907', description: 'Cooler Hose (15)', model: 'EX1200-7-BH' },
  { id: 'tc2_6', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '05', partNumber: '4207388', description: 'Cooler Hose (65)', model: 'EX1200-7-BH' },
  { id: 'tc2_7', sheet: '06', category: 'TRANSMISSION COOLER PIPINGS (2)', itemNumber: '06', partNumber: '4690164', description: 'Cooler Hose (57)', model: 'EX1200-7-BH' },

  // SHEET 07 - DELIVERY PIPINGS
  { id: 'd1', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '00', partNumber: 'YA00055740', description: 'Delivery Hose (00)', model: 'EX1200-7-BH' },
  { id: 'd2', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '01', partNumber: '4671626', description: 'Delivery Hose (00)', model: 'EX1200-7-BH' },
  { id: 'd3', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '02', partNumber: '4612007', description: 'Delivery Hose (04)', model: 'EX1200-7-BH' },
  { id: 'd4', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '03', partNumber: '4441543', description: 'Delivery Hose (08)', model: 'EX1200-7-BH' },
  { id: 'd5', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '04', partNumber: 'XV00003658', description: 'Delivery Hose (02)', model: 'EX1200-7-BH' },
  { id: 'd6', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '05', partNumber: '4622750', description: 'Delivery Hose (32)', model: 'EX1200-7-BH' },
  { id: 'd7', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '06', partNumber: '4622750', description: 'Delivery Hose (32)', model: 'EX1200-7-BH' },
  { id: 'd8', sheet: '07', category: 'DELIVERY PIPINGS', itemNumber: '07', partNumber: '4622750', description: 'Delivery Hose (32)', model: 'EX1200-7-BH' },

  // SHEET 08 - DRAIN PIPINGS
  { id: 'dr1', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '00', partNumber: 'YA60053819', description: 'Drain Hose (35)', model: 'EX1200-7-BH' },
  { id: 'dr2', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '01', partNumber: 'YA60053816', description: 'Drain Hose (34)', model: 'EX1200-7-BH' },
  { id: 'dr3', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '02', partNumber: 'YA60053815', description: 'Drain Hose (33)', model: 'EX1200-7-BH' },
  { id: 'dr4', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '03', partNumber: '4678497', description: 'Drain Hose (22)', model: 'EX1200-7-BH' },
  { id: 'dr5', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '04', partNumber: '4680278', description: 'Drain Hose (20)', model: 'EX1200-7-BH' },
  { id: 'dr6', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '05', partNumber: '4354655', description: 'Drain Hose (19)', model: 'EX1200-7-BH' },
  { id: 'dr7', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '06', partNumber: '4639926', description: 'Drain Hose (21)', model: 'EX1200-7-BH' },
  { id: 'dr8', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '07', partNumber: 'XV00003682', description: 'Drain Hose (23)', model: 'EX1200-7-BH' },
  { id: 'dr9', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '08', partNumber: '4217389', description: 'Drain Hose (24)', model: 'EX1200-7-BH' },
  { id: 'dr10', sheet: '08', category: 'DRAIN PIPINGS', itemNumber: '09', partNumber: 'XV00003681', description: 'Drain Hose (25)', model: 'EX1200-7-BH' },

  // SHEET 09 - FAN DRIVE PIPINGS
  { id: 'fd1', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '00', partNumber: '4673494', description: 'Fan Drive Hose (38)', model: 'EX1200-7-BH' },
  { id: 'fd2', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '01', partNumber: '4414656', description: 'Fan Drive Hose (05)', model: 'EX1200-7-BH' },
  { id: 'fd3', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '02', partNumber: 'YA60048930', description: 'Fan Drive Hose (00)', model: 'EX1200-7-BH' },
  { id: 'fd4', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '03', partNumber: '4687691', description: 'Fan Drive Hose (03)', model: 'EX1200-7-BH' },
  { id: 'fd5', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '04', partNumber: 'XV00003878', description: 'Fan Drive Hose (04)', model: 'EX1200-7-BH' },
  { id: 'fd6', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '05', partNumber: '4640837', description: 'Fan Drive Hose (14)', model: 'EX1200-7-BH' },
  { id: 'fd7', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '06', partNumber: '4227025', description: 'Fan Drive Hose (18)', model: 'EX1200-7-BH' },
  { id: 'fd8', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '07', partNumber: 'XV00003677', description: 'Fan Drive Hose (29)', model: 'EX1200-7-BH' },
  { id: 'fd9', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '08', partNumber: 'XV00003676', description: 'Fan Drive Hose (25)', model: 'EX1200-7-BH' },
  { id: 'fd10', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '09', partNumber: '4705873', description: 'Fan Drive Hose (26)', model: 'EX1200-7-BH' },
  { id: 'fd11', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '10', partNumber: '4446905', description: 'Fan Drive Hose (30)', model: 'EX1200-7-BH' },
  { id: 'fd12', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '11', partNumber: '4685916', description: 'Fan Drive Hose (22)', model: 'EX1200-7-BH' },
  { id: 'fd13', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '12', partNumber: '4304477', description: 'Fan Drive Hose (27)', model: 'EX1200-7-BH' },
  { id: 'fd14', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '13', partNumber: 'YA00007517', description: 'Fan Drive Hose (30)', model: 'EX1200-7-BH' },
  { id: 'fd15', sheet: '09', category: 'FAN DRIVE PIPINGS', itemNumber: '14', partNumber: 'YA00007517', description: 'Fan Drive Hose (30)', model: 'EX1200-7-BH' },

  // SHEET 10 - RETURN PIPINGS
  { id: 'r1', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '00', partNumber: '4067833', description: 'Return Hose (21)', model: 'EX1200-7-BH' },
  { id: 'r2', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '01', partNumber: '4067833', description: 'Return Hose (21)', model: 'EX1200-7-BH' },
  { id: 'r3', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '02', partNumber: '4067833', description: 'Return Hose (21)', model: 'EX1200-7-BH' },
  { id: 'r4', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '03', partNumber: '4067833', description: 'Return Hose (21)', model: 'EX1200-7-BH' },
  { id: 'r5', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '04', partNumber: '4071214', description: 'Return Hose (22)', model: 'EX1200-7-BH' },
  { id: 'r6', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '05', partNumber: '4071214', description: 'Return Hose (22)', model: 'EX1200-7-BH' },
  { id: 'r7', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '06', partNumber: '4071214', description: 'Return Hose (22)', model: 'EX1200-7-BH' },
  { id: 'r8', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '07', partNumber: '4071215', description: 'Return Hose (23)', model: 'EX1200-7-BH' },
  { id: 'r9', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '08', partNumber: '4071215', description: 'Return Hose (23)', model: 'EX1200-7-BH' },
  { id: 'r10', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '09', partNumber: '4071215', description: 'Return Hose (23)', model: 'EX1200-7-BH' },
  { id: 'r11', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '10', partNumber: '4071215', description: 'Return Hose (23)', model: 'EX1200-7-BH' },
  { id: 'r12', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '11', partNumber: '4071215', description: 'Return Hose (23)', model: 'EX1200-7-BH' },

  // SHEET 11 - SWING PIPINGS
  { id: 'sw1', sheet: '11', category: 'SWING PIPINGS', itemNumber: '00', partNumber: '4440424', description: 'Swing Hose (00)', model: 'EX1200-7-BH' },
  { id: 'sw2', sheet: '11', category: 'SWING PIPINGS', itemNumber: '01', partNumber: '4440424', description: 'Swing Hose (00)', model: 'EX1200-7-BH' },
  { id: 'sw3', sheet: '11', category: 'SWING PIPINGS', itemNumber: '02', partNumber: '4671800', description: 'Swing Hose (12)', model: 'EX1200-7-BH' },
  { id: 'sw4', sheet: '11', category: 'SWING PIPINGS', itemNumber: '03', partNumber: '4671800', description: 'Swing Hose (12)', model: 'EX1200-7-BH' },
  { id: 'sw5', sheet: '11', category: 'SWING PIPINGS', itemNumber: '04', partNumber: '4671801', description: 'Swing Hose (13)', model: 'EX1200-7-BH' },
  { id: 'sw6', sheet: '11', category: 'SWING PIPINGS', itemNumber: '05', partNumber: '4671801', description: 'Swing Hose (13)', model: 'EX1200-7-BH' },

  // SHEET 12 - TRAVEL PIPINGS (1)
  { id: 'tr1_1', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '00', partNumber: '4651806', description: 'Travel Hose (01)', model: 'EX1200-7-BH' },
  { id: 'tr1_2', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '01', partNumber: 'YA00051569', description: 'Travel Hose (02)', model: 'EX1200-7-BH' },
  { id: 'tr1_3', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '02', partNumber: '4601145', description: 'Travel Hose (00)', model: 'EX1200-7-BH' },
  { id: 'tr1_4', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '03', partNumber: 'YA00051570', description: 'Travel Hose (03)', model: 'EX1200-7-BH' },

  // SHEET 13 - TRAVEL PIPINGS (2)
  { id: 'tr2_1', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '00', partNumber: '4678995', description: 'Travel Hose (04)', model: 'EX1200-7-BH' },
  { id: 'tr2_2', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '01', partNumber: '4678995', description: 'Travel Hose (04)', model: 'EX1200-7-BH' },
  { id: 'tr2_3', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '02', partNumber: '4678995', description: 'Travel Hose (04)', model: 'EX1200-7-BH' },
  { id: 'tr2_4', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '03', partNumber: '4678995', description: 'Travel Hose (04)', model: 'EX1200-7-BH' },
  { id: 'tr2_5', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '04', partNumber: '4673041', description: 'Travel Hose (00)', model: 'EX1200-7-BH' },
  { id: 'tr2_6', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '05', partNumber: '4673041', description: 'Travel Hose (00)', model: 'EX1200-7-BH' },
  { id: 'tr2_7', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '06', partNumber: '4678796', description: 'Travel Hose (05)', model: 'EX1200-7-BH' },
  { id: 'tr2_8', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '07', partNumber: '4678796', description: 'Travel Hose (05)', model: 'EX1200-7-BH' },
  { id: 'tr2_9', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '08', partNumber: '4435992', description: 'Travel Hose (14)', model: 'EX1200-7-BH' },
  { id: 'tr2_10', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '09', partNumber: '4435992', description: 'Travel Hose (14)', model: 'EX1200-7-BH' },
  { id: 'tr2_11', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '10', partNumber: '4712781', description: 'Travel Hose (17)', model: 'EX1200-7-BH' },
  { id: 'tr2_12', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '11', partNumber: '4712781', description: 'Travel Hose (17)', model: 'EX1200-7-BH' },

  // SHEET 14 - BACKHOE FRONT MAIN PIPINGS
  { id: 'bm1', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '00', partNumber: '4720135', description: 'Main Hose (36)', model: 'EX1200-7-BH' },
  { id: 'bm2', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '01', partNumber: 'YA00001209', description: 'Main Hose (04)', model: 'EX1200-7-BH' },
  { id: 'bm3', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '02', partNumber: '4011638', description: 'Main Hose (03)', model: 'EX1200-7-BH' },
  { id: 'bm4', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '03', partNumber: '4011638', description: 'Main Hose (03)', model: 'EX1200-7-BH' },
  { id: 'bm5', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '04', partNumber: '4011638', description: 'Main Hose (03)', model: 'EX1200-7-BH' },

  // SHEET 15 - BACKHOE FRONT PIPINGS (2)
  { id: 'bf2_1', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '00', partNumber: '4720039', description: 'Front Hose (09)', model: 'EX1200-7-BH' },
  { id: 'bf2_2', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '01', partNumber: 'YA00002206', description: 'Front Hose (08)', model: 'EX1200-7-BH' },
  { id: 'bf2_3', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '02', partNumber: 'YA00002206', description: 'Front Hose (08)', model: 'EX1200-7-BH' },
  { id: 'bf2_4', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '03', partNumber: 'YA00002162', description: 'Front Hose (02)', model: 'EX1200-7-BH' },
  { id: 'bf2_5', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '04', partNumber: 'YA00002162', description: 'Front Hose (02)', model: 'EX1200-7-BH' },
  { id: 'bf2_6', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '05', partNumber: '4720029', description: 'Front Hose (01)', model: 'EX1200-7-BH' },
  { id: 'bf2_7', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '06', partNumber: '4720028', description: 'Front Hose (00)', model: 'EX1200-7-BH' },
  { id: 'bf2_8', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '07', partNumber: '4720037', description: 'Front Hose (07)', model: 'EX1200-7-BH' },
  { id: 'bf2_9', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '08', partNumber: '4720028', description: 'Front Hose (00)', model: 'EX1200-7-BH' },
  { id: 'bf2_10', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '09', partNumber: '4720037', description: 'Front Hose (07)', model: 'EX1200-7-BH' },

  // SHEET 26 - ENGINE STOP SWITCH
  { id: 'es1', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '01', partNumber: 'SWITCH-A', description: 'Engine key switch a', model: 'EX1200-7-BH' },
  { id: 'es2', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '02', partNumber: 'SWITCH-B', description: 'Engine Stop Switch b', model: 'EX1200-7-BH' },
  { id: 'es3', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '03', partNumber: 'SWITCH-C', description: 'Engine Stop Switch c', model: 'EX1200-7-BH' },
  { id: 'es4', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '04', partNumber: 'SWITCH-C', description: 'Engine Stop Switch c (stopped)', model: 'EX1200-7-BH' },
  { id: 'es5', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '05', partNumber: 'SWITCH-B', description: 'Engine Stop Switch b (stopped)', model: 'EX1200-7-BH' },
  { id: 'es6', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '06', partNumber: 'SWITCH-A', description: 'Engine key switch a (stopped)', model: 'EX1200-7-BH' },

  // SHEET 16 - AROUND ENGINE REAR SIDE (ELECTRIC)
  { id: 'e16_1', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '01', partNumber: 'HARNESS-01', description: 'Electric Harness 01', model: 'EX1200-7-BH' },
  { id: 'e16_2', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '02', partNumber: 'HARNESS-02', description: 'Electric Harness 02', model: 'EX1200-7-BH' },
  { id: 'e16_3', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '03', partNumber: 'HARNESS-03', description: 'Electric Harness 03', model: 'EX1200-7-BH' },
  { id: 'e16_4', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '04', partNumber: 'HARNESS-04', description: 'Electric Harness 04', model: 'EX1200-7-BH' },
  { id: 'e16_5', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '05', partNumber: 'HARNESS-05', description: 'Electric Harness 05', model: 'EX1200-7-BH' },

  // SHEET 27 - CLEANING THE MACHINE
  { id: 'c27_1', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '01', partNumber: 'BATTERY-COMP', description: 'Battery compartment cleaning', model: 'EX1200-7-BH' },
  { id: 'c27_2', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '02', partNumber: 'ENGINE-COMP', description: 'Engine compartment cleaning', model: 'EX1200-7-BH' },

  // SHEET 17 - HYDRAULIC PUMP PIPINGS
  { id: 'hp1', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '01', partNumber: 'YA00001234', description: 'Pump Suction Hose', model: 'EX1200-7-BH' },
  { id: 'hp2', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '02', partNumber: 'YA00001235', description: 'Pump Delivery Hose', model: 'EX1200-7-BH' },
  { id: 'hp3', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '03', partNumber: 'YA00001236', description: 'Pump Drain Hose', model: 'EX1200-7-BH' },

  // SHEET 18 - CONTROL VALVE PIPINGS
  { id: 'cv1', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '01', partNumber: 'YA00002345', description: 'Valve Inlet Hose', model: 'EX1200-7-BH' },
  { id: 'cv2', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '02', partNumber: 'YA00002346', description: 'Valve Outlet Hose', model: 'EX1200-7-BH' },
  { id: 'cv3', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '03', partNumber: 'YA00002347', description: 'Valve Pilot Hose', model: 'EX1200-7-BH' },

  // SHEET 19 - BOOM CYLINDER PIPINGS
  { id: 'bc1', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00003456', description: 'Boom Cylinder Hose (Head)', model: 'EX1200-7-BH' },
  { id: 'bc2', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00003457', description: 'Boom Cylinder Hose (Rod)', model: 'EX1200-7-BH' },

  // SHEET 20 - ARM CYLINDER PIPINGS
  { id: 'ac1', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00004567', description: 'Arm Cylinder Hose (Head)', model: 'EX1200-7-BH' },
  { id: 'ac2', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00004568', description: 'Arm Cylinder Hose (Rod)', model: 'EX1200-7-BH' },

  // SHEET 21 - BUCKET CYLINDER PIPINGS
  { id: 'buc1', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00005678', description: 'Bucket Cylinder Hose (Head)', model: 'EX1200-7-BH' },
  { id: 'buc2', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '02', partNumber: 'YA00005679', description: 'Bucket Cylinder Hose (Rod)', model: 'EX1200-7-BH' },

  // SHEET 22 - SWING MOTOR PIPINGS
  { id: 'sm1', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00006789', description: 'Swing Motor Hose (A)', model: 'EX1200-7-BH' },
  { id: 'sm2', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '02', partNumber: 'YA00006790', description: 'Swing Motor Hose (B)', model: 'EX1200-7-BH' },

  // SHEET 23 - TRAVEL MOTOR PIPINGS
  { id: 'tm1', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00007890', description: 'Travel Motor Hose (Left)', model: 'EX1200-7-BH' },
  { id: 'tm2', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '02', partNumber: 'YA00007891', description: 'Travel Motor Hose (Right)', model: 'EX1200-7-BH' },

  // SHEET 24 - RADIATOR & OIL COOLER
  { id: 'roc1', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '01', partNumber: 'YA00008901', description: 'Radiator Upper Hose', model: 'EX1200-7-BH' },
  { id: 'roc2', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '02', partNumber: 'YA00008902', description: 'Radiator Lower Hose', model: 'EX1200-7-BH' },
  { id: 'roc3', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '03', partNumber: 'YA00008903', description: 'Oil Cooler Hose', model: 'EX1200-7-BH' },

  // SHEET 25 - CABIN & ELECTRIC
  { id: 'ce1', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '01', partNumber: 'YA00009012', description: 'Cabin Harness', model: 'EX1200-7-BH' },
  { id: 'ce2', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '02', partNumber: 'YA00009013', description: 'Monitor Unit', model: 'EX1200-7-BH' },

  // SHEET 28 - UNDERCARRIAGE
  { id: 'uc1', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '01', partNumber: 'YA00010123', description: 'Track Link Assy', model: 'EX1200-7-BH' },
  { id: 'uc2', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '02', partNumber: 'YA00010124', description: 'Track Roller', model: 'EX1200-7-BH' },
  { id: 'uc3', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '03', partNumber: 'YA00010125', description: 'Carrier Roller', model: 'EX1200-7-BH' },
  { id: 'uc4', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '04', partNumber: 'YA00010126', description: 'Idler Assy', model: 'EX1200-7-BH' },
  { id: 'uc5', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '05', partNumber: 'YA00010127', description: 'Sprocket', model: 'EX1200-7-BH' },

  // SHEET 29 - BUCKET & TEETH
  { id: 'bt1', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '01', partNumber: 'YA00011234', description: 'Bucket Assy', model: 'EX1200-7-BH' },
  { id: 'bt2', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '02', partNumber: 'YA00011235', description: 'Bucket Tooth', model: 'EX1200-7-BH' },
  { id: 'bt3', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '03', partNumber: 'YA00011236', description: 'Tooth Pin', model: 'EX1200-7-BH' },

  // SHEET 30 - LIGHTS & MIRRORS
  { id: 'lm1', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '01', partNumber: 'YA00012345', description: 'Working Light (Boom)', model: 'EX1200-7-BH' },
  { id: 'lm2', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '02', partNumber: 'YA00012346', description: 'Working Light (Cab)', model: 'EX1200-7-BH' },
  { id: 'lm3', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '03', partNumber: 'YA00012347', description: 'Rear View Mirror', model: 'EX1200-7-BH' },

  // EX2500-6 DATA
  // SHEET 02 - PILOT PIPINGS (FRAME : LEFT)
  { id: 'ex25-s2-00', sheet: '02', category: 'PILOT PIPINGS (FRAME : LEFT)', itemNumber: '00', partNumber: '4358629', description: 'Pilot Hose (34)', model: 'EX2500-6' },
  { id: 'ex25-s2-01', sheet: '02', category: 'PILOT PIPINGS (FRAME : LEFT)', itemNumber: '01', partNumber: '4723521', description: 'Pilot Hose (34)', model: 'EX2500-6' },
  
  // SHEET 02 - PILOT PIPINGS (CAB BED)
  { id: 'ex25-s2-02', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '02', partNumber: '4447218', description: 'Pilot Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s2-03', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '03', partNumber: '4447217', description: 'Pilot Hose (35)', model: 'EX2500-6' },
  { id: 'ex25-s2-04', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '04', partNumber: '4217382', description: 'Pilot Hose (37)', model: 'EX2500-6' },
  { id: 'ex25-s2-05', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '05', partNumber: '4652390', description: 'Pilot Hose (40)', model: 'EX2500-6' },
  { id: 'ex25-s2-06', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '06', partNumber: '4652391', description: 'Pilot Hose (39)', model: 'EX2500-6' },
  { id: 'ex25-s2-07', sheet: '02', category: 'PILOT PIPINGS (CAB BED)', itemNumber: '07', partNumber: '4652393', description: 'Pilot Hose (41)', model: 'EX2500-6' },

  // SHEET 02 - LUBRICATE PIPINGS (UPPERSTRUCTURE)
  { id: 'ex25-s2-08', sheet: '02', category: 'LUBRICATE PIPINGS (UPPERSTRUCTURE)', itemNumber: '08', partNumber: '4642704', description: 'Lubricate Hose (42)', model: 'EX2500-6' },

  // SHEET 03-a - RETURN PIPINGS (1)
  { id: 'ex25-s3a-00', sheet: '03-a', category: 'RETURN PIPINGS (1)', itemNumber: '00', partNumber: '4422021', description: 'Return Hose (11)', model: 'EX2500-6' },

  // SHEET 03-a - RETURN PIPINGS (2)
  { id: 'ex25-s3a-01', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '01', partNumber: '4422021', description: 'Return Hose (15)', model: 'EX2500-6' },
  { id: 'ex25-s3a-02', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '02', partNumber: '4422021', description: 'Return Hose (15)', model: 'EX2500-6' },
  { id: 'ex25-s3a-03', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '03', partNumber: '4422021', description: 'Return Hose (03)', model: 'EX2500-6' },
  { id: 'ex25-s3a-04', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '04', partNumber: '4422021', description: 'Return Hose (03)', model: 'EX2500-6' },
  { id: 'ex25-s3a-05', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '05', partNumber: '4422021', description: 'Return Hose (03)', model: 'EX2500-6' },
  { id: 'ex25-s3a-06', sheet: '03-a', category: 'RETURN PIPINGS (2)', itemNumber: '06', partNumber: '4422021', description: 'Return Hose (15)', model: 'EX2500-6' },

  // SHEET 03-b - RETURN PIPINGS (3)
  { id: 'ex25-s3b-00', sheet: '03-b', category: 'RETURN PIPINGS (3)', itemNumber: '00', partNumber: '4071215', description: 'Return Hose (05)', model: 'EX2500-6' },
  { id: 'ex25-s3b-01', sheet: '03-b', category: 'RETURN PIPINGS (3)', itemNumber: '01', partNumber: '4071215', description: 'Return Hose (05)', model: 'EX2500-6' },
  { id: 'ex25-s3b-02', sheet: '03-b', category: 'RETURN PIPINGS (3)', itemNumber: '02', partNumber: '4071215', description: 'Return Hose (05)', model: 'EX2500-6' },
  { id: 'ex25-s3b-03', sheet: '03-b', category: 'RETURN PIPINGS (3)', itemNumber: '03', partNumber: '4071215', description: 'Return Hose (05)', model: 'EX2500-6' },
  { id: 'ex25-s3b-04', sheet: '03-b', category: 'RETURN PIPINGS (3)', itemNumber: '04', partNumber: '4071215', description: 'Return Hose (05)', model: 'EX2500-6' },

  // SHEET 04 - DELIVERY PIPINGS (1)
  { id: 'ex25-s4-00', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '00', partNumber: '4364997', description: 'Delivery Hose (19)', model: 'EX2500-6' },
  { id: 'ex25-s4-01', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '01', partNumber: '4364997', description: 'Delivery Hose (19)', model: 'EX2500-6' },
  { id: 'ex25-s4-02', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '02', partNumber: '4332594', description: 'Delivery Hose (20)', model: 'EX2500-6' },
  { id: 'ex25-s4-03', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '03', partNumber: '4332594', description: 'Delivery Hose (20)', model: 'EX2500-6' },
  { id: 'ex25-s4-04', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '04', partNumber: '4332593', description: 'Delivery Hose (21)', model: 'EX2500-6' },
  { id: 'ex25-s4-05', sheet: '04', category: 'DELIVERY PIPINGS (1)', itemNumber: '05', partNumber: '4332593', description: 'Delivery Hose (21)', model: 'EX2500-6' },

  // SHEET 04 - DELIVERY PIPINGS (2)
  { id: 'ex25-s4-06', sheet: '04', category: 'DELIVERY PIPINGS (2)', itemNumber: '06', partNumber: '4332165', description: 'Delivery Hose (19)', model: 'EX2500-6' },
  { id: 'ex25-s4-07', sheet: '04', category: 'DELIVERY PIPINGS (2)', itemNumber: '07', partNumber: '4411894', description: 'Delivery Hose (20)', model: 'EX2500-6' },
  { id: 'ex25-s4-08', sheet: '04', category: 'DELIVERY PIPINGS (2)', itemNumber: '08', partNumber: '4345436', description: 'Delivery Hose (21)', model: 'EX2500-6' },

  // SHEET 05 - SUCTION PIPINGS
  { id: 'ex25-s5-00', sheet: '05', category: 'SUCTION PIPINGS', itemNumber: '00', partNumber: '4362845', description: 'Suction Hose (43)', model: 'EX2500-6' },
  { id: 'ex25-s5-01', sheet: '05', category: 'SUCTION PIPINGS', itemNumber: '01', partNumber: '4362845', description: 'Suction Hose (43)', model: 'EX2500-6' },
  { id: 'ex25-s5-02', sheet: '05', category: 'SUCTION PIPINGS', itemNumber: '02', partNumber: '4362845', description: 'Suction Hose (43)', model: 'EX2500-6' },
  { id: 'ex25-s5-03', sheet: '05', category: 'SUCTION PIPINGS', itemNumber: '03', partNumber: '4120294', description: 'Suction Hose (46)', model: 'EX2500-6' },
  { id: 'ex25-s5-04', sheet: '05', category: 'SUCTION PIPINGS', itemNumber: '04', partNumber: '4120294', description: 'Suction Hose (46)', model: 'EX2500-6' },

  // SHEET 06 - RETURN PIPINGS
  { id: 'ex25-s6-00', sheet: '06', category: 'RETURN PIPINGS', itemNumber: '00', partNumber: '4422021', description: 'Return Hose (09)', model: 'EX2500-6' },
  { id: 'ex25-s6-01', sheet: '06', category: 'RETURN PIPINGS', itemNumber: '01', partNumber: '4422021', description: 'Return Hose (09)', model: 'EX2500-6' },
  { id: 'ex25-s6-02', sheet: '06', category: 'RETURN PIPINGS', itemNumber: '02', partNumber: '4422021', description: 'Return Hose (09)', model: 'EX2500-6' },
  { id: 'ex25-s6-03', sheet: '06', category: 'RETURN PIPINGS', itemNumber: '03', partNumber: '4422021', description: 'Return Hose (09)', model: 'EX2500-6' },

  // SHEET 06 - OIL COOLER
  { id: 'ex25-s6-04', sheet: '06', category: 'OIL COOLER', itemNumber: '04', partNumber: '4447200', description: 'Oil Cooler (17)', model: 'EX2500-6' },
  { id: 'ex25-s6-05', sheet: '06', category: 'OIL COOLER', itemNumber: '05', partNumber: '4447207', description: 'Oil Cooler (16)', model: 'EX2500-6' },

  // SHEET 06 - OIL COOLER PIPINGS
  { id: 'ex25-s6-06', sheet: '06', category: 'OIL COOLER PIPINGS', itemNumber: '06', partNumber: '4447199', description: 'Cooler Hose (00)', model: 'EX2500-6' },
  { id: 'ex25-s6-07', sheet: '06', category: 'OIL COOLER PIPINGS', itemNumber: '07', partNumber: '4485404', description: 'Cooler Hose (11)', model: 'EX2500-6' },
  { id: 'ex25-s6-08', sheet: '06', category: 'OIL COOLER PIPINGS', itemNumber: '08', partNumber: '4485404', description: 'Cooler Hose (11)', model: 'EX2500-6' },

  // SHEET 07 - PIPING DRAIN
  { id: 'ex25-s7-00', sheet: '07', category: 'PIPING DRAIN', itemNumber: '00', partNumber: '4446026', description: 'Drain Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s7-01', sheet: '07', category: 'PIPING DRAIN', itemNumber: '01', partNumber: '4407940', description: 'Drain Hose (03)', model: 'EX2500-6' },
  { id: 'ex25-s7-02', sheet: '07', category: 'PIPING DRAIN', itemNumber: '02', partNumber: '4722335', description: 'Drain Hose (32)', model: 'EX2500-6' },
  { id: 'ex25-s7-03', sheet: '07', category: 'PIPING DRAIN', itemNumber: '03', partNumber: '4722331', description: 'Drain Hose (21)', model: 'EX2500-6' },
  { id: 'ex25-s7-04', sheet: '07', category: 'PIPING DRAIN', itemNumber: '04', partNumber: '4722331', description: 'Drain Hose (21)', model: 'EX2500-6' },
  { id: 'ex25-s7-05', sheet: '07', category: 'PIPING DRAIN', itemNumber: '05', partNumber: '4722333', description: 'Drain Hose (22)', model: 'EX2500-6' },
  { id: 'ex25-s7-06', sheet: '07', category: 'PIPING DRAIN', itemNumber: '06', partNumber: '4722335', description: 'Drain Hose (32)', model: 'EX2500-6' },

  // SHEET 08 - PILOT PIPINGS (CENTER PART TO FRAME)
  { id: 'ex25-s8-00', sheet: '08', category: 'PILOT PIPINGS (CENTER PART TO FRAME)', itemNumber: '00', partNumber: '4642711', description: 'Pilot Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s8-01', sheet: '08', category: 'PILOT PIPINGS (CENTER PART TO FRAME)', itemNumber: '01', partNumber: '4642707', description: 'Pilot Hose (40)', model: 'EX2500-6' },

  // SHEET 08 - PILOT PIPINGS (RIGHT SIDE OF FRAME)
  { id: 'ex25-s8-02', sheet: '08', category: 'PILOT PIPINGS (RIGHT SIDE OF FRAME)', itemNumber: '02', partNumber: '4642706', description: 'Pilot Hose (17)', model: 'EX2500-6' },
  { id: 'ex25-s8-03', sheet: '08', category: 'PILOT PIPINGS (RIGHT SIDE OF FRAME)', itemNumber: '03', partNumber: '4412001', description: 'Pilot Hose (16)', model: 'EX2500-6' },

  // SHEET 08 - PILOT PIPINGS (PUMP)
  { id: 'ex25-s8-04', sheet: '08', category: 'PILOT PIPINGS (PUMP)', itemNumber: '04', partNumber: '4349508', description: 'Pilot Hose (48)', model: 'EX2500-6' },
  { id: 'ex25-s8-05', sheet: '08', category: 'PILOT PIPINGS (PUMP)', itemNumber: '05', partNumber: '4349509', description: 'Pilot Hose (49)', model: 'EX2500-6' },
  { id: 'ex25-s8-06', sheet: '08', category: 'PILOT PIPINGS (PUMP)', itemNumber: '06', partNumber: '4485428', description: 'Pilot Hose (99)', model: 'EX2500-6' },
  { id: 'ex25-s8-07', sheet: '08', category: 'PILOT PIPINGS (PUMP)', itemNumber: '07', partNumber: '4485428', description: 'Pilot Hose (99)', model: 'EX2500-6' },
  { id: 'ex25-s8-08', sheet: '08', category: 'PILOT PIPINGS (PUMP)', itemNumber: '08', partNumber: '4443717', description: 'Pilot Hose (81)', model: 'EX2500-6' },

  // SHEET 09 - FUEL HOSES
  { id: 'ex25-s9-00', sheet: '09', category: 'FUEL HOSES', itemNumber: '00', partNumber: '4623477', description: 'Fuel Hose (18)', model: 'EX2500-6' },
  { id: 'ex25-s9-01', sheet: '09', category: 'FUEL HOSES', itemNumber: '01', partNumber: '4671862', description: 'Fuel Hose (21)', model: 'EX2500-6' },
  { id: 'ex25-s9-02', sheet: '09', category: 'FUEL HOSES', itemNumber: '02', partNumber: '4658024', description: 'Fuel Hose (19)', model: 'EX2500-6' },
  { id: 'ex25-s9-03', sheet: '09', category: 'FUEL HOSES', itemNumber: '03', partNumber: '4631455', description: 'Fuel Hose (20)', model: 'EX2500-6' },
  { id: 'ex25-s9-04', sheet: '09', category: 'FUEL HOSES', itemNumber: '04', partNumber: '4658024', description: 'Fuel Hose (20)', model: 'EX2500-6' },
  { id: 'ex25-s9-05', sheet: '09', category: 'FUEL HOSES', itemNumber: '05', partNumber: '4658985', description: 'Fuel Hose (30)', model: 'EX2500-6' },
  { id: 'ex25-s9-06', sheet: '09', category: 'FUEL HOSES', itemNumber: '06', partNumber: '4652663', description: 'Fuel Hose (31)', model: 'EX2500-6' },
  { id: 'ex25-s9-07', sheet: '09', category: 'FUEL HOSES', itemNumber: '07', partNumber: '4666521', description: 'Fuel Hose (28)', model: 'EX2500-6' },
  { id: 'ex25-s9-08', sheet: '09', category: 'FUEL HOSES', itemNumber: '08', partNumber: '4666522', description: 'Fuel Hose (27)', model: 'EX2500-6' },
  { id: 'ex25-s9-09', sheet: '09', category: 'FUEL HOSES', itemNumber: '09', partNumber: '4658713', description: 'Fuel Hose (06)', model: 'EX2500-6' },
  { id: 'ex25-s9-10', sheet: '09', category: 'FUEL HOSES', itemNumber: '10', partNumber: '4666525', description: 'Fuel Hose (07)', model: 'EX2500-6' },
  { id: 'ex25-s9-11', sheet: '09', category: 'FUEL HOSES', itemNumber: '11', partNumber: '4639387', description: 'Fuel Hose (25)', model: 'EX2500-6' },
  { id: 'ex25-s9-12', sheet: '09', category: 'FUEL HOSES', itemNumber: '12', partNumber: '4659057', description: 'Fuel Hose (03)', model: 'EX2500-6' },
  { id: 'ex25-s9-13', sheet: '09', category: 'FUEL HOSES', itemNumber: '13', partNumber: '4658713', description: 'Fuel Hose (04)', model: 'EX2500-6' },

  // SHEET 10-a - MAIN PIPINGS (1) <LOADER>
  { id: 'ex25-s10a-00', sheet: '10-a', category: 'MAIN PIPINGS (1) <LOADER>', itemNumber: '00', partNumber: '4361086', description: 'Main Hose (57)', model: 'EX2500-6' },
  { id: 'ex25-s10a-01', sheet: '10-a', category: 'MAIN PIPINGS (1) <LOADER>', itemNumber: '01', partNumber: '4353137', description: 'Main Hose (65)', model: 'EX2500-6' },

  // SHEET 10-a - MAIN PIPINGS (3) <LOADER>
  { id: 'ex25-s10a-02', sheet: '10-a', category: 'MAIN PIPINGS (3) <LOADER>', itemNumber: '02', partNumber: '4345430', description: 'Main Hose (63)', model: 'EX2500-6' },
  { id: 'ex25-s10a-03', sheet: '10-a', category: 'MAIN PIPINGS (3) <LOADER>', itemNumber: '03', partNumber: '4345283', description: 'Main Hose (64)', model: 'EX2500-6' },
  { id: 'ex25-s10a-04', sheet: '10-a', category: 'MAIN PIPINGS (3) <LOADER>', itemNumber: '04', partNumber: '4332591', description: 'Main Hose (129)', model: 'EX2500-6' },

  // SHEET 10-a - MAIN PIPINGS (4) <SWING, TRAVEL>
  { id: 'ex25-s10a-05', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '05', partNumber: '4363100', description: 'Main Hose (06)', model: 'EX2500-6' },
  { id: 'ex25-s10a-06', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '06', partNumber: '4363100', description: 'Main Hose (06)', model: 'EX2500-6' },
  { id: 'ex25-s10a-07', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '07', partNumber: '4363101', description: 'Main Hose (07)', model: 'EX2500-6' },
  { id: 'ex25-s10a-08', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '08', partNumber: '4363101', description: 'Main Hose (07)', model: 'EX2500-6' },
  { id: 'ex25-s10a-09', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '09', partNumber: '4401504', description: 'Main Hose (35)', model: 'EX2500-6' },
  { id: 'ex25-s10a-10', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '10', partNumber: '4401505', description: 'Main Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s10a-11', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '11', partNumber: '4401505', description: 'Main Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s10a-12', sheet: '10-a', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '12', partNumber: '4401504', description: 'Main Hose (35)', model: 'EX2500-6' },

  // SHEET 10-b - MAIN PIPINGS (1) <BACKHOE>
  { id: 'ex25-s10b-00', sheet: '10-b', category: 'MAIN PIPINGS (1) <BACKHOE>', itemNumber: '00', partNumber: '4361086', description: 'Main Hose (57)', model: 'EX2500-6' },
  { id: 'ex25-s10b-01', sheet: '10-b', category: 'MAIN PIPINGS (1) <BACKHOE>', itemNumber: '01', partNumber: '4353137', description: 'Main Hose (65)', model: 'EX2500-6' },
  { id: 'ex25-s10b-02', sheet: '10-b', category: 'MAIN PIPINGS (1) <BACKHOE>', itemNumber: '02', partNumber: '4404928', description: 'Main Hose (139)', model: 'EX2500-6' },

  // SHEET 10-b - MAIN PIPINGS (3) <BACKHOE>
  { id: 'ex25-s10b-03', sheet: '10-b', category: 'MAIN PIPINGS (3) <BACKHOE>', itemNumber: '03', partNumber: '4345430', description: 'Main Hose (63)', model: 'EX2500-6' },
  { id: 'ex25-s10b-04', sheet: '10-b', category: 'MAIN PIPINGS (3) <BACKHOE>', itemNumber: '04', partNumber: '4345283', description: 'Main Hose (64)', model: 'EX2500-6' },
  { id: 'ex25-s10b-05', sheet: '10-b', category: 'MAIN PIPINGS (3) <BACKHOE>', itemNumber: '05', partNumber: '4332591', description: 'Main Hose (129)', model: 'EX2500-6' },
  { id: 'ex25-s10b-06', sheet: '10-b', category: 'MAIN PIPINGS (3) <BACKHOE>', itemNumber: '06', partNumber: '4345283', description: 'Main Hose (64)', model: 'EX2500-6' },

  // SHEET 10-b - MAIN PIPINGS (4) <SWING, TRAVEL>
  { id: 'ex25-s10b-07', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '07', partNumber: '4363100', description: 'Main Hose (06)', model: 'EX2500-6' },
  { id: 'ex25-s10b-08', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '08', partNumber: '4363100', description: 'Main Hose (06)', model: 'EX2500-6' },
  { id: 'ex25-s10b-09', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '09', partNumber: '4363101', description: 'Main Hose (07)', model: 'EX2500-6' },
  { id: 'ex25-s10b-10', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '10', partNumber: '4363101', description: 'Main Hose (07)', model: 'EX2500-6' },
  { id: 'ex25-s10b-11', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '11', partNumber: '4401504', description: 'Main Hose (35)', model: 'EX2500-6' },
  { id: 'ex25-s10b-12', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '12', partNumber: '4401505', description: 'Main Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s10b-13', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '13', partNumber: '4401505', description: 'Main Hose (36)', model: 'EX2500-6' },
  { id: 'ex25-s10b-14', sheet: '10-b', category: 'MAIN PIPINGS (4) <SWING, TRAVEL>', itemNumber: '14', partNumber: '4401504', description: 'Main Hose (35)', model: 'EX2500-6' },

  // SHEET 11 - TRAVEL PIPINGS (TRACK)
  { id: 'ex25-s11-01', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '01', partNumber: '4190090', description: 'HOSE (Code 00)', model: 'EX2500-6' },
  { id: 'ex25-s11-02', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '02', partNumber: '4075854', description: 'FLANGE;SPLIT (Code 01)', model: 'EX2500-6' },
  { id: 'ex25-s11-03', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '03', partNumber: 'M341650', description: 'BOLT;SOCKET (Code 02)', model: 'EX2500-6' },
  { id: 'ex25-s11-04', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '04', partNumber: '4510169', description: 'O-RING (Code 03)', model: 'EX2500-6' },
  { id: 'ex25-s11-05', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '05', partNumber: '3035396', description: 'BLOCK (Code 04)', model: 'EX2500-6' },
  { id: 'ex25-s11-06', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '06', partNumber: '8060657', description: 'PIPE (Code 06)', model: 'EX2500-6' },
  { id: 'ex25-s11-07', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '07', partNumber: '8060658', description: 'PIPE (Code 07)', model: 'EX2500-6' },
  { id: 'ex25-s11-08', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '08', partNumber: '8060659', description: 'PIPE (Code 08)', model: 'EX2500-6' },
  { id: 'ex25-s11-09', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '09', partNumber: '8060660', description: 'PIPE (Code 09)', model: 'EX2500-6' },
  { id: 'ex25-s11-10', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '10', partNumber: '4386596', description: 'VALVE;BRAKE (Code 11)', model: 'EX2500-6' },
  { id: 'ex25-s11-11', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '11', partNumber: 'J901611', description: 'BOLT (Code 12)', model: 'EX2500-6' },
  { id: 'ex25-s11-12', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '12', partNumber: 'A590916', description: 'WASHER;SPRING (Code 13)', model: 'EX2500-6' },
  { id: 'ex25-s11-13', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '13', partNumber: 'J950016', description: 'NUT (Code 14)', model: 'EX2500-6' },
  { id: 'ex25-s11-14', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '14', partNumber: '4344602', description: 'HOSE (Code 15)', model: 'EX2500-6' },
  { id: 'ex25-s11-15', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '15', partNumber: '4344601', description: 'HOSE (Code 16)', model: 'EX2500-6' },
  { id: 'ex25-s11-16', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '16', partNumber: '9743322', description: 'SUPPORT (Code 18)', model: 'EX2500-6' },
  { id: 'ex25-s11-17', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '17', partNumber: 'J271225', description: 'BOLT;SEMS (Code 19)', model: 'EX2500-6' },
  { id: 'ex25-s11-18', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '18', partNumber: 'J901225', description: 'BOLT (Code 19A)', model: 'EX2500-6' },
  { id: 'ex25-s11-19', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '19', partNumber: 'J222012', description: 'WASHER (Code 19B)', model: 'EX2500-6' },
  { id: 'ex25-s11-20', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '20', partNumber: '4186032', description: 'CLAMP (Code 20)', model: 'EX2500-6' },
  { id: 'ex25-s11-21', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '21', partNumber: '4186033', description: 'BUSHING (Code 21)', model: 'EX2500-6' },
  { id: 'ex25-s11-22', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '22', partNumber: 'J901003', description: 'BOLT (Code 22)', model: 'EX2500-6' },
  { id: 'ex25-s11-23', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '23', partNumber: 'A590910', description: 'WASHER;SPRING (Code 23)', model: 'EX2500-6' },
  { id: 'ex25-s11-24', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '24', partNumber: '4257716', description: 'CLAMP;PIPE (Code 24)', model: 'EX2500-6' },
  { id: 'ex25-s11-25', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '25', partNumber: 'J271285', description: 'BOLT;SEMS (Code 25)', model: 'EX2500-6' },
  { id: 'ex25-s11-26', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '26', partNumber: 'J901285', description: 'BOLT (Code 25A)', model: 'EX2500-6' },
  { id: 'ex25-s11-27', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '27', partNumber: 'J222012', description: 'WASHER (Code 25B)', model: 'EX2500-6' },
  { id: 'ex25-s11-28', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '28', partNumber: '9748863', description: 'SUPPORT (Code 26)', model: 'EX2500-6' },
  { id: 'ex25-s11-29', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '29', partNumber: '4031909', description: 'CLAMP (Code 27)', model: 'EX2500-6' },
  { id: 'ex25-s11-30', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '30', partNumber: 'J271275', description: 'BOLT;SEMS (Code 28)', model: 'EX2500-6' },
  { id: 'ex25-s11-31', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '31', partNumber: 'J901275', description: 'BOLT (Code 28A)', model: 'EX2500-6' },
  { id: 'ex25-s11-32', sheet: '11', category: 'TRAVEL PIPINGS (TRACK)', itemNumber: '32', partNumber: 'J222012', description: 'WASHER (Code 28B)', model: 'EX2500-6' },

  // SHEET 12 - LOADER FRONT TO SUPERSTRUCTURE
  { id: 'ex25-s12-00', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '00', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-01', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '01', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-02', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '02', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-03', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '03', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-04', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '04', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-05', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '05', partNumber: '4357725', description: 'Front Hose (11)', model: 'EX2500-6' },
  { id: 'ex25-s12-06', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '06', partNumber: '4357725', description: 'Front Hose (11)', model: 'EX2500-6' },
  { id: 'ex25-s12-07', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '07', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-08', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '08', partNumber: '4357729', description: 'Front Hose (10)', model: 'EX2500-6' },
  { id: 'ex25-s12-09', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '09', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-10', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '10', partNumber: '4357729', description: 'Front Hose (10)', model: 'EX2500-6' },
  { id: 'ex25-s12-11', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '11', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-12', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '12', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-13', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '13', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },
  { id: 'ex25-s12-14', sheet: '12', category: 'LOADER FRONT TO SUPERSTRUCTURE', itemNumber: '14', partNumber: '4433056', description: 'Front Hose (08)', model: 'EX2500-6' },

  // SHEET 13 - BACKHOE FRONT TO SUPERSTRUCTURE
  { id: 'ex25-s13-01', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '01', partNumber: '8069189', description: 'PIPE', model: 'EX2500-6' },
  { id: 'ex25-s13-02', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '02', partNumber: '8069190', description: 'PIPE', model: 'EX2500-6' },
  { id: 'ex25-s13-03', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '03', partNumber: '4510170', description: 'O-RING', model: 'EX2500-6' },
  { id: 'ex25-s13-04', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '04', partNumber: 'M342065', description: 'BOLT;SOCKET', model: 'EX2500-6' },
  { id: 'ex25-s13-05', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '05', partNumber: '4433056', description: 'HOSE', model: 'EX2500-6' },
  { id: 'ex25-s13-06', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '06', partNumber: '4169565', description: 'FLANGE;SPLIT', model: 'EX2500-6' },
  { id: 'ex25-s13-07', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '07', partNumber: '4510170', description: 'O-RING', model: 'EX2500-6' },
  { id: 'ex25-s13-08', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '08', partNumber: 'M342065', description: 'BOLT;SOCKET', model: 'EX2500-6' },
  { id: 'ex25-s13-09', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '09', partNumber: '4342723', description: 'CLAMP;PIPE', model: 'EX2500-6' },
  { id: 'ex25-s13-10', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '10', partNumber: 'J271200', description: 'BOLT;SEMS', model: 'EX2500-6' },
  { id: 'ex25-s13-11', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '11', partNumber: 'J901200', description: 'BOLT', model: 'EX2500-6' },
  { id: 'ex25-s13-12', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '12', partNumber: 'J222012', description: 'WASHER', model: 'EX2500-6' },
  { id: 'ex25-s13-13', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '13', partNumber: '3098370', description: 'PLATE', model: 'EX2500-6' },
  { id: 'ex25-s13-14', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '14', partNumber: '4473130', description: 'CLAMP', model: 'EX2500-6' },
  { id: 'ex25-s13-15', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '15', partNumber: '4485333', description: 'CLAMP', model: 'EX2500-6' },
  { id: 'ex25-s13-16', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '16', partNumber: 'J901213', description: 'BOLT', model: 'EX2500-6' },
  { id: 'ex25-s13-17', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '17', partNumber: 'A590112', description: 'WASHER;PLANE', model: 'EX2500-6' },
  { id: 'ex25-s13-18', sheet: '13', category: 'BACKHOE FRONT TO SUPERSTRUCTURE', itemNumber: '18', partNumber: 'J950012', description: 'NUT', model: 'EX2500-6' },

  // SHEET 07 - AIR-CONDITIONER PIPING (2)
  { id: 'ac2-02', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '02', partNumber: 'A852244', description: 'ELBOW;S (Code 02)', model: 'EX2500-6' },
  { id: 'ac2-02a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '02A', partNumber: '4506418', description: 'O-RING (Code 02A)', model: 'EX2500-6' },
  { id: 'ac2-03', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '03', partNumber: 'A852266', description: 'ELBOW;S (Code 03)', model: 'EX2500-6' },
  { id: 'ac2-03a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '03A', partNumber: '4506424', description: 'O-RING (Code 03A)', model: 'EX2500-6' },
  { id: 'ac2-05', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '05', partNumber: 'A852144', description: 'ADAPTER;S (Code 05)', model: 'EX2500-6' },
  { id: 'ac2-05a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '05A', partNumber: '4506418', description: 'O-RING (Code 05A)', model: 'EX2500-6' },
  { id: 'ac2-14', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '14', partNumber: '9744697', description: 'BRACKET (Code 14)', model: 'EX2500-6' },
  { id: 'ac2-15', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '15', partNumber: 'J271025', description: 'BOLT;SEMS (Code 15)', model: 'EX2500-6' },
  { id: 'ac2-15a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '15A', partNumber: 'J901025', description: 'BOLT (Code 15A)', model: 'EX2500-6' },
  { id: 'ac2-15b', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '15B', partNumber: 'J222010', description: 'WASHER (Code 15B)', model: 'EX2500-6' },
  { id: 'ac2-19', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '19', partNumber: '4352252', description: 'BLOCK (Code 19)', model: 'EX2500-6' },
  { id: 'ac2-20', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '20', partNumber: 'J271065', description: 'BOLT;SEMS (Code 20)', model: 'EX2500-6' },
  { id: 'ac2-20a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '20A', partNumber: 'J901065', description: 'BOLT (Code 20A)', model: 'EX2500-6' },
  { id: 'ac2-20b', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '20B', partNumber: 'J222010', description: 'WASHER (Code 20B)', model: 'EX2500-6' },
  { id: 'ac2-21', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '21', partNumber: '4616739', description: 'VALVE (Code 21)', model: 'EX2500-6' },
  { id: 'ac2-22', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '22', partNumber: '4156433', description: 'ELBOW;S (Code 22)', model: 'EX2500-6' },
  { id: 'ac2-23', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '23', partNumber: '4353121', description: 'HOSE;WATER (Code 23)', model: 'EX2500-6' },
  { id: 'ac2-24', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '24', partNumber: '4652384', description: 'HOSE;WATER (Code 24)', model: 'EX2500-6' },
  { id: 'ac2-25', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '25', partNumber: '4652383', description: 'HOSE;WATER (Code 25)', model: 'EX2500-6' },
  { id: 'ac2-26', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '26', partNumber: '4514699', description: 'CLAMP;HOSE (Code 26)', model: 'EX2500-6' },
  { id: 'ac2-27', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '27', partNumber: '4193816', description: 'CLIP (Code 27)', model: 'EX2500-6' },
  { id: 'ac2-28', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '28', partNumber: '4190265', description: 'CLIP (Code 28)', model: 'EX2500-6' },
  { id: 'ac2-29', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '29', partNumber: '4190266', description: 'CLIP (Code 29)', model: 'EX2500-6' },
  { id: 'ac2-30', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '30', partNumber: 'J271025', description: 'BOLT;SEMS (Code 30)', model: 'EX2500-6' },
  { id: 'ac2-30a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '30A', partNumber: 'J901025', description: 'BOLT (Code 30A)', model: 'EX2500-6' },
  { id: 'ac2-30b', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '30B', partNumber: 'J222010', description: 'WASHER (Code 30B)', model: 'EX2500-6' },
  { id: 'ac2-32', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '32', partNumber: '8104714', description: 'PANEL (Code 32)', model: 'EX2500-6' },
  { id: 'ac2-33', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '33', partNumber: 'J271030', description: 'BOLT;SEMS (Code 33)', model: 'EX2500-6' },
  { id: 'ac2-33a', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '33A', partNumber: 'J901030', description: 'BOLT (Code 33A)', model: 'EX2500-6' },
  { id: 'ac2-33b', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '33B', partNumber: 'J222010', description: 'WASHER (Code 33B)', model: 'EX2500-6' },
  { id: 'ac2-35', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '35', partNumber: '4447217', description: 'HOSE (Code 35)', model: 'EX2500-6' },
  { id: 'ac2-36', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '36', partNumber: '4447218', description: 'HOSE (Code 36)', model: 'EX2500-6' },
  { id: 'ac2-37', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '37', partNumber: '4217382', description: 'HOSE (Code 37)', model: 'EX2500-6' },
  { id: 'ac2-39', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '39', partNumber: '4652391', description: 'HOSE (Code 39)', model: 'EX2500-6' },
  { id: 'ac2-40', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '40', partNumber: '4652390', description: 'HOSE (Code 40)', model: 'EX2500-6' },
  { id: 'ac2-41', sheet: '07', category: 'AIR-CONDITIONER PIPING (2)', itemNumber: '41', partNumber: '4652393', description: 'HOSE (Code 41)', model: 'EX2500-6' },
  
  // EX2600-7-BH PARTS
  { id: 'ex26-01-01', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '01', partNumber: '4649911', description: 'Radiator Core', model: 'EX2600-7-BH' },
  { id: 'ex26-01-02', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '02', partNumber: '4649912', description: 'Upper Tank', model: 'EX2600-7-BH' },
  { id: 'ex26-01-03', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '03', partNumber: '4649913', description: 'Lower Tank', model: 'EX2600-7-BH' },
  { id: 'ex26-02-01', sheet: '02', category: 'RADIATOR (2/2)', itemNumber: '01', partNumber: '4649914', description: 'Oil Cooler Core', model: 'EX2600-7-BH' },
  { id: 'ex26-02-02', sheet: '02', category: 'RADIATOR (2/2)', itemNumber: '02', partNumber: '4649915', description: 'Fan Motor', model: 'EX2600-7-BH' },
  { id: 'ex26-03-01', sheet: '03', category: 'ENGINE', itemNumber: '01', partNumber: 'YA00001234', description: 'Engine Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-03-02', sheet: '03', category: 'ENGINE', itemNumber: '02', partNumber: 'YA00001235', description: 'Turbocharger', model: 'EX2600-7-BH' },
  { id: 'ex26-03-03', sheet: '03', category: 'ENGINE', itemNumber: '03', partNumber: 'YA00001236', description: 'Alternator', model: 'EX2600-7-BH' },
  { id: 'ex26-04-01', sheet: '04', category: 'HYDRAULIC PUMP', itemNumber: '01', partNumber: 'YA00005678', description: 'Main Pump (R)', model: 'EX2600-7-BH' },
  { id: 'ex26-04-02', sheet: '04', category: 'HYDRAULIC PUMP', itemNumber: '02', partNumber: 'YA00005679', description: 'Main Pump (L)', model: 'EX2600-7-BH' },
  { id: 'ex26-05-01', sheet: '05', category: 'SWING MOTOR', itemNumber: '01', partNumber: 'YA00009012', description: 'Swing Motor Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-05-02', sheet: '05', category: 'SWING MOTOR', itemNumber: '02', partNumber: 'YA00009013', description: 'Swing Reduction Gear', model: 'EX2600-7-BH' },
  { id: 'ex26-06-01', sheet: '06', category: 'CONTROL VALVE', itemNumber: '01', partNumber: 'YA00007788', description: 'Control Valve Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-07-01', sheet: '07', category: 'BOOM', itemNumber: '01', partNumber: 'YA00008899', description: 'Boom Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-08-01', sheet: '08', category: 'ARM', itemNumber: '01', partNumber: 'YA00009900', description: 'Arm Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-09-01', sheet: '09', category: 'BUCKET', itemNumber: '01', partNumber: 'YA00010011', description: 'Bucket Assy', model: 'EX2600-7-BH' },
  { id: 'ex26-01-01-std', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '01', partNumber: '4649911', description: 'Radiator Core', model: 'EX2600-7' },
  { id: 'ex26-01-02-std', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '02', partNumber: '4649912', description: 'Upper Tank', model: 'EX2600-7' },
  { id: 'ex26-01-03-std', sheet: '01', category: 'RADIATOR (1/2)', itemNumber: '03', partNumber: '4649913', description: 'Lower Tank', model: 'EX2600-7' },
  { id: 'ex26-02-01-std', sheet: '02', category: 'RADIATOR (2/2)', itemNumber: '01', partNumber: '4649914', description: 'Oil Cooler Core', model: 'EX2600-7' },
  { id: 'ex26-02-02-std', sheet: '02', category: 'RADIATOR (2/2)', itemNumber: '02', partNumber: '4649915', description: 'Fan Motor', model: 'EX2600-7' },
  { id: 'ex26-03-01-std', sheet: '03', category: 'ENGINE', itemNumber: '01', partNumber: 'YA00001234', description: 'Engine Assy', model: 'EX2600-7' },
  { id: 'ex26-03-02-std', sheet: '03', category: 'ENGINE', itemNumber: '02', partNumber: 'YA00001235', description: 'Turbocharger', model: 'EX2600-7' },
  { id: 'ex26-03-03-std', sheet: '03', category: 'ENGINE', itemNumber: '03', partNumber: 'YA00001236', description: 'Alternator', model: 'EX2600-7' },
  { id: 'ex26-04-01-std', sheet: '04', category: 'HYDRAULIC PUMP', itemNumber: '01', partNumber: 'YA00005678', description: 'Main Pump (R)', model: 'EX2600-7' },
  { id: 'ex26-04-02-std', sheet: '04', category: 'HYDRAULIC PUMP', itemNumber: '02', partNumber: 'YA00005679', description: 'Main Pump (L)', model: 'EX2600-7' },
  { id: 'ex26-05-01-std', sheet: '05', category: 'SWING MOTOR', itemNumber: '01', partNumber: 'YA00009012', description: 'Swing Motor Assy', model: 'EX2600-7' },
  { id: 'ex26-05-02-std', sheet: '05', category: 'SWING MOTOR', itemNumber: '02', partNumber: 'YA00009013', description: 'Swing Reduction Gear', model: 'EX2600-7' },
  { id: 'ex26-06-01-std', sheet: '06', category: 'CONTROL VALVE', itemNumber: '01', partNumber: 'YA00007788', description: 'Control Valve Assy', model: 'EX2600-7' },
  { id: 'ex26-07-01-std', sheet: '07', category: 'BOOM', itemNumber: '01', partNumber: 'YA00008899', description: 'Boom Assy', model: 'EX2600-7' },
  { id: 'ex26-08-01-std', sheet: '08', category: 'ARM', itemNumber: '01', partNumber: 'YA00009900', description: 'Arm Assy', model: 'EX2600-7' },
  { id: 'ex26-09-01-std', sheet: '09', category: 'BUCKET', itemNumber: '01', partNumber: 'YA00010011', description: 'Bucket Assy', model: 'EX2600-7' },
  // Additional sheets for EX2600-7-BH
  { id: 'ex26-10-01', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '01', partNumber: 'YA00001111', description: 'Return Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-11-01', sheet: '11', category: 'SWING PIPINGS', itemNumber: '01', partNumber: 'YA00002222', description: 'Swing Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-12-01', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '01', partNumber: 'YA00003333', description: 'Travel Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-13-01', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '01', partNumber: 'YA00004444', description: 'Travel Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-14-01', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '01', partNumber: 'YA00005555', description: 'Main Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-15-01', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '01', partNumber: 'YA00006666', description: 'Front Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-16-01', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '01', partNumber: 'YA00007777', description: 'Electric Harness', model: 'EX2600-7-BH' },
  { id: 'ex26-17-01', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '01', partNumber: 'YA00008888', description: 'Pump Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-18-01', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '01', partNumber: 'YA00009999', description: 'Valve Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-19-01', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00011111', description: 'Boom Cylinder Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-20-01', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00022222', description: 'Arm Cylinder Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-21-01', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00033333', description: 'Bucket Cylinder Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-22-01', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00044444', description: 'Swing Motor Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-23-01', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00055555', description: 'Travel Motor Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-24-01', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '01', partNumber: 'YA00066666', description: 'Radiator Hose', model: 'EX2600-7-BH' },
  { id: 'ex26-25-01', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '01', partNumber: 'YA00077777', description: 'Cabin Harness', model: 'EX2600-7-BH' },
  { id: 'ex26-26-01', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '01', partNumber: 'YA00088888', description: 'Stop Switch', model: 'EX2600-7-BH' },
  { id: 'ex26-27-01', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '01', partNumber: 'YA00099999', description: 'Cleaning Point', model: 'EX2600-7-BH' },
  { id: 'ex26-28-01', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '01', partNumber: 'YA00111111', description: 'Track Link', model: 'EX2600-7-BH' },
  { id: 'ex26-29-01', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '01', partNumber: 'YA00222222', description: 'Bucket Tooth', model: 'EX2600-7-BH' },
  { id: 'ex26-30-01', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '01', partNumber: 'YA00333333', description: 'Working Light', model: 'EX2600-7-BH' },
  // Additional sheets for EX2600-7
  { id: 'ex26-10-01-std', sheet: '10', category: 'RETURN PIPINGS', itemNumber: '01', partNumber: 'YA00001111', description: 'Return Hose', model: 'EX2600-7' },
  { id: 'ex26-11-01-std', sheet: '11', category: 'SWING PIPINGS', itemNumber: '01', partNumber: 'YA00002222', description: 'Swing Hose', model: 'EX2600-7' },
  { id: 'ex26-12-01-std', sheet: '12', category: 'TRAVEL PIPINGS (1)', itemNumber: '01', partNumber: 'YA00003333', description: 'Travel Hose', model: 'EX2600-7' },
  { id: 'ex26-13-01-std', sheet: '13', category: 'TRAVEL PIPINGS (2)', itemNumber: '01', partNumber: 'YA00004444', description: 'Travel Hose', model: 'EX2600-7' },
  { id: 'ex26-14-01-std', sheet: '14', category: 'BACKHOE FRONT MAIN PIPINGS', itemNumber: '01', partNumber: 'YA00005555', description: 'Main Hose', model: 'EX2600-7' },
  { id: 'ex26-15-01-std', sheet: '15', category: 'BACKHOE FRONT PIPINGS (2)', itemNumber: '01', partNumber: 'YA00006666', description: 'Front Hose', model: 'EX2600-7' },
  { id: 'ex26-16-01-std', sheet: '16', category: 'AROUND ENGINE REAR SIDE', itemNumber: '01', partNumber: 'YA00007777', description: 'Electric Harness', model: 'EX2600-7' },
  { id: 'ex26-17-01-std', sheet: '17', category: 'HYDRAULIC PUMP PIPINGS', itemNumber: '01', partNumber: 'YA00008888', description: 'Pump Hose', model: 'EX2600-7' },
  { id: 'ex26-18-01-std', sheet: '18', category: 'CONTROL VALVE PIPINGS', itemNumber: '01', partNumber: 'YA00009999', description: 'Valve Hose', model: 'EX2600-7' },
  { id: 'ex26-19-01-std', sheet: '19', category: 'BOOM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00011111', description: 'Boom Cylinder Hose', model: 'EX2600-7' },
  { id: 'ex26-20-01-std', sheet: '20', category: 'ARM CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00022222', description: 'Arm Cylinder Hose', model: 'EX2600-7' },
  { id: 'ex26-21-01-std', sheet: '21', category: 'BUCKET CYLINDER PIPINGS', itemNumber: '01', partNumber: 'YA00033333', description: 'Bucket Cylinder Hose', model: 'EX2600-7' },
  { id: 'ex26-22-01-std', sheet: '22', category: 'SWING MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00044444', description: 'Swing Motor Hose', model: 'EX2600-7' },
  { id: 'ex26-23-01-std', sheet: '23', category: 'TRAVEL MOTOR PIPINGS', itemNumber: '01', partNumber: 'YA00055555', description: 'Travel Motor Hose', model: 'EX2600-7' },
  { id: 'ex26-24-01-std', sheet: '24', category: 'RADIATOR & OIL COOLER', itemNumber: '01', partNumber: 'YA00066666', description: 'Radiator Hose', model: 'EX2600-7' },
  { id: 'ex26-25-01-std', sheet: '25', category: 'CABIN & ELECTRIC', itemNumber: '01', partNumber: 'YA00077777', description: 'Cabin Harness', model: 'EX2600-7' },
  { id: 'ex26-26-01-std', sheet: '26', category: 'ENGINE STOP SWITCH', itemNumber: '01', partNumber: 'YA00088888', description: 'Stop Switch', model: 'EX2600-7' },
  { id: 'ex26-27-01-std', sheet: '27', category: 'CLEANING THE MACHINE', itemNumber: '01', partNumber: 'YA00099999', description: 'Cleaning Point', model: 'EX2600-7' },
  { id: 'ex26-28-01-std', sheet: '28', category: 'UNDERCARRIAGE', itemNumber: '01', partNumber: 'YA00111111', description: 'Track Link', model: 'EX2600-7' },
  { id: 'ex26-29-01-std', sheet: '29', category: 'BUCKET & TEETH', itemNumber: '01', partNumber: 'YA00222222', description: 'Bucket Tooth', model: 'EX2600-7' },
  { id: 'ex26-30-01-std', sheet: '30', category: 'LIGHTS & MIRRORS', itemNumber: '01', partNumber: 'YA00333333', description: 'Working Light', model: 'EX2600-7' },
  // New UNDERCARRIAGE sheets for EX2600-7
  { id: 'ex26-31-01', sheet: '31', category: 'TRAVEL DEVICE', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL DEVICE', model: 'EX2600-7' },
  { id: 'ex26-32-01', sheet: '32', category: 'TRANSMISSION (TRAVEL)', itemNumber: '01', partNumber: '++++++++++', description: 'TRANSMISSION (TRAVEL)', model: 'EX2600-7' },
  { id: 'ex26-33-01', sheet: '33', category: 'DRIVE TUMBLER', itemNumber: '01', partNumber: '++++++++++', description: 'DRIVE TUMBLER', model: 'EX2600-7' },
  { id: 'ex26-34-01', sheet: '34', category: 'ADJUSTER PIPING (1)', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER PIPING (1)', model: 'EX2600-7' },
  { id: 'ex26-35-01', sheet: '35', category: 'ADJUSTER PIPING (2)', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER PIPING (2)', model: 'EX2600-7' },
  { id: 'ex26-36-01', sheet: '36', category: 'TRAVEL PIPING (1)', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL PIPING (1)', model: 'EX2600-7' },
  { id: 'ex26-37-01', sheet: '37', category: 'TRAVEL PIPING (2)', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL PIPING (2)', model: 'EX2600-7' },
  { id: 'ex26-38-01', sheet: '38', category: 'ADJUSTER CYLINDER', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER CYLINDER', model: 'EX2600-7' },
  { id: 'ex26-39-01', sheet: '39', category: 'ANGLE SENSOR (TRAVEL)', itemNumber: '01', partNumber: '++++++++++', description: 'ANGLE SENSOR (TRAVEL)', model: 'EX2600-7' },
  { id: 'ex26-40-01', sheet: '40', category: 'FRONT IDLER', itemNumber: '01', partNumber: '++++++++++', description: 'FRONT IDLER', model: 'EX2600-7' },
  { id: 'ex26-41-01', sheet: '41', category: 'UPPER ROLLER', itemNumber: '01', partNumber: '++++++++++', description: 'UPPER ROLLER', model: 'EX2600-7' },
  { id: 'ex26-42-01', sheet: '42', category: 'LOWER ROLLER', itemNumber: '01', partNumber: '++++++++++', description: 'LOWER ROLLER', model: 'EX2600-7' },
  // New UNDERCARRIAGE sheets for EX2600-7-BH
  { id: 'ex26-31-01-bh', sheet: '31', category: 'TRAVEL DEVICE', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL DEVICE', model: 'EX2600-7-BH' },
  { id: 'ex26-32-01-bh', sheet: '32', category: 'TRANSMISSION (TRAVEL)', itemNumber: '01', partNumber: '++++++++++', description: 'TRANSMISSION (TRAVEL)', model: 'EX2600-7-BH' },
  { id: 'ex26-33-01-bh', sheet: '33', category: 'DRIVE TUMBLER', itemNumber: '01', partNumber: '++++++++++', description: 'DRIVE TUMBLER', model: 'EX2600-7-BH' },
  { id: 'ex26-34-01-bh', sheet: '34', category: 'ADJUSTER PIPING (1)', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER PIPING (1)', model: 'EX2600-7-BH' },
  { id: 'ex26-35-01-bh', sheet: '35', category: 'ADJUSTER PIPING (2)', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER PIPING (2)', model: 'EX2600-7-BH' },
  { id: 'ex26-36-01-bh', sheet: '36', category: 'TRAVEL PIPING (1)', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL PIPING (1)', model: 'EX2600-7-BH' },
  { id: 'ex26-37-01-bh', sheet: '37', category: 'TRAVEL PIPING (2)', itemNumber: '01', partNumber: '++++++++++', description: 'TRAVEL PIPING (2)', model: 'EX2600-7-BH' },
  { id: 'ex26-38-01-bh', sheet: '38', category: 'ADJUSTER CYLINDER', itemNumber: '01', partNumber: '++++++++++', description: 'ADJUSTER CYLINDER', model: 'EX2600-7-BH' },
  { id: 'ex26-39-01-bh', sheet: '39', category: 'ANGLE SENSOR (TRAVEL)', itemNumber: '01', partNumber: '++++++++++', description: 'ANGLE SENSOR (TRAVEL)', model: 'EX2600-7-BH' },
  { id: 'ex26-40-01-bh', sheet: '40', category: 'FRONT IDLER', itemNumber: '01', partNumber: '++++++++++', description: 'FRONT IDLER', model: 'EX2600-7-BH' },
  { id: 'ex26-41-01-bh', sheet: '41', category: 'UPPER ROLLER', itemNumber: '01', partNumber: '++++++++++', description: 'UPPER ROLLER', model: 'EX2600-7-BH' },
  { id: 'ex26-42-01-bh', sheet: '42', category: 'LOWER ROLLER', itemNumber: '01', partNumber: '++++++++++', description: 'LOWER ROLLER', model: 'EX2600-7-BH' },
  // Basic parts for other models to enable reporting
  { id: 'ex12-5d-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX1200-5D' },
  { id: 'ex12-6-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX1200-6' },
  { id: 'ex25-5-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX2500-5' },
  { id: 'ex26-6bh-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX2600-6 BH' },
  { id: 'ex55-6-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX5500-6' },
  { id: 'ex55-5-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX5500-5' },
  { id: 'ex56-6ld-01', sheet: '01', category: 'GENERAL', itemNumber: '01', partNumber: 'GEN-01', description: 'General Inspection Point', model: 'EX5600-6LD' },
];
