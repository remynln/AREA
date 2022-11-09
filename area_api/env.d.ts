declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        DEEZER_CLIENT_ID: string;
        DEEZER_CLIENT_SECRET: string;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        NOTION_CLIENT_ID: string;
        NOTION_CLIENT_SECRET: string;
        TRELLO_CLIENT_ID: string;
        TRELLO_CLIENT_SECRET: string;
        JWT_KEY: string;
        GOOGLE_APPLICATION_CREDENTIALS: string;
        DB_USER: string;
        DB_PASSWORD: string;
        ROOT_PASSWORD: string;
        SESSION_SECRET: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}