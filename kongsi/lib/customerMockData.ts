// Mock/static data for the Customer experience.
// No backend, no database, no network calls — everything here is hardcoded
// so the UI can be demonstrated end-to-end on the frontend only.
//
// Existing exports (CATEGORIES, RECOMMENDED_DEALS, ALMOST_THERE_DEALS,
// NEARBY_DEALS, ORDERS, NOTIFICATIONS, ADDRESSES, MOCK_PROFILE,
// formatRupiah) are preserved as-is so existing pages keep working.
// New exports added for Deal Detail / Checkout / UMKM Profile / Rating:
// Seller, SELLERS, Review, REVIEWS, getDealById, getSellerById,
// getReviewsForSeller, getReviewForOrder, getDealStatus.

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "kuliner", label: "Kuliner", emoji: "🍜" },
  { id: "fashion", label: "Fashion", emoji: "👕" },
  { id: "kerajinan", label: "Kerajinan", emoji: "🧶" },
  { id: "rumah", label: "Kebutuhan Rumah", emoji: "🏠" },
  { id: "lokal", label: "Produk Lokal", emoji: "🌾" },
];

export type FulfillmentMethod = "pickup" | "delivery" | "pickup-delivery";

// "berlangsung" is derived automatically once currentParticipants reaches
// targetParticipants (-> "sukses"). "berakhir" must be set explicitly on
// deals used to demonstrate the expired-without-reaching-target state.
export type DealOutcome = "berlangsung" | "sukses" | "berakhir";

export interface GroupDeal {
  id: string;
  name: string;
  seller: string;
  sellerId: string;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  remainingLabel: string;
  timeLeft: string;
  distanceLabel?: string;
  locationLabel?: string;
  category?: string;
  imageEmoji: string;
  imageUrl?: string;
  description: string;
  details: string[];
  fulfillment: FulfillmentMethod;
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
  /** Set to "berakhir" to demo a deal that expired without reaching target. */
  outcome?: DealOutcome;
}

export function getDealStatus(deal: GroupDeal): DealOutcome {
  if (deal.currentParticipants >= deal.targetParticipants) return "sukses";
  return deal.outcome ?? "berlangsung";
}

