Vai trò của các thành phần chính trong NestJS:

Modules: Là các khối xây dựng cơ bản của ứng dụng, giúp tổ chức và nhóm các thành phần liên quan (như controllers, services, providers). Mỗi module đóng gói logic cụ thể, hỗ trợ dependency injection và cấu trúc ứng dụng theo mô-đun, làm cho code dễ bảo trì và mở rộng.

Controllers: Xử lý các yêu cầu HTTP đến từ client, định nghĩa các endpoint (routes) và ánh xạ chúng đến các phương thức xử lý. Chúng chịu trách nhiệm nhận dữ liệu đầu vào, gọi logic nghiệp vụ từ services, và trả về phản hồi.

Services: Chứa logic nghiệp vụ chính của ứng dụng, như xử lý dữ liệu, tương tác với cơ sở dữ liệu, hoặc thực hiện các phép tính. Được inject vào controllers hoặc các thành phần khác thông qua dependency injection, đảm bảo tách biệt logic và tái sử dụng.

Cách NestJS sử dụng TypeScript để hỗ trợ phát triển ứng dụng:

NestJS tận dụng TypeScript để cung cấp type safety, decorators, và metadata reflection, giúp phát triển ứng dụng Node.js mạnh mẽ hơn. TypeScript cho phép định nghĩa rõ ràng các kiểu dữ liệu cho DTOs, entities, và interfaces, giảm lỗi runtime; decorators (@Module, @Controller, @Injectable) tự động cấu hình dependency injection và routing; và hỗ trợ IntelliSense, refactoring, và kiểm tra tĩnh, làm cho code dễ đọc, bảo trì, và mở rộng.



Bài 1 :  Task Management API – NestJS

1. Giới thiệu

Dự án này là một API RESTful được xây dựng bằng NestJS theo mô hình MVC, dùng để quản lý các Task (công việc).

API hỗ trợ:

CRUD Task (Create, Read, Update, Delete)
Kiểm tra dữ liệu đầu vào (Validation Pipes)
Lưu trữ dữ liệu bằng SQLite + TypeORM
Tài liệu API bằng Swagger
Unit Test bằng Jest

2. Công nghệ sử dụng

| Công nghệ  | Mô tả             |
| Node.js    | Runtime           |
| NestJS     | Backend framework |
| TypeScript | Ngôn ngữ chính    |
| TypeORM    | ORM               |
| SQLite     | Database          |
| Swagger    | API Documentation |
| Jest       | Unit Testing      |


3. Cấu trúc thư mục

task-crud/
│
├── src/
│   ├── task/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── task.controller.ts
│   │   ├── task.service.ts
│   │   ├── task.entity.ts
│   │   └── task.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│   └── task.service.spec.ts
│
├── package.json
├── tsconfig.json
└── README.md



4. Cách chạy

4.1 Yêu cầu hệ thống

Node.js >= 18
npm >= 9

Kiểm tra:

node -v
npm -v

4.2 Cài đặt dependencies

Clone project từ GitHub:

git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git
cd task-crud

npm install


5. Chạy ứng dụng

npm run start:dev

Ứng dụng chạy tại:

http://localhost:3000


6. Truy cập Swagger (API Documentation)

http://localhost:3000/docs

Swagger cho phép:

* Xem toàn bộ API
* Test trực tiếp các API (POST, GET, PUT, DELETE)
* Xem cấu trúc request/response


7. Danh sách API chính

7.1 Tạo task mới

POST `/tasks`

{
  "title": "học nest js",
  "description": "học nest js căn bản",
  "status": "To Do"
}

7.2 Lấy danh sách task

GET `/tasks`

7.3 Lấy task theo ID

GET `/tasks/{id}`

Nhập id vào ô tương ứng

7.4 Cập nhật task

PUT `/tasks/{id}`

Nhập id vào ô tương ứng

{
  "title": "Learn NestJS Advanced",
  "status": "In Progress"
}


7.5 Xóa task

DELETE `/tasks/{id}`

Nhập id task cần xóa vào ô tương ứng


8. Validation dữ liệu

API sử dụng Validation Pipes để kiểm tra dữ liệu:


Khi post

| Trường | Điều kiện                                | Trả về lỗi
| title  | Không được rỗng                          | thông báo không rỗng
| status | Chỉ nhận: `To Do`, `In Progress`, `Done` | status must be one of the following values: To Do, In Progress, Done

Khi get, delete, put theo id nếu sai id sẽ gây lỗi 404

Khi put cũng sẽ có ràng buộc như khi get


9. Database

Database: SQLite
File DB được tạo tự động khi chạy ứng dụng
Không cần cài thêm phần mềm DB

10. Kết quả chạy Unit Test (Jest)

10.1 Công cụ sử dụng

Framework test: Jest (tích hợp sẵn trong NestJS)
Phạm vi kiểm thử:

  `TaskService`
  `AppController`


10.2 Cách chạy Unit Test

Tại thư mục gốc của project, thực hiện lệnh:

npm run test


10.3 Kết quả thực tế khi chạy Test

Kết quả chạy test thành công như sau:

PASS  src/app.controller.spec.ts
PASS  src/task.service.spec.ts

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.432 s
Ran all test suites.



10.4 Phân tích kết quả

| Thành phần         | Trạng thái |
| AppController Test | ✅ PASS     |
| TaskService Test   | ✅ PASS     |
| Tổng số Test Suite | 2          |
| Tổng số Test Case  | 2          |
| Test thất bại      | 0          |
| Thời gian chạy     | ~4.4 giây  |

10.5 Ý nghĩa

Xác nhận logic nghiệp vụ của TaskService hoạt động đúng
Đảm bảo Controller khởi tạo và phản hồi đúng
Đáp ứng đầy đủ yêu cầu unit test tối thiểu của đề bài
Hệ thống sẵn sàng để mở rộng thêm test trong tương lai




