export default
{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.4",
    "refresh": {
        "userIds": [],
        "action": {
            "type": "Action.Execute",
            "verb": "refresh",
            "title": "Refresh",
            "data": {              
            }
        }
    },
    "body": [
        {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "items": [
                  {
                    "type": "TextBlock",
                    "size": "Large",
                    "weight": "Bolder",
                    "text": "**ORDER STATUS**",
                    "wrap": true,
                    "style": "heading"
                  }
                ],
                "width": "stretch"
              },
              {
                "type": "Column",
                "items": [
                  {
                    "type": "Image",
                    "url": "https://adaptivecards.io/content/pending.png",
                    "height": "30px",
                    "altText": "Pending"
                  }
                ],
                "width": "auto"
              }
            ]
          },
       
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Email sales team: Order #${orderId}",
                            "horizontalAlignment": "left",
                            "isSubtle": true,
                            "wrap": true
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                              {
                                "title": "Sales contact head:",
                                "value": "${contact}"
                              }
                            ]
                            }
                        ]
                }
            ]
        }
      
    ],
    "actions": [{
            "type": "Action.OpenUrl",
            "title": "Compose mail",
            "id": "chatWithUser",
            "url": ""
        }
    ]
}