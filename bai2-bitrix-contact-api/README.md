Dự án NestJS RESTful API để quản lý Contact trên Bitrix24, bao gồm thông tin cơ bản và thông tin ngân hàng.  
Tích hợp với Bitrix24 qua webhook API và bảo vệ bằng API Key.


1. Mục tiêu

- Quản lý contact trên Bitrix24: hiển thị, thêm, sửa, xóa.
- Bảo vệ API bằng API Key (`x-api-key`).
- Swagger UI đầy đủ để test tất cả endpoint.
- Logging header API Key để kiểm tra dữ liệu nhập từ Swagger Authorize.
- Đảm bảo validate dữ liệu, xử lý lỗi rõ ràng.


2. Cấu trúc dự án

bitrix24-contact-api/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ contacts/
│  │  ├─ contacts.controller.ts
│  │  ├─ contacts.service.ts
│  │  ├─ dto/
│  │  │  ├─ create-contact.dto.ts
│  │  │  └─ update-contact.dto.ts
│  ├─ common/
│  │  └─ guards/
│  │     └─ auth.guard.ts
├─ .env
├─ package.json
├─ tsconfig.json
├─ README.md


Modules

  Controller: Xử lý các route của contact (`/contacts`)
  Service: Xử lý logic CRUD và gọi Bitrix24 API
  DTOs: Định nghĩa và validate dữ liệu đầu vào

Cấu trúc thư mục:

contacts/
├─ contacts.module.ts
├─ contacts.controller.ts
├─ contacts.service.ts
├─ dto/
│  ├─ create-contact.dto.ts
│  └─ update-contact.dto.ts



=> tách biệt rõ ràng giữa logic xử lý dữ liệu (service), định nghĩa dữ liệu (DTO), và route xử lý request (controller)



Controllers

  Xử lý các HTTP request như GET, POST, PUT, DELETE cho `/contacts`.

  Sử dụng guard `ApiKeyGuard` để bảo vệ API (yêu cầu header `x-api-key`).

  Gọi service để thực hiện logic CRUD hoặc gọi API Bitrix24.

Ví dụ GET /contacts:

@Get()
getAll() {
  return this.contactsService.getContacts();
}

Khi test với Swagger hoặc Postman controller nhận request, guard kiểm tra API Key, sau đó gọi service để trả dữ liệu.


Services

  Xử lý toàn bộ logic thao tác dữ liệu contact.
  Bao gồm CRUD:

    `getContacts()`: lấy danh sách contact
    `createContact(dto)`: tạo contact mới
    `updateContact(id, dto)`: cập nhật contact theo ID
    `deleteContact(id)`: xóa contact theo ID
 

 DTOs : Xác định cấu trúc dữ liệu đầu vào. Validate dữ liệu trước khi gửi đến service hoặc Bitrix24 API.

 Sử dụng class-validator để kiểm tra :

| Trường         | Validate                       | Mô tả                         |
| -------------- | ------------------------------ | ----------------------------- |
| `name`         | `@IsNotEmpty()`, `@IsString()` | Bắt buộc, phải là string      |
| `email`        | `@IsOptional()`, `@IsEmail()`  | Email hợp lệ, nếu có          |
| `phone`        | `@IsOptional()`, `@IsString()` | Số điện thoại hợp lệ (string) |
| `address`      | `@IsOptional()`, `@IsString()` | Địa chỉ (không bắt buộc)      |
| `website`      | `@IsOptional()`, `@IsString()` | URL website (string)          |
| `bank_name`    | `@IsOptional()`, `@IsString()` | Tên ngân hàng                 |
| `bank_account` | `@IsOptional()`, `@IsString()` | Số tài khoản ngân hàng        |

Ví dụ POST /contacts với data :

{
  "name": "Tran Xuan Dat",
  "address": "GiapNhi, HoangMai, HaNoi",
  "phone": "0973788176",
  "email": "tranxuandat@gmail.com",
  "website": "https://tranxuandat.com",
  "bank_name": "BIDV",
  "bank_account": "2123317758"
}

Khi gửi dữ liệu này:

  * DTO sẽ kiểm tra `name` không được bỏ trống → nếu bỏ trống, trả về lỗi.
  * DTO kiểm tra `email` có đúng định dạng hay không.
  * Các trường khác tùy chọn nhưng vẫn phải là string nếu có.


Guard (`ApiKeyGuard`)


  * Kiểm tra x-api-key gửi từ client (Postman, Swagger, hoặc frontend).
  * Ngăn request không hợp lệ → trả về 401 Unauthorized.
  * Hiển thị log header x-api-key để debug:

