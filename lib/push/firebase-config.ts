export function getPushConfig() {
  return {
    provider: process.env.PUSH_PROVIDER || 'webhook',
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    webhookUrl: process.env.PUSH_DELIVERY_WEBHOOK_URL || null,
  };
}
