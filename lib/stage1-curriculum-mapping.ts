/** Port of Flutter CurriculumService.getCurriculumIdFromPathway — do not invent routes. */

export function getCurriculumIdFromPathway(pathwayId: string, gradeId: string): string | null {
    // Map pathway ID and grade to curriculum ID
    switch (pathwayId) {
      case 'uk_national': {
        // Handle special grade IDs first
        if (gradeId === 'nursery' || gradeId === 'reception') {
          // EYFS - map to KS1/KS2 curriculum
          return 'uk_national_ks1_ks2';
        } else if (gradeId === 'gcse') {
          return 'uk_national_ks4_gcse';
        } else if (gradeId === 'as_level') {
          return 'uk_national_ks5_as_a_level';
        } else if (gradeId === 'a_level') {
          return 'uk_national_ks5_as_a_level';
        }
        // Handle numeric grades
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 1 && grade <= 6) {
          return 'uk_national_ks1_ks2';
        } else if (grade >= 7 && grade <= 9) {
          return 'uk_national_ks3';
        }
        break;
      }
      case 'cambridge_international': {
        // Handle special grade IDs first
        if (gradeId === 'nursery' || gradeId === 'reception') {
          // Early Years - map to Primary curriculum
          return 'cambridge_primary';
        } else if (gradeId === 'primary_checkpoint') {
          return 'cambridge_primary_checkpoint';
        } else if (gradeId === 'lower_secondary_checkpoint') {
          return 'cambridge_lower_secondary_checkpoint';
        } else if (gradeId === 'igcse') {
          return 'cambridge_igcse';
        } else if (gradeId === 'as_level') {
          return 'cambridge_as_a_level';
        } else if (gradeId === 'a_level') {
          return 'cambridge_as_a_level';
        }
        // Handle numeric grades
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 1 && grade <= 6) {
          return 'cambridge_primary';
        } else if (grade >= 7 && grade <= 9) {
          return 'cambridge_lower_secondary';
        }
        break;
      }
      case 'pearson_edexcel': {
        // Handle special grade IDs first
        if (gradeId === 'nursery' || gradeId === 'reception') {
          // EYFS - map to KS1/KS2 curriculum
          return 'pearson_edexcel_ks1_ks2';
        } else if (gradeId === 'gcse_edexcel') {
          return 'pearson_edexcel_ks4';
        } else if (gradeId === 'as_level') {
          return 'pearson_edexcel_ks5';
        } else if (gradeId === 'a_level') {
          return 'pearson_edexcel_ks5';
        }
        // Handle numeric grades
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 1 && grade <= 6) {
          return 'pearson_edexcel_ks1_ks2';
        } else if (grade >= 7 && grade <= 9) {
          return 'pearson_edexcel_ks3';
        }
        break;
      }
      case 'us_standards': {
        // US Standards (Common Core / NGSS) mapping
        if (gradeId === 'k') {
          // Kindergarten - map to Elementary
          return 'us_elementary';
        }
        // Handle numeric grades
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 1 && grade <= 5) {
          return 'us_elementary';
        } else if (grade >= 6 && grade <= 8) {
          return 'us_middle_school';
        } else if (grade >= 9 && grade <= 12) {
          return 'us_high_school';
        }
        break;
      }
      case 'ap_pathway': {
        // Advanced Placement (AP) Pathway mapping
        // All AP grades (9-12) map to AP pathway curriculum
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 9 && grade <= 12) {
          return 'us_ap_pathway';
        }
        break;
      }
      case 'ib_pyp': {
        // IB Primary Years Programme (PYP) mapping
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 1 && grade <= 5) {
          return 'ib_pyp';
        }
        break;
      }
      case 'ib_myp': {
        // IB Middle Years Programme (MYP) mapping
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 6 && grade <= 10) {
          return 'ib_myp';
        }
        break;
      }
      case 'ib_dp': {
        // IB Diploma Programme (DP) mapping
        const grade = Number.parseInt(gradeId, 10);
        if (!Number.isFinite(grade)) return null;
        if (grade >= 11 && grade <= 12) {
          return 'ib_dp';
        }
        break;

      // Australian Curriculum pathways
      }
      case 'australian_nsw': {
        if (gradeId === 'foundation') {
          return 'australian_nsw_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_nsw_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_nsw_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_nsw_hsc';
            }
          }
        }
        break;
      }
      case 'australian_vic': {
        if (gradeId === 'foundation') {
          return 'australian_vic_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_vic_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_vic_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_vic_vce';
            }
          }
        }
        break;
      }
      case 'australian_qld': {
        if (gradeId === 'foundation') {
          return 'australian_qld_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_qld_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_qld_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_qld_qce';
            }
          }
        }
        break;
      }
      case 'australian_wa': {
        if (gradeId === 'foundation') {
          return 'australian_wa_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_wa_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_wa_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_wa_wace';
            }
          }
        }
        break;
      }
      case 'australian_sa': {
        if (gradeId === 'foundation') {
          return 'australian_sa_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_sa_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_sa_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_sa_sace';
            }
          }
        }
        break;
      }
      case 'australian_tas': {
        if (gradeId === 'foundation') {
          return 'australian_tas_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_tas_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_tas_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_tas_tce';
            }
          }
        }
        break;
      }
      case 'australian_act': {
        if (gradeId === 'foundation') {
          return 'australian_act_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_act_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_act_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_act_senior';
            }
          }
        }
        break;
      }
      case 'australian_nt': {
        if (gradeId === 'foundation') {
          return 'australian_nt_primary';
        } else if (gradeId.startsWith('year_')) {
          const yearStr = gradeId.substring(5);
          const year = Number.parseInt(yearStr, 10);
          if (Number.isFinite(year)) {
            if (year >= 1 && year <= 6) {
              return 'australian_nt_primary';
            } else if (year >= 7 && year <= 10) {
              return 'australian_nt_secondary';
            } else if (year >= 11 && year <= 12) {
              return 'australian_nt_ntcet';
            }
          }
        }
        break;

      // Canadian Curriculum pathways
      }
      case 'canadian_ontario': {
        if (gradeId === 'kindergarten') {
          return 'canadian_ontario_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_ontario_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_ontario_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_ontario_ossd';
            }
          }
        }
        break;
      }
      case 'canadian_bc': {
        if (gradeId === 'kindergarten') {
          return 'canadian_bc_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_bc_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_bc_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_bc_dogwood';
            }
          }
        }
        break;
      }
      case 'canadian_alberta': {
        if (gradeId === 'kindergarten') {
          return 'canadian_alberta_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_alberta_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_alberta_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_alberta_diploma';
            }
          }
        }
        break;
      }
      case 'canadian_quebec': {
        if (gradeId === 'kindergarten') {
          return 'canadian_quebec_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_quebec_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_quebec_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_quebec_des';
            }
          }
        }
        break;
      }
      case 'canadian_manitoba': {
        if (gradeId === 'kindergarten') {
          return 'canadian_manitoba_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_manitoba_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_manitoba_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_manitoba_diploma';
            }
          }
        }
        break;
      }
      case 'canadian_saskatchewan': {
        if (gradeId === 'kindergarten') {
          return 'canadian_saskatchewan_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_saskatchewan_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_saskatchewan_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_saskatchewan_diploma';
            }
          }
        }
        break;
      }
      case 'canadian_maritimes': {
        if (gradeId === 'kindergarten') {
          return 'canadian_maritimes_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_maritimes_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_maritimes_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_maritimes_diploma';
            }
          }
        }
        break;
      }
      case 'canadian_territories': {
        if (gradeId === 'kindergarten') {
          return 'canadian_territories_elementary';
        } else if (gradeId.startsWith('grade_')) {
          const gradeStr = gradeId.substring(6);
          const grade = Number.parseInt(gradeStr, 10);
          if (Number.isFinite(grade)) {
            if (grade >= 1 && grade <= 6) {
              return 'canadian_territories_elementary';
            } else if (grade >= 7 && grade <= 10) {
              return 'canadian_territories_secondary';
            } else if (grade >= 11 && grade <= 12) {
              return 'canadian_territories_diploma';
            }
          }
        }
        break;
      }
    }
    return null;
}


