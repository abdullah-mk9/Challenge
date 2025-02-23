export const joinRequest = ({
  name,
  eventDescription,
  eventName,
  requesterEmail,
  requesterName,
}: {
  name: string;
  eventName: string;
  eventDescription: string;
  requesterEmail: string;
  requesterName: string;
}) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #eaeaea;
        }
        .email-header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 1.5em;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body p {
            margin: 10px 0;
        }
        .email-body ul {
            list-style-type: none;
            padding: 0;
        }
        .email-body li {
            margin: 10px 0;
            background: #f9f9f9;
            padding: 10px;
            border-left: 4px solid #4CAF50;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 0.9em;
            color: #666666;
            background-color: #f4f4f9;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            New Event Join Request
        </div>
        <div class="email-body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>You have received a new join request for the event:</p>
            <ul>
                <li><strong>Event Name: </strong>${eventName}</li>
                <li><strong>Description: </strong>${eventDescription}</li>
            </ul>
            <p><strong>Requester Email: </strong>${requesterEmail}</p>
            <p><strong>Requester Name: </strong>${requesterName}</p>
            <p>Please review the request and take the appropriate action.</p>
        </div>
        <div class="email-footer">
            &copy; 2024 Event Management Team at Kaf Corpo. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
};
