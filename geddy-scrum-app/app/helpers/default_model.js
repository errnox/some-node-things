// var ExampleModel = '{
//   "Issue": {
//     "name": "Issue",
//     "properties": {
//       "createdAt": {
// 	"name": "createdAt",
//         "datatype": "datetime",
//         "options": {},
//         "validations": {}
//       },
//       "updatedAt": {
//         "name": "updatedAt",
//         "datatype": "datetime",
//         "options": {},
//         "validations": {}
//       },
//       "name": {
//         "name": "name",
//         "datatype": "string",
//         "options": {
// 	  "name": {
// 	    "type": "string",
//             "required": true
//           },
//           "description": {
//             "type": "string"
//           },
//           "status": {
//             "type": "boolean"
//           }
//         },
//         "validations": {
//           "present": {},
//           "length": {
//             "qualifier": {
// 	      "min": 3
//             }
//           },
//           "withFunction": {}
//         }
//       },
//       "description": {
//         "name": "description",
//         "datatype": "string",
//         "options": {
//           "name": {
//             "type": "string",
//             "required": true
//           },
//           "description": {
//             "type": "string"
//           },
//           "status": {
//             "type": "boolean"
//           }
//         },
//         "validations": {
//           "present": {}
//         }
//       },
//       "status": {
//         "name": "status",
//         "datatype": "boolean",
//         "options": {
//           "name": {
//             "type": "string",
//             "required": true
//           },
//           "description": {
//             "type": "string"
//           },
//           "status": {
//             "type": "boolean"
//           }
//         },
//         "validations": {}
//       }
//     },
//     "associations": {}
//   }
// }'

var DefautlModel = {
  name: undefined
  , properties: {
    name: undefined
    , datatype: undefined
    , required: undefined
    , present: undefined
    , validations: {
      present: undefined
      ,length: {
	min: undefined
	, max: undefined
      }
    }
  }
}

module.exports.DefautlModel = DefautlModel;

