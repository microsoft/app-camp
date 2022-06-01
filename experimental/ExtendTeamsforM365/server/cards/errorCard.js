export default{
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "originator":"a9f77b9d-f9eb-4176-b7b3-4e7c0be9b354",
    "version": "1.4",
    "body": [
      {
        "type": "TextBlock",
        "text": "Oops! Something went wrong:",
        "wrap": true
      },      
      {
        "type": "Graph",
        "someProperty": "foo",
        "fallback": {
          "type": "TextBlock",
          "text": "Could not update stock at this time",
          "wrap": true
        }
      }
    ]
  }