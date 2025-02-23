export const acceptedEmail = ({
  name,
  eventDescription,
  eventName,
}: {
  name: string;
  eventName: string;
  eventDescription: string;
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
            Request Accepted
        </div>
        <div class="email-body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your request to join the event <strong>${eventName}</strong> has been accepted! 🎉</p>
            <p>We look forward to seeing you there.</p>
            <p>${eventDescription}</p>
        </div>
        <div class="email-footer">
            &copy; 2024 Event Management Team. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
};
