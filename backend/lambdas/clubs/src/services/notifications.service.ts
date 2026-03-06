import notificationsRepository from "@repositories/notifications.repository";
import NotificationValueObject from "@valueObjects/notifications.valueObject";
import FormData from "form-data";
import { IMailgunClient } from "mailgun.js/Interfaces/index";
import Mailgun from "mailgun.js";
import envService from "./env.service";
import UserValueObject from "@valueObjects/users.valueObject";

class NotificationService {
    private mg: IMailgunClient;

    constructor() {
        const mailgun = new Mailgun(FormData);
        this.mg = mailgun.client({
            username: "api",
            key: envService.getMailGunKey(),
            url: "https://api.eu.mailgun.net",
        });
    }

    async send(notification: NotificationValueObject) {
        await notificationsRepository.put(notification);

        await this.mg.messages.create("bde-valgrind.fr", {
            from: "BDE Valgrind <notifications@bde-valgrind.fr>",
            to: [
                `${notification.getUserDisplayName()} <${notification.getUserEmail()}>`,
            ],
            subject: notification.getTitle(),
            text: `
Bonjour ${notification.getUserDisplayName()},

${notification.getMessage()}

Accéder au club:
https://club.bde-valgrind.fr/club/${notification.getResourceId()}
                `,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4;">
  <tr>
    <td align="center" style="padding:40px 10px;">

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff;border-radius:6px;">
        
        <!-- Image -->
        <tr>
          <td align="center" style="padding:30px 20px 10px 20px;">
            <img src="https://dyvlfli0anz5v.cloudfront.net/Valgrind-Logo.png"
                 alt="Logo valgrind"
                 width="100"
                 style="display:block;border:0;max-width:100%;height:auto;">
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:10px 20px 0 20px;font-family:Arial, Helvetica, sans-serif;">
            <h1 style="margin:0;font-size:24px;color:#333333;">
              ${notification.getTitle()}
            </h1>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:20px 40px;font-family:Arial, Helvetica, sans-serif;font-size:16px;color:#555555;line-height:24px;">
            Bonjour, ${notification.getUserDisplayName()}<br><br>
            ${notification.getMessage()}
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:20px 20px 40px 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" bgcolor="#2563eb" style="border-radius:4px;">
                  <a href="https://club.bde-valgrind.fr/club/${notification.getResourceId()}"
                     target="_blank"
                     style="font-family:Arial, Helvetica, sans-serif;font-size:16px;color:#ffffff;text-decoration:none;padding:14px 28px;display:inline-block;">
                    Accéder au club
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
            `,
        });
    }

    public async batchSend(
        notification: NotificationValueObject,
        users: UserValueObject[],
    ) {
        await Promise.all(
            users.map(async (user) => {
                await this.send(
                    new NotificationValueObject({
                        ...notification.getObject(),
                        userId: user.getId(),
                        userEmail: user.getEmail(),
                        userDisplayName: user.getDisplayName(),
                    }),
                );
            }),
        );
    }
}

export default new NotificationService();
