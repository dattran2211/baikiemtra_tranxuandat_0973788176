Báo cáo Bài 2: Tính số Fibonacci thứ 50

1. Mô tả thuật toán
Thuật toán sử dụng Dynamic Programming để tính số Fibonacci thứ n:  
- Tính từ F(0) đến F(n) theo thứ tự tăng dần, tránh việc tính lại các giá trị trung gian.  
- Lưu kết quả từng bước vào mảng `dp` (memoization).  
- Sử dụng `BigInt` để xử lý các số lớn như F(50).  
- Đo thời gian thực thi bằng `console.time` và `console.timeEnd`.

2. Độ phức tạp

đánh giá số phép toán mà thuật toán triển khai so với kích thước đầu vào

thuật toán :  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
 

thời gian : Vòng lặp đơn ( Vòng lặp chạy n - 1  lần, mỗi lần thực hiện 1 phép tính ) => Độ phức tạp: O(n)

nếu là Vòng lặp lồng nhau : O(n²)


Không gian: O(n) (Thuật toán sử dụng bộ nhớ tỉ lệ thuận với kích thước dữ liệu đầu vào n )

vì lưu mảng `dp` chứa n+1 giá trị , khi n tăng lên bộ nhớ dùng để lưu mảng dp cũng sẽ tăng lên => cần nhiều bộ nhớ hơn

> Nếu muốn tối ưu không gian, chỉ cần lưu 2 biến cuối cùng, giảm không gian xuống O(1).

  let prev1 = 0n; // F(0)
  let prev2 = 1n; // F(1)
  let current;

  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2; 
    prev1 = prev2;           
    prev2 = current;         
  }

  Lúc này khi n tăng lên bộ nhớ cũng sẽ giữ nguyên vì mỗi lần lặp chỉ cần lưu 3 biến cố định là current, prev1, prev2




3. Kết quả thời gian thực thi
Thời gian thực thi được đo qua 10 lần chạy cho mỗi giá trị n:  

- Fibonacci(10): dao động từ 0.01 ms đến 0.268 ms, kết quả trung bình khoảng 0.078 ms.  
- Fibonacci(20): dao động từ 0.011 ms đến 0.027 ms, kết quả trung bình khoảng 0.014 ms.  
- Fibonacci(50): dao động từ 0.008 ms đến 0.656 ms, kết quả trung bình khoảng 0.080 ms.  

> Như vậy, thuật toán hoàn toàn đáp ứng yêu cầu thời gian < 1 ms.

4. Kết quả kiểm tra với các giá trị n
| n   | Fibonacci(n)       |
|-----|------------------|
| 10  | 55               |
| 20  | 6765             |
| 50  | 12586269025      |


5. Hướng dẫn chạy

1. git clone https://github.com/dattran2211/baikiemtra_tranxuandat_0973788176.git

   cd bài 2 fibonacci

2. Chạy bằng Node.js:

   node fibonacci.js