export const config = {
  port: 5000,
  db: {
    host: "db",
    port: 5432,
    user: "myuser",
    password: "mypassword",
    name: "mydatabase",
    logging: false,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  body: {
    maxSize: 1 * 1024 * 1024, // 1MB
  },
};
