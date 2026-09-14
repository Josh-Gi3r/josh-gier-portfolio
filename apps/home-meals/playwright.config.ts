import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir:"./tests/e2e",
  timeout:30_000,
  expect:{timeout:8_000},
  retries:process.env.CI?1:0,
  workers:process.env.CI?1:undefined,
  reporter:process.env.CI?[["line"]]:[["list"]],
  use:{
    baseURL:"http://127.0.0.1:3100",
    viewport:{width:390,height:844},
    trace:"retain-on-failure",
    screenshot:"only-on-failure"
  },
  webServer:{
    command:"npm start -- -p 3100",
    url:"http://127.0.0.1:3100",
    reuseExistingServer:!process.env.CI,
    timeout:120_000
  }
});