export const RECOMMENDED_DEALS: GroupDeal[] = [
  {
    id: "deal-1",
    name: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    sellerId: "warung-bu-rina",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 8,
    targetParticipants: 10,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "03:12:40",
    imageEmoji: "🍚",
    description: "Rice bowl dengan ayam crispy, nasi hangat, dan saus spesial.",
    details: ["1 porsi", "Ayam crispy", "Saus spesial"],
    fulfillment: "pickup-delivery",
    pickupLocation: "Pos Satpam Blok B",
    pickupHours: "17.00–19.00",
    deliveryFee: 10000,
  },
  {
    id: "deal-2",
    name: "Kaos Katun Polos",
    seller: "Rumah Jahit Melati",
    sellerId: "rumah-jahit-melati",
    normalPrice: 65000,
    kongsiPrice: 48000,
    currentParticipants: 5,
    targetParticipants: 15,
    remainingLabel: "Tinggal 10 orang lagi!",
    timeLeft: "11:40:05",
    imageEmoji: "👕",
    description:
      "Kaos katun combed 30s, nyaman dipakai harian, tersedia beberapa warna.",
    details: ["Bahan katun combed 30s", "Unisex", "Ukuran S–XL"],
    fulfillment: "delivery",
    deliveryFee: 12000,
  },
  {
    id: "deal-3",
    name: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    sellerId: "kriya-ibu-sari",
    normalPrice: 85000,
    kongsiPrice: 69000,
    currentParticipants: 6,
    targetParticipants: 8,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "05:22:10",
    imageEmoji: "🧺",
    description:
      "Tas rotan anyaman tangan, ringan dan tahan lama untuk belanja harian.",
    details: ["Anyaman tangan", "Tahan lama", "Muat untuk belanja harian"],
    fulfillment: "pickup",
    pickupLocation: "Kriya Ibu Sari",
    pickupHours: "08.00–16.00",
  },
  {
    id: "deal-4",
    name: "Sabun Herbal Sereh",
    seller: "Griya Sehat Alami",
    sellerId: "griya-sehat-alami",
    normalPrice: 18000,
    kongsiPrice: 13000,
    currentParticipants: 12,
    targetParticipants: 20,
    remainingLabel: "Tinggal 8 orang lagi!",
    timeLeft: "08:05:30",
    imageEmoji: "🧼",
    description:
      "Sabun batang herbal dengan ekstrak sereh, cocok untuk kulit sensitif.",
    details: ["Ekstrak sereh alami", "Cocok kulit sensitif", "Bebas paraben"],
    fulfillment: "pickup-delivery",
    pickupLocation: "Griya Sehat Alami",
    pickupHours: "10.00–18.00",
    deliveryFee: 8000,
  },
  {
    id: "deal-5",
    name: "Keripik Singkong Pedas",
    seller: "UMKM Renyah Jaya",
    sellerId: "umkm-renyah-jaya",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "01:45:00",
    imageEmoji: "🥔",
    description:
      "Keripik singkong renyah dengan bumbu pedas manis, dikemas higienis.",
    details: ["Renyah tahan lama", "Level pedas sedang", "Kemasan higienis"],
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
  },
  {
    id: "deal-6",
    name: "Batik Tulis Motif Kawung",
    seller: "Batik Sekar Ayu",
    sellerId: "batik-sekar-ayu",
    normalPrice: 150000,
    kongsiPrice: 120000,
    currentParticipants: 3,
    targetParticipants: 6,
    remainingLabel: "Tinggal 3 orang lagi!",
    timeLeft: "23:10:00",
    imageEmoji: "🧵",
    description: "Batik tulis asli motif kawung, bahan katun primisima.",
    details: ["Batik tulis asli", "Katun primisima", "Motif kawung klasik"],
    fulfillment: "delivery",
    deliveryFee: 15000,
  },
];

export const ALMOST_THERE_DEALS: GroupDeal[] = [
  {
    id: "almost-1",
    name: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    sellerId: "warung-bu-rina",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 10,
    targetParticipants: 12,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "02:10:00",
    imageEmoji: "🍚",
    description: "Rice bowl dengan ayam crispy, nasi hangat, dan saus spesial.",
    details: ["1 porsi", "Ayam crispy", "Saus spesial"],
    fulfillment: "pickup-delivery",
    pickupLocation: "Pos Satpam Blok B",
    pickupHours: "17.00–19.00",
    deliveryFee: 10000,
  },
  {
    id: "almost-2",
    name: "Keripik Singkong Pedas",
    seller: "UMKM Renyah Jaya",
    sellerId: "umkm-renyah-jaya",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "01:45:00",
    imageEmoji: "🥔",
    description:
      "Keripik singkong renyah dengan bumbu pedas manis, dikemas higienis.",
    details: ["Renyah tahan lama", "Level pedas sedang", "Kemasan higienis"],
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
  },
  {
    id: "almost-3",
    name: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    sellerId: "kriya-ibu-sari",
    normalPrice: 85000,
    kongsiPrice: 69000,
    currentParticipants: 7,
    targetParticipants: 8,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "04:05:00",
    imageEmoji: "🧺",
    description:
      "Tas rotan anyaman tangan, ringan dan tahan lama untuk belanja harian.",
    details: ["Anyaman tangan", "Tahan lama", "Muat untuk belanja harian"],
    fulfillment: "pickup",
    pickupLocation: "Kriya Ibu Sari",
    pickupHours: "08.00–16.00",
  },
];

