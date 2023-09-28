type ResumeNavItem = {
  name: string;
  link: string;
  navName: string;
};

type ResumeNav = {
  cv: ResumeNavItem;
  ml: ResumeNavItem;
  swe: ResumeNavItem;
  fullstack: ResumeNavItem;
};

const resumeNav: ResumeNav = {
  swe: {
    name: "Software",
    link: "https://drive.google.com/file/d/1rJ9AEKzpXfqGkq7Qntz5C_jqasoKTRmV/preview",
    navName: "swe",
  },
  ml: {
    name: "Machine Learning",
    link: "https://drive.google.com/file/d/1JQ816wmr4muIyqnXOZfv5EvGuiORkB-Z/preview",
    navName: "ml",
  },
  fullstack: {
    name: "Full Stack",
    link: "https://drive.google.com/file/d/1Ui9ShPXvTPjllDwVTplmceGV2hr6mnqM/preview",
    navName: "fullstack",
  },
  cv: {
    name: "CV",
    link: "https://drive.google.com/file/d/1cIhAMDdPmgg3mNbdxWe0P3RcVBqj2EYM/preview",
    navName: "cv",
  },
};

export default resumeNav;
