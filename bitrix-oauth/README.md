
Bài 1: Triển khai cơ chế OAuth 2.0 với Bitrix24

Bước 1: Nhận sự kiện Install App

Khi cài đặt mới:

Bitrix24 khởi tạo OAuth flow, redirect user đến app với authorization code.
Ứng dụng nhận POST request tại /install với code và member_id.
InstallController gọi OAuthService.exchangeCodeForToken(): gửi code đến https://oauth.bitrix.info/oauth/token để đổi lấy access_token, refresh_token, expires_in.
TokenService.saveToken() lưu token mới vào SQLite (hoặc cập nhật nếu tồn tại cho member_id).

Khi cài đặt lại:

Bitrix24 có thể gửi token trực tiếp qua POST với AUTH_ID, REFRESH_ID, AUTH_EXPIRES, member_id.
InstallController lưu trực tiếp qua TokenService.saveToken() mà không cần exchange code.
Nếu gửi code, quy trình giống cài đặt mới (đổi code lấy token và lưu).


Bước 2: Lưu trữ và quản lý token

Sử dụng SQLite database tại db/bitrix-token.sqlite để lưu trữ access_token, refresh_token, expires_in, member_id, và created_at.

Triển khai các hàm trong token.service.ts:
saveToken(): Lưu hoặc cập nhật token cho một member_id.
loadToken(): Tải token từ database dựa trên member_id.


Bước 3: Tự động làm mới token


Viết hàm `getValidToken()` trong `token.service.ts` để kiểm tra thời hạn token.

Nếu token sắp hết hạn (trước 1 phút), tự động gọi `refreshToken()` để làm mới.

Hàm `refreshToken()` sử dụng `refresh_token` để gọi API `https://oauth.bitrix.info/oauth/token` và lấy token mới.

Lưu token mới vào database và trả về token hợp lệ.


Bước 4: Gọi API Bitrix24

Tạo hàm `getContacts()` trong `install.controller.ts` để test gọi API `crm.contact.list`.

Sử dụng endpoint `GET /install/contacts?member_id=<member_id>`.

Hàm lấy token hợp lệ bằng `tokenService.getValidToken(member_id)`, sau đó gọi API Bitrix24 với `axios.get()`.

URL gọi API: `https://b24-2u4fjh.bitrix24.vn/rest/crm.contact.list.json?auth=${token.access_token}`.

Trả về dữ liệu contact từ Bitrix24.


Bước 5: Tích hợp ngrok

- Chạy ngrok để tạo tunnel: `ngrok http 3000`.

- Cập nhật URL của ứng dụng trong Local Application trên Bitrix24 với domain ngrok (ví dụ: ` https://5d90f2845f40.ngrok-free.app /install`).

- Cài đặt lại ứng dụng trên Bitrix24 để kiểm tra endpoint `/install` nhận được sự kiện và lưu token.

- Test endpoint `/install/contacts` để xác nhận gọi API Bitrix24 thành công.


Các bước thực hiện kiểm tra 


git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git
cd bitrix-oauth

- Chạy npm run start:dev

- Chạy ngrok để tạo tunnel: `ngrok http 3000` => ta có link https://5d90f2845f40.ngrok-free.app

- Cập nhật URL của ứng dụng trong Local Application trên Bitrix24 với domain ngrok (ví dụ: ` https://5d90f2845f40.ngrok-free.app/install`).

- Cập nhật trong .env với dữ liệu trong URL vừa cập nhật

CLIENT_ID=local.6958aca22a76d0.68218074
CLIENT_SECRET=kwuOsvztJo5QSe5ZG6K2ZN2JajENGvKGw0JU82jA4lxP8e1Erh
REDIRECT_URI=https://5d90f2845f40.ngrok-free.app/install

- Ấn cài đặt lại, tin nhắn message : success hiện ra và dữ liệu lưu mới mẫu trong SQLite


INSTALL POST BODY: {
  AUTH_ID: '39d15b69007f8b57007f8717000000014038077ea90614007865b9d185af54f377d693',
  AUTH_EXPIRES: '3600',
  REFRESH_ID: '29508369007f8b57007f87170000000140380712468b573d4e93cc1479610fd9f4e457',
  SERVER_ENDPOINT: 'https://oauth.bitrix.info/rest/',
  member_id: '7340197e38cfeac59dc24ff6e12f38d1',
  status: 'L',
  PLACEMENT: 'DEFAULT',
  PLACEMENT_OPTIONS: '{"any":"17\\/"}'
}
Token saved in SQLite: Token {
  id: 1,
  access_token: '39d15b69007f8b57007f8717000000014038077ea90614007865b9d185af54f377d693',
  refresh_token: '29508369007f8b57007f87170000000140380712468b573d4e93cc1479610fd9f4e457',
  expires_in: 3600,
  member_id: '7340197e38cfeac59dc24ff6e12f38d1',
  created_at: 1767621404350
}


- Test hàm api bằng

https://b24-2u4fjh.bitrix24.vn/rest/crm.contact.list.json?auth=${token.access_token}

ví dụ : 

https://b24-2u4fjh.bitrix24.vn/rest/crm.contact.list.json?auth=39d15b69007f8b57007f8717000000014038077ea90614007865b9d185af54f377d693



