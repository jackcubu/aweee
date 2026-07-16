const fs = require('fs');
const path = require('path');

const jsonPath = 'js/data.json'; // Đường dẫn đến file JSON hiện có của bạn
const rootPath = path.join('assets', 'images', '1');

// 1. Đọc file JSON cũ lên
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 2. Tạo danh sách chương mới dựa trên 66 chương
let updatedChapters = [];

for (let i = 1; i <= 66; i++) {
    const folderName = `chương ${i}`;
    const chapPath = path.join(rootPath, folderName);
    
    let imageList = [];
    if (fs.existsSync(chapPath)) {
        imageList = fs.readdirSync(chapPath)
            .filter(f => f.toLowerCase().match(/\.(jpg|jpeg|png)$/))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .map(f => path.join('assets', 'images', '1', folderName, f).replace(/\\/g, '/'));
    }

    updatedChapters.push({
        name: folderName,
        images: imageList
    });
}

// 3. Chỉ cập nhật mảng chapters, giữ nguyên các thông tin khác (name, id, v.v.)
data.mangas[0].chapters = updatedChapters;

// 4. Ghi đè lại chính file cũ
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log("Đã cập nhật xong file data.json mà vẫn giữ nguyên cấu trúc cũ!");