import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import readline from "readline-sync";
import { SMSActivate } from "./lib/index.js";
import * as TURBO from "./lib/turbo.js";
import chalk from "chalk";
import delay from "delay";
import { HttpsProxyAgent } from "https-proxy-agent";
import { faker } from "@faker-js/faker";
import fs from "fs-extra";
import sleep from "delay";

const apikey = "127466U8b45261445a29df68e9d5208dfd0b6dc";
const apikeyTurbo = "1e5a97228ed35aacb289f0e938b89347";

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
function log(respon, jam = true) {
  if (jam) {
    var jamku = `[ ${chalk.blue(
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    )} ]  =>`;
  } else {
    var jamku = "";
  }
  return process.stdout.write(`${jamku} ${respon}`);
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
(async () => {
  while (true) {
    const Phone = readline.question(
      chalk.yellowBright(`[ ???? ] `) +
        "Input Number Not Include ( 62 or 0 ) : "
    );
    const password = readline.question(
      chalk.yellowBright(`[ ???? ] `) + "Input Password : "
    );
    const Generate =
      faker.person.lastName() +
      faker.person.firstName() +
      faker.person.lastName() +
      "@gmail.com";

    const email = Generate;

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
        console.log(error);
        console.log(
          chalk.yellowBright(`[ INFO ] `) + chalk.greenBright("Proxy Not Found")
        );
      }
    } while (!dataip);
    console.log(
      chalk.yellowBright(`[ INFO ] `) +
        chalk.greenBright("Data Proxy : " + dataip.respon.ip)
    );
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
      console.log(
        chalk.yellowBright(`[ INFO ] `) + "Token Successfuly Create.."
      );
      console.log(
        chalk.yellowBright(`[ INFO ] `) +
          `Account :\n      - Email : ${Register.respon.auth.email}\n      - Status : ${Register.respon.auth.active}\n      - Password : ${password}\n`
      );
      fs.appendFileSync("accountregister.txt", `${email}|${password}\n`);

      const Sendverify = await curl({
        endpoint:
          "https://api.vidio.com/api/profile/phone/send_verification_code",
        data: JSON.stringify({ phone: Phone }),
        header: headers(
          visitor,
          Register.respon.auth.authentication_token,
          Register.respon.auth.email
        ),
        proxy: proxyauth,
      });
      //   console.log(Sendverify);
      if (Sendverify.respon.message === "Kode verifikasi terkirim!") {
        console.log(
          chalk.yellowBright(`[ INFO ] `) + Sendverify.respon.message
        );
        const OtpInput = readline.question(
          chalk.yellowBright(`[ ???? ] `) + "Input Otp : "
        );
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
          console.log(
            chalk.yellowBright(`[ INFO ] `) + VerifyOtp.respon.message
          );

          let otpCode;
          let data;
          let otp;
          do {
            const sms = new SMSActivate(apikey, "smshub");
            const balance = await sms.getBalance();
            console.log(
              chalk.yellowBright(`[ INFO ] `) + `Saldo SMSHUB ${balance} руб`
            );

            try {
              do {
                data = await sms.getNumber("fv", 6, "telkomsel");
                // console.log(data);
              } while (data === null);
            } catch (err) {
              console.log(
                chalk.yellowBright(`[ INFO ] `) +
                  `Gagal Mendapatkan Nomer ${err}`
              );
              await delay(5000);
              continue;
            }
            let { id, number } = data;
            await sms.setStatus(id, 1);
            console.log(
              chalk.yellowBright(`[ INFO ] `) +
                `Try To Create With Number [ ${number} ]`
            );
            const PhoneNumber = number.toString().split("628")[1];
            const SendverifySmsHub = await curl({
              endpoint:
                "https://api.vidio.com/api/profile/phone/send_verification_code",
              data: JSON.stringify({ phone: "8" + PhoneNumber }),
              header: headers(
                visitor,
                Register.respon.auth.authentication_token,
                Register.respon.auth.email
              ),
              proxy: proxyauth,
            });
            console.log(SendverifySmsHub);
            if (
              SendverifySmsHub.respon.message === "Kode verifikasi terkirim!"
            ) {
              console.log(
                chalk.yellowBright(`[ INFO ] `) +
                  SendverifySmsHub.respon.message,
                "With Sms Hub"
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
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + "Cancel Phone Number"
                );
                continue;
              } else {
                otp = otpCode;
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + ("SMS OTP : " + otp)
                );
              }
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
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + VerifyOtpHub.respon.message,
                  "With Sms Hub"
                );
                otpCode === "SUKSES";
                const Generatenew =
                  faker.person.lastName() +
                  faker.person.firstName() +
                  faker.person.lastName() +
                  "@gmail.com";

                const emailnew = Generatenew;
                const visitornew = uuidv4().toLocaleUpperCase();
                const Registernew = await curl({
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
                  console.log(
                    chalk.yellowBright(`[ INFO ] `) +
                      "Token Successfuly Create.."
                  );
                  console.log(
                    chalk.yellowBright(`[ INFO ] `) +
                      `Account :\n      - Email : ${Registernew.respon.auth.email}\n      - Status : ${Registernew.respon.auth.active}\n      - Password : ${password}\n`
                  );
                  fs.appendFileSync(
                    "accountregister.txt",
                    `${emailnew}|${password}\n`
                  );

                  const Sendverifynew = await curl({
                    endpoint:
                      "https://api.vidio.com/api/profile/phone/send_verification_code",
                    data: JSON.stringify({ phone: Phone }),
                    header: headers(
                      visitornew,
                      Registernew.respon.auth.authentication_token,
                      Registernew.respon.auth.email
                    ),
                    proxy: proxyauth,
                  });
                  // console.log(Sendverify);
                  if (
                    Sendverifynew.respon.message === "Kode verifikasi terkirim!"
                  ) {
                    console.log(
                      chalk.yellowBright(`[ INFO ] `) +
                        Sendverifynew.respon.message
                    );
                    const OtpInputnew = readline.question(
                      chalk.yellowBright(`[ ???? ] `) + "Input Otp : "
                    );
                    const VerifyOtpnew = await curl({
                      endpoint:
                        "https://api.vidio.com/api/profile/phone/verify",
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
                      VerifyOtpnew.respon.message ===
                      "Yay, nomor HP terverifikasi!"
                    ) {
                      console.log(
                        chalk.yellowBright(`[ INFO ] `) +
                          VerifyOtpnew.respon.message
                      );
                      const claimBUndle = await curl({
                        endpoint: "https://api.vidio.com/telco/bundle/claim",
                        data: JSON.stringify({
                          data: {
                            type: "telco_bundle_claim",
                            attributes: {
                              msisdn: "0" + Phone,
                              operator: "telkomsel",
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
                      console.log(claimBUndle);
                      let otpCodenew;
                      let datanew;
                      let otpnew;
                      do {
                        const smsnew = new SMSActivate(apikey, "smshub");
                        const balancenew = await smsnew.getBalance();
                        console.log(
                          chalk.yellowBright(`[ INFO ] `) +
                            `Saldo SMSHUB ${balancenew} руб`
                        );

                        try {
                          do {
                            datanew = await smsnew.getNumber(
                              "fv",
                              6,
                              "telkomsel"
                            );
                            // console.log(data);
                          } while (datanew === null);
                        } catch (err) {
                          console.log(
                            chalk.yellowBright(`[ INFO ] `) +
                              `Gagal Mendapatkan Nomer ${err}`
                          );
                          await delay(5000);
                          continue;
                        }
                        let { id, number } = datanew;
                        await sms.setStatus(id, 1);
                        console.log(
                          chalk.yellowBright(`[ INFO ] `) +
                            `Try To Create With Number [ ${number} ]`
                        );
                        const PhoneNumbernew = number
                          .toString()
                          .split("628")[1];
                        const SendverifySmsHubnewsu = await curl({
                          endpoint:
                            "https://api.vidio.com/api/profile/phone/send_verification_code",
                          data: JSON.stringify({
                            phone: "8" + PhoneNumbernew,
                          }),
                          header: headers(
                            visitornew,
                            Registernew.respon.auth.authentication_token,
                            Registernew.respon.auth.email
                          ),
                          proxy: proxyauth,
                        });
                        console.log(SendverifySmsHubnewsu);
                        if (
                          SendverifySmsHubnewsu.respon.message ===
                          "Kode verifikasi terkirim!"
                        ) {
                          console.log(
                            chalk.yellowBright(`[ INFO ] `) +
                              SendverifySmsHubnewsu.respon.message,
                            "With Sms Hub"
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
                            console.log(
                              chalk.yellowBright(`[ INFO ] `) +
                                "Cancel Phone Number"
                            );
                            continue;
                          } else {
                            otpnew = otpCodenew;
                            console.log(
                              chalk.yellowBright(`[ INFO ] `) +
                                ("SMS OTP : " + otpnew)
                            );
                          }
                          const VerifyOtpHubnewsu = await curl({
                            endpoint:
                              "https://api.vidio.com/api/profile/phone/verify",
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
                            console.log(
                              chalk.yellowBright(`[ INFO ] `) +
                                VerifyOtpHubnewsu.respon.message,
                              "With Sms Hub"
                            );
                            otpCode === "SUKSES";
                          }
                        }
                      } while (otpCode === "STATUS_CANCEL");
                    } else {
                    }
                  } else {
                  }
                } else {
                }
              } else {
                console.log(
                  chalk.redBright(`[ INFO ] `) + VerifyOtpHub.respon.message,
                  "With Sms Hub"
                );
              }
            } else {
              console.log(
                chalk.redBright(`[ INFO ] `) + SendverifySmsHub.respon.message,
                "With Sms Hub"
              );
            }
          } while (otpCode === "STATUS_CANCEL");
        } else {
          console.log(chalk.redBright(`[ INFO ] `) + VerifyOtp.respon.message);
        }
      } else {
        console.log(chalk.redBright(`[ INFO ] `) + Sendverify.respon.message);
      }
    } else {
      console.log(
        chalk.redBright(`[ INFO ] `) + "Token Not Successfuly Create.."
      );
    }
    console.log("");
  }
})();
