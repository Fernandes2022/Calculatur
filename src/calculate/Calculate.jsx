import React, { useState } from 'react'

const calculate = () => {

 const [value, setValue] = useState("");


  return (
    <section className='bg-gradient-to-r from-gray-500 to-gray-300'>
      <div className="min-h-screen flex flex-col items-center container mx-auto ">
          <div className="bg-white mt-20 p-6 flex flex-col items-center">
          <div className="">
           <input type="text" value={value} className='text-white bg-black text-right rounded-md h-16 w-64 text-2xl p-2'/>
          </div>
          <div className=" flex flex-col">
           <div className="flex pt-3 space-x-2 text-2xl text-white">
            <input className='bg-slate-600 calcu w-14 h-14 rounded-md' type="button" value='AC' onClick={e => setValue('')}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='DE' onClick={e => setValue(value.slice(0, -1))}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='.' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='/' onClick={e => setValue(value + e.target.value)}/>
           </div>
           <div className="flex pt-3 space-x-2 text-2xl text-white">
            <input className='bg-slate-600 calcu w-14  h-14 rounded-md' type="button" value='7' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 w-14 calcu rounded-md' type="button" value='8' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='9' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='*' onClick={e => setValue(value + e.target.value)}/>
           </div>
           <div className="flex pt-3 space-x-2 text-2xl text-white">
            <input className='bg-slate-600 calcu w-14 h-14 rounded-md' type="button" value='4' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='5' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='6' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='+' onClick={e => setValue(value + e.target.value)}/>
           </div>
           <div className="flex pt-3 space-x-2 text-2xl text-white">
            <input className='bg-slate-600 calcu w-14 h-14 rounded-md' type="button" value='1' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='2' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='3' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='-' onClick={e => setValue(value + e.target.value)}/>
           </div>
           <div className="flex pt-3 space-x-2 text-2xl text-white">
            <input className='bg-slate-600 calcu w-14 h-14 rounded-md' type="button" value='00' onClick={e => setValue('')}/>
            <input className='bg-slate-600 calcu w-14 rounded-md' type="button" value='0' onClick={e => setValue(value + e.target.value)}/>
            <input className='bg-slate-600 calcu w-[119px] rounded-md' type="button" value='=' onClick={e => setValue(eval(value))}/>
            
           </div>
          </div>
          </div>
      </div>
    </section>
  )
}

export default calculate