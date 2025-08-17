export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string | null;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
