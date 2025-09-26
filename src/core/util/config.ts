const { NODE_ENV, SERVER_MODE } = process.env;

const DEVELOPMENT_ENVS = ['dev', 'development', 'local'];
const TEST_ENVS = ['jest', 'e2e', 'test'];

export default () => ({
  app: {
    email: process.env.EMAIL,
  },
  env: {
    value: NODE_ENV,
    isDev: DEVELOPMENT_ENVS.includes(NODE_ENV),
    isTest: TEST_ENVS.includes(NODE_ENV),
    mode: SERVER_MODE,
  },
  email: {
    defaultSenderAddress: process.env.EMAIL_DEFAULT_SENDER_ADDRESS,
    defaultSenderName: process.env.EMAIL_DEFAULT_SENDER_NAME,
  },

  // PORT CONFIG
  port: parseInt(process.env.APP_PORT, 10) || 3000,

  // REMITA CONFIG
  remita_url: process.env.REMITA_URL,
  remita_apikey: process.env.REMITA_API_KEY,
  remita_service_type_id: process.env.REMITA_SERVICE_TYPE_ID,
  remita_merchant_id: process.env.REMITA_MERCHANT_ID,

  // rabbitMq CONFIG
  rabbitMq: {
    url: process.env.AMQP_URL,
    username: process.env.AMQP_USERNAME,
    password: process.env.AMQP_PASSWORD,
    globalVhost: process.env.AMQP_GLOBAL_VHOST,
    vhost: process.env.AMQP_VHOST,
    routingKeyPrefix: process.env.AMQP_ROUTING_KEY_PREFIX,
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
  },
  mail: {
    service: process.env.MAIL_SERVICE as string,
    auth: {
      apiUser: process.env.MAIL_USERNAME as string,
      apiKey: process.env.MAIL_PASSWORD as string,
    },
  },
  host: {
    url: 'localhost:4000',
  },
});
