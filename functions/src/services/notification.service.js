const { Expo } = require("expo-server-sdk");

class NotificationService {
  static expo = new Expo();

  static sendPushNotification = async (pushTokens, title, body, data = {}) => {
    const messages = [];

    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      });
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error sending push notification:", error);
      }
    }

    return tickets;
  };

  static checkNotificationReceipts = async (ticketIds) => {
    const receipts = await this.expo.getPushNotificationReceiptsAsync(
      ticketIds
    );

    for (let receiptId in receipts) {
      const { status, message, details } = receipts[receiptId];

      if (status === "error") {
        console.error(`Error sending push notification: ${message}`, details);
      }
    }
  };
}

module.exports = NotificationService;
