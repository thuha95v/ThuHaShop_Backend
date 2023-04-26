const Queue = require('bull');
const { sendMessTelegram } = require("../utils/callAPI")
const { orderProductService, userService } = require("../services")
const notiQueue = new Queue('Telegram', { redis: { port: 6379, host: '127.0.0.1', password: '!CnJbIcJqew' } });

notiQueue.on('error', (error) => {
  console.log("Error connect redis", error);
})

notiQueue.process(async function (job, done) {
  try {
    const { type, data } = job.data
    if(type == "ERROR"){
      sendMessTelegram(""+
      "❌  CẢNH BÁO: LỖI HỆ THỐNG%0A"+
      `🚦  Mã lỗi: ${data.code}%0A`+
      `📌  Message lỗi: ${data.error}`
      )
    } 

    if(type == "ORDER"){
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
        `🙆 Khách hàng: *${first_name} ${last_name}* vừa đặt mua thành công %0A`+
        `${arrayProduct}`
      )
    }
  } catch (error) {
    console.log("Error telegram job", error);
  }

  done();

  // or give an error if error
  done(new Error('error noti'));

});

module.exports = notiQueue

