# 🌺 ThuHa Backend 🌺

Project BE Project HShop

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#about-the-project">Giới thiệu chung</a>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu</a>
      <ul>
        <li><a href="#prerequisites">Điều kiện tiên quyết</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#usage">Cách chạy</a></li>
    <li><a href="#license">Bản quyền</a></li>
  </ol>
</details>

## Bắt đầu
### Điều kiện tiên quyết
1. Nếu cài bình thường vui lòng cài đặt node >= v18
2. Nếu dùng docker vui lòng cài đặt docker và docker compose

## Công nghệ sử dụng
- [x] 🐉 ExpressJS
- [x] 🦊 MySQL
- [x] 🍍 Redis
- [x] 🐳 Docker
- [x] 🦄 Chatbot Telegram

# Cách chạy project 
**Chú ý**: Kiểm tra xem project chạy chưa ?
``` bash
sudo docker ps 
```

- Bước 1: Vào folder chứa project

``` bash
cd /home/thuha/HShop_Backend
```

- Bước 2: Nếu có project đang chạy thì chạy lệnh này để TẮT
``` bash
sudo docker compose down
```

- Bước 3: Chạy docker
``` bash
sudo docker compose up --build -d
```