const apiKey = request.headers['x-api-key'];
console.log('Header x-api-key:', apiKey);
if (!apiKey || apiKey !== process.env.API_KEY) {
  throw new UnauthorizedException('Invalid API key');
}

* Khi test bằng Swagger:

  * Nhập key trong Authorize box → giá trị được guard đọc → console log.
  * Nếu key đúng → request đi qua → service xử lý CRUD.
  * Nếu key sai hoặc chưa nhập → trả về 401 Unauthorized.

Tổng kết

| Thành phần | Chức năng                                          |                                  
| ---------- | -------------------------------------------------- |  
| Module     | Quản lý cấu trúc, phân tách controller/service/DTO |                                   
| Controller | Nhận request, gọi service, áp dụng guard           |                         
| Service    | Xử lý logic CRUD, gọi Bitrix24 API                 | 
| DTO        | Validate dữ liệu đầu vào, bắt lỗi sớm              | 
| Guard      | Bảo mật API bằng x-api-key                         |


3. Cài đặt dự án

1. Clone repo:

git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git
cd bai2-bitrix-contact-api

2. Cài dependencies:

npm install

Cấu hình bitrix24 : 

vào ứng dụng => tài nguyên cho nhà phát triển => khác => webhook vào => set quyền crm ( toàn quyền) ấn lưu và copy Webhook để gọi REST API, sau đó paste vào .env

ví dụ link : https://b24-2u4fjh.bitrix24.vn/rest/1/zha15ncu2gwss0bn/

3. Tạo file `.env`:

API_KEY=test123456
BITRIX24_WEBHOOK=https://b24-2u4fjh.bitrix24.vn/rest/1/zha15ncu2gwss0bn/
PORT=3000



4. Chạy server:

npm run start:dev
Server sẽ chạy trên `http://localhost:3000`

cấu hình ngrok : download và chạy file ngrok.exe, sau đó chạy ngrok http 3000

ví dụ : https://5d90f2845f40.ngrok-free.app 


4. Cấu hình Swagger

* Mở Swagger UI: `https://5d90f2845f40.ngrok-free.app/api`
* Nhấn Authorize, chọn scheme `x-api-key`, nhập key: test123456

Nhấn Try it out cho các endpoint `/contacts`.

5. Danh sách endpoint API

| Method | Endpoint      | Mô tả                    |
| GET    | /contacts     | Lấy danh sách contact    |
| POST   | /contacts     | Tạo contact mới          |
| PUT    | /contacts/:id | Cập nhật contact theo ID |
| DELETE | /contacts/:id | Xóa contact theo ID      |


ví dụ 

GET /contacts: ấn excute để trả về danh sách contact dưới dạng json

POST /contacts:

{
  "name": "Tran Xuan Dat",
  "address": "Phường Thinh Liet, Quận Hoang Mai, TP Ha Noi",
  "phone": "0973788176",
  "email": "tranxuandat37374@gmail.com",
  "website": "https://khatocoshop.free.nf/?i=1", 
  "bank_name": "bidv",
  "bank_account": "2123317758"
}
kết quả trả về 
{
  "contactId": 97
} và dữ liệu api được gửi lên contact bitrix24 qua địa chỉ webhook vào

validate dữ liệu khi post

export class CreateContactDto {
  @ApiProperty({ description: 'Tên contact' })
  @IsNotEmpty({ message: 'Tên contact là bắt buộc' })
  @IsString({ message: 'Tên contact phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Tên contact phải có ít nhất 1 ký tự' })
  @MaxLength(100, { message: 'Tên contact không được vượt quá 100 ký tự' })
  name: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ không được vượt quá 255 ký tự' })
  address?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ (định dạng Việt Nam)' })
  @MaxLength(15, { message: 'Số điện thoại không được vượt quá 15 ký tự' })
  phone?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email?: string;

  @ApiProperty({ description: 'Website', required: false })
  @IsOptional()
  @IsString({ message: 'Website phải là chuỗi ký tự' })
  @IsUrl({}, { message: 'Website phải là URL hợp lệ' })
  @MaxLength(200, { message: 'Website không được vượt quá 200 ký tự' })
  website?: string;

  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  @IsOptional()
  @IsString({ message: 'Tên ngân hàng phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Tên ngân hàng phải có ít nhất 1 ký tự' })
  @MaxLength(100, { message: 'Tên ngân hàng không được vượt quá 100 ký tự' })
  bank_name?: string;