export const NEARBY_DEALS: GroupDeal[] = [
  {
    id: "nearby-1",
    name: "Seblak Teh Nia",
    seller: "Warung Teh Nia",
    sellerId: "warung-teh-nia",
    normalPrice: 15000,
    kongsiPrice: 12000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "02:30:00",
    distanceLabel: "1.2 km dari kamu",
    locationLabel: "Cipondoh, Tangerang",
    imageEmoji: "🍲",
    description: "Seblak kuah pedas dengan kerupuk basah, ceker, dan telur.",
    details: [
      "Level pedas bisa disesuaikan",
      "Ceker & telur",
      "Porsi mengenyangkan",
    ],
    fulfillment: "pickup",
    pickupLocation: "Warung Teh Nia",
    pickupHours: "16.00–21.00",
  },
  {
    id: "nearby-2",
    name: "Nasi Uduk Betawi",
    seller: "Dapur Mpok Yani",
    sellerId: "dapur-mpok-yani",
    normalPrice: 14000,
    kongsiPrice: 11000,
    currentParticipants: 6,
    targetParticipants: 10,
    remainingLabel: "Tinggal 4 orang lagi!",
    timeLeft: "06:15:00",
    distanceLabel: "2.4 km dari kamu",
    locationLabel: "Cibodas, Tangerang",
    imageEmoji: "🍛",
    description: "Nasi uduk gurih dengan lauk lengkap ala Betawi.",
    details: ["Nasi uduk gurih", "Lauk lengkap", "Sambal kacang"],
    fulfillment: "pickup-delivery",
    pickupLocation: "Dapur Mpok Yani",
    pickupHours: "06.00–10.00",
    deliveryFee: 7000,
  },
  {
    id: "nearby-3",
    name: "Kerupuk Kulit Original",
    seller: "UMKM Renyah Jaya",
    sellerId: "umkm-renyah-jaya",
    normalPrice: 22000,
    kongsiPrice: 17000,
    currentParticipants: 8,
    targetParticipants: 12,
    remainingLabel: "Tinggal 4 orang lagi!",
    timeLeft: "09:50:00",
    distanceLabel: "3.1 km dari kamu",
    locationLabel: "Periuk, Tangerang",
    imageEmoji: "🍘",
    description: "Kerupuk kulit sapi renyah, digoreng kering tanpa pengawet.",
    details: ["Tanpa pengawet", "Digoreng kering", "Cocok untuk camilan"],
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
  },
];

// A couple of extra demo deals used only to exercise the "sudah penuh" and
// "sudah berakhir" states on the Deal Detail page. Not shown on the homepage.
export const EXTRA_DEALS: GroupDeal[] = [
  {
    id: "deal-full",
    name: "Sabun Herbal Sereh",
    seller: "Griya Sehat Alami",
    sellerId: "griya-sehat-alami",
    normalPrice: 18000,
    kongsiPrice: 13000,
    currentParticipants: 20,
    targetParticipants: 20,
    remainingLabel: "Target tercapai!",
    timeLeft: "00:00:00",
    imageEmoji: "🧼",
    description:
      "Sabun batang herbal dengan ekstrak sereh, cocok untuk kulit sensitif.",
    details: ["Ekstrak sereh alami", "Cocok kulit sensitif", "Bebas paraben"],
    fulfillment: "pickup-delivery",
    pickupLocation: "Griya Sehat Alami",
    pickupHours: "10.00–18.00",
    deliveryFee: 8000,
  },
  {
    id: "deal-expired",
    name: "Kacang Bawang Renyah",
    seller: "UMKM Renyah Jaya",
    sellerId: "umkm-renyah-jaya",
    normalPrice: 16000,
    kongsiPrice: 12000,
    currentParticipants: 4,
    targetParticipants: 10,
    remainingLabel: "Tinggal 6 orang lagi!",
    timeLeft: "00:00:00",
    imageEmoji: "🥜",
    description: "Kacang bawang renyah gurih, cocok untuk teman santai.",
    details: ["Renyah gurih", "Tanpa pengawet", "Kemasan 250gr"],
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
    outcome: "berakhir",
  },
];

