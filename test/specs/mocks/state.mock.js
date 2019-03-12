export default {
  "filterObject": [
    {
      "id": "newtons",
      "type": "select",
      "value": [
        "f144y"
      ],
      "operator": null
    },
    {
      "id": "figgy",
      "type": "select",
      "value": null
    },
    {
      "id": "state",
      "type": "select",
      "value": [
        "87fc3814-4cb9-43a5-b723-63ecebd65c5a",
        "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"
      ],
      "operator": "AND"
    },
    {
      "id": "languages",
      "type": "select",
      "value": [
        "9d5741e1-b482-4027-8c57-45193073ef12"
      ],
      "operator": "OR"
    }
  ],
  "queryObject": {
    "newtons": [
      "f144y"
    ],
    "state": [
      "87fc3814-4cb9-43a5-b723-63ecebd65c5a",
      "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"
    ],
    "languages": [
      "9d5741e1-b482-4027-8c57-45193073ef12"
    ]
  },
  "queryString": "?newtons=f144y&state=87fc3814-4cb9-43a5-b723-63ecebd65c5a,cdc3d520-8b74-46ac-9f4c-8f27d04ab49f&languages=9d5741e1-b482-4027-8c57-45193073ef12",
  "items": {},
  "views": [
    {
      "id": "eli",
      "columns": [
        {
          "property": "id",
          "sort": "ASC"
        },
        {
          "property": "title",
          "visible": true
        }
      ],
      "filterGroups": [
        {
          "id": "figNewtons",
          "filters": [
            {
              "id": "newtons",
              "type": "select",
              "value": [
                "f144y"
              ],
              "operator": null
            },
            {
              "id": "figgy",
              "type": "select",
              "value": null
            },
            {
              "id": "state",
              "type": "select",
              "value": [
                "87fc3814-4cb9-43a5-b723-63ecebd65c5a",
                "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"
              ],
              "operator": "AND"
            },
            {
              "id": "languages",
              "type": "select",
              "value": [
                "9d5741e1-b482-4027-8c57-45193073ef12"
              ],
              "operator": "OR"
            }
          ]
        }
      ],
      "_pagination": {
        "cursor": null,
        "page": 1,
        "skip": 0,
        "take": 25,
        "totalItems": 0
      }
    },
    {
      "id": "eliWithGlasses",
      "columns": [
        {
          "property": "id"
        },
        {
          "property": "title",
          "visible": true
        }
      ],
      "_pagination": {
        "cursor": null,
        "page": 1,
        "skip": 0,
        "take": 25,
        "totalItems": 0
      },
      "filterGroups": []
    },
    {
      "id": "eliWithAPegLeg",
      "columns": [
        {
          "property": "id"
        },
        {
          "property": "title",
          "visible": false
        },
        {
          "property": "genre",
          "visible": true
        }
      ],
      "_pagination": {
        "cursor": null,
        "page": 1,
        "skip": 0,
        "take": 25,
        "totalItems": 0
      },
      "filterGroups": []
    }
  ],
  "workspace": {
    "items": {}
  },
  "loading": true,
  "selectedView": "eli"
};