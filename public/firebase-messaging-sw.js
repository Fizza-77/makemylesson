/* Firebase Messaging service worker for web push (Next.js PWA companion).
 * Uses the Next.js web app credentials (same project as Flutter mobile). */
/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCMmFYJOaVNgsBaW1f71509-riQPUH7F1o",
  appId: "1:232688835781:web:d1a29df301d6a8268224ac",
  messagingSenderId: "232688835781",
  projectId: "makemylesson-44088",
  authDomain: "makemylesson-44088.firebaseapp.com",
  storageBucket: "makemylesson-44088.firebasestorage.app",
  measurementId: "G-WP3JHE7335",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Make My Lesson";
  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "You have a new notification.";
  const deepLink = payload?.data?.deepLink || "/notifications";

  self.registration.showNotification(title, {
    body,
    data: { deepLink },
    icon: "/logo.jpeg",
    badge: "/logo.jpeg",
    tag:
      payload?.messageId ||
      payload?.data?.notificationId ||
      "mml-notification",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const deepLink = event.notification?.data?.deepLink || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (list && list.length > 0) {
        const client = list[0];
        client.focus();
        client.postMessage({ type: "mml_notification_click", deepLink });
        return;
      }
      return clients.openWindow(deepLink);
    }),
  );
});
