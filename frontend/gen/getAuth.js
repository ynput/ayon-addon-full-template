import fs from "fs";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

async function getToken() {
  try {
    const response = await fetch("http://localhost:5173/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: process.env.NAME,
        password: process.env.PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const token = `TOKEN=${data.token}`;

    // write to .env file
    fs.writeFileSync("./gen/.env", token);

    // copy token to clipboard
    const platform = process.platform;
    const clipboardCmd =
      platform === "darwin"
        ? `echo "${data.token}" | pbcopy`
        : platform === "win32"
          ? `echo ${data.token} | clip`
          : `echo "${data.token}" | xclip -selection clipboard`;

    exec(clipboardCmd, (err) => {
      if (err) {
        console.error("Failed to copy token to clipboard:", err);
      } else {
        console.log("Token copied to clipboard.");
      }
    });
  } catch (error) {
    console.error("Error getting token", error);
  }
}

getToken();
