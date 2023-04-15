interface Props {
  colour: string;
  text: string | JSX.Element;
}
const SquareButton = ({ colour, text }: Props) => {
  switch (colour) {
    case "purple":
      return (
        <button
          className={
            "inline-flex text-white bg-purple border-0 py-2 px-6 focus:outline-none hover:bg-purple rounded text-lg"
          }
        >
          {text}
        </button>
      );
    default:
      return (
        <button
          className={
            "inline-flex text-white bg-purple border-0 py-2 px-6 focus:outline-none hover:bg-purple rounded text-lg"
          }
        >
          {text}
        </button>
      );
  }
};
export default SquareButton;
