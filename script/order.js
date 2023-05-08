const Queue = require('bull');
const { sendMessTelegram } = require("../utils/callAPI")
const { productService, orderProductService } = require("../services")
const { redis }= require("../config");

const orderQueue = new Queue('order', { redis: { port: redis.port, host: redis.host, password: redis.password } });

orderQueue.on('error', (error) => {
  console.log("Error connect redis", error);
})

orderQueue.process(async function (job, done) {
  try {
    const { type, data } = job.data
    if(type == "FAIL"){
      let products = await orderProductService.getAllByOrderID(data.id)

      for(let p of products){
        await productService.increment(p.product_id, p.quantity)
      }

      sendMessTelegram(""+
        "🚫 *THÔNG BÁO: ĐƠN HÀNG BỊ TỪ CHỐI* %0A"+
        `📌 Mã đơn hàng: *${data.id}* %0A`+
        `🚀 Trạng thái: *TỪ CHỐI* %0A`+
        `❓ Ghi chú: *${data.note}*`
      )
    } 

    done();
  } catch (error) {
    console.log("Error order job", error);
    done(new Error('error noti'));
  }
});

module.exports = orderQueue

