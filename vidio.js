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
const apikey = "133313U58ce9b44c6cddb569b43745641782f36";

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
    let authorizationFounds = false; // Variabel kontrol untuk menghentikan pemeriksaan
    let cookies;
    let crfs;
    let OtpInputnew;
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
      await browser.close();
      await delay(2000);
      await fs.rmdirSync("rand", { recursive: true, force: true });
      let status;
      let Sendverify;
      let OtpInput;
      let VerifyOtp;
      do {
        Sendverify = await curl({
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
          log(Sendverify.respon.message, "success");
          OtpInput = await inquirer
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
          VerifyOtp = await curl({
            endpoint: "https://www.vidio.com/dashboard/setting/phone",
            data: new URLSearchParams({
              "user[phone_confirmation_code]": OtpInput,
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

          // console.log(VerifyOtp.respon);
          if (VerifyOtp.respon.verified) {
            log(
              ` Verified status ${VerifyOtp.respon.verified} ${Phone} register success`,
              "success"
            );
          } else {
            log(VerifyOtp.respon.message, "error");
          }
        } else {
          log(Sendverify.respon.message, "error");
        }
      } while (!VerifyOtp.respon.verified);

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
      let maxretry = 0;
      let VerifyOtpHub;
      do {
        try {
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
            otpCode = "STATUS_CANCEL";
            maxretry++;
          }
          let { id, number } = data;
          await sms.setStatus(id, 1);
          log(`Try To Switch Number in Account [ ${number} ]`, "warning");
          const PhoneNumber = filterNumber(number.toString());
          const SendverifySmsHub = await curl({
            endpoint: "https://www.vidio.com/dashboard/setting/phone",
            data: new URLSearchParams({
              "user[phone]": PhoneNumber,
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
              SendverifySmsHub.respon.message + " " + number + " With Sms Hub",
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
              otpCode = "STATUS_CANCEL";
              maxretry++;
            } else {
              otp = otpCode;
              log("SMS OTP : " + otp, "success");
              VerifyOtpHub = await curl({
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
              console.log(VerifyOtpHub);
              if (VerifyOtpHub.respon.verified) {
                log(
                  `success switch number with account [ ${email} ] => [ ${Phone} ] => [ ${number} ]` +
                    " With Sms Hub",
                  "success"
                );

                otpCode = "SUKSES";
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
                  maxretry++;
                }
              } else {
                log(
                  VerifyOtpHub.respon.message + " " + number + " With Sms Hub",
                  "error"
                );
                otpCode = "STATUS_CANCEL";
                maxretry++;
              }
            }
          } else {
            log(
              SendverifySmsHub.respon.message + " " + number + " With Sms Hub",
              "error"
            );
            otpCode = "STATUS_CANCEL";
            maxretry++;
          }
          log(`delay 10 sec to try get new number request`, "warning");
        } catch (error) {
          otpCode = "STATUS_CANCEL";
          maxretry++;
        }
        await sleep(2000);
      } while (otpCode === "STATUS_CANCEL" || maxretry <= 3);
      if (maxretry >= 3) {
        log(`max limit retry get otp skip account`, "error");
        continue;
      }
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
      await pages.waitForSelector('input[id="onboarding-login-form-submit"]', {
        visible: true,
      });
      await pages.click('input[id="onboarding-login-form-submit"]');
      await delay(1000);
      await pages.waitForSelector('a[aria-label="User"]', {
        visible: true,
      });
      await pages.goto("https://www.vidio.com/dashboard/setting");
      await browsers.close();
      await delay(2000);
      await fs.rmdirSync("rand", { recursive: true, force: true });
      let VerifyOtpnew;
      let Sendverifynew;
      do {
        Sendverifynew = await curl({
          endpoint: "https://www.vidio.com/dashboard/setting/phone",
          data: new URLSearchParams({
            "user[phone]": filterNumber(Phone),
          }),
          header: {
            accept:
              "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
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
          log(Sendverifynew.respon.message, "success");
          OtpInputnew = await inquirer
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
          VerifyOtpnew = await curl({
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
          } else {
            log(VerifyOtpnew.respon.message, "error");
          }
        } else {
          log(Sendverifynew.respon.message, "error");
        }
      } while (VerifyOtpnew.respon.verified === false);

      let authorizationFoundss = false; // Variabel kontrol untuk menghentikan pemeriksaan
      let cookiess;
      let crfss;

      const browsersx = await puppeteer.launch({
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

      const pagesx = await browsersx.newPage();

      pagesx.on("console", (msg) => {});

      // Aktifkan intercept request untuk memfilter berdasarkan URL
      await pagesx.setRequestInterception(true);

      pagesx.on("request", (request) => {
        const url = request.url();

        if (authorizationFoundss) {
          request.continue(); // Lanjutkan permintaan jika header sudah ditemukan
          return;
        }

        // Periksa apakah URL sesuai dengan target
        if (url === "https://api.vidio.com/telco/bundle/claim") {
          const headers = request.headers();
          if (headers["cookie"]) {
            cookiess = headers["cookie"];
            crfss = headers["x-api-key"];
            authorizationFoundss = true; // Tandai bahwa header telah ditemukan
          }
        }

        request.continue(); // Lanjutkan permintaan lainnya
      });
      await pagesx.goto(
        "https://m.vidio.com/telcos/xl/claim/?utm_source=smsaxis"
      );
      await pagesx.waitForSelector('input[type="tel"]');
      await pagesx.type('input[type="tel"]', "0" + filterNumber(Phone));
      await pagesx.waitForSelector('button[type="button"]');
      await pagesx.click('button[type="button"]');
      await pagesx.waitForSelector(
        'p[class="telcos-xl-claim-module_modal_description__TAWqr"]'
      );
      await delay(1000);

      // await pagesx.reload();
      await browsersx.close();
      await delay(2000);
      await fs.rmdirSync("rand", { recursive: true, force: true });
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
          log(`Try To Switch Number in Account [ ${number} ]`, "warning");
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
            SendverifySmsHubnewsu.respon.message === "Verification code sent!"
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
              otpCode = "STATUS_CANCEL";
            } else {
              otpnew = otpCodenew;
              log("SMS OTP : " + otpnew, "success");
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

                otpCodenew = "SUKSES";
              } else {
                otpCodenew = "STATUS_CANCEL";
              }
            }
          } else {
            otpCodenew = "STATUS_CANCEL";
          }
        } catch (error) {
          otpCodenew = "STATUS_CANCEL";
        }
      } while (otpCodenew === "STATUS_CANCEL");
    } else {
      log("Token Not Successfuly Create..", "error");
    }
    try {
      const loginVerrified = await curl({
        endpoint: "https://api.vidio.com/api/login",
        data: new URLSearchParams({
          login: email,
          password: password,
        }),
        header: headers(visitor, null),
        proxy: proxyauth,
      });
      const validasisubcription = await curl({
        endpoint: "https://api.vidio.com/api/users/subscriptions",
        data: null,
        header: headers(
          visitor,
          loginVerrified.respon.auth_tokens.access_token,
          loginVerrified.respon.auth.email,
          loginVerrified.respon.auth.authentication_token
        ),
        proxy: proxyauth,
      });
      console.log(validasisubcription.respon);
      const count = validasisubcription.respon.subscriptions;
      if (count.length > 0) {
        log(
          `Checking validate ${email} => ${validasisubcription.respon.subscriptions[0].package.name} =>  ${validasisubcription.respon.subscriptions[0].package.description} => ${validasisubcription.respon.subscriptions[0].end_at}`,
          "success"
        );
        fs.appendFileSync(
          "dataaccountpremi.txt",
          `${loginVerrified.respon.auth.email}|${password}\n`
        );
      } else {
        log(`Checking validate ${email} => not found subcription`, "error");
      }
      const loginVerrifiednew = await curl({
        endpoint: "https://api.vidio.com/api/login",
        data: new URLSearchParams({
          login: emailnew,
          password: password,
        }),
        header: headers(visitor, null),
        proxy: proxyauth,
      });
      const validasisubcriptionnew = await curl({
        endpoint: "https://api.vidio.com/api/users/subscriptions",
        data: null,
        header: headers(
          visitornew,
          loginVerrifiednew.responauth_tokens.access_token,
          loginVerrifiednew.respon.auth.email,
          loginVerrifiednew.respon.auth.authentication_token
        ),
        proxy: proxyauth,
      });
      console.log(validasisubcriptionnew.respon);

      const counts = validasisubcriptionnew.respon.subscriptions;
      if (counts.length > 0) {
        log(
          `Checking validate ${email} => ${validasisubcriptionnew.respon.subscriptions[0].package.name} =>  ${validasisubcriptionnew.respon.subscriptions[0].package.description} => ${validasisubcriptionnew.respon.subscriptions[0].end_at}`,
          "success"
        );
        fs.appendFileSync(
          "dataaccountpremi.txt",
          `${loginVerrifiednew.respon.auth.email}|${password}\n`
        );
      } else {
        log(`Checking validate ${email} => not found subcription`, "error");
      }
    } catch (error) {}
    console.log("");
  }
})();
