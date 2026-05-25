import Title from "./decoration/Title";
interface ResumeProps {
  title: string;
  children?: React.ReactNode;
}
const Layout = ({ title, children }: ResumeProps) => {
  return (
    <div className="relative flex flex-col py-20">
      <div className="px-20  z-10">
        <Title text={title} />
      </div>

      <div className="z-10 pt-20 gap-4 flex flex-col md:flex-row items-center justify-cente">
        {children}
      </div>
    </div>
  );
};
export default Layout;
