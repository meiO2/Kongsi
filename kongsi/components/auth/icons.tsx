    import type { SVGProps } from "react";

    export function EyeIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
        <circle cx="12" cy="12" r="3" />
        </svg>
    );
    }

    export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5C5 19.5 1.5 12 1.5 12a20.6 20.6 0 0 1 4.22-5.06M9.9 4.6A10.7 10.7 0 0 1 12 4.5c7 0 10.5 7.5 10.5 7.5a20.5 20.5 0 0 1-2.36 3.44M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1.5 1.5l21 21" />
        </svg>
    );
    }

    export function UserRoundIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
    );
    }

    export function StoreIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        >
        <path d="M3 9.5 4.5 4h15L21 9.5" />
        <path d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M9.5 20v-5a2.5 2.5 0 0 1 5 0v5" />
        </svg>
    );
    }

    export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
        >
        <circle cx="12" cy="12" r="12" />
        <path
            d="M7 12.5l3 3 7-7"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        </svg>
    );
    }

    export function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth={3}
            opacity={0.25}
        />
        <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
        />
        </svg>
    );
    }