const ALL_DEALS: GroupDeal[] = [
  ...RECOMMENDED_DEALS,
  ...ALMOST_THERE_DEALS,
  ...NEARBY_DEALS,
  ...EXTRA_DEALS,
];

export function getDealById(id: string): GroupDeal | undefined {
  return ALL_DEALS.find((deal) => deal.id === id);
}

// ---------------------------------------------------------------------------
// Sellers (UMKM profiles, customer-facing)
// ---------------------------------------------------------------------------

export interface Seller {
  id: string;
  name: string;
  category: string;
  avatarEmoji: string;
  rating: number | null;
  reviewCount: number;
  description: string;
  address: string;
}

export const SELLERS: Seller[] = [
  {
    id: "warung-bu-rina",
    name: "Warung Bu Rina",
    category: "Kuliner",
    avatarEmoji: "🍚",
    rating: 4.8,
    reviewCount: 124,
    description:
      "Usaha makanan rumahan yang menyediakan makanan berkualitas dengan harga terjangkau.",
    address: "Cipondoh, Tangerang",
  },
  {
    id: "rumah-jahit-melati",
    name: "Rumah Jahit Melati",
    category: "Fashion",
    avatarEmoji: "👕",
    rating: 4.6,
    reviewCount: 38,
    description:
      "Konveksi rumahan yang memproduksi pakaian katun berkualitas dengan harga bersaing.",
    address: "Karawaci, Tangerang",
  },
  {
    id: "kriya-ibu-sari",
    name: "Kriya Ibu Sari",
    category: "Kerajinan",
    avatarEmoji: "🧺",
    rating: 4.9,
    reviewCount: 56,
    description:
      "Pengrajin anyaman rotan dan bambu, membuat setiap produk secara handmade.",
    address: "Periuk, Tangerang",
  },
  {
    id: "griya-sehat-alami",
    name: "Griya Sehat Alami",
    category: "Produk Lokal",
    avatarEmoji: "🧼",
    rating: 4.7,
    reviewCount: 91,
    description:
      "Memproduksi sabun dan produk perawatan tubuh herbal dari bahan alami pilihan.",
    address: "Cibodas, Tangerang",
  },
  {
    id: "umkm-renyah-jaya",
    name: "UMKM Renyah Jaya",
    category: "Kuliner",
    avatarEmoji: "🥔",
    rating: 4.5,
    reviewCount: 67,
    description:
      "Produsen keripik dan camilan rumahan dengan berbagai varian rasa.",
    address: "Periuk, Tangerang",
  },
  {
    id: "batik-sekar-ayu",
    name: "Batik Sekar Ayu",
    category: "Fashion",
    avatarEmoji: "🧵",
    rating: 4.9,
    reviewCount: 22,
    description:
      "Pengrajin batik tulis tradisional dengan motif klasik Nusantara.",
    address: "Karawaci, Tangerang",
  },
  {
    id: "warung-teh-nia",
    name: "Warung Teh Nia",
    category: "Kuliner",
    avatarEmoji: "🍲",
    rating: null,
    reviewCount: 0,
    description:
      "Warung seblak dan camilan pedas legendaris di lingkungan Cipondoh.",
    address: "Cipondoh, Tangerang",
  },
  {
    id: "dapur-mpok-yani",
    name: "Dapur Mpok Yani",
    category: "Kuliner",
    avatarEmoji: "🍛",
    rating: 4.4,
    reviewCount: 15,
    description: "Menyajikan nasi uduk dan masakan rumahan Betawi setiap pagi.",
    address: "Cibodas, Tangerang",
  },
];

export function getSellerById(id: string): Seller | undefined {
  return SELLERS.find((seller) => seller.id === id);
}

export function getDealsBySeller(sellerId: string): GroupDeal[] {
  return ALL_DEALS.filter(
    (deal) =>
      deal.sellerId === sellerId && getDealStatus(deal) === "berlangsung",
  );
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  sellerId: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
}

