import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}`;

async function testLoginAndAnalytics() {
  console.log('🔍 Testing Admin Login and Analytics Config...\n');

  try {
    // Step 1: Test Login
    console.log('1️⃣ Testing login with asdsadmin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'asdsadmin',
      password: 'Mm123567..'
    });

    const loginData = loginResponse.data;
    console.log('✅ Login successful!');
    console.log('   User ID:', loginData.user.id);
    console.log('   Username:', loginData.user.username);
    console.log('   Role:', loginData.user.role);
    console.log('   Token:', loginData.token.substring(0, 20) + '...\n');

    const token = loginData.token;

    // Step 2: Get Current Analytics Config
    console.log('2️⃣ Fetching current analytics config...');
    const getResponse = await axios.get(`${BASE_URL}/api/admin/analytics/config`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const currentConfig = getResponse.data;
    console.log('✅ Current config:', JSON.stringify(currentConfig, null, 2), '\n');

    // Step 3: Update Analytics Config
    console.log('3️⃣ Updating analytics config...');
    const newConfig = {
      ga4_measurement_id: 'G-TEST123456',
      google_ads_conversion_id: 'AW-TEST789',
      conversion_action_id: 'TEST-ACTION-123',
      enabled: true
    };

    const updateResponse = await axios.put(`${BASE_URL}/api/admin/analytics/config`, newConfig, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const updatedConfig = updateResponse.data;
    console.log('✅ Config updated successfully!');
    console.log('   Updated config:', JSON.stringify(updatedConfig, null, 2), '\n');

    // Step 4: Verify the update
    console.log('4️⃣ Verifying the update...');
    const verifyResponse = await axios.get(`${BASE_URL}/api/admin/analytics/config`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const verifiedConfig = verifyResponse.data;
    console.log('✅ Verification successful!');
    console.log('   Verified config:', JSON.stringify(verifiedConfig, null, 2), '\n');

    // Check if values match
    const matches =
      verifiedConfig.ga4_measurement_id === newConfig.ga4_measurement_id &&
      verifiedConfig.google_ads_conversion_id === newConfig.google_ads_conversion_id &&
      verifiedConfig.conversion_action_id === newConfig.conversion_action_id &&
      verifiedConfig.enabled === newConfig.enabled;

    if (matches) {
      console.log('🎉 All tests passed! Analytics config save is working correctly.\n');
    } else {
      console.log('⚠️  Warning: Config values do not match expected values.\n');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testLoginAndAnalytics();
