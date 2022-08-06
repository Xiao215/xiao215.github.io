interface aboutProps{
    color:string,
    id: string,
 }
function About({color, id}:aboutProps){
  return(
    <div>
    <p className={"underline underline-offset-8 text-4xl pl-10 font-bold text-"+color}>About</p>
  </div>
  )
}
export default About;
