import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection
} from 'rxdb';

const enterpriseSchemaLiteral = {
  title: 'enterprise schema',
  description: 'describes a human being',
  version: 0,
  keyCompression: true,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 30
    },
    address: {
      type: 'string'
    },
    workshops: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['name'],
} as const; // <- It is important to set 'as const' to preserve the literal type

// ORM methods
type EnterpriseMethods = {};

const enterpriseMethods: EnterpriseMethods = {}

const schemaTyped = toTypedRxJsonSchema(enterpriseSchemaLiteral);

// aggregate the document type from the schema
export type EnterpriseDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const enterpriseSchema: RxJsonSchema<EnterpriseDocType> = enterpriseSchemaLiteral;

export type EnterpriseDocument = RxDocument<EnterpriseDocType, EnterpriseMethods>;

export type EnterpriseCollection = RxCollection<EnterpriseDocType, EnterpriseMethods, {}>;

export const enterpriseCollection = {
  schema: enterpriseSchema,
  methods: enterpriseMethods
}
