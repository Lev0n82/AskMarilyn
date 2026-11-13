// Module image mappings for GRACE Academy
// Primary images: Ask Marilyn stroke-style editorial illustrations (displayed in module pages)
// Badge images: Colorful concept images (awarded when quiz is passed, displayed on profile)

export interface ModuleImages {
  primary: string;  // Ask Marilyn style editorial illustration
  badge: string;    // Colorful concept badge (earned on quiz completion)
  badgeTitle: string; // Title for the badge
}

export const moduleImages: Record<number, ModuleImages> = {
  // ABT Foundations (Modules 1-10)
  1: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/VmshOPmwFJJtwtwN.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/QCfDXlQIpHlrFAWk.jpg",
    badgeTitle: "Testing Paradox Master"
  },
  2: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/qrmjTFPwMjGzhTGB.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/GSXAZKCTbVgUJzsP.jpg",
    badgeTitle: "Three Layers Architect"
  },
  3: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/zQHnKjJRerpKudLg.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/tYdkyzTsFnzyKhsU.jpg",
    badgeTitle: "Test DNA Decoder"
  },
  4: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/YMgbsGOWqwSbtGDd.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/SXODHDGBlqBffvZx.jpg",
    badgeTitle: "Action Conductor"
  },
  5: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/zOCcDdMALNCxHijo.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/PENnjBRDMLcgnUEP.jpg",
    badgeTitle: "Interface Translator"
  },
  6: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/qEKGUtHGvCTVxduM.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/uPUcBYKdcZmekJkt.jpg",
    badgeTitle: "Data Factory Foreman"
  },
  7: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/VEKuIDxPiFKFlpOc.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/PboXNmxQJtuccrDV.jpg",
    badgeTitle: "Reusability Champion"
  },
  8: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/BpuABrCLHOxoNNeg.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/eIbjqzMCAyTNkrec.jpg",
    badgeTitle: "Error Handler Elite"
  },
  9: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/PmeJrWKRWsoAiddK.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/kPxpoaQSnIZfWWEP.jpg",
    badgeTitle: "Test Librarian"
  },
  10: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/SyHcoeYuQStDHrQh.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/EsgAVVcShtikfsGA.jpg",
    badgeTitle: "ABT Foundations Graduate"
  },
  
  // AI Agent Mastery (Modules 11-20)
  11: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/tRanICTFChuftAec.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/gtYJeNcwaCpgogve.jpg",
    badgeTitle: "AI Agent Initiate"
  },
  12: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/UgYFCLSRcaKqNvdU.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/ypRCfigKbWroWAhs.jpg",
    badgeTitle: "Orchestration Maestro"
  },
  13: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/yCWcFzsGOAEzrtoS.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/fzwDZEZGrIeOqFpH.jpg",
    badgeTitle: "NLP Whisperer"
  },
  14: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/UMxxQzBzedyiCHQH.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/zvcGcikNYlOCAiBI.jpg",
    badgeTitle: "Test Generation Wizard"
  },
  15: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/CzwhtvPljjcIqxtb.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/KPAwcMPZzyJVIoVg.jpg",
    badgeTitle: "Parallel Execution Controller"
  },
  16: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/dOXkAcgrFZpvFgBs.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/fpwGWDOaMHExwlac.jpg",
    badgeTitle: "Self-Healing Phoenix"
  },
  17: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/rNARXoUxcPdyqBJE.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/psfQbAwNxwRMAtol.jpg",
    badgeTitle: "Continuous Learner"
  },
  18: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/JuFArEnnBNTVGfQh.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/KQXrpHpXaZKRImDG.jpg",
    badgeTitle: "Framework Polyglot"
  },
  19: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/UROACqwFAYJvxiCt.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/pMRukorfJqbTZLxd.jpg",
    badgeTitle: "Time Optimization Expert"
  },
  20: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/yYHJTizAscQSSBNq.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/JRevulyXjUvgFohE.jpg",
    badgeTitle: "AI Agent Mastery Graduate"
  },
  
  // Enterprise Leadership (Modules 21-30)
  21: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/fAuWqnxBWCcLkzST.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/lhsBIKVAJauTSOJJ.jpg",
    badgeTitle: "Advanced AI Orchestrator"
  },
  22: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/tMpxKDUnFxbbclop.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/EhYEbZudHELCDfeE.jpg",
    badgeTitle: "Quality Avenger"
  },
  23: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/NGJdsTrRTjfmxIPU.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/uMuzVyuvZVDYbwVn.jpg",
    badgeTitle: "Strategic Decision Maker"
  },
  24: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/qXEtLpSshWEMZwuk.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/WNfUBjCSzOtsxmsM.jpg",
    badgeTitle: "ROI Balancer"
  },
  25: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/hfGvhrLbrConFxZK.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/UQmlURRXaxTMNYyv.jpg",
    badgeTitle: "Enterprise Scaler"
  },
  26: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/KlfdWvcRMwZStxbS.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/CkPbTPBcELyNgOFQ.jpg",
    badgeTitle: "Security Fortress Guardian"
  },
  27: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/omMBACCQIXYvUjnb.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/HbRiiAiYyfvBuCUF.jpg",
    badgeTitle: "Future Visionary"
  },
  28: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/LphQpGVLDPeBrQEF.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/TIfBYnWBwAzjvloR.jpg",
    badgeTitle: "Quality Leadership Conductor"
  },
  29: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/xhKHwnWRkWAxsrDr.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/LCdKVfrWxWRrHbAA.jpg",
    badgeTitle: "Center of Excellence Beacon"
  },
  30: {
    primary: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/HSgRCwQPgsnmxmef.jpg",
    badge: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/yYwGokxKorHfxDPk.jpg",
    badgeTitle: "GRACE Academy Master"
  }
};

// Helper function to get module images
export function getModuleImages(moduleNumber: number): ModuleImages | null {
  return moduleImages[moduleNumber] || null;
}

// Get all badges for a list of completed modules
export function getEarnedBadges(completedModules: number[]): Array<ModuleImages & { moduleNumber: number }> {
  return completedModules
    .filter(num => moduleImages[num])
    .map(num => ({
      moduleNumber: num,
      ...moduleImages[num]
    }));
}
