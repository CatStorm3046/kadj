"use strict";
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const fs = require("fs");
const needle = require("needle");
let { PythonShell } = require("python-shell");

// async function getProxy() {
// let res = await needle("get", url);
// let data = res.body.data;
// save data to proxies.txt
// fs.writeFileSync("proxies.txt", JSON.stringify(data));
// data[0].ip + ":" + data[0].port

// let data = response.data;
// let proxy = data.data[0].ip + ":" + data.data[0].port;
// console.log(proxy);
// return proxy;
// }

// getProxy()

async function getUserData(username) {
  try {
    PythonShell.runString(
      `
from instagrapi import Client
import json

cl = Client(delay_range=[1, 3], request_timeout=10)
cl.set_user_agent("Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36")
info = cl.user_info_by_username('${username}')
data = {
"name": info.full_name,
"username": info.username,
"biography": info.biography,
"avatar": info.profile_pic_url_hd,
"isPrivate": info.is_private,
"postsCount": info.media_count,
"followingCount": info.following_count,
"followedByCount": info.follower_count,
}

with open("./data.json", "w") as outfile:
  json.dump(data, outfile)
`,
      undefined
    );
  } catch (err) {
    console.log(err);
  }

  while (!fs.existsSync("data.json")) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  let rawdata = fs.readFileSync("data.json");
  let data = JSON.parse(rawdata);

  fs.unlinkSync("data.json");

  return data;
}

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
  });
  server.route({
    method: "POST",
    path: "/{username}",
    handler: async (request, h) => {
      // if (request.params.username == "favicon.ico")
      //   return h.response().code(404);
      return await getUserData(request.params.username);
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
