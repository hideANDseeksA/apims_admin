import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import API from '@/api/axios'

const AddPosition = () => {
    const [position, setPosition] = useState();
    const [classification, setClassification] = useState();
    const [salaryGrade, setSalaryGrade] = useState([]);
    const [selectedSalaryGrade, setSelectedSalaryGrade] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const fetchSalaryGrades = async () => {
            try{
                const response = await axios.get(`${API_URL}/salary_tranches`);
                setSalaryGrade(response.data);
            } catch (error) {
                console.error("Error fetching salary grades:", error);
            }
        }

        fetchSalaryGrades();
    }, [API_URL]);

    const handleAddPosition = async () => {
    try {
        const payload = {
            position: position,
            classification: classification,
            salary_grade: selectedSalaryGrade || null,
        }
        const response = await axios.post(`${API_URL}/position/add`, payload)
      console.log("✅ Position added:", response.data)
    

        closeDialog();

    } catch (error) {
      console.error("Error adding position:", error)
 
    }
}

const closeDialog = () => {
  setIsDialogOpen(false);
  setPosition('');  
  setClassification('');
  setSelectedSalaryGrade('');
};

  return (
    <div className='space-y-5'>
         
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) closeDialog()
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Position</DialogTitle>
                </DialogHeader>
                <div>
                    <div>
                        <Label htmlFor="position">Position</Label>
                        <Input 
                        id="position"
                        required
                        placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
                    </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 w-full">


                        <div>
                        <Label>Classification</Label>
                        <Select value={classification} onValueChange={setClassification}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Classification" />
                            </SelectTrigger>
                            <SelectContent>
                            
                                    <SelectItem value="Teaching">Teaching</SelectItem>
                                    <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                                    <SelectItem value="Teaching Related">Teaching Related</SelectItem>
                                
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Salary Grade Level</Label>
                        <Select value={selectedSalaryGrade} onValueChange={setSelectedSalaryGrade}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Salary Grade Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {salaryGrade.map((salary) => (
                                        <SelectItem key={salary.id} value={salary.id}>
                                             {salary.salary_grade}
                                        </SelectItem>
                                    ))}
                                    
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    </div>
                    
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                     
                        <Button onClick={handleAddPosition}>Done</Button>
                </DialogFooter>
                       
                </div>
               

            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddPosition