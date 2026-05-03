"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const typeColors = {
  reels: "bg-virel-purple-500",
  stories: "bg-virel-blue-500",
  post: "bg-green-500",
  carousel: "bg-orange-500",
};

const scheduledPosts: Record<number, { title: string; type: keyof typeof typeColors; time: string }[]> = {
  2: [{ title: "Tutorial fitness", type: "reels", time: "09:00" }],
  5: [{ title: "Dica do dia", type: "stories", time: "14:00" }, { title: "Post motivacional", type: "post", time: "18:00" }],
  8: [{ title: "Bastidores", type: "stories", time: "12:00" }],
  12: [{ title: "Review produto", type: "post", time: "10:00" }],
  15: [{ title: "Tutorial makeup", type: "reels", time: "15:00" }, { title: "Q&A stories", type: "stories", time: "19:00" }],
  19: [{ title: "Transformação", type: "reels", time: "08:00" }],
  22: [{ title: "Dica semanal", type: "post", time: "11:00" }],
  25: [{ title: "Unboxing", type: "reels", time: "16:00" }, { title: "Enquete", type: "stories", time: "20:00" }],
  28: [{ title: "Reflexão mensal", type: "carousel", time: "09:00" }],
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function PlannerPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Planejador de Conteúdo</h1>
          <p className="text-white/50 mt-1">Organize seus posts com antecedência</p>
        </div>
        <Button size="sm">
          <Plus size={16} />
          Agendar Post
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-white/30 text-xs font-medium py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const posts = day ? scheduledPosts[day] ?? [] : [];
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[80px] rounded-lg p-1.5 transition-colors",
                  day ? "hover:bg-white/3 cursor-pointer" : "",
                  isToday ? "bg-virel-purple-500/10 border border-virel-purple-500/30" : "border border-transparent"
                )}
              >
                {day && (
                  <>
                    <span className={cn(
                      "text-xs font-medium block mb-1 text-right",
                      isToday ? "text-virel-purple-400" : "text-white/50"
                    )}>
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {posts.map((post, j) => (
                        <div
                          key={j}
                          className={cn(
                            "text-xs text-white rounded px-1 py-0.5 truncate",
                            typeColors[post.type]
                          )}
                        >
                          {post.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-white/50 text-xs capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
