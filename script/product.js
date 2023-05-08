const Queue = require('bull');
const { sendMessTelegram } = require("../utils/callAPI")
const { productService } = require("../services")
const { redis }= require("../config");

const productQueue = new Queue('product', { redis: { port: redis.port, host: redis.host, password: redis.password } });

productQueue.on('error', (error) => {
  console.log("Error connect redis", error);
})

productQueue.process(async function (job, done) {
  try {
    const { type, data } = job.data
    if(type == "QUANTITY"){

      for(const p of data){
        let product = await productService.getProductById(p.product_id)

        if(product.quantity == 0){
          sendMessTelegram(""+
            "🚛 *THÔNG BÁO: CÓ SẢN PHẨM HẾT HÀNG* %0A"+
            `📌 Mã sản phẩm: *${product.id}* %0A`+
            `🚀 Tên sản phẩm: *${product.name}* %0A`+
            "🏭 Số lượng trong kho: *0*"
          )
        }
      } 
    } 

    done();
  } catch (error) {
    console.log("Error product job", error);
    done(new Error('error noti'));
  }
});

module.exports = productQueue

