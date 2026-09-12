    // Mock/static data for the Pesanan (orders) list and detail pages.
    // No backend calls — everything here is hardcoded for demonstration.


    export type OrderStatus =
    | "menunggu"
    | "perlu-diproses"
    | "diproses"
    | "siap-diambil"
    | "sedang-dikirim"
    | "selesai"
    | "dibatalkan";

    export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    menunggu: "Menunggu Kongsi Berhasil",
    "perlu-diproses": "Perlu Diproses",
    diproses: "Sedang Diproses",
    "siap-diambil": "Siap Diambil",
    "sedang-dikirim": "Sedang Dikirim",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
    };

    export const ORDER_FILTERS: { value: OrderStatus | "semua"; label: string }[] = [
    { value: "semua", label: "Semua" },
    { value: "menunggu", label: "Menunggu Kongsi Berhasil" },
    { value: "perlu-diproses", label: "Perlu Diproses" },
    { value: "diproses", label: "Sedang Diproses" },
    { value: "siap-diambil", label: "Siap Diambil" },
    { value: "sedang-dikirim", label: "Sedang Dikirim" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
    ];

    export interface Order {
    id: string;
    kongsiId: string;
    customerName: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    fulfillment: "pickup" | "delivery";
    pickupLocation?: string;
    pickupHours?: string;
    deliveryFee?: number;
    status: OrderStatus;
    }

    export const ORDERS: Order[] = [
    {
        id: "KS001",
        kongsiId: "ks-001",
        customerName: "Andi",
        productName: "Rice Bowl Ayam",
        quantity: 2,
        unitPrice: 16000,
        fulfillment: "delivery",
        deliveryFee: 10000,
        status: "perlu-diproses",
    },
    {
        id: "KS002",
        kongsiId: "ks-001",
        customerName: "Siti Rahma",
        productName: "Rice Bowl Ayam",
        quantity: 1,
        unitPrice: 16000,
        fulfillment: "pickup",
        pickupLocation: "Pos Satpam Blok B",
        pickupHours: "17.00–19.00",
        status: "menunggu",
    },
    {
        id: "KS003",
        kongsiId: "ks-002",
        customerName: "Budi Santoso",
        productName: "Keripik Singkong Pedas",
        quantity: 3,
        unitPrice: 9000,
        fulfillment: "pickup",
        pickupLocation: "Warung Renyah Jaya",
        pickupHours: "09.00–17.00",
        status: "diproses",
    },
    {
        id: "KS004",
        kongsiId: "ks-004",
        customerName: "Dewi Anggraini",
        productName: "Sabun Herbal Sereh",
        quantity: 2,
        unitPrice: 13000,
        fulfillment: "delivery",
        deliveryFee: 8000,
        status: "siap-diambil",
    },
    {
        id: "KS005",
        kongsiId: "ks-004",
        customerName: "Rian Pratama",
        productName: "Sabun Herbal Sereh",
        quantity: 1,
        unitPrice: 13000,
        fulfillment: "delivery",
        deliveryFee: 8000,
        status: "sedang-dikirim",
    },
    {
        id: "KS006",
        kongsiId: "ks-005",
        customerName: "Nadia Putri",
        productName: "Batik Tulis Motif Kawung",
        quantity: 1,
        unitPrice: 120000,
        fulfillment: "delivery",
        deliveryFee: 15000,
        status: "selesai",
    },
    {
        id: "KS007",
        kongsiId: "ks-006",
        customerName: "Fajar Hidayat",
        productName: "Anyaman Tas Rotan",
        quantity: 1,
        unitPrice: 69000,
        fulfillment: "pickup",
        pickupLocation: "Kriya Ibu Sari",
        pickupHours: "08.00–16.00",
        status: "dibatalkan",
    },
    ];

    export function getOrderById(id: string): Order | undefined {
    return ORDERS.find((order) => order.id.toLowerCase() === id.toLowerCase());
    }

    export function calculateOrderTotal(order: Order): number {
    const subtotal = order.quantity * order.unitPrice;
    return subtotal + (order.fulfillment === "delivery" ? order.deliveryFee ?? 0 : 0);
    }

    // The next status in the fulfillment flow, and the label of the action
    // button that triggers the transition. Returns null when the order is in a
    // terminal state (selesai / dibatalkan) or waiting on the Kongsi itself.
    export function getNextOrderStep(
    order: Order
    ): { nextStatus: OrderStatus; actionLabel: string } | null {
    if (order.status === "perlu-diproses") {
        return { nextStatus: "diproses", actionLabel: "Mulai Proses" };
    }
    if (order.status === "diproses") {
        return order.fulfillment === "pickup"
        ? { nextStatus: "siap-diambil", actionLabel: "Siap Diambil" }
        : { nextStatus: "sedang-dikirim", actionLabel: "Siap Dikirim" };
    }
    if (order.status === "siap-diambil" || order.status === "sedang-dikirim") {
        return { nextStatus: "selesai", actionLabel: "Selesaikan Pesanan" };
    }
    return null;
    }

    export function formatRupiah(value: number): string {
    return `Rp${value.toLocaleString("id-ID")}`;
    }