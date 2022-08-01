const fetch = require('node-fetch')

async function sendNotif(token, title, body, redirectUrl) {

  //send notifications to users
  var notification = {
    title: title,
    body: body,
    click_action: redirectUrl,
    priority: 'high',
    soundName: 'default',
  }
  var notification_body = {
    notification: notification,
    registration_ids: [token],
  }
  // return res.json(notification_body)
  try {
    let fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${process.env.firebase_notif_server_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification_body),
    })
    console.log("SUCESSSS-----------")
    return ({
      msg: 'Notification Sent!!!!!',
      fcmResponse,
    })
  } catch (e) {
    console.error(e)
    return ({ msg: 'Notification Error' })
  }

}

module.exports = { sendNotif }

// await sendNotif(token.notifToken, title, Body, imgUrl)