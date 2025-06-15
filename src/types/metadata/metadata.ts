import { RegisterOptions } from 'react-hook-form';

export type GeneralMetadata = { [discriminator: string]: Metadata };

export type Metadata = MetadataField[];

export type MetadataField = {
  type: string;
  sub?: string;
  fields?: Metadata;
  name: string;
  label?: string;
  options?: string[];
  constraints: RegisterOptions;
};
