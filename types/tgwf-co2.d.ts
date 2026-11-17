// Minimal declarations for the pinned CO2.js 0.19.0 API, which ships without TypeScript types.
declare module "@tgwf/co2" {
  export interface CO2Segments {
    total: number;
    dataCenterOperationalCO2e: number;
    networkOperationalCO2e: number;
    consumerDeviceOperationalCO2e: number;
    dataCenterEmbodiedCO2e: number;
    networkEmbodiedCO2e: number;
    consumerDeviceEmbodiedCO2e: number;
  }
  export interface ByteTraceOptions {
    greenHostingFactor?: number;
    gridIntensity?: { dataCenter?: number; network?: number; device?: number };
  }
  export class co2 {
    constructor(options: { model: "swd"; version: 4; results?: "segment" });
    perByte(bytes: number, green?: boolean): number | CO2Segments;
    perByteTrace(bytes: number, green?: boolean, options?: ByteTraceOptions): {
      co2: number | CO2Segments;
      variables: {
        greenHostingFactor: number;
        gridIntensity: { dataCenter: { value: number }; network: { value: number }; device: { value: number } };
      };
    };
  }
}