export const REVIEWS: Review[] = [
  {
    id: "review-1",
    sellerId: "warung-bu-rina",
    orderId: "order-6",
    customerName: "Andi",
    rating: 5,
    comment: "Makanannya enak dan pickup-nya gampang!",
  },
  {
    id: "review-2",
    sellerId: "warung-bu-rina",
    orderId: "order-7",
    customerName: "Citra",
    rating: 4,
    comment: "Harganya worth it dan prosesnya cepat.",
  },
  {
    id: "review-3",
    sellerId: "warung-bu-rina",
    orderId: "order-8",
    customerName: "Budi",
    rating: 5,
    comment: "Rice bowlnya juara, bakal pesan lagi kalau ada Kongsi baru.",
  },
];

export function getReviewsForSeller(sellerId: string): Review[] {
  return REVIEWS.filter((review) => review.sellerId === sellerId);
}

export function getReviewForOrder(orderId: string): Review | undefined {
  return REVIEWS.find((review) => review.orderId === orderId);
}

export const RATING_LABELS: Record<number, string> = {
  1: "Sangat Buruk",
  2: "Buruk",
  3: "Cukup",
  4: "Bagus",
  5: "Sangat Bagus",
};

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderStatus = "berlangsung" | "sukses" | "gagal" | "selesai";

export interface Order {
  id: string;
  orderNumber: string;
  dealId: string;
  sellerId: string;
  dealName: string;
  seller: string;
  currentParticipants: number;
  targetParticipants: number;
  status: OrderStatus;
  statusLabel: string;
  helperLabel: string;
  imageEmoji: string;
  quantity: number;
  unitPrice: number;
  fulfillment: "pickup" | "delivery";
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
}

export const ORDERS: Order[] = [
  {
    id: "order-1",
    orderNumber: "KS101",
    dealId: "deal-1",
    sellerId: "warung-bu-rina",
    dealName: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    currentParticipants: 8,
    targetParticipants: 10,
    status: "berlangsung",
    statusLabel: "Menunggu Kongsi berhasil",
    helperLabel: "Tinggal 2 orang lagi!",
    imageEmoji: "🍚",
    quantity: 2,
    unitPrice: 16000,
    fulfillment: "delivery",
    deliveryFee: 10000,
  },
  {
    id: "order-2",
    orderNumber: "KS102",
    dealId: "deal-2",
    sellerId: "rumah-jahit-melati",
    dealName: "Kaos Katun Polos",
    seller: "Rumah Jahit Melati",
    currentParticipants: 5,
    targetParticipants: 15,
    status: "berlangsung",
    statusLabel: "Menunggu Kongsi berhasil",
    helperLabel: "Tinggal 10 orang lagi!",
    imageEmoji: "👕",
    quantity: 1,
    unitPrice: 48000,
    fulfillment: "delivery",
    deliveryFee: 12000,
  },
  {
    id: "order-3",
    orderNumber: "KS103",
    dealId: "deal-4",
    sellerId: "griya-sehat-alami",
    dealName: "Sabun Herbal Sereh",
    seller: "Griya Sehat Alami",
    currentParticipants: 20,
    targetParticipants: 20,
    status: "sukses",
    statusLabel: "Pesanan sedang diproses",
    helperLabel: "Target tercapai 🎉",
    imageEmoji: "🧼",
    quantity: 2,
    unitPrice: 13000,
    fulfillment: "pickup",
    pickupLocation: "Griya Sehat Alami",
    pickupHours: "10.00–18.00",
  },
  {
    id: "order-4",
    orderNumber: "KS104",
    dealId: "deal-3",
    sellerId: "kriya-ibu-sari",
    dealName: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    currentParticipants: 3,
    targetParticipants: 8,
    status: "gagal",
    statusLabel: "Pembayaran dikembalikan",
    helperLabel: "Target tidak tercapai",
    imageEmoji: "🧺",
    quantity: 1,
    unitPrice: 69000,
    fulfillment: "pickup",
    pickupLocation: "Kriya Ibu Sari",
    pickupHours: "08.00–16.00",
  },
  {
    id: "order-5",
    orderNumber: "KS105",
    dealId: "deal-5",
    sellerId: "umkm-renyah-jaya",
    dealName: "Keripik Singkong Pedas",
    seller: "UMKM Renyah Jaya",
    currentParticipants: 10,
    targetParticipants: 10,
    status: "selesai",
    statusLabel: "Selesai",
    helperLabel: "Pesanan sudah diterima",
    imageEmoji: "🥔",
    quantity: 3,
    unitPrice: 9000,
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
  },
  {
    id: "order-6",
    orderNumber: "KS001",
    dealId: "deal-1",
    sellerId: "warung-bu-rina",
    dealName: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    currentParticipants: 10,
    targetParticipants: 10,
    status: "selesai",
    statusLabel: "Selesai",
    helperLabel: "Pesanan sudah diterima",
    imageEmoji: "🍚",
    quantity: 2,
    unitPrice: 16000,
    fulfillment: "pickup",
    pickupLocation: "Pos Satpam Blok B",
    pickupHours: "17.00–19.00",
  },
];

