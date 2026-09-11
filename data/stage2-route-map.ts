/** Mirrors Flutter `LessonFlowNotifier._stage2RouteMap`. */
export const STAGE2_ROUTE_MAP: Record<string, string> = {
  ib_pyp: "pyp",
  ib_myp: "myp",
  ib_dp: "dp",
  uk_national_ks1_ks2: "uk-ks1-ks2",
  uk_national_ks3: "uk-ks3",
  uk_national_ks4_gcse: "uk-ks4-gcse",
  uk_national_ks5_as_a_level: "uk-ks5-alevel",
  cambridge_primary: "cambridge-primary",
  cambridge_primary_checkpoint: "cambridge-primary-checkpoint",
  cambridge_lower_secondary: "cambridge-lower-secondary",
  cambridge_lower_secondary_checkpoint: "cambridge-lower-checkpoint",
  cambridge_igcse: "igcse",
  cambridge_as_a_level: "cambridge-as-alevel",
  pearson_edexcel_ks1_ks2: "edexcel-ks1-ks2",
  pearson_edexcel_ks3: "edexcel-ks3",
  pearson_edexcel_ks4: "edexcel-ks4",
  pearson_edexcel_ks5: "edexcel-ks5",
  us_elementary: "us-elementary",
  us_middle_school: "us-middle",
  us_high_school: "us-highschool",
  us_ap_pathway: "us-ap",
  australian_nsw_primary: "nsw-primary",
  australian_nsw_secondary: "nsw-secondary",
  australian_nsw_hsc: "nsw-hsc",
  australian_vic_primary: "vic-primary",
  australian_vic_secondary: "vic-secondary",
  australian_vic_vce: "vce",
  australian_qld_primary: "qld-primary",
  australian_qld_secondary: "qld-secondary",
  australian_qld_qce: "qce",
  australian_wa_primary: "wa-primary",
  australian_wa_secondary: "wa-secondary",
  australian_wa_wace: "wace",
  australian_sa_primary: "sa-primary",
  australian_sa_secondary: "sa-secondary",
  australian_sa_sace: "sace",
  australian_tas_primary: "tas-primary",
  australian_tas_secondary: "tas-secondary",
  australian_tas_tce: "tce",
  australian_act_primary: "act-primary",
  australian_act_senior: "act-senior",
  australian_nt_primary: "nt-primary",
  australian_nt_secondary: "nt-secondary",
  australian_nt_ntcet: "ntcet",
  canadian_ontario_elementary: "ontario-elem",
  canadian_ontario_secondary: "ontario-7-10",
  canadian_ontario_ossd: "ossd-11-12",
  canadian_bc_elementary: "bc-elem",
  canadian_bc_secondary: "bc-7-10",
  canadian_bc_dogwood: "bc-dogwood",
  canadian_alberta_elementary: "alberta-elem",
  canadian_alberta_secondary: "alberta-7-10",
  canadian_alberta_diploma: "alberta-diploma",
  canadian_quebec_elementary: "quebec-elem",
  canadian_quebec_secondary: "quebec-7-10",
  canadian_quebec_des: "quebec-des",
  canadian_manitoba_elementary: "manitoba-elem",
  canadian_manitoba_secondary: "manitoba-7-10",
  canadian_manitoba_diploma: "manitoba-senior",
  canadian_saskatchewan_elementary: "sask-elem",
  canadian_saskatchewan_secondary: "sask-7-10",
  canadian_saskatchewan_diploma: "sask-11-12",
  canadian_maritimes_elementary: "atlantic-elem",
  canadian_maritimes_secondary: "atlantic-7-10",
  canadian_maritimes_diploma: "atlantic-11-12",
  canadian_territories_elementary: "northern-elem",
  canadian_territories_secondary: "northern-7-10",
  canadian_territories_diploma: "northern-11-12",
};

export function mapStage2RouteId(mappedCurriculumId: string): string {
  const id = mappedCurriculumId.trim();
  return STAGE2_ROUTE_MAP[id] ?? id;
}

export function fallbackStage2RouteId(topLevelId: string): string {
  const top = topLevelId.toLowerCase();
  if (top.includes("us")) return "us-highschool";
  return "uk-ks3";
}


