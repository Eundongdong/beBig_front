import { readdirSync, copyFileSync, existsSync, mkdirSync, statSync } from "fs";
import { resolve, join } from "path";

// 디렉토리 복사 함수 (재귀적으로 디렉토리 내부의 파일도 복사)
function copyDirectory(source, destination) {
  // 디렉토리가 존재하지 않으면 생성
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  // source 디렉토리의 파일 및 서브디렉토리 목록을 읽음
  readdirSync(source).forEach((item) => {
    const sourcePath = join(source, item);
    const destinationPath = join(destination, item);

    // 항목이 파일인지 디렉토리인지 확인
    if (statSync(sourcePath).isDirectory()) {
      // 디렉토리일 경우 재귀적으로 복사
      copyDirectory(sourcePath, destinationPath);
    } else {
      // 파일일 경우 복사
      copyFileSync(sourcePath, destinationPath);
    }
  });
}

// 빌드 후 복사할 경로 설정
const source = resolve(process.cwd(), "images");
const destination = resolve(process.cwd(), "dist/images");

// 루트 디렉토리의 images 폴더를 dist 폴더로 복사
copyDirectory(source, destination);

console.log("Images folder copied to dist/images");
