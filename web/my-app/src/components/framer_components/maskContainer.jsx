import { MaskContainer } from "../ui/svg-mask-effect";

export function SVGMaskEffect() {
  return (
    <div className="h-[40rem] w-[100%] flex items-center justify-center overflow-hidden" style={{borderRadius:'20px'}}>
      <MaskContainer
        revealText={
            <p className="max-w-full mx-auto font-mono text-slate-200 text-center text-4xl font-bold">
              Book your video consultation today Or try our VR application
              <br/>Online medical consultations and electronic prescription services offer a convenient way for individuals to access healthcare services without having to travel to a doctor’s office or clinic.
              <br/> Try out our VR application for more realistic consultation.
            </p>
        }
        className="h-[40rem] border rounded-md"
      >
        Book your  <span className="text-slate-600 font-mono">video consultation</span> today Or try our  <span className="text-slate-600 font-mono"> VR application </span>
        <br/> <span className="text-slate-600  font-mono"> Online medical consultations and electronic prescription </span> services offer a convenient way for individuals to access healthcare services without having to travel to a doctor’s office or clinic.
        <br/> Try out our <span className="text-slate-600 font-mono">VR application </span>VR application for more realistic consultation. 
      </MaskContainer>
    </div>
  );
}