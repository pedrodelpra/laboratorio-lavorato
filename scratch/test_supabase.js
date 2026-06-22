import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

async function run() {
  try {
    const blogUrl = `${supabaseUrl}/rest/v1/blog_posts?select=*`;
    const settingsUrl = `${supabaseUrl}/rest/v1/site_settings?select=*`;

    const headers = {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json'
    };

    console.log("Fetching blog posts...");
    const blogRes = await fetch(blogUrl, { headers });
    const blogData = await blogRes.json();
    console.log("=== BLOG POSTS IN DATABASE ===");
    console.log(JSON.stringify(blogData, null, 2));

    console.log("\nFetching site settings...");
    const settingsRes = await fetch(settingsUrl, { headers });
    const settingsData = await settingsRes.json();
    console.log("=== SITE SETTINGS IN DATABASE ===");
    console.log(JSON.stringify(settingsData, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
