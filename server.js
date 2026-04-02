import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 接收 App Hosting 动态注入的 PORT 环境变量，默认兜底为 8080
const PORT = process.env.PORT || 8080;

// 告诉服务器：静态资源都从 Vite 打包生成的 dist 目录里拿
app.use(express.static(join(__dirname, 'dist')));

// 【极其重要】为了让前端路由（如 React Router 或 Vue Router）正常工作，
// 必须将所有未匹配的路径都重定向回 index.html
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// 启动并监听端口
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is successfully running and listening on port ${PORT}`);
});