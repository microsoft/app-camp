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
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "spacing": "None",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "2:00 PM",
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "spacing": "None",
                            "text": "5 days ago",
                            "isSubtle": true,
                            "wrap": true
                        }
                    ],
                    "width": "110px"
                },
                {
                    "type": "Column",
                    "backgroundImage": {
                        "url": "https://messagecardplayground.azurewebsites.net/assets/SmallVerticalLineGray.png",
                        "fillMode": "RepeatVertically",
                        "horizontalAlignment": "Center"
                    },
                    "items": [
                        {
                            "type": "Image",
                            "horizontalAlignment": "Center",
                            "url": "https://messagecardplayground.azurewebsites.net/assets/CircleGreen_coffee.png",
                            "altText": "Location A: Coffee"
                        }
                    ],
                    "width": "auto",
                    "spacing": "None"
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "**Order #${orderId} out for delivery**",
                            "wrap": true
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://messagecardplayground.azurewebsites.net/assets/location_gray.png",
                                            "altText": "Location"
                                        }
                                    ],
                                    "width": "auto"
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Sydney",
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        },
                        {
                            "type": "ImageSet",
                            "spacing": "Small",
                            "imageSize": "Small",
                            "images": [
                                {
                                    "type": "Image",
                                    "url": "https://messagecardplayground.azurewebsites.net/assets/person_m1.png",
                                    "size": "Small",
                                    "altText": "Person with glasses and short hair"
                                }
                            ]
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "Small",
                            "columns": [
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Delivery team",
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        }
                    ],
                    "width": 40
                }
            ]
        },
        {
            "type": "ColumnSet",
            "spacing": "None",
            "columns": [
                {
                    "type": "Column",
                    "width": "110px"
                },
                {
                    "type": "Column",
                    "backgroundImage": {
                        "url": "https://messagecardplayground.azurewebsites.net/assets/SmallVerticalLineGray.png",
                        "fillMode": "RepeatVertically",
                        "horizontalAlignment": "Center"
                    },
                    "items": [
                        {
                            "type": "Image",
                            "horizontalAlignment": "Center",
                            "url": "https://messagecardplayground.azurewebsites.net/assets/Gray_Dot.png"
                        }
                    ],
                    "width": "auto",
                    "spacing": "None"
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://messagecardplayground.azurewebsites.net/assets/car.png",
                                            "altText": "Travel by car"
                                        }
                                    ],
                                    "width": "auto"
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "about 2 days ago",
                                            "isSubtle": true,
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        }
                    ],
                    "width": 40
                }
            ]
        },
        {
            "type": "ColumnSet",
            "spacing": "None",
            "columns": [
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "spacing": "None",
                            "text": "8:00 PM",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "spacing": "None",
                            "text": "1 day ago",
                            "isSubtle": true,
                            "wrap": true
                        }
                    ],
                    "width": "110px"
                },
                {
                    "type": "Column",
                    "backgroundImage": {
                        "url": "https://messagecardplayground.azurewebsites.net/assets/SmallVerticalLineGray.png",
                        "fillMode": "RepeatVertically",
                        "horizontalAlignment": "Center"
                    },
                    "items": [
                        {
                            "type": "Image",
                            "horizontalAlignment": "Center",
                            "url": "https://messagecardplayground.azurewebsites.net/assets/CircleBlue_flight.png",
                            "altText": "Location B: Flight"
                        }
                    ],
                    "width": "auto",
                    "spacing": "None"
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "**Reached Brisbane warehouse**",
                            "wrap": true
                        },
                        {
                            "type": "ColumnSet",
                            "spacing": "None",
                            "columns": [
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://messagecardplayground.azurewebsites.net/assets/location_gray.png",
                                            "altText": "Location"
                                        }
                                    ],
                                    "width": "auto"
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "400 George, Brisbane - 4000, QLD",
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        },
                        {
                            "type": "Image",
                            "url": "https://messagecardplayground.azurewebsites.net/assets/SeaTacMap.png",
                            "size": "Stretch",
                            "altText": "Map of the Brisbane warehouse"
                        }
                    ],
                    "width": 40
                }
            ]
        }
    ]
}