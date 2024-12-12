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
const apikey = "";

const curl = ({ endpoint, data, header, proxy }) =>
  new Promise((resolve, reject) => {
    let fetchData = {
      headers: header,
      agent: new HttpsProxyAgent(proxy),
    };
    // console.log(fetchData);
    if (data) {
      fetchData.method = "POST";
      fetchData.body = data;
    } else {
      fetchData.method = "GET";
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
function headers(visitor, token, email) {
  if (!token) {
    return {
      Host: "api.vidio.com",
      "X-VISITOR-ID": visitor,
      "X-API-App-Info": "ios/iOS16.7.5/6.26.0-2105",
      Accept: "*/*",
      "Accept-Language": "id",
      "X-API-Platform": "app-ios",
      "User-Agent": "vidioios/6.26.0 2105",
      Referer: "ios-app://com.kmk.vidio",
      Connection: "keep-alive",
      "X-API-Auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "Content-Type": "application/json",
    };
  } else {
    return {
      Host: "api.vidio.com",
      "X-VISITOR-ID": visitor,
      "X-API-App-Info": "ios/iOS16.7.5/6.26.0-2105",
      Accept: "*/*",
      "X-USER-EMAIL": email,
      "Accept-Language": "id",
      "X-API-Platform": "app-ios",
      "User-Agent": "vidioios/6.26.0 2105",
      Referer: "ios-app://com.kmk.vidio",
      Connection: "keep-alive",
      "X-USER-TOKEN": token,
      "X-API-Auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "Content-Type": "application/json",
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
  let Registernew;
  let visitornew;
  let emailnew;
  while (true) {
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

    const email = Generate;
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
      data: JSON.stringify({
        email: email,
        password: password,
      }),
      header: headers(visitor, null),
      proxy: proxyauth,
    });
    if (JSON.stringify(Register.respon).includes("access_token")) {
      log("Token Successfuly Create..", "success");
      log(
        `\nAccount :\n      - Email : ${Register.respon.auth.email}\n      - Status : ${Register.respon.auth.active}\n      - Password : ${password}\n`,
        "custom"
      );
      fs.appendFileSync("accountregister.txt", `${email}|${password}\n`);

      const Sendverify = await curl({
        endpoint:
          "https://api.vidio.com/api/profile/phone/send_verification_code",
        data: JSON.stringify({ phone: filterNumber(Phone) }),
        header: headers(
          visitor,
          Register.respon.auth.authentication_token,
          Register.respon.auth.email
        ),
        proxy: proxyauth,
      });
      //   console.log(Sendverify);
      if (Sendverify.respon.message === "Kode verifikasi terkirim!") {
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
          endpoint: "https://api.vidio.com/api/profile/phone/verify",
          data: JSON.stringify({ verification_code: OtpInput }),
          header: headers(
            visitor,
            Register.respon.auth.authentication_token,
            Register.respon.auth.email
          ),
          proxy: proxyauth,
        });
        if (VerifyOtp.respon.message === "Yay, nomor HP terverifikasi!") {
          log(
            `${VerifyOtp.respon.message} ${Phone} register success`,
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
              endpoint:
                "https://api.vidio.com/api/profile/phone/send_verification_code",
              data: JSON.stringify({ phone: PhoneNumber }),
              header: headers(
                visitor,
                Register.respon.auth.authentication_token,
                Register.respon.auth.email
              ),
              proxy: proxyauth,
            });

            if (
              SendverifySmsHub.respon.message === "Kode verifikasi terkirim!"
            ) {
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
                  endpoint: "https://api.vidio.com/api/profile/phone/verify",
                  data: JSON.stringify({ verification_code: otpCode }),
                  header: headers(
                    visitor,
                    Register.respon.auth.authentication_token,
                    Register.respon.auth.email
                  ),
                  proxy: proxyauth,
                });
                if (
                  VerifyOtpHub.respon.message === "Yay, nomor HP terverifikasi!"
                ) {
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
                  emailnew = Generatenew;
                  visitornew = uuidv4().toLocaleUpperCase();
                  Registernew = await curl({
                    endpoint: "https://api.vidio.com/api/register",
                    data: JSON.stringify({
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

          const Sendverifynew = await curl({
            endpoint:
              "https://api.vidio.com/api/profile/phone/send_verification_code",
            data: JSON.stringify({ phone: filterNumber(Phone) }),
            header: headers(
              visitornew,
              Registernew.respon.auth.authentication_token,
              Registernew.respon.auth.email
            ),
            proxy: proxyauth,
          });
          // console.log(Sendverify);
          if (Sendverifynew.respon.message === "Kode verifikasi terkirim!") {
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
              endpoint: "https://api.vidio.com/api/profile/phone/verify",
              data: JSON.stringify({
                verification_code: OtpInputnew,
              }),
              header: headers(
                visitornew,
                Registernew.respon.auth.authentication_token,
                Registernew.respon.auth.email
              ),
              proxy: proxyauth,
            });
            if (
              VerifyOtpnew.respon.message === "Yay, nomor HP terverifikasi!"
            ) {
              log(VerifyOtpnew.respon.message, "success");
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
                    "afUserId=52bc9545-b087-45c2-aa82-6fe5ae5d2dbd-p; ahoy_visitor=63103961-7c75-43b9-a1b2-d8b3d0495d0e; _CEFT=Q%3D%3D%3D; USER_DATA=%7B%22attributes%22%3A%5B%5D%2C%22subscribedToOldSdk%22%3Afalse%2C%22deviceUuid%22%3A%22beece86b-adf6-40ce-8b49-05c2b629693e%22%2C%22deviceAdded%22%3Atrue%7D; OPT_IN_SHOWN_TIME=1716447486915; SOFT_ASK_STATUS=%7B%22actualValue%22%3A%22dismissed%22%2C%22MOE_DATA_TYPE%22%3A%22string%22%7D; ahoy_visit=3c954a29-a09e-472f-be0f-08003bd8dc8c; _gid=GA1.2.1696319918.1733901165; _gcl_au=1.1.1609771823.1733901165; _ga_JBTBSESXVN=GS1.1.1733901165.3.0.1733901165.60.0.0; _ga=GA1.1.980845800.1716447482; _tt_enable_cookie=1; _ttp=jnKE66g2ve0bhcZFyPA-UDXSeDt.tt.1; cebs=1; _ce.clock_data=867%2C113.11.183.213%2C1%2Cf51bb482c660d0eeadd1f058058a2b35%2CChrome%2CID; cebsp_=1; AF_SYNC=1733901168563; moe_uuid=beece86b-adf6-40ce-8b49-05c2b629693e; SESSION=%7B%22sessionKey%22%3A%229ec681eb-c7ea-4ba2-b23a-ba13234403a8%22%2C%22sessionStartTime%22%3A%222024-12-11T07%3A12%3A51.962Z%22%2C%22sessionMaxTime%22%3A1800%2C%22customIdentifiersToTrack%22%3A%5B%5D%2C%22sessionExpiryTime%22%3A1733902972201%2C%22numberOfSessions%22%3A4%2C%22currentSource%22%3A%7B%22source_url%22%3A%22https%3A%2F%2Fm.vidio.com%2Ftelcos%2Fxl%2Fclaim%2F%3Futm_source%3Dsmsaxis%22%2C%22source%22%3A%22smsaxis%22%7D%7D; _ce.s=v~57dea64cf6670416c4bcb0d253fa3a35667c0226~lcw~1733901183476~lva~1733901168014~vpv~3~v11.fhb~1733901168303~v11.lhb~1733901168304~vir~new~v11.cs~265059~v11.s~53a3ba20-b78f-11ef-8a35-79f9e0f8bf79~v11.sla~1733901183476~gtrk.la~m4jjzvn8~lcw~1733901183477",
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
                    "CH1ZFsN4N/MIfAds1DL9mP151CNqIpWHqZGRr+LkvUyiq3FRPuP1Kt6aK+pG3nEC1FXt0ZAAJ5FKP8QU8CZ5/uijyOF/nlIaEGjHNo4DiQ5va7b5t6levFC7hSUkZYpSSFspswvt1d2lb91zs/4d8+yhLIkcpGn9zStUWLBSBZM=",
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
                  endpoint:
                    "https://api.vidio.com/api/profile/phone/send_verification_code",
                  data: JSON.stringify({
                    phone: PhoneNumbernew,
                  }),
                  header: headers(
                    visitornew,
                    Registernew.respon.auth.authentication_token,
                    Registernew.respon.auth.email
                  ),
                  proxy: proxyauth,
                });
                if (
                  SendverifySmsHubnewsu.respon.message ===
                  "Kode verifikasi terkirim!"
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
                    continue;
                  } else {
                    otpnew = otpCodenew;
                    log("SMS OTP : " + otpnew, "success");
                  }
                  const VerifyOtpHubnewsu = await curl({
                    endpoint: "https://api.vidio.com/api/profile/phone/verify",
                    data: JSON.stringify({
                      verification_code: otpCode,
                    }),
                    header: headers(
                      visitornew,
                      Registernew.respon.auth.authentication_token,
                      Registernew.respon.auth.email
                    ),
                    proxy: proxyauth,
                  });
                  if (
                    VerifyOtpHubnewsu.respon.message ===
                    "Yay, nomor HP terverifikasi!"
                  ) {
                    log(`${VerifyOtpHubnewsu.respon.message}`, "success");

                    otpCode === "SUKSES";
                  }
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
        Register.respon.auth.authentication_token,
        Register.respon.auth.email
      ),
      proxy: proxyauth,
    });
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
        Registernew.respon.auth.authentication_token,
        Registernew.respon.auth.email
      ),
      proxy: proxyauth,
    });
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
