// services/region.service.ts
// 使用 country-state-city 包提供 ISO 3166-1 标准国家/城市数据
import { Country, City } from 'country-state-city';

export interface CountryOption {
  isoCode: string;   // ISO 3166-1 alpha-2, e.g. "US"
  name: string;      // e.g. "United States"
  flag?: string;
}

/** 获取所有国家列表（按名称排序） */
export function getEnabledCountries(): CountryOption[] {
  return Country.getAllCountries()
    .map(c => ({ isoCode: c.isoCode, name: c.name, flag: c.flag }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** 根据国家 ISO code 获取城市列表（去重排序） */
export function getEnabledCities(countryIsoCode: string): string[] {
  const cities = City.getCitiesOfCountry(countryIsoCode);
  if (!cities || cities.length === 0) return [];
  return [...new Set(cities.map(c => c.name))].sort();
}

/** 根据 ISO code 获取国家名称 */
export function getCountryName(isoCode: string): string {
  return Country.getCountryByCode(isoCode)?.name ?? isoCode;
}
