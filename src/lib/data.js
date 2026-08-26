import React from 'react';
import { Flame, Hammer, Zap, Gem, Wand2, ScrollText } from 'lucide-react';

const startCareer = 2016  ;
const currentYear = new Date().getFullYear();
const level = currentYear - startCareer;

let maxHp = 100;
let maxMana = 100;
// Daily HP/Mana status depends on `new Date()` (current day/hour) and
// `Math.random()` (Friday and Mon-Thu rolls). Sampling this at module-scope
// causes an SSR/CSR hydration mismatch because the value the server captures
// at build time differs from the value the client captures on mount. The
// safe path: keep the deterministic fields (name/title/level/class/guild/
// location/bio) as a frozen INITIAL_STATS_DATA constant, and expose the
// time/random-driven `hp` and `mana` through `getInitialStats()` so the
// caller can resolve them inside a `useEffect` after hydration.
function calculateStatus() {
  const now = new Date();
  const day = now.getDay(); // 0: Minggu, 1: Senin, ..., 6: Sabtu
  const hour = now.getHours();

  let status = { hp: 0, mana: 0, message: "" };

  switch (day) {
      case 6: // SABTU (Recovery)
          // Pulih setiap jam (100 / 24 jam = ~4.16 per jam)
          status.hp = Math.min(100, Math.floor((hour / 24) * 100));
          status.mana = Math.min(100, Math.floor((hour / 24) * 100));
          break;

      case 5: // JUMAT (Bisa 0)
          status.hp = Math.floor(Math.random() * 101);
          status.mana = Math.floor(Math.random() * 101);
          break;

      case 0: // MINGGU (Puncak/Max)
          status.hp = 100;
          status.mana = 100;
          break;

      default: // SENIN - KAMIS (Tidak boleh 0)
          status.hp = Math.floor(Math.random() * 100) + 1;
          status.mana = Math.floor(Math.random() * 100) + 1;
          break;
  }

  return status;
}

export const INITIAL_STATS_DATA = {
  name: "Aditya the Paladin",
  title: "Senior Full-Stack Knight",
  level: level,
  class: "Full-Stack Developer",
  guild: "Mengantar",
  location: "Cloud Realm (Remote)",
  bio: "Gather 'round! My journey began in the smithies of vocational school, where I first learned to forge the logic that binds our world. Since the year 2016, I’ve been stationed in the City of Flowers, crafting digital wonders for a local merchant guild. 'Tis a heavy burden I carry, for I also walk the halls of Widyatama Academy to master my craft while the rest of the realm sleeps."
};

// Sample HP/Mana on demand (client-only). Callers must invoke this from
// inside a `useEffect` so the server-rendered HTML never carries these
// non-deterministic values.
export function getInitialStats() {
  const { hp, mana } = calculateStatus();
  return { hp, mana };
}

export const QUESTS_BASE = [
  {
    id: 1,
    typeKey: "epic",
    period: "2021 - Present",
    spellsUsed: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Module Federation"],
  },
  {
    id: 2,
    typeKey: "side",
    period: "2018 - 2021",
    spellsUsed: ["Vue.js", "D3.js", "Node.js", "GraphQL", "Framer Motion"],
  }
];

export const PROJECTS_BASE = [
  {
    id: 1,
    rarity: "Legendary",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
    link: "#",
    loot: ["Solidity", "React", "Web3"],
    icon: <Gem className="w-8 h-8" />
  },
  {
    id: 2,
    rarity: "Epic",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
    link: "#",
    loot: ["Python", "TensorFlow", "D3.js"],
    icon: <Wand2 className="w-8 h-8" />
  },
  {
    id: 3,
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    link: "#",
    loot: ["Node.js", "Socket.io", "Redis"],
    icon: <Zap className="w-8 h-8" />
  },
  {
    id: 4,
    rarity: "Common",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    link: "#",
    loot: ["HTML", "CSS", "JS"],
    icon: <ScrollText className="w-8 h-8" />
  }
];

