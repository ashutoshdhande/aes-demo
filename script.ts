import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { createUser, updateUser, viewUser } from "./dbOps";

async function main() {
  // set some random name (firstName only) here
  const name = "Dane";
  // const users = createUser(name, `${name} plays valorant`);
  // viewUser(name);
  // updateUser(name, `${name} eats a lot`);

  for (let i = 0; i < 4; i++) {
    if (i === 0) await createUser(name, `${name} plays valorant`);
    else if (i === 2) await updateUser(name, `${name} eats a lot`);
    else if (i === 1 || i === 3) await viewUser(name);
  }
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
