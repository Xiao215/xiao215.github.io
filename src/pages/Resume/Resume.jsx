import { Box } from "@mui/material";
export default function Test() {
  return (
    <Box
      position="static"
      sx={{ ml: 25, zIndex: "tooltip", minWidth: 200 }}
      height="100vh"
    >
      <iframe
        src="https://drive.google.com/file/d/1C0RUUqg39ugr5OvHXKdldaZvF-rU33Ve/view?usp=sharing"
        frameBorder="0"
        className="bg-white	 w-full h-full"
        allow="autoplay"
        title="resume"
      ></iframe>
    </Box>
  );
}