export const SKILL_TREE_BASE = [
  {
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    skills: [
      { name: "React / Next.js", level: 75, rarity: "Rare" },
      { name: "Tailwind CSS", level: 60, rarity: "Common" },
      { name: "Javascript", level: 85, rarity: "Legendary" },
      { name: "Vue.js / Nuxt.js", level: 80, rarity: "Epic" }
    ]
  },
  {
    icon: <Hammer className="w-5 h-5 text-gray-400" />,
    skills: [
      { name: "Laravel", level: 80, rarity: "Epic" },
      { name: "PostgreSQL", level: 82, rarity: "Epic" },
      { name: "PHP", level: 85, rarity: "Legendary" },
      { name: "MySQL", level: 75, rarity: "Rare" }
    ]
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    skills: [
      { name: "CI/CD", level: 70, rarity: "Rare" },
      { name: "Git", level: 85, rarity: "Legendary" }
    ]
  }
];

export const PARTY_MEMBERS_BASE = [
  { name: "Dani 'Town Idiot'", roleKey: "se", quoteKey: "dani", token: "/danitoken.png", link: 'https://nugraha.dev/' },
  { name: "Berlian 'The Wizard'", roleKey: "fs", quoteKey: "beber", token: "/bebertoken.png", link: 'https://bayuaji.dev/' },
  { name: "Sheila 'Priestess'", roleKey: "fs", quoteKey: "sheila", token: "/sheilatoken.png", link: 'https://sheilaa.dev/' }
];

