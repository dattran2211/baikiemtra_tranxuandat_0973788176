1. Ứng dụng API Tích hợp Jotform và Bitrix24

Ứng dụng NestJS tự động đồng bộ dữ liệu từ Jotform sang Bitrix24 CRM. Khi có submission mới trên Jotform, ứng dụng sẽ tạo contact tương ứng trên Bitrix24, với việc kiểm tra trùng lặp dựa trên email hoặc số điện thoại.

2. Kiến trúc hệ thống

[Jotform Form]
     ↓ submit
[Jotform Server]
     ↓
[NestJS Server] ( JOTFORM_API_KEY=d9066b9d709f2d99c8c64cb4e31e93ee ; FORM_ID=260030763155045 )
     ↓ (GET)
Jotform API /submissions
     ↓
Parse + Mapping
     ↓ (POST)
Bitrix24 Webhook (crm.contact.add) sử dụng webhook ( BITRIX_WEBHOOK_URL=https://b24-2u4fjh.bitrix24.vn/rest/1zha15ncu2gwss0bn/ )

     ↓
Contact được tạo trong CRM


3. Tính năng

- Đồng bộ tự động submission từ Jotform sang Bitrix24
- Chuẩn hóa dữ liệu (xử lý object/array từ Jotform)
- Kiểm tra trùng lặp contact dựa trên email hoặc số điện thoại
- Logging toàn diện với timestamp
- Cron job đồng bộ định kỳ
- Webhook endpoint cho tích hợp real-time

Yêu cầu hệ thống

- Node.js 
- npm 
- Tài khoản Jotform với API access ( )
- Tài khoản Bitrix24 với webhook setup

4. Hướng dẫn triển khai

Thiết lập tài khoản JOTFORM_API_KEY và lấy FormID

Đăng nhập vào Jotform:
   - Truy cập [https://www.jotform.com] và đăng nhập tài khoản của bạn.

Tạo hoặc chọn form:
   - Tạo form mới hoặc chọn form hiện có mà bạn muốn đồng bộ.

ở đây em sử dụng product => form builded để tạo form mới => vào element => chọn các trường fullname, email, phone để thực hiện bài toán => sau đó chuyển sang trang public để lấy form điền và ghi nhớ formID trong URL của form


Lấy API Key:
   - Vào Setting  > API trong menu bên trái.
   - Tạo API Key mới hoặc sử dụng key hiện có.
   - Sao chép API Key để sử dụng sau.

Cấu hình form fields ( ấn vào từng form vào tab advanced, ghi nhớ form field để có thể match với code sau này để match các trường )

   - Đảm bảo form có các trường: 
   
   Họ tên (field ID 3)
   Email (field ID 4)
   Số điện thoại (field ID 5).

   - Field ID có thể khác nhau.

Thiết lập webhook trên Bitrix24 và lấy thông tin xác thực

Đăng nhập vào Bitrix24:
   - Truy cập portal Bitrix24 (ví dụ bitrix24 của em: `https://b24-2u4fjh.bitrix24.vn/crm/deal/kanban/`).

Tạo webhook:
   - Vào ứng dụng > tài nguyên cho nhà phát triển -> khác -> webhook vào và sao chép Webhook để gọi REST API, ví dụ 

   https://b24-2u4fjh.bitrix24.vn/rest/1/sbrq0o96aty9rm3n/


   - Tạo webhook mới với quyền CRM (đọc/ghi contacts).
     

Lấy Webhook URL:
     
   - Sao chép URL ví dụ bên trên để sử dụng làm `BITRIX_WEBHOOK_URL`.

Tạo API Key cho bảo mật:
   - Tạo một API key ngẫu nhiên để bảo vệ webhook endpoint (ví dụ: em sử dụng API_KEY=JOTFORM_SECRET_KEY  ).


Cài đặt và chạy ứng dụng

1. Vào VS Code -> Terminal

   Clone github:

   git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git
   cd jotform-bitrix24-api
   


2. Cài đặt dependencies: npm install
   

3. Tạo file môi trường:
   Tạo file `.env` trong thư mục gốc với nội dung sau:

   # Jotform Configuration ( 2 chỉ số đã thiết lập ở trong jotform)
   JOTFORM_API_KEY=
   FORM_ID=

   # Bitrix24 Configuration ( trong bitrix24)
   BITRIX_WEBHOOK_URL=

   # Security
   API_KEY=

   # Application
   PORT=3000
   


Chạy ứng dụng:

   
   npm run start:dev

   sau đó vào form trên jotform vừa tạo và thử submit và kết quả được hiển thị trên bitrix24, em đã thử rất nhiều lần và thành công nên nếu sai thì anh chị thử lại giúp e nha hihi
   
   
   
   trong quá trình thực hiện em gặp 1 số lỗi như các trường không map dữ liệu ( sai id field trong jotform và code nhưng đã khắc phục) , dữ liệu gửi lên bị sai định dạng ( fix bằng cách chuẩn hóa dữ liệu normalizePhone , normalizeEmail, ...)

   ngoài ra có thêm 1 số ràng buộc check như dữ liệu email và số điện thoại ( 1 trong 2 không được tùng trên bitrix24)



Kiểm tra ứng dụng:

   - Ứng dụng sẽ chạy trên `http://localhost:3000` ( trong quá trình thực hiện cần test định dạng dữ liệu gửi lên bitrix24 nên có thể dùng ngrok http 3000 để up lên bitrix thay cho localhost và sử dụng POSTMAN API để test dữ liệu có gửi lên chưa )

   - Cron job sẽ chạy mỗi phút để đồng bộ dữ liệu

   - POSTMAN: `POST https://5d90f2845f40.ngrok-free.app/contacts/webhook/jotform` (cần API key tự đặt trong header để bảo mật)

   => gửi thử dữ liệu dạng json lên bitrix để xem đã nhận chưa

Logging

Ứng dụng ghi log toàn diện với timestamp cho tất cả hoạt động:

- Nhận dữ liệu từ Jotform
- Mapping và chuẩn hóa dữ liệu
- Kiểm tra trùng lặp
- Gửi dữ liệu lên Bitrix24
- Lỗi và exceptions

Logs được xuất ra console và có thể được cấu hình để ghi vào file.


Xử lý dữ liệu  Chuẩn hóa dữ liệu từ Jotform

Jotform có thể trả về dữ liệu dưới dạng object hoặc array. Ứng dụng tự động chuẩn hóa:

- Name field: Nếu là object `{first, last}`, sẽ ghép thành "first last"
- Phone field: Trích xuất giá trị từ object hoặc array
- Email field: Chuẩn hóa thành string

Kiểm tra trùng lặp

Trước khi tạo contact mới, ứng dụng kiểm tra trên Bitrix24:

- Tìm contact có email hoặc số điện thoại trùng khớp
- Nếu trùng, bỏ qua submission
- Nếu không, tạo contact mới


Lỗi Thường Gặp

1. Lỗi (401) API Key không hợp lệ

Nguyên nhân:

JOTFORM_API_KEY không đúng hoặc hết hạn
BITRIX_WEBHOOK_URL không hợp lệ hoặc không có quyền truy cập
API key bị thay đổi trên Jotform/Bitrix24

Cách kiểm tra:

Đăng nhập Jotform → Settings → API → Kiểm tra API Key
Đăng nhập Bitrix24 → Applications → Webhooks → Kiểm tra webhook URL

Test API key bằng curl:

curl https://api.jotform.com/form/{FORM_ID}/submissions?apiKey=YOUR_API_KEY

với formID và API_KEY ở trên đã hướng dẫn

Test Bitrix webhook:

ví dụ : https://b24-2u4fjh.bitrix24.vn/rest/1/zha15ncu2gwss0bn/crm.contact.list

với BITRIX_WEBHOOK_URL=https://b24-2u4fjh.bitrix24.vn/rest/1/zha15ncu2gwss0bn/ là địa chỉ bí mật trên bitrix24 


Giải pháp:

Cập nhật .env file với API key mới
Tạo webhook mới trên Bitrix24 nếu cần
Kiểm tra quyền truy cập của API key ( xem đã set quyền crm chưa hoặc 1 số quyền khác nhỏ hơn )

2. Lỗi Form ID sai

Nguyên nhân:

FORM_ID trong .env không khớp với form thực tế
Form đã bị xóa hoặc đổi tên
Sử dụng form ID cũ

Cách kiểm tra:

Đăng nhập Jotform → Forms → Chọn form → Copy ID từ URL

Test form ID bằng API:

curl -H "APIKEY: YOUR_API_KEY" "https://api.jotform.com/form/FORM_ID"

ví dụ : 

curl -H "APIKEY: d9066b9d709f2d99c8c64cb4e31e93ee" "https://api.jotform.com/form/260030763155045"


3. Lỗi Field Mapping sai

Nguyên nhân:

Field IDs trong jotform.service.ts không khớp với form fields ( ví dụ trong field là 3,4,5 mà trong code lại là số khác khiến cho không mapping dữ liệu )


Form trên jotform thay đổi mà code chưa cập nhật

Kiểm tra normalize functions xử lý đúng format của từng field type

Field types khác nhau (text, email, phone) có format khác nhau


Cách kiểm tra:

Xem log "NHẬN DỮ LIỆU" để kiểm tra dữ liệu từ Jotform bằng câu lệnh

curl -H "APIKEY: YOUR_API_KEY" "https://api.jotform.com/form/FORM_ID/submissions?limit=1"

So sánh field IDs trong code với form properties, sau đó cập nhật field IDs trong mapSubmission() method

ví dụ : 3 là name , 4 là email , 5 là phone


 "3": {
                "name": "name",
                "order": "2",
                "sublabels": "{\"prefix\":\"Prefix\",\"first\":\"First Name\",\"middle\":\"Middle Name\",\"last\":\"Last Name\",\"suffix\":\"Suffix\"}",
                "text": "Name",
                "type": "control_fullname",
                "answer": {
                    "first": "trang",
                    "last": "tr\u1ea7n"
                },
                "prettyFormat": "trang tr\u1ea7n"
            },
            "4": {
                "name": "email",
                "order": "4",
                "text": "Email",
                "type": "control_email",
                "answer": "trangxuan37370@gmail.com"
            },
            "5": {
                "countryCode": "No",
                "inputMask": "enable",
                "inputMaskValue": "(###) ###-####",
                "name": "phoneNumber",
                "order": "3",
                "sublabels": "{\"country\":\"Country Code\",\"area\":\"Area Code\",\"phone\":\"Phone Number\",\"full\":\"Phone Number\",\"masked\":\"Please enter a valid phone number.\"}",
                "text": "Phone Number",
                "type": "control_phone",
                "answer": {
                    "full": "(097) 378-8171"
                },
                "prettyFormat": "(097) 378-8171"
            }


Bảo mật

- Sử dụng formid, API Keyjotform
- Bảo vệ webhook endpoint bằng API key
- Validate dữ liệu đầu vào


License
 Đạt ( Trần Xuân Đạt )
