
Game server với NestJS bao gồm quản lý tài khoản và 2 trò chơi: Line 98 và Caro 

Cài đặt

git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git
cd game-server

npm install

Chạy ứng dụng

npm run start:dev

Server sẽ chạy trên `http://localhost:3000`

## API Endpoints

- `POST /auth/register` - Đăng ký tài khoản

POSTMAN 

http://localhost:3000/auth/register

{
  "username": "Trần Xuân Đạt",
  "password": "Dat@123",
  "email": "tranxuandat37374@gmail.com",
  "nickname": "Dat123"
}


khi send => dữ liệu lưu vào db.sqlite ( mật khẩu lưu dưới dạng mã hóa )

kết quả sau khi tạo
    "id": 2,
    "username": "Tran Xuan Dat",
    "password": "$2b$10$XVEGA45ntG/jkD5V2ubs8.7Dzsx3YCyPZKsXdNrGXRm2QOxLJ/v1m",
    "email": "tranxuandat37374@gmail.com",
    "nickname": "Dat123"



- `POST /auth/login` - Đăng nhập

đăng nhập sai tài khoản

{
    "message": "Tài khoản không tồn tại",
    "error": "Unauthorized",
    "statusCode": 401
}

đăng nhập sai mật khẩu

{
    "message": "Sai mật khẩu",
    "error": "Unauthorized",
    "statusCode": 401
}

đăng nhập đúng, hiển thị jwt token

{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiVHJhbiBYdWFuIERhdCIsImlhdCI6MTc2Nzc3MTk5NiwiZXhwIjoxNzY3ODU4Mzk2fQ.wgZXsth66rpou5GXq7KPgUMItnhmVMMAmYw7jQzIHaw"
}

chơi line 98 trên : http://localhost:3000/line98.html

Line 98
- `move` - Di chuyển bóng
- `hint` - Nhận gợi ý
- `update` - Cập nhật bàn chơi


Mục tiêu: Trò chơi lưới 9x9 với 5 màu bóng; di chuyển bóng để tạo hàng >=5 cùng màu (ngang/dọc/chéo) để xóa; sau mỗi lượt sinh 3 bóng nếu không có xóa; có nút trợ giúp (hint); đồng bộ qua WebSocket; lưu trạng thái vào DB.

Cách hoạt động (tóm tắt từ code)

Board: Lưới 9x9, 5 màu được tạo bởi spawnRandomBalls() và khởi tạo board trong logic.

Di chuyển: Frontend gửi event move; server xử lý trong Line98Gateway.handleMove và gọi logic.moveBall(from, to).

Xóa hàng >=5: checkLine() phát hiện chuỗi >=5 theo 4 hướng (phải, xuống, chéo xuôi, chéo ngược) và xóa các ô thỏa điều kiện.

Sinh bóng sau lượt: Nếu sau move không xóa được gì thì gọi spawnRandomBalls() để thêm 3 bóng, sau đó kiểm tra lại checkLine().

Gợi ý: Client gửi event hint; server trả logic.getHint() (thuật toán mô phỏng nước đi để ưu tiên nước dẫn đến xóa, nếu không có trả một nước ngẫu nhiên hợp lệ).

Đồng bộ: Dùng @WebSocketGateway() + socket.io; sau mỗi cập nhật server emit('update', board) và client cập nhật canvas.

Lưu trạng thái: Có entity Line98Game (cột boardState) trong DB; Line98Service cung cấp saveBoard() và getLatestBoard(); 

Line98Gateway tải board khi khởi tạo và lưu board sau mỗi lượt.
Vị trí chính trong repository

Logic trò chơi: src/games/line98/line98.logic.ts

WebSocket gateway: src/games/line98/line98.gateway.ts

Frontend (Canvas): public/line98.html

Entity DB: src/games/line98/line98.entity.ts

Service persistence: src/games/line98/line98.service.ts


chơi caro trên : http://localhost:3000/caro.html


Caro
- `join` - Tham gia phòng chờ
- `move` - Đánh nước đi
- `update` - Cập nhật bàn cờ
- `end` - Kết thúc trận


Mục Tiêu : Triển khai Cờ Caro (15x15), hai người chơi X/O, thắng 5 liên tiếp, ghép cặp qua WebSocket, giao diện Canvas, lưu lịch sử trận đấu

Board (15x15): Bàn khởi tạo 15x15 trong CaroLogic và frontend (caro.html).

Di chuyển: Client gửi move; CaroGateway.handleMove cập nhật game.board và broadcast update.

Kiểm tra thắng: CaroLogic.checkWin và CaroGateway.checkWin kiểm tra 4 hướng (ngang, dọc, 2 chéo) sau mỗi nước; trả winner khi có 5 liên tiếp.

Ghép cặp trực tuyến: CaroGateway.waitingQueue ghép 2 client FIFO, tạo room và phát start với board và lượt (X).

Giao diện: caro.html dùng Canvas, hiển thị X/O, lượt hiện tại và kết quả (end).

Đồng bộ (WebSocket): Dùng @WebSocketGateway() + socket.io; events: join, start, move, update, end.

Lưu lịch sử trận đấu: Entity CaroMatch tồn tại; thêm CaroService.saveMatch() và cập nhật CaroGateway để thu moves và gọi saveMatch() khi ván kết thúc.


File chính để xem/kiểm tra

caro.gateway.ts — ghép cặp, xử lý move, lưu match.
caro.logic.ts — luật thắng / helper logic.
caro.service.ts — lưu CaroMatch.
caro.entity.ts — schema CaroMatch.
caro.html — frontend Canvas.
app.module.ts — TypeORM đăng ký entity.

