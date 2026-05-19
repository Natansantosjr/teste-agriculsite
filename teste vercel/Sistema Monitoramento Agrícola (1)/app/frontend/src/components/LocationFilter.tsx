import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/api";
import { withRetry } from "@/lib/retry";
import { MapPin } from "lucide-react";

interface Region {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  region_id: string;
}

interface City {
  id: string;
  name: string;
  state_id: string;
}

export function LocationFilter() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    loadRegions();
  }, []);

  async function loadRegions() {
    try {
      const response = await withRetry(() => client.entities.regions.query({}));
      const items = response?.data?.items || [];
      setRegions(items as Region[]);
    } catch {
      setRegions([]);
    }
  }

  async function handleRegionChange(regionId: string) {
    setSelectedRegion(regionId);
    setSelectedState("");
    setSelectedCity("");
    setCities([]);
    if (regionId) {
      try {
        const response = await withRetry(() =>
          client.entities.states.query({
            query: { region_id: regionId },
          })
        );
        const items = response?.data?.items || [];
        setStates(items as State[]);
      } catch {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }

  async function handleStateChange(stateId: string) {
    setSelectedState(stateId);
    setSelectedCity("");
    if (stateId) {
      try {
        const response = await withRetry(() =>
          client.entities.cities.query({
            query: { state_id: stateId },
          })
        );
        const items = response?.data?.items || [];
        setCities(items as City[]);
      } catch {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
      <Select value={selectedRegion} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-[140px] bg-[#0F172A] border-white/10 text-[#F8FAFC] text-xs h-8">
          <SelectValue placeholder="Região" />
        </SelectTrigger>
        <SelectContent className="bg-[#1E293B] border-white/10">
          {regions.map((r) => (
            <SelectItem key={r.id} value={r.id} className="text-[#F8FAFC] text-xs">
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedState} onValueChange={handleStateChange} disabled={!selectedRegion}>
        <SelectTrigger className="w-[140px] bg-[#0F172A] border-white/10 text-[#F8FAFC] text-xs h-8">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent className="bg-[#1E293B] border-white/10">
          {states.map((s) => (
            <SelectItem key={s.id} value={s.id} className="text-[#F8FAFC] text-xs">
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
        <SelectTrigger className="w-[140px] bg-[#0F172A] border-white/10 text-[#F8FAFC] text-xs h-8">
          <SelectValue placeholder="Município" />
        </SelectTrigger>
        <SelectContent className="bg-[#1E293B] border-white/10">
          {cities.map((c) => (
            <SelectItem key={c.id} value={c.id} className="text-[#F8FAFC] text-xs">
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}