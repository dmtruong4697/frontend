export type TranslationDict = {
  login: {
    slide1: string; slide2: string; slide3: string; slide4: string; slide5: string; slide6: string;
    slogan: string; heroTitleLine1: string; heroTitleLine2: string; heroSub: string;
    agreeTerms: string; terms: string; and: string; privacy: string;
  };
  loginSEO: {
    title: string;
    description: string;
    feat1Title: string; feat1Desc: string;
    feat2Title: string; feat2Desc: string;
    closing1: string; closing2: string; closingBold: string;
  };
  footer: {
    terms: string; privacy: string; conversationStart: string; safetyGuide: string; copyright: string;
  };
  chat: {
    stranger: string; online: string; offline: string; reportBtn: string; exitBtn: string;
    strangerLeft: string; strangerLeftSub: string; chatEnded: string; connecting: string;
    typeMessage: string; reportTitle: string; reportSelectLabel: string; reportSpam: string;
    reportHarassment: string; reportHate: string; reportInappropriate: string; reportOther: string;
    reportOtherPlaceholder: string; reportCancel: string; reportConfirm: string; toastReportSuccess: string;
  };
  home: {
    readyToExplore: string; logOut: string; findingMatch: string; meetNew: string;
    hangTight: string; pressButton: string; stopSearching: string; findMatchBtn: string;
    yourProfile: string; genderLabel: string; myAgeLabel: string; agePlaceholder: string;
    myLanguageLabel: string; interestsLabel: string; selected: string; less: string; more: string;
    whoYouWant: string; prefLangLabel: string; prefGenderLabel: string; ageRangeLabel: string;
    minAgeLabel: string; maxAgeLabel: string; sharedInterestsLabel: string; doOurBest: string;
    saveChangesBtn: string; toastProfileUpdate: string;
    errGender: string; errAgeEmpty: string; errAgeUnder18: string; errAgeRangePref: string; errAgeInvalid: string;
  };
  privacy: {
    title: string; backBtn: string;
    introTitle: string; introDesc: string;
    dataCollectTitle: string; dataId: string; dataTech: string; dataUsage: string;
    howUseTitle: string; useIntro: string; use1: string; use2: string; use3: string; use4: string;
    rightsTitle: string; rightsIntro: string; right1: string; right2: string; right3: string;
    securityTitle: string; securityDesc: string;
    thirdPartyTitle: string; thirdPartyDesc: string;
    lastUpdated: string;
  };
  terms: {
    title: string; backBtn: string;
    content: string; // we will use condensed rich text to limit complexity
  };
  blogStart: {
    title: string; backBtn: string;
    content: string; 
  };
  blogSafety: {
    title: string; backBtn: string;
    content: string;
  };
};
