import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection
} from 'rxdb';

const stafferSchemaLiteral = {
  title: 'staffer schema',
  description: 'describes a human being',
  version: 1,
  keyCompression: true,
  primaryKey: 'username',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      maxLength: 30,
    },
    workshop: {
      type: 'string',
    },
    role: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    remark: {
      type: 'string'
    }
  },
  required: ['username', 'role', 'workshop'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM methods
type StafferMethods = {};

const stafferMethods: StafferMethods = {}

const schemaTyped = toTypedRxJsonSchema(stafferSchemaLiteral);

// aggregate the document type from the schema
export type StafferDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const stafferSchema: RxJsonSchema<StafferDocType> = stafferSchemaLiteral;

export type StafferDocument = RxDocument<StafferDocType, StafferMethods>;

export type StafferCollection = RxCollection<StafferDocType, StafferMethods, {}>;

export const stafferCollection = {
  schema: stafferSchema,
  methods: stafferMethods,
  migrationStrategies: {
    1: async function (oldDoc: StafferDocType) {
      return oldDoc
    }
  }
}
