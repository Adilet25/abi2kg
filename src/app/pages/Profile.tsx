import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { profileService, type ProfileData } from "../services/profileService";
import { universities } from "../data";
import { UniversityCard } from "../components/UniversityCard";
import {
  Settings, Bookmark, GraduationCap, MapPin,
  Target, Heart, Languages, Loader2,
} from "lucide-react";

const DEFAULT_BUDGET = 30000;

export function Profile() {
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "preferences";

  // Поля формы (строки для input'ов)
  const [fields, setFields] = useState({
    ortScore: "",
    gpa: "",
    budget: DEFAULT_BUDGET,
    city: "",
    targetField: "",
    interests: "",
    languages: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  // Загружаем профиль с бэкенда
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    profileService
      .get(user.id)
      .then((data) => {
        setFields({
          ortScore: data.ort_score?.toString() ?? "",
          gpa: data.gpa?.toString() ?? "",
          budget: data.budget_kgs ?? DEFAULT_BUDGET,
          city: data.city ?? "",
          targetField: data.target_field ?? "",
          interests: data.interests?.join(", ") ?? "",
          languages: data.languages?.join(", ") ?? "",
        });
      })
      .catch(() => {
        // Профиль ещё не создан — оставляем дефолты, это нормально
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload: ProfileData = {
        ort_score: fields.ortScore ? parseInt(fields.ortScore) : null,
        gpa: fields.gpa ? parseFloat(fields.gpa) : null,
        budget_kgs: fields.budget,
        city: fields.city || null,
        target_field: fields.targetField || null,
        interests: fields.interests
          ? fields.interests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        languages: fields.languages
          ? fields.languages.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await profileService.save(user.id, payload);
      setSaveMsg({ text: "Профиль сохранён!", ok: true });
    } catch {
      setSaveMsg({ text: "Ошибка сохранения. Попробуй ещё раз.", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  if (!isAuthenticated) return null;

  const tabs = [
    { id: "preferences", name: "Мои данные", icon: Settings },
    { id: "saved", name: "Сохранённые вузы", icon: Bookmark },
  ];

  // saved unis пока из data.ts (бэкенд для этого не готов)
  const savedUnisData = universities.filter((u: any) =>
    (user as any)?.savedUniversities?.includes(u.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center shadow-md border-4 border-white">
              <span className="text-3xl font-black text-indigo-600">
                {user?.full_name?.charAt(0).toUpperCase() ?? "?"}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user?.full_name}</h1>
              <p className="text-lg text-gray-500 mt-1">{user?.email}</p>
            </div>
            <div className="sm:ml-auto flex gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">ОРТ</div>
                <div className="text-xl font-black text-indigo-700">
                  {fields.ortScore || "—"}<span className="text-sm font-medium text-indigo-400">/245</span>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-center">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">GPA</div>
                <div className="text-xl font-black text-indigo-700">
                  {fields.gpa ? parseFloat(fields.gpa).toFixed(1) : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchParams({ tab: tab.id })}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-indigo-700" : "text-gray-400"} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main */}
          <div className="flex-1">

            {activeTab === "preferences" && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-2xl font-bold text-gray-900">Мои данные</h2>
                  <p className="mt-1 text-gray-500">Заполни — ИИ подберёт подходящие вузы.</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-10">

                    {/* Академический профиль */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <GraduationCap className="text-indigo-600" size={20} /> Академический профиль
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Балл ОРТ (макс. 245)</label>
                          <input
                            type="number" min="0" max="245" placeholder="например 180"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            value={fields.ortScore}
                            onChange={(e) => {
                              let v = e.target.value;
                              if (v && parseInt(v) > 245) v = "245";
                              setFields({ ...fields, ortScore: v });
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GPA <span className="text-gray-400 font-normal">(необязательно)</span>
                          </label>
                          <input
                            type="number" min="0" max="4" step="0.01" placeholder="например 3.8"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            value={fields.gpa}
                            onChange={(e) => {
                              let v = e.target.value;
                              if (v && parseFloat(v) > 4) v = "4";
                              setFields({ ...fields, gpa: v });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Предпочтения */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Target className="text-indigo-600" size={20} /> Предпочтения
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Желаемая специальность</label>
                          <input
                            type="text" placeholder="например Информатика"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            value={fields.targetField}
                            onChange={(e) => setFields({ ...fields, targetField: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                            <MapPin size={16} className="text-gray-400" /> Предпочтительный город
                          </label>
                          <input
                            type="text" placeholder="например Бишкек"
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            value={fields.city}
                            onChange={(e) => setFields({ ...fields, city: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Максимальный годовой бюджет (сом)</label>
                        <div className="mt-2 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <input
                            type="range" min="10000" max="200000" step="5000"
                            value={fields.budget}
                            onChange={(e) => setFields({ ...fields, budget: parseInt(e.target.value) })}
                            className="w-full max-w-md accent-indigo-600"
                          />
                          <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded shadow-sm border border-gray-200 whitespace-nowrap">
                            {fields.budget.toLocaleString()} сом
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* О себе */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Heart className="text-indigo-600" size={20} /> О себе
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Интересы (через запятую)</label>
                        <input
                          type="text" placeholder="например Технологии, Медицина, Спорт"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={fields.interests}
                          onChange={(e) => setFields({ ...fields, interests: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                          <Languages size={16} className="text-gray-400" /> Языки (через запятую)
                        </label>
                        <input
                          type="text" placeholder="например Русский, Кыргызский, Английский"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          value={fields.languages}
                          onChange={(e) => setFields({ ...fields, languages: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                      <button
                        type="submit" disabled={saving}
                        className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center gap-2"
                      >
                        {saving && <Loader2 className="animate-spin" size={16} />}
                        Сохранить
                      </button>
                      {saveMsg && (
                        <span className={`text-sm font-medium ${saveMsg.ok ? "text-green-600" : "text-red-600"}`}>
                          {saveMsg.text}
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Сохранённые вузы</h2>
                    <p className="mt-1 text-gray-500">Вузы, которые тебя заинтересовали.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                    {savedUnisData.length} сохранено
                  </span>
                </div>
                {savedUnisData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {savedUnisData.map((uni: any) => (
                      <UniversityCard key={uni.id} university={uni} isSaved={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Нет сохранённых вузов</h3>
                    <p className="mt-1 text-gray-500">Ты ещё не сохранил ни одного вуза.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