export const translations = {
  en: {
    hero: { name: "Aditya the Paladin", class: "Full-Stack Developer", bio: "Gather 'round! My journey began in the smithies of vocational school, where I first learned to forge the logic that binds our world. Since the year 2016, I’ve been stationed in the City of Flowers, crafting digital wonders for a local merchant guild. 'Tis a heavy burden I carry, for I also walk the halls of Widyatama Academy to master my craft while the rest of the realm sleeps." },
    nav: { hero: "Hero", quests: "Quests", portfolio: "Backpack", skills: "Spells", library: "Library", party: "Party", guild: "Guild" },
    sections: {
      quests: { title: "Quest Log", subtitle: "Archived campaigns and technologies harnessed." },
      portfolio: { title: "Adventurer's Backpack", subtitle: "Your collection of artifacts gathered across the digital realms." },
      skills: { title: "The Skill Tree", subtitle: "Technical masteries categorized by arcane discipline." },
      library: { title: "The Grand Library", subtitle: "Archived records and technical research." },
      party: { title: "The Party", subtitle: "Collaborators and companions from my best Party." },
      guild: { title: "The Guild Hall", subtitle: "Official channels to coordinate future expeditions." }
    },
    ui: { health: "Health", mana: "Mana", lvl: "LVL", message: "Message Bird", viewCv: "Open Character Sheet", fateTitle: "Fate System", rollBtn: "Roll for Initiative!", rolling: "Consulting...", spellsCast: "Spells Cast:", totalArchives: "Total Archives", prohibited: "Magic is prohibited in the library.", guildHall: "Enter the Guild Hall", recorded: "Recorded", archivalRecord: "Archival Record", visit: "View Artifact", copyright: "2026 / CRAFTED WITH REACT & MAGIC", inspect: "Inspect Item", itemBox: "Inventory Slots", stats: "Properties", loot: "Arcane Components", close: "Close", backToLibrary: "Back to the Library", prevBook: "Previous Tome", previousBook: "Previous Volume", nextBook: "Next Tome", readingTime: "min read", pennedBy: "Penned by", volume: "Vol.", yearOfEra: "Year {year} of {era}", turnPage: "Turn the page with ← →", emptyLibraryTitle: "The ink has not yet dried.", emptyLibraryBody: "No scrolls have been inscribed in this archive yet. Return when the first tale has been told." },
    fate: {
      critFail: "CRITICAL FAILURE: Your keyboard sparks, a bug enters production, and the coffee machine is empty.",
      fail: "A clumsy effort. The code compiles, but the CSS is haunting your dreams.",
      mid: "A mediocre check. You found a Stack Overflow answer, but it's from 2012.",
      good: "Solid work. You refactored a function and shaved 20ms off the load time.",
      great: "Great Success! Your PR was approved without comments.",
      critSuccess: "CRITICAL SUCCESS: 100% Test Coverage achieved. Peak architectural enlightenment."
    },
    questsData: [
      { type: "Epic Quest", title: "Lead Frontend Sorcerer", guild: "Nebula Corp", description: "Orchestrated the migration of a legacy monolithic kingdom into a vibrant micro-frontend empire." },
      { type: "Side Quest", title: "Senior UI Alchemist", guild: "Pixel Forge", description: "Transmuted complex data visualizations into intuitive, gold-standard user interfaces." }
    ],
    projectsData: [
      { title: "Aether Exchange", desc: "A decentralized portal for trading mystical digital assets using smart contract incantations." },
      { title: "The Oracle Engine", desc: "A scrying tool using neural patterns to predict market fluctuations across the seven realms." },
      { title: "Shadow Network", desc: "A real-time communication array for underground guilds to share encrypted whispers." },
      { title: "Parchment Script", desc: "A simple but effective automation tool for scribes to manage repetitive administrative scrolls." }
    ],
    skillsData: ["Fire Magic (Frontend)", "Blacksmithing (Backend)", "Alchemy (Tools)"],
    libraryTitles: ["The Ritual of Code Review", "Technical Debt Dragons", "Clean Architecture Spells", "The UI Alchemist's Guide", "Frontend Necromancy", "The Backend Forge", "Slaying Slow Queries", "The Scroll of TypeScript", "CSS Sorcery", "Deployment Divination", "The React Grimoire", "Microservice Guilds", "Agile Adventuring", "Cloud Realm Conquests", "Unit Test Enchantments", "Refactoring Alchemy", "The State Management Staff", "Performance Potions", "Legacy Code Crypts", "API Artifacts", "The Last Commit"],
    partyData: { se: "Software Engineer", fs: "Full Stack Developer", dani: "Dani always helps me with coding because he’s really quick at solving problems.", beber: "Berli is basically my walking encyclopedia because I feel like he knows everything.", sheila: "Sheila is a great person to hang out with, and she’s very curious about everything and loves trying new things." }
  },
  id: {
    hero: { name: "Aditya Sang Paladin", class: "Full-Stack Developer", bio: "Kumpulkan para petualang! Perjalananku dimulai di bengkel sekolah kejuruan, tempatku pertama kali belajar menempa logika yang mengikat dunia. Sejak tahun 2016, aku telah ditempatkan di Kota Kembang, menciptakan keajaiban digital untuk serikat pedagang lokal. Sungguh beban berat yang kupikul, karena aku juga berjalan di aula Akademi Widyatama untuk menguasai keahlianku sementara seluruh negeri tertidur." },
    nav: { hero: "Pahlawan", quests: "Misi", portfolio: "Tas", skills: "Mantra", library: "Perpustakaan", party: "Rekan", guild: "Serikat" },
    sections: {
      quests: { title: "Catatan Misi", subtitle: "Arsip kampanye dan teknologi yang telah dikuasai." },
      portfolio: { title: "Tas Petualang", subtitle: "Koleksi artefak yang dikumpulkan di seluruh alam digital." },
      skills: { title: "Pohon Keahlian", subtitle: "Penguasaan teknis yang dikategorikan berdasarkan disiplin ilmu kuno." },
      library: { title: "Perpustakaan Agung", subtitle: "Arsip catatan dan penelitian teknis." },
      party: { title: "Rekan Perjalanan", subtitle: "Kolaborator dan teman dari kampanye masa lalu." },
      guild: { title: "Balai Serikat", subtitle: "Saluran resmi untuk koordinasi ekspedisi di masa depan." }
    },
    ui: { health: "Darah", mana: "Mana", lvl: "LVL", message: "Kirim Pesan", viewCv: "Buka Lembar Karakter", fateTitle: "Sistem Takdir", rollBtn: "Lempar Dadu Inisiatif!", rolling: "Menghubungi...", spellsCast: "Mantra:", totalArchives: "Total Arsip", prohibited: "Sihir dilarang di dalam perpustakaan.", guildHall: "Masuki Balai Serikat", recorded: "Dicatat", archivalRecord: "Catatan Arsip", visit: "Lihat Artefak", copyright: "ALBN-99-2026 / SISTEM AMAN / DIBUAT DENGAN REACT & SIHIR", inspect: "Periksa Item", itemBox: "Slot Inventaris", stats: "Properti", loot: "Komponen Arcane", close: "Tutup", backToLibrary: "Kembali ke Perpustakaan", prevBook: "Kitab Sebelumnya", previousBook: "Jilid Sebelumnya", nextBook: "Jilid Berikutnya", readingTime: "menit baca", pennedBy: "Ditulis oleh", volume: "Jil.", yearOfEra: "Tahun {year} {era}", turnPage: "Gunakan ← → untuk membalik halaman", emptyLibraryTitle: "Tinta belum kering.", emptyLibraryBody: "Belum ada gulungan yang ditulis di arsip ini. Kembalilah saat kisah pertama selesai dituturkan." },
    fate: {
      critFail: "KEGAGALAN KRITIS: Keyboardmu memercik, bug masuk ke produksi, dan mesin kopi kosong.",
      fail: "Usaha yang canggung. Kode berhasil dikompilasi, tapi CSS menghantui mimpimu.",
      mid: "Pemeriksaan rata-rata. Kamu menemukan jawaban Stack Overflow, tapi dari tahun 2012.",
      good: "Pekerjaan solid. Kamu merombak fungsi dan memangkas waktu muat sebesar 20ms.",
      great: "Keberhasilan Besar! PR disetujui tanpa komentar.",
      critSuccess: "KEBERHASILAN KRITIS: Cakupan Tes 100% tercapai. Pencerahan arsitektur tertinggi."
    },
    questsData: [
      { type: "Misi Epik", title: "Penyihir Frontend Utama", guild: "Nebula Corp", description: "Mengatur migrasi kerajaan monolitik lama menjadi kekaisaran micro-frontend yang dinamis." },
      { type: "Misi Sampingan", title: "Alkemis UI Senior", guild: "Pixel Forge", description: "Mengubah visualisasi data yang kompleks menjadi antarmuka pengguna standar emas yang intuitif." }
    ],
    projectsData: [
      { title: "Pertukaran Aether", desc: "Portal terdesentralisasi untuk memperdagangkan aset digital mistis menggunakan mantra kontrak pintar." },
      { title: "Mesin Ramalan", desc: "Alat pengintai menggunakan pola saraf untuk memprediksi fluktuasi pasar di tujuh alam." },
      { title: "Jaringan Bayangan", desc: "Larik komunikasi real-time untuk serikat bawah tanah berbagi bisikan terenkripsi." },
      { title: "Skrip Perkamen", desc: "Alat otomatisasi sederhana namun efektif bagi juru tulis untuk mengelola gulungan administratif." }
    ],
    skillsData: ["Sihir Api (Frontend)", "Pandai Besi (Backend)", "Alkimia (Alat)"],
    libraryTitles: ["Ritual Peninjauan Kode", "Naga Hutang Teknis", "Mantra Arsitektur Bersih", "Panduan Alkemis UI", "Nekromansi Frontend", "Tempaan Backend", "Membasmi Query Lambat", "Gulungan TypeScript", "Sihir CSS", "Ramalan Deployment", "Grimoire React", "Serikat Mikroservis", "Petualangan Agile", "Penaklukan Alam Awan", "Enchantment Unit Test", "Alkimia Refactoring", "Tongkat Manajemen State", "Ramuan Performa", "Ruang Bawah Tanah Kode Warisan", "Artefak API", "Commit Terakhir"],
    partyData: { pm: "Manajer Produk", devops: "Ketua DevOps", sarah: "Alaric selalu menemukan jalan pintas melalui hutan fitur terpadat.", marcus: "Kode yang andal dan kokoh. Sistemnya tidak pernah mati dalam pertempuran panas." }
  }
};
