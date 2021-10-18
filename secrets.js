import  dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
}

export const DATABASE = process.env.DATABASE;
export const DB_USER = process.env.DB_USER;
export const PASS = process.env.PASS;
export const HOST = process.env.HOST;

