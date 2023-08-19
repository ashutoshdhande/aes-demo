import { PrismaClient } from "@prisma/client";
import gcm from "./gcm";

const prisma = new PrismaClient();

const secret = "mT0NrPWKiKlJhBygixosbJ3GwdnUDUNX";

type User = {
  name: string;
  data: string;
  role: string;
};

prisma.$use(async (params, next) => {
  if (params.model === "User") {
    // Determine if it's a read operation (findFirst, findMany, findUnique)
    const isReadOperation = ["findFirst", "findMany", "findUnique"].includes(
      params.action
    );

    // Determine if it's a write operation (create, createMany, update, updateMany)
    const isWriteOperation = [
      "create",
      "createMany",
      "update",
      "updateMany",
      "upsert",
    ].includes(params.action);

    if (isReadOperation) {
      // Execute the read operation and decrypt the data if it's an array or single item
      const result = await next(params);

      if (Array.isArray(result)) {
        result.forEach((item) => {
          item.data = gcm.decrypt(item.data, secret);
        });
      } else {
        result.data = gcm.decrypt(result.data, secret);
      }

      return result;
    } else if (isWriteOperation) {
      // Encrypt the data before executing the write operation
      if (Array.isArray(params.args?.data)) {
        params.args?.data.forEach((user: User) => {
          user.data = gcm.encrypt(user.data, secret);
        });
      } else {
        if (params.action === "upsert") {
          params.args.create.data = gcm.encrypt(
            params.args.create.data,
            secret
          );
          params.args.update.data = gcm.encrypt(
            params.args.update.data,
            secret
          );
        } else {
          params.args.data.data = gcm.encrypt(params.args.data.data, secret);
        }
      }

      return await next(params);
    }
  }

  // For other models or operations, pass the parameters to the next middleware
  return await next(params);
});

async function main() {
  // some synthetic data
  const users: User[] = [
    {
      name: "amit",
      data: "amit is a developer",
      role: "dev",
    },
    {
      name: "priya",
      data: "priya is an HRM",
      role: "hrm",
    },
    {
      name: "rahul",
      data: "rahul is a developer",
      role: "dev",
    },
    {
      name: "sneha",
      data: "sneha is an SRE",
      role: "sre",
    },
  ];

  const res = await prisma.user.upsert({
    where: { name: "sneha" },
    create: {
      name: "sneha",
      data: "sneha excel's in monitoring",
      role: "devops",
    },
    update: {
      data: "good communicator",
      role: "hrm",
    },
  });
  console.log(res);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
