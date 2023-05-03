const Queue = require('bull');
const { sendMessTelegram } = require("../utils/callAPI")
const statusOrder = require("../types/order.type")
const { orderProductService, userService } = require("../services")
const { redis }= require("../config");

const notiQueue = new Queue('Telegram', { redis: { port: redis.port, host: redis.host, password: redis.password } });

notiQueue.on('error', (error) => {
  console.log("Error connect redis", error);
})

notiQueue.process(async function (job, done) {
  try {
    const { type, data } = job.data
    if(type == "ERROR"){
      sendMessTelegram(""+
      "❌ *CẢNH BÁO: LỖI HỆ THỐNG* %0A"+
      `🚦 Mã lỗi: *${data.code}* %0A`+
      `📌 Thông báo lỗi: *${data.error}*`
      )
    } 

    if(type == "ORDER"){
      if(data.status == "WAITING"){
        let result = await Promise.all([
          userService.getUserById(data.userId),
          orderProductService.getAllByOrderID(data.orderId)
        ])
    
        const { first_name, last_name } = result[0]
        let arrayProduct = result[1].map((pro) => {
          if(pro)
            return `🛍️ Sản phẩm ${pro.product.name} - Số lượng: ${pro.quantity}%0A`
        }).join("\b")
    
        sendMessTelegram(""+
          "🛒 *THÔNG BÁO: CÓ ĐƠN HÀNG MỚI* %0A"+
          `📌 Mã đơn hàng: *${data.orderId}* %0A`+
          `🚀 Trạng thái: *${statusOrder[data.status]}* %0A`+
          `🙆 Khách hàng: *${first_name} ${last_name}* vừa đặt mua thành công %0A`+
          `${arrayProduct}`
        )
      }else {
        let {first_name, last_name } = await userService.getUserById(data.userId)
        sendMessTelegram(""+
          "🛒 *THÔNG BÁO: THANH TOÁN THÀNH CÔNG* %0A"+
          `📌 Mã đơn hàng: *${data.orderId}* %0A`+
          `🙆 Khách hàng: *${first_name} ${last_name}* %0A`+
          `🚀 Trạng thái: *${statusOrder[data.status]}* %0A`+
          `💳 Phương thức thanh toán: *Chuyển khoản ngân hàng*`
        )
      }
    }
  } catch (error) {
    console.log("Error telegram job", error);
  }

  done();

  // or give an error if error
  done(new Error('error noti'));

});

module.exports = notiQueue

