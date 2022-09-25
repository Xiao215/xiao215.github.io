function About({ color, id }) {
  return (
    <div className="pl-10 pt-0.5">
      <p
        className={
          "underline underline-offset-8 text-4xl font-bold text-" + color
        }
      >
        About :)
      </p>
      <p>
        👋 Hello! I am Xiao and this is my personal website! (Feels so tired
        these UI does take time...)
      </p>
      <p>
        🏫 I am a second year student studying for Engineering Science at
        University of Toronto! You might see me a lot in University of Waterloo,
        been onto their Pie contest winner list and official news letter, but
        those are all coincidence.
      </p>
      <p>
        🎂 My birthday is everyday but I don't really celebrate them :( But I
        still wish my friends happy birthday everyday!
      </p>
      <p>
        🧮 My favourite number is 2^127-1, stole from my best friend and luckily
        we are still friend!
      </p>
      <p>🌐 This site is not finished yet, but thanks for stepping by ❤️</p>
    </div>
  );
}
export default About;
