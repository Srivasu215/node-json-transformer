# Example 07 — Three Array Levels

The depth is not a special feature. The same mapping pattern can be nested again.

## Source

```json
{
  "companies": [
    {
      "name": "KeshavSoft",
      "departments": [
        {
          "name": "Engineering",
          "teams": [
            { "name": "Platform" },
            { "name": "Data" }
          ]
        }
      ]
    }
  ]
}
```

## Transformation

```js
const transformation = {
    mapping: {
        item: {
            companies: [
                {
                    list: "companies",
                    item: {
                        company: "name",
                        departments: [
                            {
                                list: "departments",
                                item: {
                                    department: "name",
                                    teams: [
                                        {
                                            list: "teams",
                                            item: {
                                                team: "name"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};
```

## Output

```json
{
  "companies": [
    {
      "company": "KeshavSoft",
      "departments": [
        {
          "department": "Engineering",
          "teams": [
            { "team": "Platform" },
            { "team": "Data" }
          ]
        }
      ]
    }
  ]
}
```

The important lesson is not the number three. The important lesson is that the mapping is recursive.
