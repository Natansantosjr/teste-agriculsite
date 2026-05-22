import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Satellite, Brain, FileCheck, Globe, ChevronDown } from "lucide-react";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-10/oixqvjaaagqq/landing-hero-satellite-field.png)`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/60 to-[#0F172A]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <img
            src="/assets/cambui-logo.png"
            alt="Cambuí Online"
            className="w-20 h-20 mx-auto mb-8 rounded-2xl shadow-lg shadow-emerald-500/20"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Plataforma de Inteligência Geoespacial para{" "}
            <span className="text-emerald-400">Monitoramento Agrícola</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Monitoramento por satélite com inteligência artificial e conformidade fiscal integrada.
            Análise de NDVI, detecção de anomalias e gestão territorial em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 text-lg"
            >
              Acessar Plataforma
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 border border-white/20 hover:border-emerald-400/50 text-[#F8FAFC] font-semibold rounded-xl transition-all duration-300 hover:bg-white/5 text-lg"
            >
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-[#1E293B]/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <AnimatedCounter end={2.4} suffix="M" />
            <p className="text-sm text-gray-400 mt-2">ha Monitorados</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={12} />
            <p className="text-sm text-gray-400 mt-2">Culturas</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={847} />
            <p className="text-sm text-gray-400 mt-2">Anomalias Detectadas</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={312} prefix="R$ " suffix="M" />
            <p className="text-sm text-gray-400 mt-2">Recuperação Fiscal</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnologia de Ponta para o{" "}
              <span className="text-emerald-400">Agronegócio</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Soluções integradas de monitoramento, análise e conformidade para gestão agrícola inteligente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Analysis */}
            <div className="group relative bg-[#1E293B]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-10/oixqylyaagoq/landing-feature-ai-analysis.png"
                  alt="Análise por IA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Análise por IA</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Algoritmos de machine learning para detecção automática de anomalias,
                  previsão de safra e classificação de culturas com precisão superior a 95%.
                </p>
              </div>
            </div>

            {/* Feature 2 - Fiscal Integration */}
            <div className="group relative bg-[#1E293B]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-10/oixq2iqaagnq/landing-feature-fiscal-integration.png"
                  alt="Integração Fiscal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integração Fiscal</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Cruzamento automático de dados produtivos com registros fiscais,
                  identificando divergências e otimizando a recuperação tributária.
                </p>
              </div>
            </div>

            {/* Feature 3 - Geospatial */}
            <div className="group relative bg-[#1E293B]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-10/oixqwbqaagqa/landing-feature-geospatial.png"
                  alt="Dados Geoespaciais"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dados Geoespaciais</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Imagens multiespectrais de satélite com análise NDVI, EVI e índices
                  vegetativos para monitoramento contínuo da saúde das culturas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 bg-[#1E293B]/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <Satellite className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-6">
            Tecnologia de Monitoramento Avançado
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 text-lg">
            Nossa plataforma combina índices vegetativos (NDVI, EVI, SAVI) com modelos de
            machine learning treinados em milhões de hectares de dados agrícolas brasileiros.
            Todo o processamento segue rigorosos padrões de conformidade LGPD, garantindo
            a proteção dos dados dos produtores e a integridade das informações fiscais.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["NDVI", "Machine Learning", "LGPD", "Tempo Real"].map((tech) => (
              <div
                key={tech}
                className="px-4 py-3 bg-[#0F172A]/60 border border-white/10 rounded-xl text-sm text-emerald-400 font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/cambui-logo.png"
              alt="Cambuí Online"
              className="w-16 h-16 object-contain rounded-2xl shadow-lg shadow-emerald-500/20 mb-8"
            />
            <span className="font-bold text-lg">CAMBUÍ ONLINE</span>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Secretaria da Fazenda — Plataforma de Monitoramento Agrícola
          </p>
          <p className="text-xs text-gray-500">
            © 2026 Cambuí Online. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}