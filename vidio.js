import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import readline from "readline-sync";
import { SMSActivate } from "./lib/index.js";
import * as TURBO from "./lib/turbo.js";
import chalk from "chalk";
import delay from "delay";
import { HttpsProxyAgent } from "https-proxy-agent";
import { af_ZA, faker } from "@faker-js/faker";
import fs from "fs-extra";
import sleep from "delay";
import inquirer from "inquirer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
process.env.NODE_NO_WARNINGS = "1";

const stealthPlugin = StealthPlugin();
["chrome.runtime", "navigator.languages"].forEach((a) =>
  stealthPlugin.enabledEvasions.delete(a)
);

puppeteer.use(stealthPlugin);
const apikey = "101139U2a9a9d4dd19e79d40c38996487e731e6";

const curl = ({ endpoint, data, header, proxy, method = null }) =>
  new Promise((resolve, reject) => {
    let fetchData = {
      headers: header,
      agent: new HttpsProxyAgent(proxy),
    };
    if (method === "PATCH") {
      fetchData.method = "PATCH";
      fetchData.body = data;
    } else {
      if (data) {
        fetchData.method = "POST";
        fetchData.body = data;
      } else {
        fetchData.method = "GET";
      }
    }

    fetch(endpoint, fetchData)
      .then((res) => res)
      .then(async (res) => {
        const data = {
          cookie: await res.headers.raw(),
          respon: await res.json(),
          status: await res.status,
        };
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
function log(msg, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  switch (type) {
    case "success":
      console.log(`[${timestamp}] ➤  ${chalk.green(msg)}`);
      break;
    case "custom":
      console.log(`[${timestamp}] ➤  ${chalk.magenta(msg)}`);
      break;
    case "error":
      console.log(`[${timestamp}] ➤  ${chalk.red(msg)}`);
      break;
    case "warning":
      console.log(`[${timestamp}] ➤  ${chalk.yellow(msg)}`);
      break;
    default:
      console.log(`[${timestamp}] ➤  ${msg}`);
  }
}
function headers(visitor, token, email, tokenx) {
  if (!token) {
    return {
      Host: "api.vidio.com",
      "User-Agent": "vidioandroid/6.41.11-0703defa3c (3191426)",
      "Accept-Encoding": "gzip",
      referer: "android-app://com.vidio.android",
      "x-api-platform": "app-android",
      "x-api-auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "x-api-app-info": "android/7.1.2/6.41.11-0703defa3c-3191426",
      "accept-language": "en",
      "x-visitor-id": visitor,
    };
  } else {
    return {
      Host: "api.vidio.com",
      "User-Agent": "vidioandroid/6.41.11-0703defa3c (3191426)",
      "Accept-Encoding": "gzip",
      referer: "android-app://com.vidio.android",
      "x-api-platform": "app-android",
      "x-api-auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "x-api-app-info": "android/7.1.2/6.41.11-0703defa3c-3191426",
      "accept-language": "en",
      "x-user-email": email,
      "x-user-token": tokenx,
      "x-visitor-id": visitor,
      "x-authorization": token,
    };
  }
}
function filterNumber(phoneNumber) {
  // Jika dimulai dengan '62', hapus '62'
  if (phoneNumber.startsWith("62")) {
    return phoneNumber.slice(2);
  }
  // Jika dimulai dengan '0', ubah '0' menjadi kosong
  if (phoneNumber.startsWith("0")) {
    return phoneNumber.slice(1);
  }
  // Jika tidak memenuhi kondisi di atas, kembalikan nomor asli
  return phoneNumber;
}
(async () => {
  while (true) {
    let Registernew;
    let visitornew;
    let emailnew;
    let Phone = await inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Input number ? ",
        },
      ])
      .then((answers) => {
        return answers.name;
      });
    let password = await inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Input password ? ",
        },
      ])
      .then((answers) => {
        return answers.name;
      });
    const Generate =
      faker.person.lastName() +
      faker.person.firstName() +
      faker.person.lastName() +
      "@gmail.com";

    const email = Generate.replace(/[^a-zA-Z0-9@.]/g, "");
    log(`create new email step 1 [ ${email} ] `, "success");

    const proxyauth = `https://1a48601ad88d747d779b__cr.id:d536875334c6af36@gw.dataimpulse.com:823`;
    let dataip;
    do {
      try {
        dataip = await curl({
          endpoint: "https://api.ipify.org?format=json",
          data: null,
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
          },
          proxy: proxyauth,
        });
        // console.log(dataip);
      } catch (error) {
        log("Proxy Not Found", "error");
      }
    } while (!dataip);
    log("Data Proxy : " + dataip.respon.ip, "warning");
    const visitor = uuidv4().toLocaleUpperCase();
    const Register = await curl({
      endpoint: "https://api.vidio.com/api/register",
      data: new URLSearchParams({
        email: email,
        password: password,
      }),
      header: headers(visitor, null),
      proxy: proxyauth,
    });
    // console.log(Register.respon);
    if (JSON.stringify(Register.respon).includes("access_token")) {
      log("Token Successfuly Create..", "success");
      log(
        `\nAccount :\n      - Email : ${Register.respon.auth.email}\n      - Status : ${Register.respon.auth.active}\n      - Password : ${password}\n`,
        "custom"
      );
      fs.appendFileSync("accountregister.txt", `${email}|${password}\n`);
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ["--enable-automation"],
        userDataDir: "rand",
        headless: false,
        devtools: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-notifications",
          "--disable-features=site-per-process",
          "--disable-dev-shm-usage",
        ],
      });

      // Listener untuk menangkap semua request

      const page = await browser.newPage();

      page.on("console", (msg) => {});
      let authorizationFound = false; // Variabel kontrol untuk menghentikan pemeriksaan
      let cookie;
      let crf;
      // Aktifkan intercept request untuk memfilter berdasarkan URL
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        const url = request.url();

        if (authorizationFound) {
          request.continue(); // Lanjutkan permintaan jika header sudah ditemukan
          return;
        }

        // Periksa apakah URL sesuai dengan target
        if (url === "https://www.vidio.com/dashboard/setting") {
          const headers = request.headers();
          if (headers["cookie"]) {
            cookie = headers["cookie"];
            crf = headers["x-csrf-token"];
            authorizationFound = true; // Tandai bahwa header telah ditemukan
          }
        }

        request.continue(); // Lanjutkan permintaan lainnya
      });
      log("Navigated to the website.", "success");
      await page.goto("https://www.vidio.com/users/login");
      await page.waitForSelector('input[id="user_login"]', { visible: true });
      await page.type('input[id="user_login"]', email, { delay: 20 });
      await delay(1000);
      await page.waitForSelector('input[id="user_password"]', {
        visible: true,
      });
      await page.type('input[id="user_password"]', password, { delay: 20 });
      await delay(1000);
      await page.waitForSelector('input[id="onboarding-login-form-submit"]', {
        visible: true,
      });
      await page.click('input[id="onboarding-login-form-submit"]');
      await delay(1000);
      await page.waitForSelector('a[aria-label="User"]', { visible: true });
      await page.goto("https://www.vidio.com/dashboard/setting");
      const Sendverify = await curl({
        endpoint: "https://www.vidio.com/dashboard/setting/phone",
        data: new URLSearchParams({
          "user[phone]": filterNumber(Phone),
        }),
        header: {
          accept:
            "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          cookie: cookie,
          origin: "https://www.vidio.com",
          priority: "u=1, i",
          referer: "https://www.vidio.com/dashboard/setting",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "x-csrf-token": crf,
          "x-requested-with": "XMLHttpRequest",
        },
        proxy: proxyauth,
      });

      if (Sendverify.respon.message === "Verification code sent!") {
        await browser.close();
        await delay(2000);
        await fs.rmdirSync("rand", { recursive: true, force: true });
        log(Sendverify.respon.message, "success");
        let OtpInput = await inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "Input otp ? ",
            },
          ])
          .then((answers) => {
            return answers.name;
          });
        if (!OtpInput) {
          continue;
        }
        const VerifyOtp = await curl({
          endpoint: "https://www.vidio.com/dashboard/setting/phone",
          data: new URLSearchParams({
            "user[phone_confirmation_code]": OtpInput,
          }),
          header: {
            accept:
              "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            cookie: cookie,
            origin: "https://www.vidio.com",
            priority: "u=1, i",
            referer: "https://www.vidio.com/dashboard/setting",
            "sec-ch-ua":
              '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "x-csrf-token": crf,
            "x-requested-with": "XMLHttpRequest",
          },
          proxy: proxyauth,
          method: "PATCH",
        });

        // console.log(VerifyOtp.respon);
        if (VerifyOtp.respon.verified) {
          log(
            ` Verified status ${VerifyOtp.respon.verified} ${Phone} register success`,
            "success"
          );
          await inquirer
            .prompt([
              {
                type: "input",
                name: "name",
                message: "enter jika sudah membeli paket ? ",
              },
            ])
            .then((answers) => {
              return answers.name;
            });

          let otpCode;
          let data;
          let otp;

          do {
            const sms = new SMSActivate(apikey, "smshub");
            const balance = await sms.getBalance();
            log(`Saldo SMSHUB ${balance} руб`, "warning");

            try {
              do {
                data = await sms.getNumber("fv", 6, "telkomsel");
                // console.log(data);
              } while (data === null);
            } catch (err) {
              log(`Gagal Mendapatkan Nomer ${err}`, "error");
              await delay(5000);
              continue;
            }
            let { id, number } = data;
            await sms.setStatus(id, 1);
            log(`Try To Switch Number in Account [ ${number} ]`, "warning");
            const PhoneNumber = filterNumber(number.toString());
            const SendverifySmsHub = await curl({
              endpoint: "https://www.vidio.com/dashboard/setting/phone",
              data: new URLSearchParams({
                "user[phone]": filterNumber(number.toString()),
              }),
              header: {
                accept:
                  "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                cookie: cookie,
                origin: "https://www.vidio.com",
                priority: "u=1, i",
                referer: "https://www.vidio.com/dashboard/setting",
                "sec-ch-ua":
                  '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "x-csrf-token": crf,
                "x-requested-with": "XMLHttpRequest",
              },
              proxy: proxyauth,
            });

            if (SendverifySmsHub.respon.message === "Verification code sent!") {
              log(
                SendverifySmsHub.respon.message +
                  " " +
                  number +
                  " With Sms Hub",
                "warning"
              );

              let count = 0;
              do {
                otpCode = await sms.getCode(id);
                // console.log(otpCode);
                if (count === 60) {
                  await sms.setStatus(id, 8);
                }
                await delay(1000);
                count++;
                // console.log(otpCode);
              } while (otpCode === "STATUS_WAIT_CODE");
              if (otpCode === "STATUS_CANCEL") {
                log("Cancel Phone Number", "error");
                otpCode === "STATUS_CANCEL";
              } else {
                otp = otpCode;
                log("SMS OTP : " + otp, "success");
                const VerifyOtpHub = await curl({
                  endpoint: "https://www.vidio.com/dashboard/setting/phone",
                  data: new URLSearchParams({
                    "user[phone_confirmation_code]": otp,
                  }),
                  header: {
                    accept:
                      "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type":
                      "application/x-www-form-urlencoded; charset=UTF-8",
                    cookie: cookie,
                    origin: "https://www.vidio.com",
                    priority: "u=1, i",
                    referer: "https://www.vidio.com/dashboard/setting",
                    "sec-ch-ua":
                      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    "x-csrf-token": crf,
                    "x-requested-with": "XMLHttpRequest",
                  },
                  proxy: proxyauth,
                  method: "PATCH",
                });
                if (VerifyOtpHub.respon.verified) {
                  log(
                    `success switch number with account [ ${email} ] => [ ${Phone} ] => [ ${number} ]` +
                      " With Sms Hub",
                    "success"
                  );

                  otpCode === "SUKSES";
                  const Generatenew =
                    faker.person.lastName() +
                    faker.person.firstName() +
                    faker.person.lastName() +
                    "@gmail.com";
                  log(
                    `create new email step 5 [ ${Generatenew} ] with phone [ ${Phone} ] `,
                    "success"
                  );
                  emailnew = Generatenew.replace(/[^a-zA-Z0-9@.]/g, "");
                  visitornew = uuidv4().toLocaleUpperCase();
                  Registernew = await curl({
                    endpoint: "https://api.vidio.com/api/register",
                    data: new URLSearchParams({
                      email: emailnew,
                      password: password,
                    }),
                    header: headers(visitornew, null),
                    proxy: proxyauth,
                  });
                  if (
                    JSON.stringify(Registernew.respon).includes("access_token")
                  ) {
                    log("Token Successfuly Create..", "warning");
                    log(
                      `\nAccount :\n      - Email : ${Registernew.respon.auth.email}\n      - Status : ${Registernew.respon.auth.active}\n      - Password : ${password}\n`,
                      "warning"
                    );
                    fs.appendFileSync(
                      "accountregister.txt",
                      `${emailnew}|${password}\n`
                    );
                  } else {
                    log("Token Not Successfuly Create..", "error");
                    otpCode = "STATUS_CANCEL";
                  }
                } else {
                  log(
                    VerifyOtpHub.respon.message +
                      " " +
                      number +
                      " With Sms Hub",
                    "error"
                  );
                  otpCode = "STATUS_CANCEL";
                }
              }
            } else {
              log(
                SendverifySmsHub.respon.message +
                  " " +
                  number +
                  " With Sms Hub",
                "error"
              );
            }
            log(`delay 10 sec to try get new number request`, "warning");
            await sleep(10000);
          } while (otpCode === "STATUS_CANCEL");
          const browsers = await puppeteer.launch({
            ignoreDefaultArgs: ["--enable-automation"],
            userDataDir: "rand",
            headless: false,
            devtools: true,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-notifications",
              "--disable-features=site-per-process",
              "--disable-dev-shm-usage",
            ],
          });

          // Listener untuk menangkap semua request

          const pages = await browsers.newPage();

          pages.on("console", (msg) => {});
          let authorizationFounds = false; // Variabel kontrol untuk menghentikan pemeriksaan
          let cookies;
          let crfs;
          // Aktifkan intercept request untuk memfilter berdasarkan URL
          await pages.setRequestInterception(true);

          pages.on("request", (request) => {
            const url = request.url();

            if (authorizationFounds) {
              request.continue(); // Lanjutkan permintaan jika header sudah ditemukan
              return;
            }

            // Periksa apakah URL sesuai dengan target
            if (url === "https://www.vidio.com/dashboard/setting") {
              const headers = request.headers();
              if (headers["cookie"]) {
                cookies = headers["cookie"];
                crfs = headers["x-csrf-token"];
                authorizationFounds = true; // Tandai bahwa header telah ditemukan
              }
            }

            request.continue(); // Lanjutkan permintaan lainnya
          });
          log("Navigated to the website.", "success");
          await pages.goto("https://www.vidio.com/users/login");
          await pages.waitForSelector('input[id="user_login"]', {
            visible: true,
          });
          await pages.type('input[id="user_login"]', emailnew, { delay: 20 });
          await delay(1000);
          await pages.waitForSelector('input[id="user_password"]', {
            visible: true,
          });
          await pages.type('input[id="user_password"]', password, {
            delay: 20,
          });
          await delay(1000);
          await pages.waitForSelector(
            'input[id="onboarding-login-form-submit"]',
            {
              visible: true,
            }
          );
          await pages.click('input[id="onboarding-login-form-submit"]');
          await delay(1000);
          await pages.waitForSelector('a[aria-label="User"]', {
            visible: true,
          });
          await pages.goto("https://www.vidio.com/dashboard/setting");
          const Sendverifynew = await curl({
            endpoint: "https://www.vidio.com/dashboard/setting/phone",
            data: new URLSearchParams({
              "user[phone]": filterNumber(Phone),
            }),
            header: {
              accept:
                "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9",
              "content-type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              cookie: cookies,
              origin: "https://www.vidio.com",
              priority: "u=1, i",
              referer: "https://www.vidio.com/dashboard/setting",
              "sec-ch-ua":
                '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
              "x-csrf-token": crfs,
              "x-requested-with": "XMLHttpRequest",
            },
            proxy: proxyauth,
          });

          if (Sendverifynew.respon.message === "Verification code sent!") {
            await browsers.close();
            await delay(2000);
            await fs.rmdirSync("rand", { recursive: true, force: true });
            log(Sendverifynew.respon.message, "success");
            const OtpInputnew = await inquirer
              .prompt([
                {
                  type: "input",
                  name: "name",
                  message: "Input otp ? ",
                },
              ])
              .then((answers) => {
                return answers.name;
              });
            const VerifyOtpnew = await curl({
              endpoint: "https://www.vidio.com/dashboard/setting/phone",
              data: new URLSearchParams({
                "user[phone_confirmation_code]": OtpInputnew,
              }),
              header: {
                accept:
                  "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                cookie: cookies,
                origin: "https://www.vidio.com",
                priority: "u=1, i",
                referer: "https://www.vidio.com/dashboard/setting",
                "sec-ch-ua":
                  '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "x-csrf-token": crfs,
                "x-requested-with": "XMLHttpRequest",
              },
              proxy: proxyauth,
              method: "PATCH",
            });
            if (VerifyOtpnew.respon.verified) {
              log(
                ` Verified status ${VerifyOtp.respon.verified} ${Phone} register success`,
                "success"
              );
              const claimBUndle = await curl({
                endpoint: "https://api.vidio.com/telco/bundle/claim",
                data: JSON.stringify({
                  data: {
                    type: "telco_bundle_claim",
                    attributes: {
                      msisdn: "0" + filterNumber(Phone),
                      operator: "axis",
                    },
                  },
                }),
                header: {
                  accept: "*/*",
                  "accept-language": "id",
                  "content-type": "application/vnd.api+json",
                  cookie:
                    "ahoy_visitor=461df5fb-ea48-47e9-84fb-fa9f644c393e; country_id=ID; _vidio_session=WVF5a2JYZ2hCQUZScGdRT0hJL1pJYS8zcENjRWp5c2syWWs2aUwzenZTcThmSVE5Zmk3aVM3OFU5SHorUnpxT3FVNzhVVGNLZkdCREdOcVBZL2R5ckE0clA5ZDkzaXVtUnI0bUZFV0NUNHF3R2VLSGpYTlQrUG15NDBkK2dNTlluRTN1SmFCeE5WUm1MenlrM1hGNkhBU2JBd1VBNGxQcThwZnFMT05jd082OXJDZ2cxNWhVTUo5MTY3VlBkVGU3Qkp3ZmJiYzNENGtwdkVFNU9hT1hKZXB5N0R0S0NBVm43eTZ4QytRRFJYVklmd2dKZ3pJcXFWMGE5VU0zVTc0NWhsU3AzREFyTHNqZ2xKbE1rUVNaaWcrREsvYTZPejZPdzhJYzFzYVh2U1JtWmx0U2IxWE5KU1JoU2FZdUdGQ3BRWEdheWR2YnAvc004S1NDd0hXcllZMGQ2Ui9KQlBQdzlvRW43Y2kvZml3PS0tUFpPenBvNGpzbzUrZnBBZFk3L1lkZz09--012b883383c8d932f6157c6ee69eedfc7c260768; _gcl_au=1.1.590937953.1734117975; _gid=GA1.2.996334334.1734117978; cebs=1; afUserId=03b59be1-68b2-456d-8a77-eb5f934e7fc4-p; AF_SYNC=1734117979829; _ce.clock_data=-1075%2C180.253.68.232%2C1%2Cf51bb482c660d0eeadd1f058058a2b35%2CChrome%2CID; moe_uuid=b9331855-aaba-4173-a07e-ccfbbff62e56; USER_DATA=%7B%22attributes%22%3A%5B%5D%2C%22subscribedToOldSdk%22%3Afalse%2C%22deviceUuid%22%3A%22b9331855-aaba-4173-a07e-ccfbbff62e56%22%2C%22deviceAdded%22%3Atrue%7D; _ga_JBTBSESXVN=GS1.1.1734147956.2.0.1734147956.60.0.0; _ga=GA1.2.2106467955.1734117978; _tt_enable_cookie=1; _ttp=6-SEIVetBeTtM0Q-f63cK3pRPel.tt.1; cebsp_=2; SESSION=%7B%22sessionKey%22%3A%227e27aad5-6596-4836-9027-4ee113fbdb55%22%2C%22sessionStartTime%22%3A%222024-12-14T03%3A46%3A02.899Z%22%2C%22sessionMaxTime%22%3A1800%2C%22customIdentifiersToTrack%22%3A%5B%5D%2C%22sessionExpiryTime%22%3A1734149763141%2C%22numberOfSessions%22%3A3%2C%22currentSource%22%3A%7B%22source_url%22%3A%22https%3A%2F%2Fm.vidio.com%2Ftelcos%2Fxl%2Fclaim%2F%3Futm_source%3Dsmsaxis%22%2C%22source%22%3A%22smsaxis%22%7D%7D; _ce.s=v~46f6867c2f88c1ce7b6b8c7fbc56fefc4fb8d8d4~lcw~1734147970847~vir~new~lva~1734117979507~vpv~0~v11.fhb~1734117979896~v11.lhb~1734147958421~v11.cs~265059~v11.s~ee0194d0-b9cd-11ef-9db1-5f898334ebdb~v11.sla~1734147970919~gtrk.la~m4nmxdy7~lcw~1734147970919",
                  origin: "https://m.vidio.com",
                  priority: "u=1, i",
                  referer: "https://m.vidio.com/",
                  "sec-ch-ua":
                    '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"Windows"',
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                  "x-api-key":
                    "CH1ZFsN4N/MIfAds1DL9mP151CNqIpWHqZGRr+LkvUyiq3FRPuP1Kt6aK+pG3nEC1FXt0ZAAJ5FKP8QU8CZ5/qAyjFei4IQV5bnLLvdI/nQPkNPNLdL3zfrDc9dhlAd+Jjf7BtbRDZmc5x30O4ZrDXQ/f2PC22FLX5Mr/QgYDeU=",
                  "x-api-platform": "web-mobile",
                  "x-secure-level": "2",
                },
                proxy: proxyauth,
              });
              console.log(JSON.stringify(claimBUndle.respon));
              let otpCodenew;
              let datanew;
              let otpnew;
              do {
                try {
                  const smsnew = new SMSActivate(apikey, "smshub");
                  const balancenew = await smsnew.getBalance();
                  log(`Saldo SMSHUB ${balancenew} руб`, "warning");
                  try {
                    do {
                      datanew = await smsnew.getNumber("fv", 6, "telkomsel");
                      // console.log(data);
                    } while (datanew === null);
                  } catch (err) {
                    log(`Gagal Mendapatkan Nomer ${err}`, "error");
                    await delay(5000);
                    continue;
                  }
                  let { id, number } = datanew;
                  await smsnew.setStatus(id, 1);
                  log(
                    `Try To Switch Number in Account [ ${number} ]`,
                    "warning"
                  );
                  const PhoneNumbernew = filterNumber(number.toString());
                  const SendverifySmsHubnewsu = await curl({
                    endpoint: "https://www.vidio.com/dashboard/setting/phone",
                    data: new URLSearchParams({
                      "user[phone]": PhoneNumbernew,
                    }),
                    header: {
                      accept:
                        "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                      "accept-language": "en-US,en;q=0.9",
                      "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                      cookie: cookies,
                      origin: "https://www.vidio.com",
                      priority: "u=1, i",
                      referer: "https://www.vidio.com/dashboard/setting",
                      "sec-ch-ua":
                        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                      "sec-ch-ua-mobile": "?0",
                      "sec-ch-ua-platform": '"Windows"',
                      "sec-fetch-dest": "empty",
                      "sec-fetch-mode": "cors",
                      "sec-fetch-site": "same-origin",
                      "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                      "x-csrf-token": crfs,
                      "x-requested-with": "XMLHttpRequest",
                    },
                    proxy: proxyauth,
                  });

                  if (
                    SendverifySmsHubnewsu.respon.message ===
                    "Verification code sent!"
                  ) {
                    log(
                      ` ${SendverifySmsHubnewsu.respon.message} With Sms Hub`,
                      "success"
                    );

                    let count = 0;
                    do {
                      otpCodenew = await smsnew.getCode(id);
                      // console.log(otpCode);
                      if (count === 60) {
                        await smsnew.setStatus(id, 8);
                      }
                      await delay(1000);
                      count++;
                      // console.log(otpCode);
                    } while (otpCodenew === "STATUS_WAIT_CODE");
                    if (otpCodenew === "STATUS_CANCEL") {
                      log("Cancel Phone Number", "error");
                      otpCode === "STATUS_CANCEL";
                    } else {
                      otpnew = otpCodenew;
                      log("SMS OTP : " + otpnew, "success");
                    }
                    const VerifyOtpHubnewsu = await curl({
                      endpoint: "https://www.vidio.com/dashboard/setting/phone",
                      data: new URLSearchParams({
                        "user[phone_confirmation_code]": otpnew,
                      }),
                      header: {
                        accept:
                          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type":
                          "application/x-www-form-urlencoded; charset=UTF-8",
                        cookie: cookies,
                        origin: "https://www.vidio.com",
                        priority: "u=1, i",
                        referer: "https://www.vidio.com/dashboard/setting",
                        "sec-ch-ua":
                          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "user-agent":
                          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                        "x-csrf-token": crfs,
                        "x-requested-with": "XMLHttpRequest",
                      },
                      proxy: proxyauth,
                      method: "PATCH",
                    });
                    if (VerifyOtpHubnewsu.respon.verified) {
                      log(
                        ` Verified status ${VerifyOtp.respon.verified} ${Phone} register success`,
                        "success"
                      );

                      otpCode === "SUKSES";
                    }
                  }
                } catch (error) {
                  otpCode === "STATUS_CANCEL";
                }
              } while (otpCode === "STATUS_CANCEL");
            } else {
              log(VerifyOtpnew.respon.message, "error");
            }
          } else {
            log(Sendverifynew.respon.message, "error");
          }
        } else {
          log(VerifyOtp.respon.message, "error");
        }
      } else {
        log(Sendverify.respon.message, "error");
      }
    } else {
      log("Token Not Successfuly Create..", "error");
    }
    const validasisubcription = await curl({
      endpoint: "https://api.vidio.com/api/users/subscriptions",
      data: null,
      header: headers(
        visitor,
        Register.respon.access_token,
        Register.respon.auth.email,
        Register.respon.auth.authentication_token
      ),
      proxy: proxyauth,
    });
    console.log(validasisubcription.respon);
    const count = validasisubcription.respon.subscriptions;
    if (count.lenght > 0) {
      fs.appendFileSync(
        "dataaccountpremi.txt",
        `${Register.respon.auth.email}|${password}\n`
      );
    } else {
      fs.appendFileSync(
        "dataaccountnopremi.txt",
        `${Register.respon.auth.email}|${password}\n`
      );
    }
    const validasisubcriptionnew = await curl({
      endpoint: "https://api.vidio.com/api/users/subscriptions",
      data: null,
      header: headers(
        visitornew,
        Registernew.respon.access_token,
        Registernew.respon.auth.email,
        Registernew.respon.auth.authentication_token
      ),
      proxy: proxyauth,
    });
    console.log(validasisubcriptionnew.respon);

    const counts = validasisubcriptionnew.respon.subscriptions;
    if (counts.lenght > 0) {
      fs.appendFileSync(
        "dataaccountpremi.txt",
        `${Registernew.respon.auth.email}|${password}\n`
      );
    } else {
      fs.appendFileSync(
        "dataaccountnopremi.txt",
        `${Registernew.respon.auth.email}|${password}\n`
      );
    }
    console.log("");
  }
})();
