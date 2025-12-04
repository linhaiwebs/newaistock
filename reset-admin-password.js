import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase configuration');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetAdminPassword() {
  const username = 'admin';
  const newPassword = 'admin123';

  try {
    console.log('Resetting password for admin user...');

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id, username')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('username', username);

      if (error) throw error;

      console.log('✓ Password reset successfully!');
      console.log(`  Username: ${username}`);
      console.log(`  Password: ${newPassword}`);
    } else {
      const { error } = await supabase
        .from('admin_users')
        .insert({
          username: username,
          password_hash: passwordHash,
          role: 'admin',
        });

      if (error) throw error;

      console.log('✓ Admin user created successfully!');
      console.log(`  Username: ${username}`);
      console.log(`  Password: ${newPassword}`);
    }

    console.log('\nPlease change the password after first login for security.');
  } catch (error) {
    console.error('Error resetting password:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