export function getOrderById(id: string): Order | undefined {
  return ORDERS.find((order) => order.id === id);
}

export type NotificationType =
  | "hampir-mencapai"
  | "berhasil"
  | "diproses"
  | "siap-diambil"
  | "pengiriman"
  | "dikembalikan"
  | "segera-berakhir";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  group: "Hari ini" | "Kemarin";
  unread: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "hampir-mencapai",
    title: "Kongsi hampir mencapai target",
    description: "Rice Bowl Ayam tinggal 2 orang lagi untuk berhasil.",
    time: "10:24",
    group: "Hari ini",
    unread: true,
  },
  {
    id: "notif-2",
    type: "siap-diambil",
    title: "Pesanan siap diambil",
    description:
      "Keripik Singkong Pedas sudah bisa diambil di Warung Renyah Jaya.",
    time: "09:02",
    group: "Hari ini",
    unread: true,
  },
  {
    id: "notif-3",
    type: "segera-berakhir",
    title: "Kongsi akan segera berakhir",
    description: "Batik Tulis Motif Kawung akan ditutup dalam 1 jam lagi.",
    time: "07:48",
    group: "Hari ini",
    unread: false,
  },
  {
    id: "notif-4",
    type: "berhasil",
    title: "Kongsi berhasil",
    description: "Sabun Herbal Sereh mencapai target 20 orang. Yay!",
    time: "19:12",
    group: "Kemarin",
    unread: false,
  },
  {
    id: "notif-5",
    type: "pengiriman",
    title: "Pengiriman sedang berlangsung",
    description: "Pesanan Nasi Uduk Betawi kamu sedang dalam perjalanan.",
    time: "14:30",
    group: "Kemarin",
    unread: false,
  },
  {
    id: "notif-6",
    type: "dikembalikan",
    title: "Pembayaran dikembalikan",
    description:
      "Anyaman Tas Rotan tidak mencapai target. Dana sudah dikembalikan.",
    time: "08:15",
    group: "Kemarin",
    unread: false,
  },
];

export interface Address {
  id: string;
  label: string;
  detail: string;
  isPrimary?: boolean;
}

export const ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Rumah",
    detail: "Jl. Contoh No. 123, Cipondoh, Tangerang",
    isPrimary: true,
  },
  {
    id: "addr-2",
    label: "Kantor",
    detail: "Jl. Melati Raya No. 45, Karawaci, Tangerang",
  },
];

export const MOCK_PROFILE = {
  name: "Dewi Anggraini",
  phone: "0812-3456-7890",
  email: "dewi.anggraini@email.com",
  avatarInitial: "D",
};

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