  @ApiProperty({ description: 'Số tài khoản', required: false })
  @IsOptional()
  @IsString({ message: 'Số tài khoản phải là chuỗi ký tự' })
  @MinLength(8, { message: 'Số tài khoản phải có ít nhất 8 ký tự' })
  @MaxLength(20, { message: 'Số tài khoản không được vượt quá 20 ký tự' })
  bank_account?: string;
}


- KHi test có thể nhập sai xem thông báo in ra có đúng không




PUT /contacts/:id : Nhập id dữ liệu cần update ( có thể tra trong get để lấy id ) và update 1 dữ liệu bất kì, ví dụ update address

nếu thành công : {
  "message": "Updated"
} có thể get để test lại


{
  "name": "Tran Xuan Dat",
  "address": "Phường Tan Mai, Quận Hoang Mai, TP Ha Noi",
  "phone": "0973788176",
  "email": "tranxuandat37374@gmail.com",
  "website": "https://khatocoshop.free.nf/?i=1", 
  "bank_name": "bidv",
  "bank_account": "2123317758"
}


validate dữ liệu khi put giống khi post, có thể test thử các trường hợp nhập sai



DELETE /contacts/:id ( Nhập id dữ liệu cần delete ( có thể tra trong get để lấy id ) và delete 1 dữ liệu bất kì, 

nếu thành công : {
  "message": "delete"
} có thể get để test lại xem dữ liệu đã bị xóa chưa
)
nếu không tìm thấy id
{
  "error": "ERROR_CORE",
  "error_description": "Không tìm thấy mục."
}



9. Test API bằng Postman và cURL

Chuẩn bị trước khi test

1. Khởi động server:

npm run start:dev

Server sẽ chạy trên `http://localhost:3000`


2. Cấu hình ngrok 

ngrok http 3000

Ví dụ URL: `https://5d90f2845f40.ngrok-free.app`

3. API Key: test123456


Test bằng Postman

GET /contacts:


- Method: GET
- URL: `https://5d90f2845f40.ngrok-free.app/contacts`
- Headers: `x-api-key: test123456`
- Click "Send"

kết quả dữ liệu lấy thành công trên  : ID": "1",
        "POST": null,
        "COMMENTS": "",
        "HONORIFIC": null,
        "NAME": "đạt",
        "SECOND_NAME": null,
        "LAST_NAME": "trần",
        "PHOTO": null,
        "LEAD_ID": null,
        "TYPE_ID": "CLIENT",
        "SOURCE_ID": "CALL",
        "SOURCE_DESCRIPTION": null,
        "COMPANY_ID": "0",
        "BIRTHDATE": "2004-11-22T03:00:00+03:00",
        "EXPORT": "Y",
        "HAS_PHONE": "Y",
        "HAS_EMAIL": "Y",
        "HAS_IMOL": "N",
        "DATE_CREATE": "2026-01-03T07:50:34+03:00",
        "DATE_MODIFY": "2026-01-03T07:50:34+03:00",
        "ASSIGNED_BY_ID": "1",
        "CREATED_BY_ID": "1",
        "MODIFY_BY_ID": "1",



POST /contacts:

- Method: POST
- URL:  https://4eaea646ae88.ngrok-free.app/contacts'
- Headers:
  - `x-api-key: test123456`
  - `Content-Type: application/json`

- Body (raw JSON):

{
  "name": "Nguyen Van B",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "phone": "0912345678",
  "email": "nguyenvanb@example.com",
  "website": "https://example.com",
  "bank_name": "Vietcombank",
  "bank_account": "123456789012"
}

kết quả : {
    "contactId": 101
} dữ liệu mẫu được cập nhật lên bitrix24



Ngoài ra test put và delete cũng tương tự


Test các trường hợp lỗi

Thiếu API Key

{
    "message": "Invalid API key",
    "error": "Unauthorized",
    "statusCode": 401
}


2. API Key sai

Kết quả: Giống trên


{
    "message": "Invalid API key",
    "error": "Unauthorized",
    "statusCode": 401
}


3. Validation lỗi - Name trống

{
    "message": [
        "Tên contact phải có ít nhất 1 ký tự",
        "Tên contact là bắt buộc"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

4. Validation lỗi - Email sai định dạng

{
    "message": [
        "Email không hợp lệ"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

5. Validation lỗi - Số điện thoại sai

{
    "message": [
        "Số điện thoại không hợp lệ (định dạng Việt Nam)"
    ],
    "error": "Bad Request",
    "statusCode": 400
}












