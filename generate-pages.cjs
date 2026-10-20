const fs = require('fs');
const path = require('path');

const pages = [
  'Home', 'Menu', 'Cart', 'Checkout', 'Login', 'Signup',
  'ForgotPassword', 'ResetPassword', 'Dashboard', 'Admin',
  'OrderStatus', 'NotFound'
];

const dir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

for (const name of pages) {
  const content = `export default function ${name}() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold">${name} Page</h1>
      <p className="text-text-muted mt-4">Coming in a future batch.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${name}.jsx`), content);
  console.log(`✓ Created ${name}.jsx`);
}

console.log('\nAll page files generated successfully.');