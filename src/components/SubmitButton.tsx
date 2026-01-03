"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`
        btn-primary w-full flex items-center justify-center gap-3 h-14 text-sm font-bold uppercase tracking-widest transition-all
        ${pending ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}
      `}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Save size={20} />
          <span>Save Guest Record</span>
        </>
      )}
    </button>
  );
}
