type ResumeNavItem = {
  name: string;
  link: string;
  navName: string;
};

type ResumeNav = {
  // cv: ResumeNavItem;
  ml: ResumeNavItem;
  swe: ResumeNavItem;
  // fullstack: ResumeNavItem;
};

const resumeNav: ResumeNav = {
  swe: {
    name: "Software",
    link: "https://drive.google.com/file/d/1eOFepl2Mfsk5X1DANQqtrFkcyQktwZ9u/preview",
    navName: "swe",
  },
  ml: {
    name: "Machine Learning",
    link: "https://drive.google.com/file/d/1pSJX5jQz3GYFS1BhL_RRn-rhOCGgFJW9/preview",
    navName: "ml",
  },
  // fullstack: {
  //   name: "Full Stack",
  //   link: "https://drive.google.com/file/d/1Ui9ShPXvTPjllDwVTplmceGV2hr6mnqM/preview",
  //   navName: "fullstack",
  // },
  // cv: {
  //   name: "CV",
  //   link: "https://drive.google.com/file/d/1cIhAMDdPmgg3mNbdxWe0P3RcVBqj2EYM/preview",
  //   navName: "cv",
  // },
};

export default resumeNav;
