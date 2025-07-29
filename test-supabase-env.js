// Test script to verify Supabase connection using environment variables
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection with environment variables...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Testing basic connection...');
    
    // Test simple query
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('🔍 Error details:', error);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log('📊 Data received:', data);
    return true;
    
  } catch (error) {
    console.log('❌ Exception:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase connection is working!');
    console.log('✅ Environment variables are correctly configured');
  } else {
    console.log('\n💥 Connection failed. Please check:');
    console.log('1. Your internet connection');
    console.log('2. Supabase project is active');
    console.log('3. Tables exist in your database (run supabase-schema.sql)');
    console.log('4. RLS policies are configured');
  }
});