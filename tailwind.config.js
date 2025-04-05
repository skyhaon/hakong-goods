/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],  // 중요! src 내부 모든 파일 감지
  theme: {
    extend: {},
  },
  plugins: [],
};
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif']
      }
    }
  },
  plugins: []
};
