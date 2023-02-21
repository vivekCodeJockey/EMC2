import { ColDef, RowSpanParams, ColGroupDef } from 'ag-grid-community';

export interface worksheet {
  worksheetName: string,
  allowAdd: boolean,
  fixedvalue: boolean,
  columnDef: (ColDef | ColGroupDef)[],
  value?: any
  resultHeaderName: string
}

export class WorksheetSettings {

  //CE01 / CE03 / CE101  / CE102
  public static W1: worksheet = {
    worksheetName: 'CE01/CE03/CE101/CE102',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{
      headerName: "Power Leads Type", field: 'lType', suppressMovable: true, rowSpan: function rowSpan(params) {
        var at = params.data.lType;
        if (at === '3 Phase') {
          return 4;
        } else {
          return 2;
        }
      }, cellClassRules: {
        'cell-span': "value ==='3 Phase'|| value ==='1 Phase'|| value ==='DC'",
      }
    }, { headerName: "Power Leads", field: 'plead', suppressMovable: true, }],
    value: [
      { lType: '3 Phase', plead: 'R Phase' },
      { plead: 'Y Phase' },
      { plead: 'B Phase' },
      { plead: 'Neutral' },
      { lType: '1 Phase', plead: 'Line' },
      { plead: 'Neutral' },
      { lType: 'DC', plead: 'Positive' },
      { plead: 'Negative' },
    ]
  }

  //CS01 / CS101 
  public static W4: worksheet = {
    worksheetName: 'CS01/CS101',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{
      headerName: "Power Leads Type", suppressMovable: true, field: 'lType', rowSpan: function rowSpan(params) {
        var at = params.data.lType;
        if (at === '3 Phase') {
          return 3;
        }
      }, cellClassRules: {
        'cell-span': "value ==='3 Phase'",
      }
    }, { headerName: "Power Leads", suppressMovable: true, field: 'plead' }],
    value: [
      { lType: '3 Phase', plead: 'R Phase' },
      { plead: 'Y Phase' },
      { plead: 'B Phase' },
      { lType: '1 Phase', plead: 'Line' },
      { lType: 'DC', plead: 'Positive' },
    ]
  }

  // RE101/RE01
  public static W2: worksheet = {
    worksheetName: 'RE101/RE01',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Test Position", suppressMovable: true, field: 'tPostion', editable: true }],
  }

  //RE02 / RE102
  public static W3: worksheet = {
    worksheetName: 'RE02/RE102',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Freq. Range", suppressMovable: true, field: 'fRange', editable: true }, { headerName: "Polarization", suppressMovable: true, field: 'fPolar', editable: true }],
    value: [
      { fRange: '10 kHz – 30 MHz', fPolar: 'Vertical' },
      { fRange: '30 MHz – 200 MHz', fPolar: 'Vertical' },
      { fRange: '30 MHz – 200 MHz', fPolar: 'Horizontal' },
      { fRange: '200 MHz – 1 GHz', fPolar: 'Vertical' },
      { fRange: '200 MHz – 1 GHz', fPolar: 'Horizontal' },
      { fRange: '1 GHz – 18 GHz', fPolar: 'Vertical' },
      { fRange: '1 GHz – 18 GHz', fPolar: 'Horizontal' },
      { fRange: '18GHz -40 GHZ', fPolar: 'Vertical' },
      { fRange: '18GHz -40 GHZ', fPolar: 'Horizontal' }]
  }

  // RS01/RS101
  public static W5: worksheet = {
    worksheetName: 'RS01/RS101',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Position of Radiating loop antenna", suppressMovable: true, field: 'rPostion', editable: true }],
  }

  // CE106/RE103
  public static W6: worksheet = {
    worksheetName: 'CE106/RE103',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Antenna Ports", suppressMovable: true, field: 'aport', editable: true }],
  }

  // CS103/CS104/CS105/CS03/CS04/CS05
  public static W7: worksheet = {
    worksheetName: 'CS103/CS104/CS105/CS03/CS04/CS05',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Specification", suppressMovable: true, field: 'specification', editable: true }],
    value: [{}]
  }

  //RS02
  public static W8: worksheet = {
    worksheetName: 'RS02',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Specification", suppressMovable: true, field: 'specification', editable: true }],
  }

  //CS02
  public static W9: worksheet = {
    worksheetName: 'CS02',
    allowAdd: true,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{
      headerName: "Specifications", field: 'specification', suppressMovable: true, rowSpan: function rowSpan(params) {
        return params.api.getDisplayedRowCount();
      }, cellClassRules: {
        'cell-span': "1===1",
      }
    }, { headerName: "Name of the cable", field: 'nCable', suppressMovable: true, editable: true }],
    value: [{ specification: '10k to 400 MHz, 1 Vrms' }]
  }

  //CS06/CS115
  public static W10: worksheet = {
    worksheetName: 'CS06/CS115',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Name of the cable", suppressMovable: true, field: 'ncable', editable: true }],
  }

  //RS03 / RS103
  public static W11: worksheet = {
    worksheetName: 'RS03/RS103',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Frequency Range", suppressMovable: true, field: 'fRange', editable: true }, { headerName: "Test Level & Modulation", suppressMovable: true, field: 'tmodul' }, { headerName: "Polarization", suppressMovable: true, field: 'fPolar', editable: true }],
    value: [
      { fRange: '14 kHz – 30 MHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '14 kHz – 30 MHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '30 MHz – 80 MHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '30 MHz – 80 MHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '80 MHz – 1 GHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '80 MHz – 1 GHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '1 GHz – 2.5 GHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '1 GHz – 2.5 GHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '2.5 GHz – 7.5 GHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '2.5 GHz – 7.5 GHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '7.5 GHz – 18 GHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '7.5 GHz – 18 GHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '18 GHz – 26.5 GHz', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '18 GHz – 26.5 GHz', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '26.5GHz-40 GHZ', fPolar: 'Vertical', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' },
      { fRange: '26.5GHz-40 GHZ', fPolar: 'Horizontal', tmodul: '____V/m, Amplitude Modulation (AM), 80% Depth' }]
  }

  //CS114
  public static W12: worksheet = {
    worksheetName: 'CS114',
    allowAdd: true,
    fixedvalue: true,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Specifications", suppressMovable: true, field: 'specification', editable: true }, { headerName: "Name of the cable", suppressMovable: true, field: 'nCable', editable: true }],
    value: [{ specification: 'Pulse Modulation,1 kHz sine wave,50 % duty cycle' },
    { specification: 'Applicable Curve' },
    { specification: '10 kHz to 2MHz: Curve #22' },
    { specification: '2 to 30 MHz: Curve #22' },
    { specification: '30 to 200 MHz: Curve #22' }]
  }

  //     //LDC102
  //     public static W13: worksheet = {
  //       worksheetName:'LDC102',
  //       allowAdd: false,
  //       fixedvalue: true,
  //       columnDef: [
  //       { headerName: "Test Condition", field: 'tcondition', editable: true },
  //       { headerName: "Voltage (Vdc)",
  //       children: [
  //         { children: [{field: 'MIL704A' },{field: 'MIL704B,C,D,E&F' }]},
  //          {field: 'Frequency (Hz)'},
  //          {field: 'Time Duration at Condition (min)'},
  //          {field: 'Re-Start (Yes/No)'}
  //         ]
  //       }, 
  //       { headerName: "Performance", field: 'perform', editable: true }
  //     ],
  // }

  //LDC102
  public static W13: worksheet = {
    worksheetName: 'LDC102',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters",
        headerClass: 'text-white', suppressMovable: true,
        children: [
          {
            headerName: "Voltage (Vdc)", suppressMovable: true,
            children: [

              { headerName: "MIL704A", suppressMovable: true, field: 'sa' },
              { headerName: "MIL704B,C,D,E&F'", suppressMovable: true, field: 'sf' }
            ]
          },
          { headerName: 'Frequency (Hz)', suppressMovable: true, field: 'freq' },
          { headerName: 'Time Duration at Condition (min)', suppressMovable: true, field: 'time' },
          { headerName: 'Re-Start (Yes/No)', suppressMovable: true, field: 'reStart' }
        ]
      },
    ],
    value: [
      { tcond: 'A', sa: '28', sf: '28', freq: '', time: '30', reStart: '' },
      { tcond: 'B', sa: '24', sf: '22', freq: '', time: '30', reStart: '' },
      { tcond: 'C', sa: '28.5', sf: '29', freq: '', time: '30', reStart: '' }
    ]
  }

  //LDC103
  public static W14: worksheet = {
    worksheetName: 'LDC103',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      { headerName: "Voltage (Vdc)", suppressMovable: true, field: 'voltage' },
      {
        headerName: "Frequency of Voltage Distortion (Hz)", suppressMovable: true,
        children: [
          { headerName: 'MIL704 A', suppressMovable: true, field: 'sa' },
          { headerName: 'MIL704 B,C & D', suppressMovable: true, field: 'sb' },
          { headerName: 'MIL704 E & F', suppressMovable: true, field: 'sf' },
        ]
      },
      {
        headerName: "Amplitude of Voltage Distortion (Vrms)", suppressMovable: true, headerClass: 'text-white',
        children: [
          { headerName: 'MIL704 A', suppressMovable: true, field: 'aa' },
          { headerName: 'MIL704 B,C & D', suppressMovable: true, field: 'ab' },
          { headerName: 'MIL704 E & F', suppressMovable: true, field: 'af' },
        ]
      }, { headerName: "Time Duration at Condition (min)", suppressMovable: true, field: 'time' },
    ],
    value: [
      { tcond: 'A', voltage: '28', sa: '10', sf: '10', sb: '10', aa: '0.9', ab: '0.1', af: '0.1', time: '5' },
      { tcond: 'B', voltage: '28', sa: '25', sf: '25', sb: '25', aa: '0.9', ab: '0.158', af: '0.158', time: '5' },
      { tcond: 'C', voltage: '28', sa: '50', sf: '50', sb: '50', aa: '0.4', ab: '0.2', af: '0.223', time: '5' },
      { tcond: 'D', voltage: '28', sa: '60', sf: '22', sb: '', aa: '0.32', ab: '0.224', af: '0.246', time: '5' },
      { tcond: 'E', voltage: '28', sa: '250', sf: '22', sb: '', aa: '0.32', ab: '0.398', af: '0.5', time: '5' },
      { tcond: 'F', voltage: '28', sa: '1 kHz', sf: '22', sb: '', aa: '0.79', ab: '0.707', af: '1', time: '5' },
      { tcond: 'G', voltage: '28', sa: '1.7 kHz', sf: '22', sb: '', aa: '1', ab: '0.891', af: '1', time: '5' },
      { tcond: 'H', voltage: '28', sa: '2 kHz', sf: '22', sb: '', aa: '1', ab: '1', af: '1', time: '5' },
      { tcond: 'I', voltage: '28', sa: '5 kHz', sf: '29', sb: '', aa: '1', ab: '0.316', af: '1', time: '5' },
      { tcond: 'J', voltage: '28', sa: '6.5 kHz', sf: '29', sb: '', aa: '1', ab: '0.707', af: '0.707', time: '5' },
      { tcond: 'K', voltage: '28', sa: '10 kHz', sf: '29', sb: '', aa: '0.4', ab: '0.125', af: '0.5', time: '5' }
    ]
  }

  //LDC104
  public static W15: worksheet = {
    worksheetName: 'LDC104',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      {
        headerName: "Test Condition", field: 'tcond', suppressMovable: true, editable: true, rowSpan: function rowSpan(params) {
          var at = params.data.tcond;
          if (at === 'A') {
            return 7;
          } else if (at === 'B') {
            return 7;
          }
        }, cellClassRules: {
          'cell-span': "value ==='A'|| value ==='B'",
        }
      },
      { headerName: "Voltage (Vdc)", suppressMovable: true, field: 'voltage' },
      { headerName: "Voltage Distortion Factor", suppressMovable: true, field: 'voltagedf' },
      { headerName: "Ripple Frequency Components (Hz)", suppressMovable: true, field: 'rfc' },
      { headerName: "Amplitude of Ripple Component (Vrms)", suppressMovable: true, headerClass: 'text-white', field: 'arc' },
       { headerName: "Time Duration at Condition (min)", suppressMovable: true, field: 'time', rowSpan: function rowSpan(params) {
        var at = params.data.tcond;
        if (at === 'A') {
          return 7;
        } else if (at === 'B') {
          return 7;
        }
      }, cellClassRules: {
        'cell-span': "value ==='A'|| value ==='B'",
      } },
    ],
    value: [
      { tcond: 'A', voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '1200', arc: '1', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '2400', arc: '0.2', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '3600', arc: '0.33', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '4800', arc: '0.1', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '6000', arc: '0.16', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '7200', arc: '0.05', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '8400', arc: '0.08', time: '30min (4.28min per each)' },
      { tcond: 'B', voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '2400', arc: '0.8', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '4800', arc: '0.16', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '7200', arc: '0.26', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '9600', arc: '0.08', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '12000', arc: '0.13', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '14400', arc: '0.04', time: '30min (4.28min per each)' },
      { voltage: '28', voltagedf: '2 Volts Peak to Mean', rfc: '16800', arc: '0.06', time: '30min (4.28min per each)' }
    ]
  }

  //LDC401
  public static W16: worksheet = {
    worksheetName: 'LDC401',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          {
            headerName: "Voltage (Vdc)", suppressMovable: true, headerClass: 'text-white', children: [
              { headerName: 'MIL704 A', suppressMovable: true, field: 'sa' }, { headerName: 'MIL704 B,E&F', suppressMovable: true, field: 'sb' },
              { headerName: 'MIL704 C', suppressMovable: true, field: 'sc' }, { headerName: 'MIL704 D', suppressMovable: true, field: 'sd' }]
          },
          { headerName: 'Time Duration at Condition (min)', suppressMovable: true, field: 'time' },
        ]
      },
      { headerName: 'Re-Start (Yes/No)', suppressMovable: true, field: 'reStart' },
    ],
    value: [
      { tcond: 'A', sa: '16', sc: '16', sb: '18', sd: '16', time: '30' },
      { tcond: 'B', sa: '24', sc: '30', sb: '29', sd: '29', time: '30' }
    ]
  }

  //LDC501
  public static W17: worksheet = {
    worksheetName: 'LDC501',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters",
        headerClass: 'text-white', suppressMovable: true,
        children: [
          {
            headerName: "Steady State Voltage (Vdc)", suppressMovable: true,
            children: [
              { headerName: 'MIL704 A,B & C', suppressMovable: true, field: 'sa' },
              { headerName: 'MIL704 D,E & F', suppressMovable: true, field: 'sf' }]
          },
          {
            headerName: "Voltage Transient (Vdc)", suppressMovable: true,
            children: [
              { headerName: 'MIL704 A,B & C', suppressMovable: true, field: 'va' },
              { headerName: 'MIL704 D,E & F', suppressMovable: true, field: 'vf' }]
          },
          { headerName: 'Time at Voltage Transient Level (sec)', suppressMovable: true, field: 'time' },
          { headerName: 'Oscilloscope Trace (Vrms vs. Time)', suppressMovable: true, field: 'trace' }
        ]
      },
    ],
    value: [
      { tcond: 'A/AA', sa: '28.5', sf: '29', va: '16', vf: '12', time: '30' },
    ]
  }

  //LDC601
  public static W18: worksheet = {
    worksheetName: 'LDC601',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", field: 'tcond', suppressMovable: true, editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Voltage (Vdc)", suppressMovable: true, field: 'vdc' },
          { headerName: 'Time Duration of Power Failure', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcond: 'A', vdc: '28', time: '100msec' },
      { tcond: 'B', vdc: '28', time: '500msec' },
      { tcond: 'C', vdc: '28', time: '3sec' },
      { tcond: 'D', vdc: '28', time: '7sec' },
    ]
  }

  //LDC301
  public static W19: worksheet = {
    worksheetName: 'LDC301',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Voltage (Vdc)", suppressMovable: true, children: [{ headerName: "MIL704-A", suppressMovable: true, field: 'va' }, { headerName: "MIL704-B,C,D,E&F", suppressMovable: true, field: 'vf' }] },
          { headerName: 'Time Duration at Condition (min)', suppressMovable: true, field: 'time' },
          { headerName: 'Re-Start (Yes/No)', suppressMovable: true, field: 'reStart' }
        ]
      },
    ],
    value: [
      { tcond: 'A', va: '22.5', vf: '20', time: '30' },
      { tcond: 'B', va: '30', vf: '31.5', time: '30' },
    ]
  }

  //LDC105
  public static W20: worksheet = {
    worksheetName: 'LDC105',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      {
        headerName: "Test Condition Type", suppressMovable: true, field: 'tcondType', rowSpan: function rowSpan(params) {
          var tval = params.data.tcondType;
          if (tval == 'Over Voltage Transient') {
            return 10;
          } else if (tval == 'Under Voltage Transient') {
            return 10;
          } else if (tval == 'Combiend Voltage Transient') {
            return 4;
          } else if (tval == 'Repetitive Normal Voltage Transient') {
            return 2;
          }
        }, cellClassRules: {
          'cell-span': "value==='Over Voltage Transient'||value==='Under Voltage Transient'||value==='Combiend Voltage Transient'||value==='Repetitive Normal Voltage Transient'",
        }
      },
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Steady State Voltage (Vdc)", suppressMovable: true, field: 'svdc' },
          { headerName: 'Voltage Transient (Vdc)', suppressMovable: true, field: 'voltTr' },
          { headerName: 'Time at Voltage Transient Level (msec)', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcondType: 'Over Voltage Transient', tcond: 'A', svdc: '28.5', voltTr: '70', time: '20' },
      { tcond: 'B', svdc: '28.5', voltTr: '70', time: '15' },
      { tcond: 'C', svdc: '28.5', voltTr: '50', time: '75' },
      { tcond: 'D', svdc: '28.5', voltTr: '50', time: '55' },
      { tcond: 'E', svdc: '28.5', voltTr: '70(3Times)', time: '12 Every 0.5 sec' },
      { tcond: 'F', svdc: '24', voltTr: '70', time: '20' },
      { tcond: 'D', svdc: '24', voltTr: '70', time: '15' },
      { tcond: 'H', svdc: '24', voltTr: '50', time: '75' },
      { tcond: 'I', svdc: '24', voltTr: '50', time: '55' },
      { tcond: 'J', svdc: '24', voltTr: '70(3Times)', time: '12 Every 0.5 sec' },
      { tcondType: 'Under Voltage Transient', tcond: 'K', svdc: '28.5', voltTr: '8', time: '50' },
      { tcond: 'L', svdc: '28.5', voltTr: '8', time: '38' },
      { tcond: 'M', svdc: '28.5', voltTr: '14', time: '170' },
      { tcond: 'N', svdc: '28.5', voltTr: '14', time: '128' },
      { tcond: 'O', svdc: '28.5', voltTr: '8(3Times)', time: '12 Every 0.5 sec' },
      { tcond: 'P', svdc: '24', voltTr: '8', time: '50' },
      { tcond: 'Q', svdc: '24', voltTr: '8', time: '38' },
      { tcond: 'R', svdc: '24', voltTr: '14', time: '170' },
      { tcond: 'S', svdc: '24', voltTr: '14', time: '128' },
      { tcond: 'T', svdc: '24', voltTr: '8(3Times)', time: '12 Every 0.5 sec' },
      { tcondType: 'Combiend Voltage Transient', tcond: 'U', svdc: '28.5', voltTr: '8', time: '10' },
      { tcond: 'U', svdc: '28.5', voltTr: '70', time: '15' },
      { tcond: 'V', svdc: '24', voltTr: '8', time: '10' },
      { tcond: 'V', svdc: '24', voltTr: '70', time: '15' },
      { tcondType: 'Repetitive Normal Voltage Transient', tcond: 'Repetitive Transient', svdc: '28', voltTr: '18', time: '30' },
      { tcond: 'Repetitive Transient', svdc: '28', voltTr: '45', time: '30' },
    ]
  }


  //CS118
  public static W21: worksheet = {
    worksheetName: 'CS118',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Test Level", suppressMovable: true, field: 'tLevel', editable: true },
    { headerName: "Discharge Type", suppressMovable: true, field: 'dType', editable: true },
    { headerName: "Discharge Points", suppressMovable: true, field: 'dPoint', editable: true },
    ],
  }

  //CS116
  public static W22: worksheet = {
    worksheetName: 'CS116',
    allowAdd: true,
    fixedvalue: false,
    resultHeaderName: 'Observations',
    columnDef: [{ headerName: "Name of the cable", suppressMovable: true, field: 'nCable', editable: true },
    { headerName: "10kHz", suppressMovable: true, field: 'kVal', editable: true },
    { headerName: "100kHz", suppressMovable: true, field: 'kvals', editable: true },
    { headerName: "1MHz", suppressMovable: true, field: 'mval', editable: true },
    { headerName: "10MHz", suppressMovable: true, field: 'mvals', editable: true },
    { headerName: "30MHz", suppressMovable: true, field: 'mvala', editable: true },
    { headerName: "100MHz", suppressMovable: true, field: 'mvalz', editable: true },
    ],
  }

  //LDC302 - MIL704A 
  public static W23: worksheet = {
    worksheetName: 'LDC302-MIL704A',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      {
        headerName: "Test Condition Type", suppressMovable: true, field: 'tcondType', rowSpan: function rowSpan(params) {
          var tval = params.data.tcondType;
          if (tval == 'Over Voltage Transient') {
            return 10;
          } else if (tval == 'Under Voltage Transient') {
            return 10;
          } else if (tval == 'Combiend Voltage Transient') {
            return 4;
          }
        }, cellClassRules: {
          'cell-span': "value==='Over Voltage Transient'||value==='Under Voltage Transient'||value==='Combiend Voltage Transient'",
        }
      },
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Steady State Voltage (Vdc)", suppressMovable: true, field: 'svdc' },
          { headerName: 'Voltage Transient (Vdc)', suppressMovable: true, field: 'voltTr' },
          { headerName: 'Time at Voltage Transient Level (msec)', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcondType: 'Over Voltage Transient', tcond: 'A', svdc: '28.5', voltTr: '80', time: '50' },
      { tcond: 'B', svdc: '28.5', voltTr: '80', time: '37.5' },
      { tcond: 'C', svdc: '28.5', voltTr: '60', time: '550' },
      { tcond: 'D', svdc: '28.5', voltTr: '60', time: '410' },
      { tcond: 'E', svdc: '28.5', voltTr: '80(3Times)', time: '12 Every 0.5 sec' },
      { tcond: 'F', svdc: '24', voltTr: '80', time: '50' },
      { tcond: 'D', svdc: '24', voltTr: '80', time: '37.5' },
      { tcond: 'H', svdc: '24', voltTr: '60', time: '550' },
      { tcond: 'I', svdc: '24', voltTr: '60', time: '410' },
      { tcond: 'J', svdc: '24', voltTr: '80(3Times)', time: '12 Every 0.5 sec' },
      { tcondType: 'Under Voltage Transient', tcond: 'K', svdc: '28.5', voltTr: '6', time: '50' },
      { tcond: 'L', svdc: '28.5', voltTr: '6', time: '37.5' },
      { tcond: 'M', svdc: '28.5', voltTr: '12', time: '550' },
      { tcond: 'N', svdc: '28.5', voltTr: '12', time: '410' },
      { tcond: 'O', svdc: '28.5', voltTr: '8(3Times)', time: '12 Every 0.5 sec' },
      { tcond: 'P', svdc: '24', voltTr: '6', time: '50' },
      { tcond: 'Q', svdc: '24', voltTr: '6', time: '37.5' },
      { tcond: 'R', svdc: '24', voltTr: '12', time: '550' },
      { tcond: 'S', svdc: '24', voltTr: '12', time: '410' },
      { tcond: 'T', svdc: '24', voltTr: '8(3Times)', time: '12 Every 0.5 sec' },
      { tcondType: 'Combiend Voltage Transient', tcond: 'U', svdc: '28.5', voltTr: '6', time: '10' },
      { tcond: 'U', svdc: '28.5', voltTr: '80', time: '50' },
      { tcond: 'V', svdc: '24', voltTr: '6', time: '10' },
      { tcond: 'V', svdc: '24', voltTr: '80', time: '50' }
    ]
  }

  //LDC302 -  MIL704B, C & D  
  public static W24: worksheet = {
    worksheetName: 'LDC302-MIL704B,C&D',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      {
        headerName: "Test Condition Type", suppressMovable: true, field: 'tcondType', rowSpan: function rowSpan(params) {
          var tval = params.data.tcondType;
          if (tval == 'Over Voltage Transient') {
            return 6;
          } else if (tval == 'Under Voltage Transient') {
            return 6;
          } else if (tval == 'Combiend Voltage Transient') {
            return 2;
          }
        }, cellClassRules: {
          'cell-span': "value==='Over Voltage Transient'||value==='Under Voltage Transient'||value==='Combiend Voltage Transient'",
        }
      },
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Steady State Voltage (Vdc)", suppressMovable: true, field: 'svdc' },
          { headerName: 'Voltage Transient (Vdc)', suppressMovable: true, field: 'voltTr' },
          { headerName: 'Time at Voltage Transient Level (msec)', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcondType: 'Over Voltage Transient', tcond: 'AA ', svdc: '29', voltTr: '50', time: '45' },
      { tcond: 'BB', svdc: '29', voltTr: '50', time: '45' },
      { tcond: 'CC', svdc: '29', voltTr: '50(3Times)', time: '45 Every 0.5 sec' },
      { tcond: 'DD', svdc: '22', voltTr: '50', time: '45' },
      { tcond: 'EE', svdc: '22', voltTr: '50', time: '45' },
      { tcond: 'FF', svdc: '22', voltTr: '50(3Times)', time: '45 Every 0.5 sec' },
      { tcondType: 'Under Voltage Transient', tcond: 'GG', svdc: '29', voltTr: '7', time: '45' },
      { tcond: 'HH', svdc: '29', voltTr: '7', time: '45' },
      { tcond: 'II', svdc: '29', voltTr: '7(3Times)', time: '45 Every 0.5 sec' },
      { tcond: 'JJ', svdc: '22', voltTr: '7', time: '45' },
      { tcond: 'KK', svdc: '22', voltTr: '7', time: '45' },
      { tcond: 'LL', svdc: '22', voltTr: '7(3Times)', time: '45 Every 0.5 sec' },
      { tcondType: 'Combiend Voltage Transient', tcond: 'MM', svdc: '29', voltTr: '7 Vdc then 50Vdc', time: '10 msec 45 msec' },
      { tcond: 'NN', svdc: '22', voltTr: '7 Vdc then 50Vdc', time: '10 msec 45 msec' }
    ]
  }

  //LDC302 - MIL704E & F  
  public static W25: worksheet = {
    worksheetName: 'LDC302-MIL704E&F',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      {
        headerName: "Test Condition Type", suppressMovable: true, field: 'tcondType', rowSpan: function rowSpan(params) {
          var tval = params.data.tcondType;
          if (tval == 'Over Voltage Transient') {
            return 6;
          } else if (tval == 'Under Voltage Transient') {
            return 6;
          } else if (tval == 'Combiend Voltage Transient') {
            return 2;
          }
        }, cellClassRules: {
          'cell-span': "value==='Over Voltage Transient'||value==='Under Voltage Transient'||value==='Combiend Voltage Transient'",
        }
      },
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: "Steady State Voltage (Vdc)", suppressMovable: true, field: 'svdc' },
          { headerName: 'Voltage Transient (Vdc)', suppressMovable: true, field: 'voltTr' },
          { headerName: 'Time at Voltage Transient Level (msec)', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcondType: 'Over Voltage Transient', tcond: 'AAA', svdc: '29', voltTr: '50', time: '50' },
      { tcond: 'BBB', svdc: '29', voltTr: '50', time: '50' },
      { tcond: 'CCC', svdc: '29', voltTr: '50', time: '50' },
      { tcond: 'DDD', svdc: '29', voltTr: '50(3Times)', time: '50 Every 0.5 sec' },
      { tcond: 'EEE', svdc: '22', voltTr: '50', time: '50c' },
      { tcond: 'FFF', svdc: '22', voltTr: '50(3Times)', time: '50 Every 0.5 sec' },
      { tcondType: 'Under Voltage Transient', tcond: 'GGG', svdc: '29', voltTr: '7', time: '50' },
      { tcond: 'HHH', svdc: '29', voltTr: '7', time: '50' },
      { tcond: 'III', svdc: '29', voltTr: '7(3Times)', time: '50 Every 0.5 sec' },
      { tcond: 'JJJ', svdc: '22', voltTr: '7', time: '50' },
      { tcond: 'KKK', svdc: '22', voltTr: '7', time: '50' },
      { tcond: 'LLL', svdc: '22', voltTr: '7(3Times)', time: '50 Every 0.5 sec' },
      { tcondType: 'Combiend Voltage Transient', tcond: 'MMM', svdc: '29', voltTr: '7 Vdc then 50Vdc', time: '10 msec 50 msec' },
      { tcond: 'NNN', svdc: '22', voltTr: '7 Vdc then 50Vd', time: '10 msec 50 msec' }
    ]
  }
  //LDC201  
  public static W26: worksheet = {
    worksheetName: 'LDC201',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      {
        headerName: "Parameters", suppressMovable: true,
        children: [
          { headerName: 'Voltage (Vdc)', suppressMovable: true, field: 'voltTr', children: [{ headerName: "MIL704-A", suppressMovable: true, field: 'va' }, { headerName: "MIL704-B,C,D,E&F", suppressMovable: true, field: 'vf' }] },
          { headerName: 'Time Duration at Power Interrupt (msec)', suppressMovable: true, field: 'time' },
        ]
      },
    ],
    value: [
      { tcond: 'A', va: '28', vf: '', time: '50' },
      { tcond: 'B', va: '24', vf: '', time: '50' },
      { tcond: 'C', va: '28.5', vf: '', time: '50' },
      { tcond: 'D', va: '28', vf: '', time: '50 Every 0.5 sec' },
      { tcond: 'E', va: '24', vf: '', time: '50c' },
      { tcond: 'F', va: '28.5', vf: '', time: '50 Every 0.5 sec' },
      { tcond: 'G', va: '28', vf: '', time: '50' },
      { tcond: 'H', va: '24', vf: '', time: '50' },
      { tcond: 'I', va: '28.5', vf: '', time: '50 Every 0.5 sec' },
      { tcond: 'J', va: '28', vf: '', time: '50' },
      { tcond: 'K', va: 'Voltage Transient-(Vrms) 50', vf: 'Voltage Transient-(Vrms) 50', time: 'Time at Voltage Transient Level(msec) 50' },
      { tcond: 'L', va: 'Voltage Transient-(Vrms) 18', vf: 'Voltage Transient-(Vrms) 18', time: 'Time at Voltage Transient Level(msec) 50' },
    ]
  }

  //LDC602 
  public static W27: worksheet = {
    worksheetName: 'LDC602',
    allowAdd: false,
    fixedvalue: true,
    resultHeaderName: 'Performance',
    columnDef: [
      { headerName: "Test Condition", suppressMovable: true, field: 'tcond', editable: true },
      { headerName: 'Voltage (Vdc)', suppressMovable: true, field: 'voltTr' },
      { headerName: 'Time Duration at Condition (min)', suppressMovable: true, field: 'time' },
    ],
    value: [
      { tcond: 'Phase Reversal', voltTr: '28', time: '30' },
      { tcond: 'Correct Phase Connection', voltTr: '28', time: '30' },
      { tcond: 'Phase Reversal Prevented by Positive Physical Means - Yes/No', voltTr: '', time: '' },
    ]
  }
}
