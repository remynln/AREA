declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        JWT_KEY: string;
        GOOGLE_APPLICATION_CREDENTIALS: string;
        DB_USER: string;
        DB_PASSWORD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}