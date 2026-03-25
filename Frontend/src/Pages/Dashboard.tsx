import CreatePostDialog from "@/components/ui/CreatePostDialog";
import { ProblemCard } from "@/components/ui/ProblemCard";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {

    const [problems, setProblems] = useState([]);

    const [open, setOpen] = useState(false);
    
    useEffect(()=>{
        getproblems();
    } , [open])

    async function  getproblems(){
        let Pres = await axios.get("http://localhost:3001/dashboard" ,  {
            headers :{
                Authorization : localStorage.getItem("token") 
            } 
        })  
        setProblems((Pres.data.problems.Problems).reverse());
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div id="navbar">
                <div className="w-full border-b bg-white px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs">
                        </div>
                        {/* <h1 className="text-sm"> */}
                            <a className="group text-black text-lg tracking" href="/dashboard" data-discover="true">100<span className="text-primary "><label className="text-blue-800">x</label></span>School</a>
                            {/* </h1> */}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
                            <Search size={16} />
                            <input placeholder="Search" className="outline-none text-sm" />
                        </div>

                        <button
                            onClick = {()=>{setOpen(true)}}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
                        >
                            <Plus size={16} /> Create
                        </button>

                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                            A
                        </div>
                    </div>
                </div>

            </div>
            {
                open ?  <CreatePostDialog  open = {open} onClose = {()=>setOpen(false)} /> : null

            }
            <div className="max-w-4xl mx-auto mt-10 space-y-6 px-6">
                {problems.map((problem, index) => (
                    <ProblemCard key={index} {...problem} />
                ))}
            </div>
        </div>
    );
}
