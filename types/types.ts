export interface Products {
  id: number;
  created_at: string;
  name: string;
  type: string;
}

export interface ShoppingList {
  id: number;
  created_at: string;
  name: string;
  type: string;
  whenAdded: string;
}

export interface HistoryOfShoppingListInt {
  id: number;
  created_at: string;
  name: string;
  type: string;
}

export type Database = {
  public: {
    Tables: {
      your_table_name: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
    };
  };
};
