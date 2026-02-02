import { dictionaries } from "@/data/dictionaries";
import mockData from "@/data/mock.json";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const t = dictionaries.ru;
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.nav.dashboard}</h1>
                <p className="text-muted-foreground mt-1">
                    Обзор состояния портфеля на {new Date().toLocaleDateString('ru-RU')}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockData.kpis.map((kpi, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-slate-500">{kpi.label}</span>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4"/></button>
                        </div>
                        <div className="flex items-baseline gap-2">
                             <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                             <div className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center",
                                kpi.change.startsWith('+') 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-rose-100 text-rose-700"
                             )}>
                                {kpi.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {kpi.change}
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for recent activity or charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm p-6 rounded-xl border shadow-sm min-h-[400px]">
                    <h3 className="font-semibold text-slate-900 mb-4">Структура капитала</h3>
                    <div className="flex items-center justify-center h-full text-muted-foreground pb-12">
                        График распределения активов
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Ближайшие события</h3>
                    <div className="space-y-4">
                         {/* Mock list */}
                         {[1,2,3].map((_, i) => (
                             <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-100">
                                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                     DEC
                                 </div>
                                 <div>
                                     <div className="text-sm font-medium">Квартальный отчет</div>
                                     <div className="text-xs text-muted-foreground">Orion Family Trust</div>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
