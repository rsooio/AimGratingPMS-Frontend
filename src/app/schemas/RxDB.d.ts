import { StafferCollection } from './staffer';
/**
 * custom typings so typescript knows about the schema-fields
 */

import { EnterpriseCollection } from './enterprise';

import type { RxDatabase } from 'rxdb';

export type AirGratingCollections = {
  enterprise: EnterpriseCollection
  staffera: StafferCollection
  stafferb: StafferCollection
};

export type AirGratingDatabase = RxDatabase<AirGratingCollections>;
