import fetch from "node-fetch";

class OTP {
  constructor(apikey) {
    this.apikey = apikey;
  }
  async Request() {
    const request = fetch(
      `https://otpku.com/api/json.php?api_key=${this.apikey}&action=services&country=indo`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async GetServis() {
    const request = fetch(
      `https://adaotp.com/api/get-services/${this.apikey}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async GetNumber(id) {
    const request = fetch(
      `https://adaotp.com/api/set-orders/${this.apikey}/${id}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async GetNumbeMulti(id) {
    const request = fetch(
      `https://adaotp.com/api/set-orders-multiservices/${this.apikey}/${id}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async GetCancel(OrderId) {
    const request = fetch(
      `https://adaotp.com/api/cancle-orders/${this.apikey}/${OrderId}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async GetMessage(OrderId) {
    const request = fetch(
      `https://adaotp.com/api/get-orders/${this.apikey}/${OrderId}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    return request;
  }
  async profile() {
    const request = fetch(`https://adaotp.com/api/profile/${this.apikey}`, {
      method: "GET",
    }).then((res) => res.json());
    return request;
  }
}
export { OTP };
