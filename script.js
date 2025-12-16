import React, { useState, useMemo } from 'react';
import { Trophy, TrendingDown, Users, Search, BarChart3, AlertCircle } from 'lucide-react';

// --- Data Sumber ---
// Data didigitalkan dari gambar papan tulis
// Tanda '-' diasumsikan sebagai 0
const rawData = [
  { name: "ABDUL", scores: [10, 20, 7, 12, 12, 0, 0, 20, 25, 12, 17, 0, 24] },
  { name: "ANJAS", scores: [9, 10, 6, 7, 0, 0, 34, 0, 18, 13, 8, 0, 4] },
  { name: "DENI", scores: [17, 11, 10, 10, 0, 0, 0, 1, 8, 0, 6, 18, 0] },
  { name: "IQBAL", scores: [3, 8, 7, 0, 6, 17, 9, 9, 0, 9, 3, 0, 13] },
  { name: "IMAM", scores: [0, 1, 10, 13, 10, 0, 0, 8, 5, 7, 2, 19, 0] },
  { name: "JANUAR", scores: [0, 2, 9, 17, 16, 0, 0, 5, 6, 18, 15, 50, 0] },
  { name: "JOSHUA", scores: [0, 3, 10, 0, 6, 14, 0, 0, 4, 0, 4, 10, 3] },
  // Baris ke-8 tidak terbaca/kosong di papan, di-skip
  { name: "PRAHARA", scores: [10, 7, 2, 9, 18, 0, 0, 16, 12, 5, 2, 25, 0] },
  { name: "RAFLI", scores: [0, 8, 16, 0, 9, 27, 20, 0, 0, 5, 15, 26, 5] },
  { name: "REANDI", scores: [16, 0, 3, 32, 7, 0, 0, 13, 25, 13, 3, 0, 0] },
  { name: "REDI", scores: [0, 10, 30, 17, 12, 19, 36, 22, 13, 11, 12, 0, 2] },
  { name: "RIKI", scores: [21, 0, 9, 19, 12, 13, 30, 0, 21, 0, 8, 25, 0] },
  { name: "RIFO", scores: [0, 17, 29, 0, 13, 14, 35, 8, 11, 0, 0, 27, 6] },
  { name: "RYAN", scores: [22, 14, 5, 6, 6, 0, 0, 12, 29, 10, 5, 15, 0] },
  { name: "ROBI", scores: [0, 14, 0, 13, 6, 0, 0, 14, 0, 0, 4, 11, 11] },
  { name: "RIZKY", scores: [0, 5, 0, 19, 10, 10, 15, 0, 11, 14, 4, 10, 16] },
  { name: "REXXY", scores: [0, 5, 18, 13, 0, 0, 10, 21, 4, 0, 6, 0, 23] },
  { name: "SEPTI", scores: [0, 0, 13, 5, 18, 20, 0, 0, 16, 9, 10, 0, 0] },
  { name: "WIWID", scores: [0, 6, 0, 0, 7, 8, 15, 0, 3, 0, 0, 27, 2] }
];

// --- Komponen Card (Komponen Pembungkus Umum) ---
const Card = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
      {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- Komponen Item Peringkat (Digunakan di Top 10 / Bottom 10) ---
const RankItem = ({ rank, name, score, maxScore, type = "top" }) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="flex items-center gap-4 mb-4 last:mb-0">
      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
        ${rank <= 3 && type === 'top' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
        {rank}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-slate-700">{name}</span>
          <span className="font-bold text-slate-900">{score}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${type === 'top' ? 'bg-indigo-500' : 'bg-rose-400'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama Aplikasi ---
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Memproses data: menghitung total dan rata-rata (hanya dihitung ulang jika rawData berubah)
  const processedData = useMemo(() => {
    return rawData.map(picker => {
      const total = picker.scores.reduce((a, b) => a + b, 0);
      const activeDays = picker.scores.filter(s => s > 0).length;
      const average = activeDays > 0 ? (total / activeDays).toFixed(1) : 0;
      return { ...picker, total, average };
    });
  }, []); // Dependensi kosong, hanya dijalankan sekali

  // 1. Mengurutkan berdasarkan Abjad (A-Z) untuk Tabel Utama & Filter Pencarian
  const alphabeticalData = useMemo(() => {
    let data = [...processedData].sort((a, b) => a.name.localeCompare(b.name));
    if (searchTerm) {
      data = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [processedData, searchTerm]); // Dijalankan ulang jika data diproses atau term pencarian berubah

  // 2. Menentukan 10 Teratas (Berdasarkan Total Skor)
  const top10 = useMemo(() => {
    return [...processedData]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [processedData]);

  // 3. Menentukan 10 Terbawah
  const bottom10 = useMemo(() => {
    return [...processedData]
      .sort((a, b) => a.total - b.total)
      .slice(0, 10);
  }, [processedData]);

  const maxTotalScore = Math.max(...processedData.map(p => p.total));

  // --- JSX Output ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Picker Performance</h1>
            <p className="text-slate-500">Desember 2025 • Dashboard Monitoring Kinerja</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama picker..." 
              className="outline-none bg-transparent text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Top 10 Card */}
          <Card title="Top 10 Performers" icon={Trophy} className="border-t-4 border-t-indigo-500">
            <div className="space-y-1">
              {top10.map((picker, index) => (
                <RankItem 
                  key={picker.name}
                  rank={index + 1}
                  name={picker.name}
                  score={picker.total}
                  maxScore={maxTotalScore}
                  type="top"
                />
              ))}
            </div>
          </Card>

          {/* Bottom 10 Card */}
          <Card title="Bottom 10 (Perlu Evaluasi)" icon={TrendingDown} className="border-t-4 border-t-rose-500">
            <div className="space-y-1">
              {bottom10.map((picker, index) => (
                <RankItem 
                  key={picker.name}
                  rank={index + 1}
                  name={picker.name}
                  score={picker.total}
                  maxScore={maxTotalScore} // Menggunakan maxScore yang sama agar skala visual sebanding
                  type="bottom"
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Main Table Section */}
        <Card title="Data Lengkap (Urut Abjad)" icon={Users} className="overflow-visible">
           {/* Mobile Warning */}
           <div className="md:hidden flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>Geser tabel ke samping untuk melihat detail harian</span>
           </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-bold text-slate-700 sticky left-0 bg-slate-50 shadow-sm z-10 w-40">Nama Picker</th>
                  <th className="px-6 py-3 text-center text-indigo-600 font-bold bg-indigo-50">Total</th>
                  <th className="px-6 py-3 text-center">Rata-rata</th>
                  {Array.from({ length: 13 }).map((_, i) => (
                    <th key={i} className="px-3 py-3 text-center min-w-[3rem] border-l border-slate-100 font-medium">
                      H-{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alphabeticalData.length > 0 ? (
                  alphabeticalData.map((picker, idx) => (
                    <tr key={picker.name} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 sticky left-0 bg-white hover:bg-slate-50 shadow-sm z-10">
                        {picker.name}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50/50">
                        {picker.total}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {picker.average}
                      </td>
                      {picker.scores.map((score, i) => (
                        <td key={i} className={`px-3 py-4 text-center border-l border-slate-100 ${score === 0 ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                          {score === 0 ? '-' : score}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data picker ditemukan untuk "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-slate-400 text-right">
            * Data dikompilasi dari papan tulis performance manual. Tanda strip (-) dihitung sebagai 0.
          </div>
        </Card>

      </div>
    </div>
  );
}