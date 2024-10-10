import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  productionSourceMap: true,

  server: {
    port: 5173, // 개발 서버 포트 번호
    open: true, // 서버 시작 시 브라우저 자동 열기
    proxy: {
      // '/api'로 시작하는 요청은 백엔드 서버로 프록시
      "/api": {
        target: "http:/localhost:8080", // 백엔드 서버 주소
        changeOrigin: true, // 백엔드 서버의 CORS 문제 해결
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  base: "./", // 배포 시 상대 경로 사용
  build: {
    outDir: "dist", // 빌드된 파일이 저장될 디렉토리
    sourcemap: false, // 필요 시 소스맵을 생성할지 여부
    rollupOptions: {
      output: {
        // 파일 크기가 너무 커지지 않도록 코드 스플리팅
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
  preview: {
    port: 80, // 빌드 후 프리뷰 서버의 포트 번호
    host: "0.0.0.0", // 모든 호스트에서 접속 가능
    proxy: {
      // 프리뷰 환경에서도 백엔드 요청에 대한 프록시 설정
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 주소
        changeOrigin: true, // CORS 문제 해결
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});