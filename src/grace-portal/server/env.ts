export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Azure DevOps — Personal Access Token stored in the ADO secret
  adoPat: process.env.ADO ?? "",

  // GRACE — LLM provider bootstrap overrides (prefer DB settings via Settings page)
  graceLlmProvider: process.env.GRACE_LLM_PROVIDER ?? "manus",
  graceOllamaEndpoint: process.env.GRACE_OLLAMA_ENDPOINT ?? "http://localhost:11434",
  graceOllamaCloudEndpoint: process.env.GRACE_OLLAMA_CLOUD_ENDPOINT ?? "",
  graceLlmModel: process.env.GRACE_LLM_MODEL ?? "",
  graceLlmApiKey: process.env.GRACE_LLM_API_KEY ?? "",
  graceAzureOpenAiEndpoint: process.env.GRACE_AZURE_OPENAI_ENDPOINT ?? "",
  graceAzureOpenAiDeployment: process.env.GRACE_AZURE_OPENAI_DEPLOYMENT ?? "",
  graceAzureOpenAiApiVersion: process.env.GRACE_AZURE_OPENAI_API_VERSION ?? "2024-02-01",
  graceCustomLlmEndpoint: process.env.GRACE_CUSTOM_LLM_ENDPOINT ?? "",

  // GRACE — SSRF allowlist (comma-separated internal hostnames)
  graceAllowedHosts: process.env.GRACE_ALLOWED_HOSTS ?? "",

  // GRACE — Quality thresholds (overridden by DB settings when configured)
  graceTestabilityThreshold: parseFloat(process.env.GRACE_TESTABILITY_THRESHOLD ?? "0.65"),
  graceConfidenceThreshold: parseFloat(process.env.GRACE_CONFIDENCE_THRESHOLD ?? "0.70"),
  graceDuplicateThreshold: parseFloat(process.env.GRACE_DUPLICATE_THRESHOLD ?? "0.85"),

  // GRACE — Playwright / CDP execution
  graceDefaultBrowser: process.env.GRACE_DEFAULT_BROWSER ?? "chromium",
  graceCdpEndpoint: process.env.GRACE_CDP_ENDPOINT ?? "",
  graceStepTimeoutMs: parseInt(process.env.GRACE_STEP_TIMEOUT_MS ?? "30000", 10),
  graceTestcaseTimeoutMs: parseInt(process.env.GRACE_TESTCASE_TIMEOUT_MS ?? "300000", 10),

  // AWS S3 — file storage for XLSX uploads and results
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  s3BucketName: process.env.S3_BUCKET_NAME ?? "grace-ai-files",
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
};
