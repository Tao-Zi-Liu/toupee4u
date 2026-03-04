import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const ADMIN_EMAIL = 'liuzhitao598@gmail.com';

try {
  const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
  await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
  console.log(`✅ isAdmin claim set successfully`);
  console.log(`   Email: ${user.email}`);
  console.log(`   UID:   ${user.uid}`);
  console.log('\n⚠️  请退出管理员账号并重新登录，令牌刷新后规则生效');
} catch (err) {
  console.error('❌ Failed:', err.message);
}

process.exit(0);
EOF