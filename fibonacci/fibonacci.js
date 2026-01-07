/**
 Hàm tính số Fibonacci thứ n sử dụng Dynamic Programming với mảng (memoization)
 Sử dụng BigInt để xử lý số lớn
 @param {number} n - chỉ số Fibonacci (bắt đầu từ F(0))
 @returns {BigInt} - số Fibonacci thứ n
 */
function fibonacci(n) {
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  // Tạo mảng để lưu kết quả tính trước
  const dp = new Array(n + 1);
  dp[0] = 0n;
  dp[1] = 1n;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Hàm đo thời gian thực thi trung bình
function measureTime(fn, n, runs = 10) {
  let totalTime = 0;
  let result;
  for (let i = 0; i < runs; i++) {
    console.time("Execution Time");
    result = fn(n);
    console.timeEnd("Execution Time");
  }
  return result;
}

// Kiểm tra kết quả với n = 10, 20, 50
const testValues = [10, 20, 50];
testValues.forEach(n => {
  console.log(`\nFibonacci(${n}):`);
  const fibN = measureTime(fibonacci, n);
  console.log(`Result: ${fibN}`);
});
