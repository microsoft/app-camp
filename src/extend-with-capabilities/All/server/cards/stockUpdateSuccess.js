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
                "pdtId": "${productId}",
                "pdtName": "${productName}",
                "categoryId": "${categoryId}"
            }
        }
    },
    "body": [
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Stock form",
                            "horizontalAlignment": "right",
                            "isSubtle": true,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "${productName}",
                            "horizontalAlignment": "right",
                            "spacing": "none",
                            "size": "large",
                            "color": "warning",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Use this form to update the stock details of ${productName}  ",
                            "isSubtle": true,
                            "wrap": true
                        }
                    ]
                }
            ]
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": 2,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Existing stock",
                            "weight": "bolder",
                            "size": "medium",
                            "wrap": true,
                            "style": "heading"
                        },
                        {
                            "type": "TextBlock",
                            "text": "${unitsInStock}",
                            "isSubtle": true,
                            "spacing": "None"
                        }
                       
                    ]
                },
                {
                    "type": "Column",
                    "width": 1,
                    "items": [
                        {
                            "type": "Image",
                            "url": "${imageUrl}",
                            "size": "auto",
                            "altText": "Image of product in warehouse"
                        }
                    ]
                }
            ]
        }
    ]
}