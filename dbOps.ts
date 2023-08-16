import { PrismaClient } from "@prisma/client";
import { performance } from "perf_hooks";
import gcm from "./gcm";
const prisma = new PrismaClient();

const secret = "mT0NrPWKiKlJhBygixosbJ3GwdnUDUNX";

export async function createUser(name: string, userData: string) {
  const startTime = performance.now();
  const newUser = await prisma.user.create({
    data: {
      name: name,
      data: gcm.encrypt(userData, secret),
    },
  });
  const endTime = performance.now();
  console.log(
    `Create User took ${endTime - startTime} milliseconds to execute\n\n`
  );

  console.log("User created:", newUser);

  return newUser;
}

export async function updateUser(name: string, updatedData: string) {
  const startTime = performance.now();
  const updatedUser = await prisma.user.update({
    where: {
      name: name,
    },
    data: {
      data: gcm.encrypt(updatedData, secret),
    },
  });
  const endTime = performance.now();
  console.log(
    `Update User took ${endTime - startTime} milliseconds to execute\n\n`
  );
  console.log("User updated:", updatedUser);
  return updatedUser;
}

export async function viewUser(name: string) {
  const startTime = performance.now();
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });
  if (user) {
    user.data = gcm.decrypt(user.data, secret);
  }
  const endTime = performance.now();
  console.log(
    `View User took ${endTime - startTime} milliseconds to execute\n\n`
  );
  console.log(user);

  return user;
}
