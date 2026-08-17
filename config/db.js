const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

async function main() {
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@clusteruc13.pka3ctj.mongodb.net/DB_Integrador_Money?appName=ClusterUC13`,
  );
  console.log("Conectou ao banco de dados!!!");
}

main().catch((err) => console.log(err));
module.exports = main;
