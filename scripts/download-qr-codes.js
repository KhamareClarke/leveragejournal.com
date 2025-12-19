/**
 * Script to download QR codes for the journal book
 * These QR codes use the full URL with domain
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Base URL for the application
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://leveragejournel.vercel.app';

// QR code URLs to generate - using full URLs
const qrCodes = [
  {
    id: 'chapter1',
    url: `${BASE_URL}/dashboard/goals`,
    description: 'Access Vision Board',
    filename: 'qr-chapter1-goals.png'
  },
  {
    id: 'chapter2',
    url: `${BASE_URL}/dashboard/daily`,
    description: 'Access Plan Dashboard',
    filename: 'qr-chapter2-daily.png'
  },
  {
    id: 'chapter3',
    url: `${BASE_URL}/dashboard`,
    description: 'Sync with AI CoPilot',
    filename: 'qr-chapter3-dashboard.png'
  },
  {
    id: 'chapter4',
    url: `${BASE_URL}/dashboard?tab=stats`,
    description: 'Access Progress Analytics',
    filename: 'qr-chapter4-stats.png'
  },
  {
    id: 'chapter5',
    url: `${BASE_URL}/dashboard`,
    description: 'Join Builder\'s Guild',
    filename: 'qr-chapter5-dashboard.png'
  }
];

// Create QR codes directory if it doesn't exist
const qrDir = path.join(__dirname, '..', 'public', 'leverage', 'qr-codes');
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
  console.log('✅ Created QR codes directory:', qrDir);
}

// Function to download QR code
function downloadQRCode(qrConfig) {
  return new Promise((resolve, reject) => {
    const encodedUrl = encodeURIComponent(qrConfig.url);
    // Using QR Server API with higher resolution for print quality
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}&bgcolor=FFFFFF&color=000000&margin=1&ecc=H`;
    
    console.log(`📥 Downloading QR code for ${qrConfig.id}...`);
    console.log(`   URL: ${qrConfig.url}`);
    console.log(`   Description: ${qrConfig.description}`);
    
    const filePath = path.join(qrDir, qrConfig.filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(qrApiUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download QR code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Saved: ${qrConfig.filename}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Download all QR codes
async function downloadAllQRCodes() {
  console.log('🚀 Starting QR code download process...');
  console.log(`📡 Base URL: ${BASE_URL}\n`);
  
  try {
    for (const qrConfig of qrCodes) {
      await downloadQRCode(qrConfig);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ All QR codes downloaded successfully!');
    console.log(`📁 Location: ${qrDir}`);
    
    // Create a manifest file with QR code information
    const manifest = {
      baseUrl: BASE_URL,
      generatedAt: new Date().toISOString(),
      qrCodes: qrCodes.map(qr => ({
        id: qr.id,
        url: qr.url,
        description: qr.description,
        filename: qr.filename,
        path: `/leverage/qr-codes/${qr.filename}`
      }))
    };
    
    const manifestPath = path.join(qrDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Manifest saved: manifest.json`);
    
  } catch (error) {
    console.error('❌ Error downloading QR codes:', error);
    process.exit(1);
  }
}

// Run the script
downloadAllQRCodes();

