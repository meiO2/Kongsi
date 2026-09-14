    export type AccountType = "customer" | "umkm";

    export interface LoginFormData {
    identifier: string; // email or phone
    password: string;
    }

    export interface LoginFormErrors {
    identifier?: string;
    password?: string;
    }

    export interface SignUpFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    accountType: AccountType;
    businessName: string;
    businessCategory: string;
    businessAddress: string;
    verificationDocumentUrl: string;
    }

    export interface SignUpFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
    verificationDocumentUrl?: string;
    }

    export const BUSINESS_CATEGORIES = [
    "Kuliner",
    "Fashion",
    "Kerajinan",
    "Kebutuhan Rumah",
    "Produk Lokal",
    ] as const;
