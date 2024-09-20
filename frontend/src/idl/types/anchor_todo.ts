export type AnchorTodo = {
  "address": "DMeNA3KKDFkK6wNLYVGts4zHmfLkY64c1wTfcqapubYB",
  "metadata": {
    "name": "anchorTodo",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTodo",
      "discriminator": [
        188,
        16,
        45,
        145,
        4,
        5,
        188,
        75
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  100,
                  111
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "markTodo",
      "discriminator": [
        70,
        24,
        206,
        243,
        92,
        29,
        249,
        110
      ],
      "accounts": [
        {
          "name": "todoAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "todoAccount",
      "discriminator": [
        31,
        86,
        84,
        40,
        187,
        31,
        251,
        132
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "todoNotFound",
      "msg": "Todo not found"
    }
  ],
  "types": [
    {
      "name": "todoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "todos",
            "type": {
              "vec": {
                "defined": {
                  "name": "todoItem"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "todoItem",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "marked",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
