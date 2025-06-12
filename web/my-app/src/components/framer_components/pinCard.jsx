import React from "react";
import { PinContainer } from "../ui/3d-pin";
import img1 from '../../assets/img1.jpg'

export function AnimatedPinCard({doctor}) {
const { _id, fName, lName, specialization } = doctor;

  return (
    <div className="h-[400px] w-[300px] flex items-center justify-center ">
      <PinContainer
        title="Book consultation"
        href={`/doctors/${_id}`}
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
             {fName + " " + lName}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
               {specialization}
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4"  style={{backgroundImage: `url(${img1})`, backgroundPosition:'center', backgroundSize:'cover'}}/>
        </div>
      </PinContainer>
    </div>
  );
}
