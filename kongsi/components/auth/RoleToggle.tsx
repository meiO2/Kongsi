    "use client";

    import type { AccountType } from "./types";
    import { CheckCircleIcon, StoreIcon, UserRoundIcon } from "./icons";

    interface RoleToggleProps {
    value: AccountType;
    onChange: (value: AccountType) => void;
    }

    const ROLES: {
    value: AccountType;
    title: string;
    subtitle: string;
    icon: typeof UserRoundIcon;
    }[] = [
    {
        value: "customer",
        title: "Pelanggan",
        subtitle: "Belanja dari usaha sekitarmu",
        icon: UserRoundIcon,
    },
    {
        value: "umkm",
        title: "UMKM",
        subtitle: "Jual produk & jasamu",
        icon: StoreIcon,
    },
    ];

    export default function RoleToggle({ value, onChange }: RoleToggleProps) {
    return (
        <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#292828]">
            Daftar sebagai
        </span>
        <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
            const selected = value === role.value;
            const Icon = role.icon;
            return (
                <button
                key={role.value}
                type="button"
                onClick={() => onChange(role.value)}
                aria-pressed={selected}
                className={[
                    "relative flex flex-col items-start gap-2 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
                    selected
                    ? "border-[#3991FA] bg-[#3991FA]/[0.06]"
                    : "border-[#E4E1DF] bg-white hover:border-[#3991FA]/40",
                ].join(" ")}
                >
                {selected && (
                    <CheckCircleIcon className="absolute right-2.5 top-2.5 h-5 w-5 text-[#3991FA]" />
                )}
                <span
                    className={[
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    selected
                        ? "bg-[#3991FA] text-white"
                        : "bg-[#F1EFEF] text-[#292828]",
                    ].join(" ")}
                >
                    <Icon className="h-5 w-5" />
                </span>
                <span>
                    <span className="block text-[15px] font-semibold text-[#292828]">
                    {role.title}
                    </span>
                    <span className="block text-xs text-[#7A7876]">
                    {role.subtitle}
                    </span>
                </span>
                </button>
            );
            })}
        </div>
        </div>
    );
    }