const axios = require('axios');

// const sendMessTelegram = async(message) => {
//   const API_ENPOINT = "https://api.telegram.org/bot" + 
//   "6010037285:AAEM5l8URXGp4dOA-3D5sp_pRFNlpn0Bs5Q/sendMessage?" + 
//   "chat_id=-1001898472227&text=" + message + "&parse_mode=markdown"

//   fetch(API_ENPOINT, {
//     method: 'POST', 
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log('Success:', data);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }

const sendMessTelegram = async(message) => {
  const API_ENPOINT = "https://api.telegram.org/bot" + 
  "6010037285:AAEM5l8URXGp4dOA-3D5sp_pRFNlpn0Bs5Q/sendMessage?" + 
  "chat_id=-1001898472227&text=" + message + "&parse_mode=markdown"

  axios.post(API_ENPOINT)
  .then(function (response) {
    // console.log(response.data);
  })
  .catch(function (error) {
    console.log("error axios", error);
  });
}

module.exports = { sendMessTelegram }